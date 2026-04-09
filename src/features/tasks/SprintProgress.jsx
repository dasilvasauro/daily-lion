import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { getSprintTier } from '../../utils/constants';

export default function SprintProgress({ sprint, onToggleSubtask }) {
    if (!sprint || sprint.completed) return null;

    const total = sprint.subtasks?.length || 0;
    const done = sprint.subtasks?.filter(s => s.completed).length || 0;
    const progressPercent = total === 0 ? 0 : Math.round((done / total) * 100);

    const tier = getSprintTier(total);

    return (
        <GlassCard className="p-5 mb-6 border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-slate-900/50 relative overflow-hidden">
        {/* Decoração de fundo */}
        <div className="absolute -right-6 -top-6 text-9xl opacity-5 pointer-events-none">🏃‍♂️</div>

        <header className="flex justify-between items-start mb-4 relative z-10">
        <div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Sprint Ativa</span>
        <h2 className="text-xl font-black text-white mt-1">{sprint.title}</h2>
        <p className="text-sm text-slate-400 mt-1">Foco e resiliência. Você não recebe XP parcial aqui.</p>
        </div>
        <div className="text-right flex flex-col items-end">
        <span className="text-4xl drop-shadow-md">{tier.icon}</span>
        <span className="text-xs font-bold text-slate-300 mt-1">{tier.label}</span>
        </div>
        </header>

        {/* Barra de Progresso Encorpada */}
        <div className="relative w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/5 mb-6 z-10">
        <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out"
        style={{ width: `${progressPercent}%` }}
        />
        </div>

        {/* Lista de Subtarefas */}
        <div className="space-y-2 z-10 relative">
        {sprint.subtasks.map((sub, idx) => (
            <label
            key={sub.id || idx}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                sub.completed
                ? 'bg-white/5 border-transparent opacity-50'
                : 'bg-black/20 border-white/10 hover:border-indigo-500/50 hover:bg-black/40'
            }`}
            >
            <input
            type="checkbox"
            checked={sub.completed}
            onChange={() => onToggleSubtask(sprint.id, sub.id)}
            className="w-5 h-5 rounded border-white/20 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-transparent cursor-pointer"
            />
            <span className={`text-sm font-medium ${sub.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
            {sub.title}
            </span>
            </label>
        ))}
        </div>
        </GlassCard>
    );
}
