import { create } from 'zustand';

export const useUserStore = create((set) => ({
    // Estado Inicial
    isNewUser: true,
    profile: {
        name: '',
        modusOperandi: null, // multitarefa, minimalista, pontual, ambicioso
        theme: 'dark',
        accentColor: 'lion-steel',
        glassEnabled: true,
        animationsEnabled: true,
    },
    rpg: {
        level: 1,
        xp: 0,
        gold: 0,
        vouchers: 0,
    },

    // Ações
    completeOnboarding: (userData) => set((state) => ({
        isNewUser: false,
        profile: { ...state.profile, ...userData }
    })),

    addGold: (amount) => set((state) => ({
        rpg: { ...state.rpg, gold: state.rpg.gold + amount }
    })),

    addXP: (amount) => set((state) => {
        // Aqui depois colocaremos a lógica de subir de nível e mostrar a carta de Sorte!
        return { rpg: { ...state.rpg, xp: state.rpg.xp + amount } };
    }),
}));
