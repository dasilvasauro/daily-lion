import { create } from 'zustand';
import { TASK_LIMITS, EDIT_FREE_WINDOW_MINUTES, getSprintTier } from '../utils/constants';
import { useUserStore } from './useUserStore';

export const useTaskStore = create((set, get) => ({
    tasks: [],

    // 1. Adicionar Nova Tarefa
    addTask: (taskData) => {
        const { tasks } = get();

        // Validação: Só permite uma Sprint por vez
        if (taskData.type === 'sprint') {
            const hasActiveSprint = tasks.some(t => t.type === 'sprint' && !t.completed);
            if (hasActiveSprint) {
                throw new Error("Você já possui uma Sprint em andamento. Termine uma corrida antes de começar outra.");
            }
        }

        const newTask = {
            ...taskData,
            id: Date.now().toString(),
                                                  createdAt: new Date().toISOString(),
                                                  completed: false,
                                                  subtasks: taskData.subtasks || []
        };

        set({ tasks: [...tasks, newTask] });
        return newTask;
    },

    // 2. Marcar tarefa comum como concluída
    toggleTask: (taskId) => {
        const { tasks } = get();
        set({
            tasks: tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        });
    },

    // 3. Atualizar Subtarefas de uma Sprint (A função que estava quebrando!)
    toggleSprintSubtask: (sprintId, subtaskId) => {
        const { tasks } = get();

        // Pega as ações de XP e Gold do outro arquivo (Zustand permite isso)
        const { addXP, addGold } = useUserStore.getState();

        const sprint = tasks.find(t => t.id === sprintId);
        if (!sprint || sprint.type !== 'sprint') return;

        // Marca a subtarefa como feita
        const updatedSubtasks = sprint.subtasks.map(sub =>
        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );

        // Checa se todas as subtarefas foram finalizadas
        const isFullyCompleted = updatedSubtasks.every(sub => sub.completed);

        // Se terminou a Sprint toda, paga o prêmio massivo!
        if (isFullyCompleted && !sprint.completed) {
            const tier = getSprintTier(updatedSubtasks.length);
            addXP(tier.xp);
            addGold(tier.gold);
        }

        const updatedSprint = {
            ...sprint,
            subtasks: updatedSubtasks,
            completed: isFullyCompleted
        };

        set({ tasks: tasks.map(t => t.id === sprintId ? updatedSprint : t) });
    },

    // 4. Deletar Tarefa
    deleteTask: (taskId) => {
        const { tasks } = get();
        set({ tasks: tasks.filter(t => t.id !== taskId) });
    }
}));
