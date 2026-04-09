import CryptoJS from 'crypto-js';

// No fluxo real, essa chave vem da senha master que o usuário digita ao logar.
// NUNCA salve isso no banco ou estado global persistido sem proteção.
// Para fins de desenvolvimento, vamos mockar uma chave temporária no sessionStorage.
const getSecretKey = () => {
    let key = sessionStorage.getItem('LION_MASTER_KEY');
    if (!key) {
        // Apenas fallback de segurança para não quebrar a aplicação no dev
        key = 'super-secret-local-key';
    }
    return key;
};

// Encripta os campos sensíveis de uma tarefa
export const encryptTask = (task) => {
    const key = getSecretKey();

    // Transformamos os campos em string encriptada (AES)
    const encryptedTitle = CryptoJS.AES.encrypt(task.title, key).toString();
    const encryptedDesc = task.description
    ? CryptoJS.AES.encrypt(task.description, key).toString()
    : '';

    // Retornamos um novo objeto misturando dados visíveis (para o banco filtrar) e dados ofuscados
    return {
        ...task,
        title: encryptedTitle,
        description: encryptedDesc,
        isEncrypted: true // Flag de segurança
    };
};

// Desencripta os campos para leitura local
export const decryptTask = (encryptedTask) => {
    if (!encryptedTask.isEncrypted) return encryptedTask;

    const key = getSecretKey();

    try {
        const bytesTitle = CryptoJS.AES.decrypt(encryptedTask.title, key);
        const decryptedTitle = bytesTitle.toString(CryptoJS.enc.Utf8);

        let decryptedDesc = '';
        if (encryptedTask.description) {
            const bytesDesc = CryptoJS.AES.decrypt(encryptedTask.description, key);
            decryptedDesc = bytesDesc.toString(CryptoJS.enc.Utf8);
        }

        return {
            ...encryptedTask,
            title: decryptedTitle,
            description: decryptedDesc,
            isEncrypted: false
        };
    } catch (error) {
        console.error("Falha ao desencriptar tarefa. Chave incorreta?", error);
        return { ...encryptedTask, title: '🔒 [Dado Protegido]' };
    }
};
