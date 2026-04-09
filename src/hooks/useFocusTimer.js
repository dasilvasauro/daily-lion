import { useState, useEffect } from 'react';
import { db } from '../services/db';

export const useFocusTimer = (task) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!task || task.type !== 'time') return;

        const calculateTime = () => {
            if (task.timerStartedAt) {
                const now = Date.now();
                const start = new Date(task.timerStartedAt).getTime();
                const elapsed = Math.floor((now - start) / 1000);
                const remaining = (task.durationMinutes * 60) - elapsed;

                if (remaining <= 0) {
                    setTimeLeft(0);
                    setIsActive(false);
                    // Lógica de finalizar automaticamente pode entrar aqui
                } else {
                    setTimeLeft(remaining);
                    setIsActive(true);
                }
            } else {
                setTimeLeft(task.durationMinutes * 60);
            }
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [task]);

    return { timeLeft, isActive };
};
