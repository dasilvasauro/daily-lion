import React, { useState, useMemo } from 'react';
import { useTaskStore } from '../../store/useTaskStore';
import TaskCard from './TaskCard';
import { filterTasksByView } from '../../utils/dateHelper';
import CreateTaskModal from './CreateTaskModal';

export default function TaskView() {
    const tasks = useTaskStore((state) => state.tasks);
    const [currentView, setCurrentView] = useState('hoje'); // hoje, semana, mes, geral
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Lógica de Filtragem e Ordenação
    const filteredTasks = useMemo(() => {
        let result = filterTasksByView(tasks, currentView);

        if (priorityFilter !== 'ALL') {
            result = result.filter(t => t.priority === priorityFilter);
        }

        return result; // Por padrão, aqui já segue a ordem de criação ou podemos dar sort
    }, [tasks, currentView, priorityFilter]);

    return (
        <div className="max-w-4xl mx-auto w-full">
        {/* Cabeçalho de Navegação de Views */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        <div className="flex bg-black/20 p-1 rounded-xl backdrop-blur-sm border border-white/5">
        {['hoje', 'semana', 'mes', 'geral'].map((view) => (
            <button
            key={view}
            onClick={() => setCurrentView(view)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all capitalize ${
                currentView === view ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
            }`}
            >
            {view}
            </button>
        ))}
        </div>

        {/* Filtro de Prioridade */}
        <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
        className="bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs font-bold outline-none"
        >
        <option value="ALL">Todas Prioridades</option>
        <option value="P0">P0 - Críticas</option>
        <option value="P1">P1 - Urgentes</option>
        <option value="P2">P2 - Importantes</option>
        </select>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-2">
        {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={(id) => console.log('Completar:', id)} />
            ))
        ) : (
            <div className="text-center py-20 opacity-30 italic">
            Nenhum leão encontrado nesta savana...
            </div>
        )}
        </div>

        {/* Botão Flutuante (FAB) */}
        <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:bg-amber-500 hover:scale-110 transition-all active:scale-95 z-50"
        >
        +
        </button>

        <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
