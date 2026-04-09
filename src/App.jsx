import React, { useEffect } from 'react';
import { useUserStore } from './store/useUserStore';
import { runFullSync } from './services/sync';

// Importação das Telas e Componentes Globais
import Onboarding from './features/onboarding/Onboarding';
import MainLayout from './components/layout/MainLayout';
import LuckCardReveal from './features/store/LuckCardReveal';

function App() {
    // Lê do nosso "cérebro" se o usuário já fez o onboarding
    const isNewUser = useUserStore((state) => state.isNewUser);

    // Lógica de Contingência (Sincronização E2EE Offline/Online)
    useEffect(() => {
        // Tenta sincronizar logo ao abrir o app
        runFullSync();

        // Fica de olho se a internet cair e voltar
        const handleOnline = () => {
            console.log("Conexão restabelecida! Iniciando contingência...");
            runFullSync();
        };

        window.addEventListener('online', handleOnline);
        return () => window.removeEventListener('online', handleOnline);
    }, []);

    return (
        // Container mestre da aplicação
        <div className="w-full min-h-screen bg-slate-900 text-slate-100 transition-colors duration-300 antialiased overflow-hidden">

        {/* A Carta de Sorte fica aqui na raiz. Ela é invisível por padrão,
            mas como está no topo do App, quando o jogador subir de nível,
            ela vai cobrir qualquer tela que ele estiver vendo!
            */}
            <LuckCardReveal />

            {/* Roteador Inteligente: Se é novo, vai pro Onboarding. Se não, vai pro App. */}
            {isNewUser ? (
                <Onboarding />
            ) : (
                <MainLayout />
            )}

            </div>
    );
}

export default App;
