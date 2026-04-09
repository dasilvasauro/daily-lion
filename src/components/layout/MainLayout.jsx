import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

import ProfileView from '../../features/profile/ProfileView';
import StoreView from '../../features/store/StoreView';
import TaskView from '../../features/tasks/TaskView';

export default function MainLayout() {
    const { rpg } = useUserStore();
    const [activeTab, setActiveTab] = useState('tarefas');

    // Variantes de transição para o Framer Motion
    const pageVariants = {
        initial: { opacity: 0, y: 10, scale: 0.98 },
        in: { opacity: 1, y: 0, scale: 1 },
        out: { opacity: 0, y: -10, scale: 0.98 }
    };

    const renderActiveView = () => {
        switch (activeTab) {
            case 'perfil':
                return <motion.div key="perfil" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.2 }} className="h-full"><ProfileView /></motion.div>;
            case 'loja':
                return <motion.div key="loja" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.2 }} className="h-full"><StoreView /></motion.div>;
            case 'tarefas':
                return <motion.div key="tarefas" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.2 }} className="h-full"><TaskView /></motion.div>;
            case 'habitos':
                return <motion.div key="habitos" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.2 }} className="h-full"><div className="text-center mt-20 text-slate-400">A Tela de Hábitos vai aqui</div></motion.div>;
            default:
                return null;
        }
    };

    return (
        <div className="h-screen flex flex-col relative pb-20">
        {/* TopBar (HUD do Jogador) usando bg-accent */}
        <header className="fixed top-0 w-full z-50 p-4 pointer-events-none">
        <div className="max-w-4xl mx-auto flex justify-between items-center bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-3 pointer-events-auto shadow-lg">
        <div className="flex items-center gap-3">
        <span className="font-black text-slate-200 tracking-widest text-sm uppercase">Nível {rpg.level}</span>
        <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden">
        <div className="h-full bg-accent w-1/3 transition-colors duration-500" />
        </div>
        </div>
        <div className="flex items-center gap-4 font-bold text-sm">
        <span className="text-amber-400 flex items-center gap-1">🪙 {rpg.gold}</span>
        <span className="text-emerald-400 flex items-center gap-1">🎟️ {rpg.vouchers}</span>
        </div>
        </div>
        </header>

        {/* AnimatePresence Cuida de destruir a aba antiga e renderizar a nova suavemente */}
        <main className="flex-1 overflow-y-auto pt-24 px-4 custom-scrollbar overflow-x-hidden">
        <AnimatePresence mode="wait">
        {renderActiveView()}
        </AnimatePresence>
        </main>

        {/* Bottom Navigation com Labels no Desktop */}
        <nav className="fixed bottom-4 w-full px-4 z-50">
        <div className="max-w-2xl mx-auto bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl flex justify-around items-center p-2 shadow-2xl">
        <button onClick={() => setActiveTab('tarefas')} className={`p-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'tarefas' ? 'bg-white/10 scale-105' : 'opacity-50 hover:opacity-100'}`}>
        <span className="text-2xl">📝</span>
        <span className={`hidden md:block font-bold ${activeTab === 'tarefas' ? 'text-accent' : 'text-slate-300'}`}>Tarefas</span>
        </button>
        <button onClick={() => setActiveTab('habitos')} className={`p-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'habitos' ? 'bg-white/10 scale-105' : 'opacity-50 hover:opacity-100'}`}>
        <span className="text-2xl">🔁</span>
        <span className={`hidden md:block font-bold ${activeTab === 'habitos' ? 'text-accent' : 'text-slate-300'}`}>Hábitos</span>
        </button>
        <button onClick={() => setActiveTab('loja')} className={`p-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'loja' ? 'bg-white/10 scale-105' : 'opacity-50 hover:opacity-100'}`}>
        <span className="text-2xl">🏪</span>
        <span className={`hidden md:block font-bold ${activeTab === 'loja' ? 'text-accent' : 'text-slate-300'}`}>Loja</span>
        </button>
        <button onClick={() => setActiveTab('perfil')} className={`p-3 rounded-xl transition-all flex items-center gap-2 ${activeTab === 'perfil' ? 'bg-white/10 scale-105' : 'opacity-50 hover:opacity-100'}`}>
        <span className="text-2xl">🦁</span>
        <span className={`hidden md:block font-bold ${activeTab === 'perfil' ? 'text-accent' : 'text-slate-300'}`}>Perfil</span>
        </button>
        </div>
        </nav>
        </div>
    );
}
