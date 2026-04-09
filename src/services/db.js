import Dexie from 'dexie';

// Criamos a instância do banco
export const db = new Dexie('DailyLionDB');

// Definimos o esquema.
// Nota: Só indexamos os campos que usaremos para filtros/buscas (ex: type, completed).
db.version(1).stores({
    tasks: 'id, title, type, priority, completed, createdAt, dueDate',
    habits: 'id, title, type, streakGeneral',
    user_profile: 'id', // Guardaremos apenas um objeto aqui
    vision: 'id',
    store_items: 'id'
});

// Helper para salvar tarefas com criptografia (Placeholder para a lógica E2EE)
export const saveEncryptedTask = async (task) => {
    // Aqui no futuro aplicaremos o crypto.js antes de salvar
    return await db.tasks.put(task);
};
