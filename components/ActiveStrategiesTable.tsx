import React from 'react';
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
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Active Strategies</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#292938]">
                    <thead className="bg-[#121212]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Target Coin</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Condition</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Amount</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#292938]">
                        {strategies.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-sm text-[#A0A0A0]">
                                    You have no active strategies.
                                </td>
                            </tr>
                        ) : (
                            strategies.map((strategy) => (
                                <tr key={strategy.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[strategy.status]}`}>
                                            {strategy.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">{strategy.targetCoin}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">{strategy.condition}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-medium">{strategy.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {strategy.status === StrategyStatus.Active && (
                                            <button onClick={() => onCancel(strategy.id)} className="text-red-400 hover:text-red-500">Cancel</button>
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