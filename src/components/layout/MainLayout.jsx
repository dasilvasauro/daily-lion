import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import GlassCard from '../ui/GlassCard';

// Ícones temporários (depois usaremos algo como lucide-react ou heroicons)
const NavItem = ({ label, icon, active, onClick }) => (
    <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${
        active ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
    >
    <span className="text-xl">{icon}</span>
    <span className="hidden md:inline">{label}</span>
    </button>
);

export default function MainLayout({ children }) {
    const { rpg, profile } = useUserStore();
    const [currentTab, setCurrentTab] = useState('tarefas');

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden relative">

        {/* Background Animado Global (respeitando configurações) */}
        {profile.glassEnabled && (
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
            </div>
        )}

        {/* Barra de Navegação Lateral (Desktop) / Inferior (Mobile) */}
        <GlassCard className="z-20 m-4 p-4 flex flex-row md:flex-col justify-between md:justify-start md:w-64 gap-2 border-white/10 fixed bottom-0 md:relative w-[calc(100%-2rem)] md:h-[calc(100vh-2rem)]">
        <div className="hidden md:flex items-center gap-3 p-2 mb-8">
        <img src="/assets/ios-lion.png" alt="Logo" className="w-10 h-10 drop-shadow-md" />
        <h2 className="text-xl font-bold tracking-tight">Daily Lion</h2>
        </div>

        <nav className="flex md:flex-col flex-1 justify-around md:justify-start w-full gap-2">
        <NavItem active={currentTab === 'tarefas'} onClick={() => setCurrentTab('tarefas')} icon="📝" label="Tarefas" />
        <NavItem active={currentTab === 'habitos'} onClick={() => setCurrentTab('habitos')} icon="🔁" label="Hábitos" />
        <NavItem active={currentTab === 'loja'} onClick={() => setCurrentTab('loja')} icon="🏪" label="Loja" />
        <NavItem active={currentTab === 'perfil'} onClick={() => setCurrentTab('perfil')} icon="🦁" label="Perfil" />
        </nav>
        </GlassCard>

        {/* Área Principal */}
        <main className="flex-1 flex flex-col z-10 p-4 pb-24 md:pb-4 md:pl-0 h-screen overflow-hidden">

        {/* Topbar: Status de RPG e Mood */}
        <GlassCard className="w-full flex items-center justify-between p-4 mb-4 border-white/10">
        <div className="flex items-center gap-6">
        <div className="flex flex-col">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Nível {rpg.level}</span>
        <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
        <div className="h-full bg-blue-500 w-1/3" /> {/* Barra de XP mockada */}
        </div>
        </div>
        </div>

        <div className="flex items-center gap-4 font-medium">
        <span className="flex items-center gap-1 text-amber-400">
        🪙 {rpg.gold}
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
        🎟️ {rpg.vouchers}
        </span>
        </div>
        </GlassCard>

        {/* Conteúdo da Aba Atual (Scrollável) */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {/* Aqui renderizaremos as views de Tarefas, Hábitos, etc, baseado no currentTab */}
        <div className="p-8 text-center text-slate-400">
        Visão ativa: <span className="font-bold text-white capitalize">{currentTab}</span>
        </div>
        </div>

        </main>
        </div>
    );
}
