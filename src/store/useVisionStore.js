import { create } from 'zustand';
import { db } from '../services/db';
import { calculateCheckpoints } from '../utils/visionHelper';

export const useVisionStore = create((set, get) => ({
    vision: {
        traitsToDevelop: [], // 4 características
        traitsToAbandon: [],  // 4 características
        goals: [], // { id, title, state: 0-4 }
        checkpoints: [], // Datas dos próximos checkpoints
        createdAt: null
    },

    // Iniciar uma nova Visão
    setupVision: async (data) => {
        const checkpoints = calculateCheckpoints(new Date());
        const newVision = {
            ...data,
            checkpoints,
            createdAt: new Date().toISOString()
        };

        set({ vision: newVision });
        await db.vision.put({ id: 'current_vision', ...newVision });
    },

    // Atualizar o estado de um objetivo (o Slider)
    updateGoalState: async (goalId, newState) => {
        const { vision } = get();
        const updatedGoals = vision.goals.map(g =>
        g.id === goalId ? { ...g, state: newState } : g
        );

        const updatedVision = { ...vision, goals: updatedGoals };
        set({ vision: updatedVision });
        await db.vision.update('current_vision', { goals: updatedGoals });
    }
}));
