import React from 'react';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import { useHabitStore } from '../../store/useHabitStore';

export default function HabitGrid() {
    const history = useHabitStore((state) => state.history);

    // Gerar os últimos 84 dias (12 semanas) para o grid
    const days = eachDayOfInterval({
        start: subDays(new Date(), 83),
                                   end: new Date(),
    });

    const getIntensityClass = (dateStr) => {
        const dayData = history[dateStr];
        if (!dayData || dayData.total === 0) return 'bg-white/5'; // Vazio

        const percent = (dayData.done / dayData.total) * 100;

        if (percent === 0) return 'bg-white/5';
        if (percent <= 25) return 'bg-emerald-900/40';
        if (percent <= 50) return 'bg-emerald-700/60';
        if (percent <= 75) return 'bg-emerald-500/80';
        return 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]'; // 100% completo (Brilho)
    };

    return (
        <div className="flex flex-col gap-2 p-4 bg-black/20 rounded-2xl border border-white/5 overflow-x-auto">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Consistência</h3>
        <div className="flex flex-wrap gap-1 w-[320px] md:w-full">
        {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            return (
                <div
                key={dateStr}
                title={`${dateStr}`}
                className={`w-3 h-3 rounded-[2px] transition-colors duration-500 ${getIntensityClass(dateStr)}`}
                />
            );
        })}
        </div>
        </div>
    );
}
