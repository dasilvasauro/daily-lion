import React from 'react';
import { useUserStore } from '../../store/useUserStore';

export default function GlassCard({ children, className = '', onClick }) {
    // Lemos a preferência do usuário direto do Zustand
    const glassEnabled = useUserStore((state) => state.profile.glassEnabled);

    // Estilos base que sempre serão aplicados
    const baseStyle = "rounded-2xl border transition-all duration-300 overflow-hidden";

    // Estilo "Liquid Glass" (Pesado em performance, visual premium)
    const glassStyle = "bg-slate-800/40 border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]";

    // Estilo Sólido (Leve em performance, design flat maduro)
    const solidStyle = "bg-slate-800 border-slate-700 shadow-md";

    return (
        <div
        onClick={onClick}
        className={`${baseStyle} ${glassEnabled ? glassStyle : solidStyle} ${className}`}
        >
        {children}
        </div>
    );
}
