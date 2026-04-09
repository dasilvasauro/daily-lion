// O Dicionário Visual de Prioridades (P0, P1, P2)
export const TASK_PRIORITIES = {
    P0: { label: 'Crítica', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    P1: { label: 'Urgente', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    P2: { label: 'Rotina', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' }
};

// Limites de criação de tarefas por dia (O "Motor de Foco")
export const TASK_LIMITS = {
    P0: 4, // Máximo de 4 Críticas
    P1: 6, // Máximo de 6 Urgentes
    P2: Infinity // Ilimitado para o resto
};

// Tempo de tolerância (em minutos) para editar/apagar sem perder vouchers
export const EDIT_FREE_WINDOW_MINUTES = 15;

// Sistema de Sprints (Corridas de longo prazo)
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
