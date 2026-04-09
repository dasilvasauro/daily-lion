import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';

// Vamos importar as telas que construímos!
// Certifique-se de que os caminhos e arquivos existem na sua pasta src/features/
import ProfileView from '../../features/profile/ProfileView';
import StoreView from '../../features/store/StoreView';
// Importe suas outras telas aqui quando as tiver prontas:
import TaskView from '../../features/tasks/TaskView';
// import HabitsView from '../../features/habits/HabitsView';

export default function MainLayout() {
    const { rpg } = useUserStore();
    const [activeTab, setActiveTab] = useState('tarefas');

    // Controle de Abas
    const renderActiveView = () => {
        switch (activeTab) {
            case 'perfil':
                return <ProfileView />;
            case 'loja':
                return <StoreView />;
            case 'tarefas':
                return <div className="text-center mt-20 text-slate-400">A Tela de Tarefas vai aqui</div>; // Substitua por <TaskView />
            case 'habitos':
                return <div className="text-center mt-20 text-slate-400">A Tela de Hábitos vai aqui</div>; // Substitua por <HabitsView />
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex flex-col relative pb-20">

        {/* TopBar (HUD do Jogador) */}
        <header className="fixed top-0 w-full z-50 p-4 pointer-events-none">
        <div className="max-w-4xl mx-auto flex justify-between items-center bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 pointer-events-auto shadow-lg">
        <div className="flex items-center gap-3">
        <span className="font-black text-slate-200 tracking-widest text-sm uppercase">
        Nível {rpg.level}
        </span>
        <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden">
        {/* Barra de XP falsa para visualização inicial */}
        <div className="h-full bg-indigo-500 w-1/3" />
        </div>
        </div>
        <div className="flex items-center gap-4 font-bold text-sm">
        <span className="text-amber-400 flex items-center gap-1">🪙 {rpg.gold}</span>
        <span className="text-emerald-400 flex items-center gap-1">🎟️ {rpg.vouchers}</span>
        </div>
        </div>
        </header>

        {/* Área de Conteúdo Principal (Scrollável) */}
        <main className="flex-1 overflow-y-auto pt-24 px-4 custom-scrollbar">
        {renderActiveView()}
        </main>

        {/* Botão Flutuante (FAB) - Onde o Leão ruge! */}
        <button
        onClick={() => console.log('Abrir Modal de Nova Tarefa')}
        className="fixed bottom-24 right-6 w-16 h-16 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 active:scale-95 z-50 border border-white/20"
        >
        ➕
        </button>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-4 w-full px-4 z-50">
        <div className="max-w-md mx-auto bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around items-center p-2 shadow-2xl">
        <button onClick={() => setActiveTab('tarefas')} className={`p-3 rounded-xl transition-all ${activeTab === 'tarefas' ? 'bg-white/10 scale-110' : 'opacity-50 hover:opacity-100'}`}>
        📝
        </button>
        <button onClick={() => setActiveTab('habitos')} className={`p-3 rounded-xl transition-all ${activeTab === 'habitos' ? 'bg-white/10 scale-110' : 'opacity-50 hover:opacity-100'}`}>
        🔁
        </button>
        <button onClick={() => setActiveTab('loja')} className={`p-3 rounded-xl transition-all ${activeTab === 'loja' ? 'bg-white/10 scale-110' : 'opacity-50 hover:opacity-100'}`}>
        🏪
        </button>
        <button onClick={() => setActiveTab('perfil')} className={`p-3 rounded-xl transition-all ${activeTab === 'perfil' ? 'bg-white/10 scale-110' : 'opacity-50 hover:opacity-100'}`}>
        🦁
        </button>
        </div>
        </nav>

        </div>
    );
}
