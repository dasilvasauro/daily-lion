import React, { useState } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import { useUserStore } from '../../store/useUserStore';

// Definição dos Itens
const VOUCHER_ITEMS = [
    { id: 'freeze', name: 'Congelamento', cost: 3, icon: '🧊', desc: 'Congela a streak individual de um hábito. O dia não é avançado e você não perde a ofensiva.' },
{ id: 'day_off', name: 'Dia de Folga', cost: 7, icon: '🏖️', desc: 'Não precisa completar nenhum hábito hoje sem afetar a sua Streak Geral.' },
{ id: 'instant_luck', name: 'Sorte Instantânea', cost: 5, icon: '🃏', desc: 'Compre para abrir uma Carta de Sorte instantaneamente.' }
];

const GOLD_ITEMS = [
    { id: 'magic_dice', name: 'Dado Mágico', cost: 500, icon: '🎲', desc: 'Rola um D6 para aplicar um multiplicador na recompensa de uma tarefa escolhida.' },
{ id: 'xp_boost', name: 'Boost de XP', cost: 400, icon: '✨', desc: 'Aumenta o XP ganho entre 15% e 50% por 24 horas.' },
{ id: 'gold_boost', name: 'Boost de Ouro', cost: 200, icon: '💰', desc: 'Aumenta a quantidade de moedas ganhas entre 25% e 45% por 24 horas.' },
{ id: 'p0_extra', name: 'P0 Extra', cost: 300, icon: '🔥', desc: 'Permite criar uma tarefa P0 (Crítica) além do limite de 4 hoje. Acumulativo.' },
{ id: 'p1_extra', name: 'P1 Extra', cost: 200, icon: '⚡', desc: 'Permite criar uma tarefa P1 (Urgente) além do limite de 6 hoje. Acumulativo.' },
{ id: 'respiro', name: 'Respiro', cost: 100, icon: '😮‍💨', desc: 'Aumenta o prazo em 3 horas. (Inativo após as 21:00 para não virar o dia).' },
{ id: 'alivio', name: 'Alívio', cost: 200, icon: '🕊️', desc: 'Adiciona 1 dia completo ao prazo final de uma tarefa com data limite.' }
];

export default function StoreView() {
    const { rpg, buyItem } = useUserStore();
    const [error, setError] = useState(null);

    const handlePurchase = (item, currencyType) => {
        try {
            setError(null);

            // Aqui mapeamos as ações de acordo com o ID do item comprado
            buyItem(currencyType, item.cost, (currentBoosts) => {
                let updatedBoosts = { ...currentBoosts };

                switch (item.id) {
                    case 'p0_extra':
                        updatedBoosts.extraP0 += 1;
                        break;
                    case 'p1_extra':
                        updatedBoosts.extraP1 += 1;
                        break;
                    case 'xp_boost':
                        updatedBoosts.xpBoostExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
                        break;
                        // ... outras lógicas de itens podem ser expandidas aqui
                    default:
                        console.log(`Item comprado: ${item.name}`);
                }
                return updatedBoosts;
            });

            alert(`Compra de ${item.name} realizada com sucesso!`);
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(null), 3000);
        }
    };

    const ItemCard = ({ item, currency, type }) => {
        const canAfford = type === 'gold' ? rpg.gold >= item.cost : rpg.vouchers >= item.cost;

        return (
            <GlassCard className="flex flex-col p-4 h-full relative group">
            <div className="flex justify-between items-start mb-2">
            <span className="text-4xl drop-shadow-lg group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className={`font-black flex items-center gap-1 ${canAfford ? (type === 'gold' ? 'text-amber-400' : 'text-emerald-400') : 'text-slate-500'}`}>
            {item.cost} {currency}
            </span>
            </div>
            <h3 className="font-bold text-lg text-slate-100">{item.name}</h3>
            <p className="text-xs text-slate-400 mt-1 flex-1 leading-relaxed">{item.desc}</p>

            <button
            disabled={!canAfford}
            onClick={() => handlePurchase(item, type === 'gold' ? 'gold' : 'vouchers')}
            className={`w-full mt-4 py-2 rounded-lg font-bold text-sm transition-all ${
                canAfford
                ? (type === 'gold' ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white')
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
            }`}
            >
            {canAfford ? 'Adquirir' : 'Saldo Insuficiente'}
            </button>
            </GlassCard>
        );
    };

    return (
        <div className="max-w-6xl mx-auto w-full space-y-8 animate-fade-in">
        {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-center font-medium animate-pulse">
            {error}
            </div>
        )}

        {/* Lojinha do Ouro */}
        <section>
        <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-black flex items-center gap-2">
        <span className="text-amber-500">💰</span> Lojinha do Ouro
        </h2>
        <span className="bg-black/30 px-4 py-1 rounded-full text-amber-400 font-mono font-bold border border-amber-500/20">
        Seu Saldo: {rpg.gold}
        </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GOLD_ITEMS.map(item => <ItemCard key={item.id} item={item} currency="🪙" type="gold" />)}
        </div>
        </section>

        {/* Divisor Visual */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

        {/* Barraca dos Vouchers */}
        <section>
        <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-2xl font-black flex items-center gap-2">
        <span className="text-emerald-500">🎟️</span> Barraca dos Vouchers
        </h2>
        <span className="bg-black/30 px-4 py-1 rounded-full text-emerald-400 font-mono font-bold border border-emerald-500/20">
        Seus Vouchers: {rpg.vouchers}
        </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {VOUCHER_ITEMS.map(item => <ItemCard key={item.id} item={item} currency="🎟️" type="vouchers" />)}
        </div>
        </section>
        </div>
    );
}
