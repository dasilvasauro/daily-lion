import { TASK_PRIORITIES } from './constants';

export const calculateTaskReward = (task) => {
    const priorityInfo = TASK_PRIORITIES[task.priority];
    let gold = priorityInfo.baseGold;
    let xp = priorityInfo.baseXP;

    // 1. Penalidade por Falta de Data (Procrastinação)
    if (!task.dueDate) {
        gold *= 0.5; // Perde 50% do valor
        xp *= 0.5;
    }

    // 2. Multiplicadores por Tipo
    if (task.type === 'daily_challenge' || task.type === 'surprise') {
        gold *= 2.0;
        xp *= 2.0;
    }

    // 3. Modus Operandi (Lógica que integra com o perfil do usuário)
    // Isso será chamado no momento da conclusão

    return { gold: Math.floor(gold), xp: Math.floor(xp) };
};
