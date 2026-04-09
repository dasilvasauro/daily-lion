import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';

const FOCUS_MESSAGES = [
    "O leão não olha para trás.",
"Foco no agora, glória no amanhã.",
"Sua mente é seu território.",
"Um passo de cada vez, com a força de um rugido.",
"Silencie o mundo, ouça sua execução.",
"A consistência é o ouro do sábio."
];

export default function FocusOverlay({ task, timeLeft, onClose }) {
    const [msgIndex, setMsgIndex] = useState(0);

    // Rotaciona as mensagens a cada 10 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % FOCUS_MESSAGES.length);
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
        >
        {/* Animação de Fundo (Foco) */}
        <div className="absolute inset-0 z-0">
        <motion.div
        animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-blue-500/20"
        />
        {/* Círculos pulsantes para efeito Zen */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center space-y-12 p-6 w-full max-w-lg">
        <header>
        <h2 className="text-slate-400 uppercase tracking-[0.2em] text-sm font-bold mb-2">Em Execução</h2>
        <h1 className="text-3xl font-bold text-white">{task.title}</h1>
        </header>

        <div className="text-8xl md:text-9xl font-mono font-black tracking-tighter text-white drop-shadow-2xl">
        {formatTime(timeLeft)}
        </div>

        <div className="h-12 flex items-center justify-center">
        <AnimatePresence mode="wait">
        <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg italic text-slate-300"
        >
        "{FOCUS_MESSAGES[msgIndex]}"
        </motion.p>
        </AnimatePresence>
        </div>

        <button
        onClick={onClose}
        className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-slate-300 hover:text-white"
        >
        Minimizar Foco
        </button>
        </div>
        </motion.div>
    );
}
