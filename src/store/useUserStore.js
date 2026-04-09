import { create } from 'zustand';

// A função utilitária fica de fora do objeto do estado
const calculateMaxXP = (level) => 1000 + (level * 500);

export const useUserStore = create((set) => ({
    // --- 1. ESTADO INICIAL ---
    isNewUser: true,
    pendingLevelUp: false,

    profile: {
        name: '',
        modusOperandi: null,
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
        xpBoostExpiry: null,
        goldBoostExpiry: null,
        extraP0: 0,
        extraP1: 0,
        freezeActive: false,
        dayOffActive: false,
    },

    moodHistory: {},

    stats: {
        tasksCompleted: 0,
        maxStreak: 0,
        sprintsWon: 0,
    },

    // --- 2. AÇÕES DO SISTEMA ---

    completeOnboarding: (userData) => set((state) => ({
        isNewUser: false,
        profile: { ...state.profile, ...userData }
    })),

    addGold: (amount) => set((state) => ({
        rpg: { ...state.rpg, gold: state.rpg.gold + amount }
    })),

    addXP: (amount) => set((state) => {
        let newXP = state.rpg.xp + amount;
        let newLevel = state.rpg.level;
        let isLevelUp = false;

        let maxXP = calculateMaxXP(newLevel);

        // Verifica se "upou" (suporta múltiplos levels de uma vez)
        while (newXP >= maxXP) {
            newXP -= maxXP;
            newLevel += 1;
            isLevelUp = true;
            maxXP = calculateMaxXP(newLevel);
        }

        return {
            rpg: { ...state.rpg, xp: newXP, level: newLevel },
            pendingLevelUp: state.pendingLevelUp || isLevelUp
        };
    }),

    consumeLevelUp: () => set({ pendingLevelUp: false }),

                                             buyItem: (currencyType, cost, itemAction) => set((state) => {
                                                 const currentAmount = state.rpg[currencyType];

                                                 if (currentAmount < cost) {
                                                     throw new Error(`Você não tem ${currencyType} suficiente!`);
                                                 }

                                                 const newBoosts = itemAction(state.activeBoosts);

                                                 return {
                                                     rpg: { ...state.rpg, [currencyType]: currentAmount - cost },
                                                     activeBoosts: newBoosts
                                                 };
                                             }),

                                             setDailyMood: (dateStr, mood) => set((state) => ({
                                                 moodHistory: { ...state.moodHistory, [dateStr]: mood }
                                             })),
}));
