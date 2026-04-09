import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import { GOAL_STATES } from '../../utils/visionHelper';
import { useVisionStore } from '../../store/useVisionStore';

export default function VisionModal({ isOpen, onClose }) {
    const [step, setStep] = useState(0); // 0: Intro, 1: Traits, 2: Goals
    const setupVision = useVisionStore(state => state.setupVision);

    const [tempData, setTempData] = useState({
        develop: ['', '', '', ''],
        abandon: ['', '', '', ''],
        goals: [
            { id: 1, title: '', state: 0 },
            { id: 2, title: '', state: 0 },
            { id: 3, title: '', state: 0 },
            { id: 4, title: '', state: 0 },
            { id: 5, title: '', state: 0 }
        ]
    });

    const handleFinish = async () => {
        await setupVision({
            traitsToDevelop: tempData.develop,
            traitsToAbandon: tempData.abandon,
            goals: tempData.goals.filter(g => g.title !== '')
        });
        onClose();
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl"
            >
            <GlassCard className="p-8 border-indigo-500/30 shadow-[0_0_50px_rgba(79,70,229,0.2)]">

            {/* Step 0: Introdução */}
            {step === 0 && (
                <div className="text-center space-y-6">
                <div className="text-6xl mb-4">🌌</div>
                <h2 className="text-3xl font-black">A Forja da Visão</h2>
                <p className="text-slate-400 leading-relaxed max-w-md mx-auto">
                Não somos apenas o que fazemos hoje, mas quem pretendemos nos tornar.
                Nesta seção, você definirá a bússola da sua vida para este mês.
                </p>
                <button onClick={() => setStep(1)} className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition-all">
                Começar Definição
                </button>
                </div>
            )}

            {/* Step 1: Características */}
            {step === 1 && (
                <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-indigo-400">01.</span> Identidade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Desenvolver</label>
                {tempData.develop.map((t, i) => (
                    <input key={i} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder={`Atributo ${i+1}`} value={t} onChange={e => {
                        const newD = [...tempData.develop]; newD[i] = e.target.value; setTempData({...tempData, develop: newD});
                    }} />
                ))}
                </div>
                <div className="space-y-3">
                <label className="text-xs font-bold text-red-400 uppercase tracking-widest">Abandonar</label>
                {tempData.abandon.map((t, i) => (
                    <input key={i} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm" placeholder={`Hábito nocivo ${i+1}`} value={t} onChange={e => {
                        const newA = [...tempData.abandon]; newA[i] = e.target.value; setTempData({...tempData, abandon: newA});
                    }} />
                ))}
                </div>
                </div>
                <div className="flex justify-end mt-6">
                <button onClick={() => setStep(2)} className="px-8 py-2 bg-white/10 rounded-lg font-bold">Próximo</button>
                </div>
                </div>
            )}

            {/* Step 2: Objetivos e Sliders (A parte que "manda") */}
            {step === 2 && (
                <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-indigo-400">02.</span> Grandes Objetivos
                </h3>
                <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                {tempData.goals.map((goal, idx) => (
                    <div key={idx} className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/5">
                    <input
                    className="w-full bg-transparent border-b border-white/10 p-1 text-lg font-bold outline-none focus:border-indigo-500"
                    placeholder={`Objetivo ${idx+1} (Ex: Aprender Alemão)`}
                    value={goal.title}
                    onChange={e => {
                        const newG = [...tempData.goals]; newG[idx].title = e.target.value; setTempData({...tempData, goals: newG});
                    }}
                    />

                    {/* Slider de Estado */}
                    <div className="space-y-2">
                    <div className="flex justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Estado de Atuação</span>
                    <span className="text-xs font-bold text-indigo-400">{GOAL_STATES[goal.state].label}</span>
                    </div>
                    <input
                    type="range" min="0" max="4" step="1"
                    className="w-full accent-indigo-500"
                    value={goal.state}
                    onChange={e => {
                        const newG = [...tempData.goals]; newG[idx].state = parseInt(e.target.value); setTempData({...tempData, goals: newG});
                    }}
                    />
                    <p className="text-[10px] text-slate-500 italic">{GOAL_STATES[goal.state].desc}</p>
                    </div>
                    </div>
                ))}
                </div>
                <button onClick={handleFinish} className="w-full py-4 bg-indigo-600 rounded-xl font-black text-lg shadow-lg">
                Consolidar Minha Visão
                </button>
                </div>
            )}

            </GlassCard>
            </motion.div>
            </div>
        )}
        </AnimatePresence>
    );
}
