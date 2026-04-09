export const TASK_LIMITS = {
    P0: 4,
    P1: 6,
};

export const TASK_PRIORITIES = {
    P0: { id: 'P0', label: 'Crítica', baseGold: 100, baseXP: 150 },
    P1: { id: 'P1', label: 'Urgente', baseGold: 70, baseXP: 100 },
    P2: { id: 'P2', label: 'Importante', baseGold: 40, baseXP: 60 },
    P3: { id: 'P3', label: 'Normal', baseGold: 20, baseXP: 30 },
    P4: { id: 'P4', label: 'Baixa', baseGold: 10, baseXP: 15 },
};

export const EDIT_FREE_WINDOW_MINUTES = 10;
export const VOUCHER_COST_EDIT = 1;
export const VOUCHER_COST_DELETE = 1;

export const SPRINT_MEDALS = {
    '5K': { maxTasks: 5, label: 'Medalha 5K', xp: 800, gold: 300, icon: '🥉' },
    '10K': { maxTasks: 10, label: 'Medalha 10K', xp: 1800, gold: 700, icon: '🥈' },
    '20K': { maxTasks: 20, label: 'Medalha 20K', xp: 4000, gold: 1500, icon: '🥇' },
    '31K': { maxTasks: 31, label: 'Ultra-maratona 31K', xp: 8000, gold: 3000, icon: '💎' }
};

export const getSprintTier = (taskCount) => {
    if (taskCount <= 5) return SPRINT_MEDALS['5K'];
    if (taskCount <= 10) return SPRINT_MEDALS['10K'];
    if (taskCount <= 20) return SPRINT_MEDALS['20K'];
    return SPRINT_MEDALS['31K'];
};
