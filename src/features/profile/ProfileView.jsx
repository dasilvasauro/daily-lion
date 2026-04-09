import React, { useState } from 'react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import GlassCard from '../../components/ui/GlassCard';
import { useUserStore } from '../../store/useUserStore';

const MOODS = [
    { id: 'radiante', emoji: '🤩', label: 'Radiante', color: 'bg-amber-400' },
{ id: 'feliz', emoji: '😊', label: 'Feliz', color: 'bg-emerald-400' },
{ id: 'normal', emoji: '😐', label: 'Normal', color: 'bg-blue-400' },
{ id: 'incomodado', emoji: '😒', label: 'Incomodado', color: 'bg-orange-500' },
{ id: 'decepcionado', emoji: '😞', label: 'Decepcionado', color: 'bg-slate-500' }
];

export default function ProfileView() {
    const { profile, rpg, moodHistory, setDailyMood, stats } = useUserStore();
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const currentMood = moodHistory[todayStr];

    // Mock de um "streak atual" para a lógica de feedback
    // Na versão final, isso viria do useHabitStore
    const currentStreak = 5;

    // --- Lógica do Feedback Psicológico ---
    const getPsychologicalFeedback = () => {
        if (currentStreak === 0 && stats.maxStreak > 5) {
            return {
                title: "Levante a cabeça, Leão.",
                msg: `Você deixou a peteca cair. Lembre-se de quando você atingiu ${stats.maxStreak} dias de consistência. Você sabe o caminho, pare de procrastinar e volte para a arena. A dor da disciplina pesa onças, a dor do arrependimento pesa toneladas.`,
                type: 'reprimand'
            };
        }
        if (currentStreak >= 15) {
            return {
                title: "Estado de Fluxo.",
                msg: "Você entrou em um plateau de excelência. A rotina já não é um peso, é a sua natureza. Continue afiando o machado, você está construindo uma fundação inquebrável.",
                type: 'praise'
            };
        }
        if (currentStreak > 3) {
            return {
                title: "Em Ascensão!",
                msg: "Você está ganhando momento (momentum). Os primeiros dias são os mais difíceis, mas você já passou por eles. Proteja sua sequência de vitórias hoje a todo custo.",
                type: 'growth'
            };
        }
        return {
            title: "Página em Branco.",
            msg: "Hoje é um excelente dia para começar a construir a sua lenda. Faça o básico bem feito.",
            type: 'neutral'
        };
    };

    const feedback = getPsychologicalFeedback();

    // --- Grid de Mood ---
    const pastDays = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });

    return (
        <div className="max-w-4xl mx-auto w-full space-y-6 pb-12 animate-fade-in">

        {/* Cabeçalho do Perfil */}
        <GlassCard className="p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-amber-500/50 flex items-center justify-center text-5xl shadow-xl z-10">
        🦁
        </div>
        <div className="text-center md:text-left z-10">
        <h1 className="text-3xl font-black text-white">{profile.name || 'Jogador'}</h1>
        <p className="text-amber-500 font-bold tracking-widest uppercase text-sm mt-1">
        Nível {rpg.level} • {profile.modusOperandi || 'Explorador'}
        </p>
        </div>

        {/* Botões de Ação Rápidos (Config/Logout) */}
        <div className="md:ml-auto flex gap-3 z-10">
        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors" title="Configurações">⚙️</button>
        <button className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors" title="Sair">🚪</button>
        </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Coluna Esquerda: Estatísticas e Feedback */}
        <div className="md:col-span-2 space-y-6">

        {/* Dashboard de Números */}
        <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 text-center">
        <span className="text-3xl font-black text-emerald-400 block">{stats.tasksCompleted}</span>
        <span className="text-xs text-slate-400 uppercase font-bold">Tarefas Concluídas</span>
        </GlassCard>
        <GlassCard className="p-4 text-center">
        <span className="text-3xl font-black text-amber-400 block">{stats.maxStreak}d</span>
        <span className="text-xs text-slate-400 uppercase font-bold">Maior Streak</span>
        </GlassCard>
        </div>

        {/* Feedback Psicológico (O Mentor) */}
        <GlassCard className={`p-6 border-l-4 ${
            feedback.type === 'reprimand' ? 'border-l-red-500 bg-red-500/5' :
            feedback.type === 'praise' ? 'border-l-blue-500 bg-blue-500/5' :
            'border-l-amber-500 bg-amber-500/5'
        }`}>
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        {feedback.type === 'reprimand' ? '⚠️' : '👁️'} {feedback.title}
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed italic">"{feedback.msg}"</p>
        </GlassCard>

        {/* Botão para a Visão */}
        <button
        onClick={() => console.log('Abrir Modal de Visão')}
        className="w-full relative overflow-hidden group rounded-2xl p-6 border border-white/20 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 hover:from-indigo-800/60 hover:to-purple-800/60 transition-all shadow-lg cursor-pointer"
        >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 group-hover:opacity-50 transition-opacity"></div>
        <div className="relative z-10 flex items-center justify-between">
        <div className="text-left">
        <h2 className="text-2xl font-black text-white drop-shadow-md">O Modal de Visão</h2>
        <p className="text-indigo-200 text-sm mt-1">Lembre-se de quem você está construindo.</p>
        </div>
        <span className="text-4xl group-hover:scale-110 transition-transform">🌌</span>
        </div>
        </button>
        </div>

        {/* Coluna Direita: Humor (Mood) */}
        <div className="space-y-6">

        {/* Seletor Diário */}
        <GlassCard className="p-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">Como você está hoje?</h3>
        <div className="flex justify-between">
        {MOODS.map(m => (
            <button
            key={m.id}
            onClick={() => setDailyMood(todayStr, m.id)}
            className={`text-2xl transition-all ${currentMood === m.id ? 'scale-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'opacity-50 hover:opacity-100 hover:scale-110'}`}
            title={m.label}
            >
            {m.emoji}
            </button>
        ))}
        </div>
        </GlassCard>

        {/* Histórico Recente de Mood (Últimos 30 dias) */}
        <GlassCard className="p-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Mapa de Humor</h3>
        <div className="flex flex-wrap gap-1 justify-center">
        {pastDays.map(day => {
            const dStr = format(day, 'yyyy-MM-dd');
            const dayMood = moodHistory[dStr];
            const moodData = MOODS.find(m => m.id === dayMood);

            return (
                <div
                key={dStr}
                title={`${dStr}: ${moodData ? moodData.label : 'Não registrado'}`}
                className={`w-4 h-4 rounded-sm transition-colors ${moodData ? moodData.color : 'bg-white/5'}`}
                />
            );
        })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-slate-400 justify-center">
        {MOODS.map(m => (
            <span key={m.id} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${m.color}`}></span> {m.label}
            </span>
        ))}
        </div>
        </GlassCard>

        </div>
        </div>
        </div>
    );
}
