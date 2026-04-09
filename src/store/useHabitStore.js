import { create } from 'zustand';
import { db } from '../services/db';
import { isToday, subDays, format } from 'date-fns';

export const useHabitStore = create((set, get) => ({
    habits: [],
    history: {}, // Estrutura: { "2023-10-25": { done: 3, total: 5 } }

    addHabit: async (habit) => {
        const newHabit = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            currentCount: 0,
            streak: 0,
            ...habit
        };
        await db.habits.add(newHabit);
        set((state) => ({ habits: [...state.habits, newHabit] }));
    },

    completeHabitAction: async (habitId) => {
        const { habits } = get();
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const newCount = habit.currentCount + 1;
        const isFullyDone = newCount >= (habit.targetCount || 1);

        const updatedHabits = habits.map(h =>
        h.id === habitId ? { ...h, currentCount: newCount, completedToday: isFullyDone } : h
        );

        set({ habits: updatedHabits });
        await db.habits.update(habitId, { currentCount: newCount });

        // Atualiza o histórico para o Grid
        const today = format(new Date(), 'yyyy-MM-dd');
        const totalHabits = updatedHabits.length;
        const doneHabits = updatedHabits.filter(h => h.currentCount >= (h.targetCount || 1)).length;

        set((state) => ({
            history: {
                ...state.history,
                [today]: { done: doneHabits, total: totalHabits }
            }
        }));
    }
}));
