import React from 'react';
import type { NewPair } from '../types';

const mockNewPairs: NewPair[] = [
    { id: 1, pair: 'CATZ/SOL', age: '3m 15s', liquidity: 15_234 },
    { id: 2, pair: 'PIKA/SOL', age: '5m 45s', liquidity: 22_500 },
    { id: 3, pair: 'ZORP/ETH', age: '10m 02s', liquidity: 55_100 },
    { id: 4, pair: 'FLOKI/ETH', age: '12m 30s', liquidity: 120_780 },
    { id: 5, pair: 'PEW/SOL', age: '18m 5s', liquidity: 8_900 },
];

export const NewPairs: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">LP Sniper / New Pairs</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">Discover newly created liquidity pools to get in early.</p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#292938]">
                        <thead className="bg-[#121212]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Pair</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Age</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">Liquidity</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
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
                                        <button className="text-primary hover:text-primary/80 font-bold">Snipe</button>
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
