import { useEffect } from 'react';
import { runFullSync } from './services/sync';

// Dentro do seu App.jsx
useEffect(() => {
    // Sincroniza ao abrir o app
    runFullSync();

    // Listener para quando a internet voltar
    const handleOnline = () => {
        console.log("Conexão restabelecida! Iniciando contingência...");
        runFullSync();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
}, []);
