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
    moodHistory: {}, // Estrutura: { "2026-04-08": "radiante" }
    stats: {
        tasksCompleted: 0,
        maxStreak: 0,
        sprintsWon: 0,
    },

    // Lógica simples de curva de XP (ex: Nível 1 precisa de 1000, Nível 2 de 1500, etc.)
    const calculateMaxXP = (level) => 1000 + (level * 500);

    // Adicione isso ao estado inicial:
    pendingLevelUp: false,

    // Atualize a ação addXP:
    addXP: (amount) => set((state) => {
        let newXP = state.rpg.xp + amount;
        let newLevel = state.rpg.level;
        let isLevelUp = false;

        let maxXP = calculateMaxXP(newLevel);

        // Verifica se "upou" (suporta múltiplos level ups de uma vez se ganhar muito XP)
        while (newXP >= maxXP) {
            newXP -= maxXP;
            newLevel += 1;
            isLevelUp = true;
            maxXP = calculateMaxXP(newLevel);
        }

        return {
            rpg: { ...state.rpg, xp: newXP, level: newLevel },
            pendingLevelUp: state.pendingLevelUp || isLevelUp // Aciona o gatilho da carta
        };
    }),

    // Ação para consumir o gatilho após revelar a carta
    consumeLevelUp: () => set({ pendingLevelUp: false }),

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
    setDailyMood: (dateStr, mood) => set((state) => ({
        moodHistory: { ...state.moodHistory, [dateStr]: mood }
    })),
}));
