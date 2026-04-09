import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css'; // Importa o Tailwind e nossas animações customizadas
import { registerSW } from 'virtual:pwa-register';

// Ativa o Service Worker do PWA para funcionamento offline e atualizações
registerSW({ immediate: true });

// Monta a aplicação na div com id="root" do index.html
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <App />
    </React.StrictMode>
);
