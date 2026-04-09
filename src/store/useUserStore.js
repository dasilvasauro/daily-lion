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
    activeBoosts: {
        xpBoostExpiry: null, // Data de expiração do bônus de 24h
        goldBoostExpiry: null,
        extraP0: 0, // Quantidade de P0 extras comprados hoje
        extraP1: 0,
        freezeActive: false, // "Congelamento" ativo para os hábitos
        dayOffActive: false, // "Dia de Folga" ativo
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
    buyItem: (currencyType, cost, itemAction) => set((state) => {
        const currentAmount = state.rpg[currencyType]; // 'gold' ou 'vouchers'

        if (currentAmount < cost) {
            throw new Error(`Você não tem ${currencyType} suficiente!`);
        }

        // Executa a ação do item (ex: adicionar um boost) e debita o valor
        const newBoosts = itemAction(state.activeBoosts);

        return {
            rpg: { ...state.rpg, [currencyType]: currentAmount - cost },
            activeBoosts: newBoosts
        };
    }),
}));
