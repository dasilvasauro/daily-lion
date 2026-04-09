import { getDaysInMonth, getDate, addDays, startOfMonth, format } from 'date-fns';

export const calculateCheckpoints = (startDate) => {
    const dayOfMonth = getDate(startDate);
    const daysInMonth = getDaysInMonth(startDate);
    const remainingDays = daysInMonth - dayOfMonth;

    const checkpoints = [];

    // Se faltarem mais de 21 dias: 3 checkpoints
    // Se faltarem entre 11 e 20: 2 checkpoints
    // Se faltarem menos de 10: 1 checkpoint (final do mês)

    if (remainingDays > 21) {
        checkpoints.push(format(addDays(startDate, 7), 'yyyy-MM-dd'));
        checkpoints.push(format(addDays(startDate, 14), 'yyyy-MM-dd'));
        checkpoints.push(format(addDays(startDate, 21), 'yyyy-MM-dd'));
    } else if (remainingDays > 10) {
        checkpoints.push(format(addDays(startDate, 7), 'yyyy-MM-dd'));
        checkpoints.push(format(addDays(startDate, 14), 'yyyy-MM-dd'));
    } else {
        checkpoints.push(format(addDays(startDate, remainingDays), 'yyyy-MM-dd'));
    }

    return checkpoints;
};

export const GOAL_STATES = [
    { value: 0, label: 'Inativo', desc: 'Nenhuma ação foi tomada ainda.' },
{ value: 1, label: 'Planejado', desc: 'Recursos pensados e estratégia definida.' },
{ value: 2, label: 'Organizado', desc: 'Abstração transformada em tarefas tangíveis.' },
{ value: 3, label: 'Ativo', desc: 'O projeto saiu do papel e está em andamento.' },
{ value: 4, label: 'Consistente', desc: 'Algo sólido, já integrado à sua realidade.' }
];
