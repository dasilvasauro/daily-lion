import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';

export default function LuckCardReveal() {
    const { pendingLevelUp, consumeLevelUp, rpg, addGold } = useUserStore();
    const [isFlipped, setIsFlipped] = useState(false);
    const [prize, setPrize] = useState(null);

    // Sorteia o prêmio quando o modal abrir
    useEffect(() => {
        if (pendingLevelUp && !prize) {
            const rand = Math.random();
            let newPrize = {};

            // Lógica de raridade e prêmios que você definiu:
            if (rand < 0.15) {
                // 15% de chance: Vouchers (Mais raros)
                const v = Math.floor(Math.random() * 4) + 2; // 2 a 5
                newPrize = { type: 'vouchers', amount: v, label: 'Vouchers', icon: '🎟️', color: 'text-emerald-400' };
            } else if (rand < 0.5) {
                // 35% de chance: XP
                const x = Math.floor(Math.random() * 301) + 300; // 300 a 600
                newPrize = { type: 'xp', amount: x, label: 'XP Bônus', icon: '✨', color: 'text-indigo-400' };
            } else {
                // 50% de chance: Moedas
                const m = Math.floor(Math.random() * 401) + 100; // 100 a 500
                newPrize = { type: 'gold', amount: m, label: 'Moedas', icon: '🪙', color: 'text-amber-400' };
            }

            setPrize(newPrize);
        }
    }, [pendingLevelUp, prize]);

    const handleReveal = () => {
        if (isFlipped) return;
        setIsFlipped(true);

        // Entrega o prêmio no estado global
        setTimeout(() => {
            if (prize.type === 'gold') addGold(prize.amount);
            if (prize.type === 'xp') useUserStore.getState().addXP(prize.amount);
            if (prize.type === 'vouchers') {
                useUserStore.setState(s => ({ rpg: { ...s.rpg, vouchers: s.rpg.vouchers + prize.amount } }));
            }
        }, 1000); // Entrega após 1 segundo (tempo da animação)
    };

    const handleClose = () => {
        setIsFlipped(false);
        setPrize(null);
        consumeLevelUp();
    };

    return (
        <AnimatePresence>
        {pendingLevelUp && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center bg-slate-950/90 backdrop-blur-md perspective-1000">
            <div className="text-center">

            {!isFlipped && (
                <motion.h2
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-black text-amber-500 mb-8 tracking-widest uppercase"
                >
                Nível {rpg.level} Alcançado!
                </motion.h2>
            )}

            {/* Container da Carta com rotação 3D */}
            <motion.div
            onClick={handleReveal}
            className="relative w-64 h-96 cursor-pointer mx-auto preserve-3d"
            whileHover={!isFlipped ? { scale: 1.05, rotateZ: [-1, 1, -1, 1, 0], transition: { duration: 0.2 } } : {}}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
            >

            {/* Frente da Carta (Oculta o prêmio) */}
            <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col items-center justify-center p-6">
            <div className="text-7xl mb-4">🃏</div>
            <h3 className="font-bold text-slate-300 uppercase tracking-widest text-sm">Toque para Revelar</h3>
            <div className="absolute inset-2 border border-white/5 rounded-xl pointer-events-none"></div>
            </div>

            {/* Costas da Carta (O Prêmio) */}
            <div
            className="absolute inset-0 rounded-2xl border-2 border-white/20 bg-slate-800 flex flex-col items-center justify-center shadow-2xl"
            style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
            >
            {/* Efeito radial de brilho */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent rounded-xl"></div>

            <span className="text-6xl drop-shadow-lg relative z-10">{prize?.icon}</span>
            <span className={`text-4xl font-black mt-4 relative z-10 ${prize?.color}`}>
            +{prize?.amount}
            </span>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-2 relative z-10">
            {prize?.label}
            </span>
            </div>

            </motion.div>

            {isFlipped && (
                <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                onClick={handleClose}
                className="mt-12 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold text-slate-200 transition-all"
                >
                Coletar e Continuar
                </motion.button>
            )}
            </div>
            </div>
        )}
        </AnimatePresence>
    );
}
