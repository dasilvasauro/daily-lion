import { collection, getDocs, doc, setDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { dbFirestore, auth } from './firebase';
import { db as localDb } from './db';
import { encryptTask, decryptTask } from './crypto';

// Envia os dados locais pendentes para a nuvem
export const syncUp = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado");

    // Pega todas as tarefas locais que ainda não têm uma flag 'synced' verdadeira
    const pendingTasks = await localDb.tasks.filter(t => !t.synced).toArray();

    for (const task of pendingTasks) {
        // 1. Encripta os dados sensíveis
        const secureTask = encryptTask(task);

        // 2. Prepara o payload com metadados para o Firebase (serverTimestamp p/ contingência de tempo)
        const payload = {
            ...secureTask,
            userId: user.uid,
            lastSyncedAt: serverTimestamp()
        };

        // 3. Salva no Firestore
        const taskRef = doc(dbFirestore, `users/${user.uid}/tasks`, task.id);
        await setDoc(taskRef, payload, { merge: true });

        // 4. Marca localmente como sincronizado para não enviar de novo
        await localDb.tasks.update(task.id, { synced: true });
    }
};

// Baixa os dados da nuvem para a máquina local
export const syncDown = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const tasksRef = collection(dbFirestore, `users/${user.uid}/tasks`);
    const snapshot = await getDocs(tasksRef);

    const localTasksUpdates = [];

    snapshot.forEach((docSnap) => {
        const encryptedData = docSnap.data();

        // 1. Desencripta usando a chave local do usuário
        const decryptedData = decryptTask(encryptedData);

        // 2. Prepara para salvar no Dexie
        localTasksUpdates.push({
            ...decryptedData,
            synced: true // Já veio da nuvem, está sincronizado
        });
    });

    // Salva no banco offline em lote (Bulk Put) para performance
    if (localTasksUpdates.length > 0) {
        await localDb.tasks.bulkPut(localTasksUpdates);
    }
};

// Função unificada para chamar no App
export const runFullSync = async () => {
    try {
        if (!navigator.onLine) {
            console.log("Usuário offline. Sincronização adiada.");
            return;
        }
        await syncUp();
        await syncDown();
        console.log("Sincronização E2EE concluída com sucesso.");
    } catch (error) {
        console.error("Erro na sincronização:", error);
    }
};
