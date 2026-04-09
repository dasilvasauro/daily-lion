import { isToday, isThisWeek, isThisMonth, parseISO } from 'date-fns';

export const filterTasksByView = (tasks, view) => {
    const now = new Date();

    switch (view) {
        case 'hoje':
            return tasks.filter(t => t.dueDate && isToday(parseISO(t.dueDate)));
        case 'semana':
            return tasks.filter(t => t.dueDate && isThisWeek(parseISO(t.dueDate)));
        case 'mes':
            return tasks.filter(t => t.dueDate && isThisMonth(parseISO(t.dueDate)));
        case 'geral':
        default:
            return tasks;
    }
};
