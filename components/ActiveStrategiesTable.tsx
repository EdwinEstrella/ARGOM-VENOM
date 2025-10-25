import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { StrategyStatus, type Strategy } from '../types';

interface ActiveStrategiesTableProps {
    strategies: Strategy[];
    onCancel: (id: number) => void;
}

const statusColors: Record<StrategyStatus, string> = {
    [StrategyStatus.Active]: 'text-green-400 bg-green-500/20',
    [StrategyStatus.Executing]: 'text-blue-400 bg-blue-500/20',
    [StrategyStatus.Completed]: 'text-gray-400 bg-gray-500/20',
};

export const ActiveStrategiesTable: React.FC<ActiveStrategiesTableProps> = ({ strategies, onCancel }) => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            title: "Active Strategies",
            headers: {
                status: "Status",
                targetCoin: "Target Coin",
                condition: "Condition",
                amount: "Amount",
                actions: "Actions"
            },
            emptyState: "You have no active strategies.",
            cancelButton: "Cancel"
        },
        es: {
            title: "Estrategias Activas",
            headers: {
                status: "Estado",
                targetCoin: "Token Objetivo",
                condition: "Condición",
                amount: "Monto",
                actions: "Acciones"
            },
            emptyState: "No tienes estrategias activas.",
            cancelButton: "Cancelar"
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    const getStatusText = (status: StrategyStatus) => {
        if (isEnglish) {
            return status.charAt(0).toUpperCase() + status.slice(1);
        }

        const statusTranslations: Record<StrategyStatus, string> = {
            [StrategyStatus.Active]: "Activo",
            [StrategyStatus.Executing]: "Ejecutando",
            [StrategyStatus.Completed]: "Completado"
        };

        return statusTranslations[status] || status;
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{t.title}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#292938]">
                    <thead className="bg-[#121212]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.status}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.targetCoin}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.condition}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.amount}</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">{t.headers.actions}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292938]">
                        {strategies.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#A0A0A0]">
                                    {t.emptyState}
                                </td>
                            </tr>
                        ) : (
                            strategies.map((strategy) => (
                                <tr key={strategy.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[strategy.status]}`}>
                                            {getStatusText(strategy.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">{strategy.targetCoin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">{strategy.condition}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{strategy.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {strategy.status === StrategyStatus.Active && (
                                            <button onClick={() => onCancel(strategy.id)} className="text-red-400 hover:text-red-500">{t.cancelButton}</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};