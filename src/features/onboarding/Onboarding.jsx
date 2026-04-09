import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock das configurações que depois irão para o Zustand/Firebase
const MODUS_OPERANDI = [
    { id: 'multitarefa', title: 'Multitarefa', desc: 'Bônus por volume de tarefas e hábitos ativos.', color: 'bg-blue-600' },
    { id: 'minimalista', title: 'Minimalista', desc: 'Menos é mais. Bônus por focar em poucas prioridades.', color: 'bg-slate-600' },
    { id: 'pontual', title: 'Pontual', desc: 'Recompensas extras por honrar prazos estritos.', color: 'bg-emerald-600' },
    { id: 'ambicioso', title: 'Ambicioso', desc: 'Mais XP ao dominar Sprints e Subtarefas.', color: 'bg-purple-600' }
];

const PALETTES = [
    { id: 'steel_blue', name: 'Azul Aço', hex: '#4682B4' },
{ id: 'muted_emerald', name: 'Esmeralda', hex: '#50C878' },
{ id: 'slate_purple', name: 'Roxo Acinzentado', hex: '#705E78' },
{ id: 'aged_gold', name: 'Dourado Envelhecido', hex: '#DAA520' },
{ id: 'terracotta', name: 'Terracota', hex: '#E2725B' },
{ id: 'charcoal', name: 'Cinza Carvão', hex: '#36454F' }
];

export default function Onboarding() {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState({
        name: '',
        modus: null,
        theme: 'dark',
        font: 'sans',
        accent: 'steel_blue',
        glassEnabled: true,
        animationsEnabled: true
    });

    const nextStep = () => setStep((prev) => prev + 1);

    // Variantes de animação do Framer Motion
    const pageVariants = {
        initial: { opacity: 0, x: 50 },
        in: { opacity: 1, x: 0 },
        out: { opacity: 0, x: -50 }
    };

    const renderStep = () => {
        switch (step) {
            case 0:
                return (
                    <motion.div
                    key="welcome"
                    variants={pageVariants} initial="initial" animate="in" exit="out"
                    className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6"
                    >
                    <img src="/assets/ios-lion.png" alt="Leão Sorridente" className="w-32 h-32 drop-shadow-xl" />
                    <h1 className="text-4xl font-bold tracking-tight">Bem-Vindo ao Daily Lion</h1>
                    <p className="text-lg opacity-80 max-w-md">
                    A vida é uma savana corrida. Nós estamos aqui para te ajudar a organizar seus projetos,
                    hábitos e matar o seu leão por dia, sem perder a elegância.
                    </p>
                    <button onClick={nextStep} className="mt-8 px-8 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md hover:bg-white/20 transition-all shadow-lg font-medium">
                    Começar a Jornada
                    </button>
                    </motion.div>
                );

            case 1:
                // Espaço para o Carrossel (Simplificado para avançar direto pro Nome no escopo atual)
                return (
                    <motion.div key="features" variants={pageVariants} initial="initial" animate="in" exit="out" className="flex flex-col items-center justify-center h-full space-y-6 p-8 text-center">
                    <h2 className="text-3xl font-bold">Domine sua Rotina</h2>
                    <p className="text-lg opacity-80 max-w-md">Transforme tarefas em Sprints, mantenha o foco e ganhe experiência real na sua evolução.</p>
                    <button onClick={nextStep} className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md">Avançar</button>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div key="name" variants={pageVariants} initial="initial" animate="in" exit="out" className="flex flex-col items-center justify-center h-full space-y-6 p-8">
                    <h2 className="text-3xl font-bold">Como devemos te chamar?</h2>
                    <input
                    type="text"
                    className="w-full max-w-sm bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 backdrop-blur-sm"
                    placeholder="Seu nome..."
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    />
                    <button
                    disabled={!userData.name.trim()}
                    onClick={nextStep}
                    className="px-8 py-3 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md disabled:opacity-50"
                    >
                    Continuar
                    </button>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div key="modus" variants={pageVariants} initial="initial" animate="in" exit="out" className="flex flex-col items-center justify-center h-full p-8 w-full">
                    <h2 className="text-3xl font-bold mb-8 text-center">Selecione seu Modus Operandi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                    {MODUS_OPERANDI.map((mod) => (
                        <div
                        key={mod.id}
                        onClick={() => { setUserData({...userData, modus: mod.id}); nextStep(); }}
                        className={`p-6 rounded-2xl cursor-pointer border border-white/10 backdrop-blur-md transition-all hover:scale-[1.02] ${mod.color} bg-opacity-20 hover:bg-opacity-40 shadow-xl relative overflow-hidden`}
                        >
                        {/* Pseudo-elemento para o "Liquid Glass" reflexo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none"></div>
                        <h3 className="text-2xl font-bold mb-2">{mod.title}</h3>
                        <p className="opacity-90">{mod.desc}</p>
                        </div>
                    ))}
                    </div>
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div key="theme" variants={pageVariants} initial="initial" animate="in" exit="out" className="flex flex-col items-center justify-center h-full space-y-8 p-8 w-full max-w-2xl">
                    <h2 className="text-3xl font-bold text-center">Personalize seu Ambiente</h2>

                    {/* Cores */}
                    <div className="w-full space-y-4">
                    <h3 className="text-xl font-medium">Cor de Destaque</h3>
                    <div className="flex justify-between gap-2">
                    {PALETTES.map(color => (
                        <div
                        key={color.id}
                        onClick={() => setUserData({...userData, accent: color.id})}
                        className={`w-12 h-12 rounded-full cursor-pointer shadow-lg border-2 transition-all ${userData.accent === color.id ? 'border-white scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        />
                    ))}
                    </div>
                    </div>

                    <button onClick={() => completeOnboarding(userData)} className="w-full py-4 mt-8 bg-white/10 border border-white/20 rounded-xl backdrop-blur-md hover:bg-white/20 font-bold text-lg">
                    Entrar no Daily Lion
                    </button>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        // O container principal define o "Liquid Glass" da aplicação em tela cheia
        <div className={`min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center overflow-hidden font-${userData.font}`}>
        {/* Background animado sutil para compor o glassmorphism */}
        <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
        </div>

        {/* Container do Onboarding */}
        <div className="relative z-10 w-full max-w-6xl h-[80vh]">
        <AnimatePresence mode="wait">
        {renderStep()}
        </AnimatePresence>
        </div>
        </div>
    );
}
