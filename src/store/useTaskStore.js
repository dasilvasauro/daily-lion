import { create } from 'zustand';
import { useUserStore } from './useUserStore';
import { TASK_LIMITS, EDIT_FREE_WINDOW_MINUTES, VOUCHER_COST_EDIT, VOUCHER_COST_DELETE } from '../utils/constants';
import { getSprintTier } from '.../utis/constants';

export const useTaskStore = create((set, get) => ({
    tasks: [],

    // Criar Tarefa
    addTask: (taskData) => {
        const { tasks } = get();
        const { profile } = useUserStore.getState();

        // 1. Validar Limites de P0 e P1
        const activeP0 = tasks.filter(t => t.priority === 'P0' && !t.completed).length;
        const activeP1 = tasks.filter(t => t.priority === 'P1' && !t.completed).length;

        if (taskData.priority === 'P0' && activeP0 >= TASK_LIMITS.P0) {
            throw new Error("Limite de tarefas P0 atingido! Use a loja para expandir.");
        }
        if (taskData.priority === 'P1' && activeP1 >= TASK_LIMITS.P1) {
            throw new Error("Limite de tarefas P1 atingido!");
        }
        if (taskData.type === 'sprint') {
            const hasActiveSprint = tasks.some(t => t.type === 'sprint' && !t.completed);
            if (hasActiveSprint) {
                throw new Error("Você já possui uma Sprint em andamento. Foco! Termine uma corrida antes de começar outra.");
            }
        }

        const newTask = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completed: false,
            subtasks: [],
            ...taskData,
        };

        set({ tasks: [...tasks, newTask] });
        return newTask;
    },

    // Editar Tarefa (com lógica de Voucher)
    updateTask: (taskId, updates) => {
        const { tasks } = get();
        const task = tasks.find(t => t.id === taskId);
        const { rpg, profile } = useUserStore.getState();

        // Verifica se passaram 10 minutos
        const diffMs = new Date() - new Date(task.createdAt);
        const diffMins = Math.floor(diffMs / 60000);
        const isFree = diffMins < EDIT_FREE_WINDOW_MINUTES;

        if (!isFree) {
            if (rpg.vouchers < VOUCHER_COST_EDIT) {
                throw new Error("Você precisa de 1 Voucher para editar após 10 minutos.");
            }
            // Deduz voucher se não for gratuito
            useUserStore.setState((state) => ({
                rpg: { ...state.rpg, vouchers: state.rpg.vouchers - VOUCHER_COST_EDIT }
            }));
        }

        set({
            tasks: tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
        });
    },

    // Excluir Tarefa (Custa 1 Voucher)
    deleteTask: (taskId) => {
        const { rpg } = useUserStore.getState();

        if (rpg.vouchers < VOUCHER_COST_DELETE) {
            throw new Error("Desistir tem um preço: 1 Voucher para excluir uma tarefa.");
        }

        useUserStore.setState((state) => ({
            rpg: { ...state.rpg, vouchers: state.rpg.vouchers - VOUCHER_COST_DELETE }
        }));

        set(state => ({
            tasks: state.tasks.filter(t => t.id !== taskId)
        }));
    }

    toggleSprintSubtask: (sprintId, subtaskId) => {
        const { tasks } = get();
        const { addXP, addGold } = useUserStore.getState(); // Para pagar o prêmio no final

        const sprint = tasks.find(t => t.id === sprintId);
        if (!sprint || sprint.type !== 'sprint') return;

        // Atualiza a subtarefa específica
        const updatedSubtasks = sprint.subtasks.map(sub =>
        sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );

        const isFullyCompleted = updatedSubtasks.every(sub => sub.completed);

        // Se terminou a Sprint toda, paga o prêmio massivo!
        if (isFullyCompleted && !sprint.completed) {
            const tier = getSprintTier(updatedSubtasks.length);
            addXP(tier.xp);
            addGold(tier.gold);

            // Opcional: Aqui você pode disparar um set para adicionar a medalha no Perfil do usuário!
            useUserStore.setState(state => ({ profile: { ...state.profile, medals: [...state.profile.medals, tier.label] } }));
        }

        // Atualiza a Store e o Banco Offline
        const updatedSprint = {
            ...sprint,
            subtasks: updatedSubtasks,
            completed: isFullyCompleted
        };

        set({ tasks: tasks.map(t => t.id === sprintId ? updatedSprint : t) });

        // Importe o db do Dexie para salvar offline (db.tasks.update(sprintId, updatedSprint))
    },
}));
