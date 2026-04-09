import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../components/ui/GlassCard';
import { useTaskStore } from '../../store/useTaskStore';
import { db } from '../../services/db';

export default function CreateTaskModal({ isOpen, onClose }) {
    const addTask = useTaskStore((state) => state.addTask);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'P3',
        type: 'normal', // normal, daily_challenge, sprint, time
        dueDate: '',
        dueTime: '',
        subtasks: []
    });

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('O título é obrigatório.');
            return;
        }

        try {
            // 1. Adiciona à Store (Valida limites P0/P1 aqui)
            const newTask = addTask(formData);

            // 2. Persiste no Dexie (Offline First)
            await db.tasks.add(newTask);

            onClose();
            setFormData({ title: '', description: '', priority: 'P3', type: 'normal', subtasks: [] });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <AnimatePresence>
        {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl"
            >
            <GlassCard className="p-6 border-white/20 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🦁 Matar um novo Leão
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Título */}
            <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">O que precisa ser feito?</label>
            <input
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500/50 transition-colors"
            placeholder="Ex: Finalizar relatório de Sprints"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
            />
            </div>

            {/* Tipo de Tarefa */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['normal', 'daily_challenge', 'sprint', 'time'].map(type => (
                <button
                key={type}
                type="button"
                onClick={() => setFormData({...formData, type})}
                className={`p-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all ${
                    formData.type === type ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
                >
                {type.replace('_', ' ')}
                </button>
            ))}
            </div>

            {/* Prioridade */}
            <div className="flex justify-between gap-2">
            {['P0', 'P1', 'P2', 'P3', 'P4'].map(p => (
                <button
                key={p}
                type="button"
                onClick={() => setFormData({...formData, priority: p})}
                className={`flex-1 p-2 rounded-lg border text-sm font-bold transition-all ${
                    formData.priority === p ? 'bg-white/20 border-white text-white' : 'bg-white/5 border-white/5 text-slate-500'
                }`}
                >
                {p}
                </button>
            ))}
            </div>

            {/* Descrição (Limite 1500) */}
            <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">Detalhes (Opcional)</label>
            <textarea
            maxLength={1500}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none focus:border-amber-500/50"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            />
            <div className="text-[10px] text-right text-slate-500">{formData.description.length}/1500</div>
            </div>

            {/* Erros */}
            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            {/* Footer do Modal */}
            <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-slate-400 font-medium">Cancelar</button>
            <button type="submit" className="px-8 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl font-bold shadow-lg transition-all active:scale-95">
            Criar Tarefa
            </button>
            </div>
            </form>
            </GlassCard>
            </motion.div>
            </div>
        )}
        </AnimatePresence>
    );
}
