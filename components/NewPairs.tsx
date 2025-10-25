import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { NewPair } from '../types';

const mockNewPairs: NewPair[] = [
    { id: 1, pair: 'CATZ/SOL', age: '3m 15s', liquidity: 15_234 },
    { id: 2, pair: 'PIKA/SOL', age: '5m 45s', liquidity: 22_500 },
    { id: 3, pair: 'ZORP/ETH', age: '10m 02s', liquidity: 55_100 },
    { id: 4, pair: 'FLOKI/ETH', age: '12m 30s', liquidity: 120_780 },
    { id: 5, pair: 'PEW/SOL', age: '18m 5s', liquidity: 8_900 },
];

export const NewPairs: React.FC = () => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            title: "LP Sniper / New Pairs",
            subtitle: "Discover newly created liquidity pools to get in early.",
            headers: {
                pair: "Pair",
                age: "Age",
                liquidity: "Liquidity",
                actions: "Actions"
            },
            snipeButton: "Snipe"
        },
        es: {
            title: "LP Sniper / Nuevos Pares",
            subtitle: "Descubre pools de liquidez recién creados para entrar temprano.",
            headers: {
                pair: "Par",
                age: "Antigüedad",
                liquidity: "Liquidez",
                actions: "Acciones"
            },
            snipeButton: "Snipear"
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#292938]">
                        <thead className="bg-[#121212]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.pair}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.age}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.liquidity}</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">{t.headers.actions}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#292938]">
                            {mockNewPairs.map((pair) => (
                                <tr key={pair.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{pair.pair}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">{pair.age}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">${pair.liquidity.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-primary hover:text-primary/80 font-bold">{t.snipeButton}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
