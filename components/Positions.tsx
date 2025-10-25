import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Position } from '../types';

const mockPositions: Position[] = [
    { id: 1, pair: 'WIF/SOL', size: '1,250 WIF', entryPrice: 2.85, currentPrice: 3.15, pnl: 375, pnlPercent: 10.53 },
    { id: 2, pair: 'BONK/SOL', size: '50M BONK', entryPrice: 0.000025, currentPrice: 0.000023, pnl: -100, pnlPercent: -8.00 },
    { id: 3, pair: 'PEPE/ETH', size: '200M PEPE', entryPrice: 0.000007, currentPrice: 0.000011, pnl: 800, pnlPercent: 57.14 },
    { id: 4, pair: 'MOG/ETH', size: '1B MOG', entryPrice: 0.0000005, currentPrice: 0.0000009, pnl: 400, pnlPercent: 80.00 },
];

export const Positions: React.FC = () => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            tableHeaders: {
                pair: "Pair",
                size: "Size",
                entryPrice: "Entry Price",
                currentPrice: "Current Price",
                pnl: "P&L",
                pnlPercent: "P&L (%)",
                actions: "Actions"
            },
            closeButton: "Close"
        },
        es: {
            tableHeaders: {
                pair: "Par",
                size: "Tamaño",
                entryPrice: "Precio Entrada",
                currentPrice: "Precio Actual",
                pnl: "P&L",
                pnlPercent: "P&L (%)",
                actions: "Acciones"
            },
            closeButton: "Cerrar"
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    const PnlIndicator: React.FC<{ value: number }> = ({ value }) => (
        <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
            {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </span>
    );

    const PnlValueIndicator: React.FC<{ value: number }> = ({ value }) => (
        <span className={value >= 0 ? 'text-green-400' : 'text-red-400'}>
            {value >= 0 ? '+' : ''}${value.toFixed(2)}
        </span>
    );

    return (
        <div className="flex flex-col gap-8">

            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#292938]">
                        <thead className="bg-[#121212]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.tableHeaders.pair}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.tableHeaders.size}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.tableHeaders.entryPrice}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.tableHeaders.currentPrice}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.tableHeaders.pnl}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.tableHeaders.pnlPercent}</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">{t.tableHeaders.actions}</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#292938]">
                            {mockPositions.map((position) => (
                                <tr key={position.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{position.pair}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">{position.size}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA] font-mono">${position.entryPrice.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono font-bold">${position.currentPrice.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold"><PnlValueIndicator value={position.pnl} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold"><PnlIndicator value={position.pnlPercent} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-primary hover:text-primary/80">{t.closeButton}</button>
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
