import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

export default function HabitCard({ habit, onAction }) {
    const isMultiple = habit.type === 'multiple';
    const progress = (habit.currentCount / (habit.targetCount || 1)) * 100;
    const isDone = habit.currentCount >= (habit.targetCount || 1);

    // Lógica de Mensagem de Streak (Psicologia)
    const getStreakIncentive = (s) => {
        if (s <= 3) return "🦁 Começo promissor! Não pare agora.";
        if (s >= 15) return "🏆 Um trunfo! Você dominou sua rotina.";
        if (s >= 21) return "🧘 Paz interior. Este hábito é parte de você.";
        return "🔥 No ritmo certo!";
    };

    return (
        <GlassCard className={`p-4 mb-3 transition-opacity ${isDone ? 'opacity-60' : 'opacity-100'}`}>
        <div className="flex justify-between items-center">
        <div>
        <h4 className="font-bold text-lg">{habit.title}</h4>
        <p className="text-xs text-slate-400">{getStreakIncentive(habit.streak)}</p>
        </div>

        <div className="flex items-center gap-4">
        <div className="text-right">
        <span className="block text-2xl font-black text-amber-500">{habit.streak}d</span>
        <span className="text-[10px] text-slate-500 uppercase font-bold">Streak</span>
        </div>

        <button
        disabled={isDone}
        onClick={() => onAction(habit.id)}
        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
            isDone ? 'bg-emerald-500/20 text-emerald-500' : 'bg-white/10 hover:bg-white/20 active:scale-95'
        }`}
        >
        {isMultiple ? (
            <span className="text-xs font-bold">{habit.currentCount}/{habit.targetCount}</span>
        ) : (
            <span className="text-xl">{isDone ? '✓' : '+'}</span>
        )}
        </button>
        </div>
        </div>

        {/* Barra de Progresso Sutil para múltiplos */}
        {isMultiple && (
            <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
            <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
            />
            </div>
        )}
        </GlassCard>
    );
}
