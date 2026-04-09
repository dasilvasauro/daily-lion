import React, { useEffect } from 'react';
import { useUserStore } from './store/useUserStore';
import { runFullSync } from './services/sync';

import Onboarding from './features/onboarding/Onboarding';
import MainLayout from './components/layout/MainLayout';
import LuckCardReveal from './features/store/LuckCardReveal';

// Mapa para converter o ID da cor selecionada no HEX correspondente
const PALETTES_MAP = {
    'steel_blue': '#4682B4',
    'muted_emerald': '#50C878',
    'slate_purple': '#705E78',
    'aged_gold': '#DAA520',
    'terracotta': '#E2725B',
    'charcoal': '#36454F'
};

function App() {
    const isNewUser = useUserStore((state) => state.isNewUser);
    const profile = useUserStore((state) => state.profile);

    useEffect(() => {
        runFullSync();
        const handleOnline = () => {
            console.log("Conexão restabelecida! Iniciando contingência...");
            runFullSync();
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    // Resgata a cor escolhida (ou cai pro Azul Aço padrão)
    const accentHex = PALETTES_MAP[profile?.accent] || '#4682B4';

    // Passamos a cor escolhida como variável CSS global (--accent-color)
    return (
        <div
        style={{ '--accent-color': accentHex }}
        className="w-full min-h-screen bg-slate-900 text-slate-100 transition-colors duration-300 antialiased overflow-hidden"
        >
        <LuckCardReveal />
        {isNewUser ? <Onboarding /> : <MainLayout />}
        </div>
    );
}

export default App;
