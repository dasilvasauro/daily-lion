import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import { TASK_PRIORITIES } from '../../utils/constants';

export default function TaskCard({ task, onComplete }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const isSprint = task.type === 'sprint';
    const { timeLeft, isActive } = useFocusTimer(task);
    const [showFocus, setShowFocus] = useState(false);

    const priorityColors = {
        P0: 'border-l-red-500',
        P1: 'border-l-orange-500',
        P2: 'border-l-blue-500',
        P3: 'border-l-slate-500',
        P4: 'border-l-emerald-500',
    };

    const handleStartTimer = async () => {
        const startTime = new Date().toISOString();
        // Atualiza na store e no banco
        updateTask(task.id, { timerStartedAt: startTime });
        await db.tasks.update(task.id, { timerStartedAt: startTime });
        setShowFocus(true);
    };

    return (
        <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
        >
        <GlassCard className={`border-l-4 ${priorityColors[task.priority] || 'border-l-transparent'}`}>
        <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
        <button
        onClick={() => onComplete(task.id)}
        className="w-6 h-6 rounded-full border-2 border-white/20 hover:border-amber-500 transition-colors flex items-center justify-center text-transparent hover:text-amber-500"
        >
        ✓
        </button>

        <div className="flex flex-col cursor-pointer" onClick={() => (hasSubtasks || isSprint) && setIsExpanded(!isExpanded)}>
        <span className="font-semibold text-slate-100">{task.title}</span>
        <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded uppercase font-bold text-slate-400">
        {task.type}
        </span>
        {task.dueDate && (
            <span className="text-[10px] text-slate-500">
            🕒 {new Date(task.dueDate).toLocaleDateString()}
            </span>
        )}
        </div>
        </div>
        </div>

        {(hasSubtasks || isSprint) && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-500 p-2">
            {isExpanded ? '▲' : '▼'}
            </button>
        )}
        </div>

        {/* Área Expandível (Subtarefas ou Sprint) */}
        {isExpanded && (
            <div className="px-12 pb-4 space-y-2 border-t border-white/5 pt-3 bg-black/10">
            {task.description && <p className="text-sm text-slate-400 mb-3">{task.description}</p>}
            {task.subtasks.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" className="rounded border-white/10 bg-transparent" />
                <span>{sub.title}</span>
                </div>
            ))}
            <div className="text-[9px] text-slate-600 mt-4 italic">
            Criado em: {new Date(task.createdAt).toLocaleString()}
            </div>
            </div>
        )}

        {/* No corpo do card, se for tipo 'time' */}
        {task.type === 'time' && (
            <div className="flex items-center gap-3 mt-2">
            <button
            onClick={handleStartTimer}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isActive ? 'bg-amber-600' : 'bg-emerald-600'
            }`}
            >
            {isActive ? 'CONTINUAR FOCO' : '▶ INICIAR (2h)'}
            </button>
            {isActive && <span className="text-xs font-mono">{Math.floor(timeLeft/60)}m restantes</span>}
            </div>
        )}

        {/* Overlay de Foco Fullscreen */}
        <AnimatePresence>
        {showFocus && (
            <FocusOverlay
                task={task}
                timeLeft={timeLeft}
                onClose={() => setShowFocus(false)}
            />
        )}
        </AnimatePresence>

        </GlassCard>
        </motion.div>
    );
}
