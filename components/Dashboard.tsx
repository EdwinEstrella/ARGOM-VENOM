import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Asset, Activity, Page, OrderType } from '../types';

const mockAssets: Asset[] = [
    { icon: 'SOL', name: 'Solana', ticker: 'SOL', balance: 25.4, price: 175.25, value: 4451.35, change24h: 2.5 },
    { icon: 'ETH', name: 'Ethereum', ticker: 'ETH', balance: 2.1, price: 3850.11, value: 8085.23, change24h: -1.2 },
    { icon: 'USDC', name: 'USD Coin', ticker: 'USDC', balance: 1250.50, price: 1.00, value: 1250.50, change24h: 0.0 },
    { icon: 'WIF', name: 'dogwifhat', ticker: 'WIF', balance: 1250, price: 3.15, value: 3937.50, change24h: 10.53 },
    { icon: 'BONK', name: 'Bonk', ticker: 'BONK', balance: 50_000_000, price: 0.000023, value: 1150.00, change24h: -8.00 },
];

const mockActivities: Activity[] = [
    { id: 1, type: 'Buy', tokenTicker: 'WIF', tokenName: 'dogwifhat', amount: '+500 WIF', value: '$1,575.00', time: '2m ago' },
    { id: 2, type: 'Sell', tokenTicker: 'BONK', tokenName: 'Bonk', amount: '-10M BONK', value: '$230.00', time: '1h ago' },
    { id: 3, type: 'Buy', tokenTicker: 'PEPE', tokenName: 'Pepe', amount: '+100M PEPE', value: '$1,100.00', time: '5h ago' },
    { id: 4, type: 'Sell', tokenTicker: 'MOG', tokenName: 'Mog Coin', amount: '-250M MOG', value: '$225.00', time: '1d ago' },
];

const StatCard: React.FC<{ title: string; value: string; change?: string; changeType?: 'positive' | 'negative' }> = ({ title, value, change, changeType }) => (
    <div className="flex flex-col gap-1 rounded-xl border border-[#292938] bg-[#1A1A1D] p-4">
        <p className="text-sm text-[#A0A0A0]">{title}</p>
        <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-white">{value}</p>
            {change && <p className={`text-sm font-bold ${changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>{change}</p>}
        </div>
    </div>
);

interface DashboardProps {
    setPage: (page: Page) => void;
    openSwapModal: (type: OrderType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setPage, openSwapModal }) => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            stats: {
                portfolioValue: "Portfolio Value",
                pnl24h: "24h P&L",
                totalPnl: "Total P&L",
                walletBalance: "Wallet Balance"
            },
            sections: {
                quickActions: "Quick Actions",
                yourAssets: "Your Assets",
                recentActivity: "Recent Activity"
            },
            actions: {
                newAutoBuy: "New Auto-Buy",
                createStrategy: "Create a new strategy",
                swapTokens: "Swap Tokens",
                manualTrade: "Execute a manual trade"
            },
            table: {
                asset: "Asset",
                price: "Price",
                balance: "Balance",
                value: "Value"
            }
        },
        es: {
            stats: {
                portfolioValue: "Valor del Portfolio",
                pnl24h: "P&L 24h",
                totalPnl: "P&L Total",
                walletBalance: "Balance de Billetera"
            },
            sections: {
                quickActions: "Acciones Rápidas",
                yourAssets: "Tus Activos",
                recentActivity: "Actividad Reciente"
            },
            actions: {
                newAutoBuy: "Nuevo Auto-Compra",
                createStrategy: "Crear una nueva estrategia",
                swapTokens: "Intercambiar Tokens",
                manualTrade: "Ejecutar una operación manual"
            },
            table: {
                asset: "Activo",
                price: "Precio",
                balance: "Balance",
                value: "Valor"
            }
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    return (
        <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard title={t.stats.portfolioValue} value="$18,874.58" change="+3.2%" changeType="positive" />
                <StatCard title={t.stats.pnl24h} value="$589.12" change="+3.2%" changeType="positive" />
                <StatCard title={t.stats.totalPnl} value="$2,130.90" change="+12.7%" changeType="positive" />
                 <StatCard title={t.stats.walletBalance} value="25.4 SOL" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                <div className="lg:col-span-3 flex flex-col gap-4">
                     <div className="rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                        <h2 className="text-white text-xl font-bold mb-4">{t.sections.quickActions}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={() => setPage('auto-buy')} className="flex items-center gap-3 rounded-lg bg-[#292938] p-4 text-left hover:bg-[#3c3c53] transition-colors">
                                <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
                                <div>
                                    <p className="font-bold text-white">{t.actions.newAutoBuy}</p>
                                    <p className="text-sm text-[#A0A0A0]">{t.actions.createStrategy}</p>
                                </div>
                            </button>
                             <button onClick={() => openSwapModal('Buy')} className="flex items-center gap-3 rounded-lg bg-[#292938] p-4 text-left hover:bg-[#3c3c53] transition-colors">
                                <span className="material-symbols-outlined text-primary text-2xl">swap_horiz</span>
                                <div>
                                    <p className="font-bold text-white">{t.actions.swapTokens}</p>
                                    <p className="text-sm text-[#A0A0A0]">{t.actions.manualTrade}</p>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                        <h2 className="text-white text-xl font-bold mb-4">{t.sections.yourAssets}</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[#292938]">
                                <thead className="bg-[#121212]">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.table.asset}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.table.price}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.table.balance}</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.table.value}</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#1A1A1D] divide-y divide-[#292938]">
                                    {mockAssets.map(asset => (
                                        <tr key={asset.ticker}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-primary/20 text-primary font-bold size-10 rounded-full flex items-center justify-center flex-shrink-0">{asset.icon[0]}</div>
                                                    <div>
                                                        <p className="font-bold text-white">{asset.name}</p>
                                                        <p className="text-sm text-[#A0A0A0]">{asset.ticker}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-white">
                                                <div>${asset.price.toLocaleString()}</div>
                                                <div className={`text-sm ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>{asset.change24h.toFixed(2)}%</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-white">{asset.balance.toLocaleString()} {asset.ticker}</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-white">${asset.value.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                        <h2 className="text-white text-xl font-bold mb-4">{t.sections.recentActivity}</h2>
                        <div className="flex flex-col gap-4">
                            {mockActivities.map(activity => (
                                <div key={activity.id} className="flex items-center gap-4">
                                    <div className={`size-10 rounded-full flex items-center justify-center ${activity.type === 'Buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        <span className="material-symbols-outlined">{activity.type === 'Buy' ? 'south_west' : 'north_east'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-white">{activity.type} {activity.tokenTicker}</p>
                                        <p className="text-sm text-[#A0A0A0]">{activity.time}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-right">{activity.amount}</p>
                                        <p className="text-sm text-[#A0A0A0] text-right">{activity.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};