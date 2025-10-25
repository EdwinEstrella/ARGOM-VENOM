import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { LimitOrder, OrderStatus, OrderType } from '../types';

const mockOrders: LimitOrder[] = [
  { id: 1, pair: 'WIF/SOL', type: 'Buy', price: 2.50, amount: '500 WIF', status: 'Active' },
  { id: 2, pair: 'BONK/SOL', type: 'Sell', price: 0.000030, amount: '20M BONK', status: 'Active' },
  { id: 3, pair: 'PEPE/ETH', type: 'Buy', price: 0.000006, amount: '100M PEPE', status: 'Filled' },
  { id: 4, pair: 'MOG/ETH', type: 'Sell', price: 0.000001, amount: '500M MOG', status: 'Filled' },
  { id: 5, pair: 'WIF/SOL', type: 'Buy', price: 2.00, amount: '1000 WIF', status: 'Cancelled' },
];

const statusColors: Record<OrderStatus, string> = {
    Active: 'text-blue-400 bg-blue-500/20',
    Filled: 'text-green-400 bg-green-500/20',
    Cancelled: 'text-gray-400 bg-gray-500/20',
};

const typeColors: Record<OrderType, string> = {
    Buy: 'text-green-400',
    Sell: 'text-red-400',
};

export const LimitOrders: React.FC = () => {
    const { isEnglish } = useLanguage();
    const [activeTab, setActiveTab] = useState<OrderStatus>('Active');

    const translations = {
        en: {
            title: "Limit Orders",
            subtitle: "Manage your pending, filled, and cancelled limit orders.",
            tabs: {
                active: "Active",
                filled: "Filled",
                cancelled: "Cancelled"
            },
            headers: {
                pair: "Pair",
                type: "Type",
                price: "Price",
                amount: "Amount",
                status: "Status",
                actions: "Actions"
            },
            cancelButton: "Cancel"
        },
        es: {
            title: "Órdenes Límite",
            subtitle: "Gestiona tus órdenes límite pendientes, ejecutadas y canceladas.",
            tabs: {
                active: "Activas",
                filled: "Ejecutadas",
                cancelled: "Canceladas"
            },
            headers: {
                pair: "Par",
                type: "Tipo",
                price: "Precio",
                amount: "Cantidad",
                status: "Estado",
                actions: "Acciones"
            },
            cancelButton: "Cancelar"
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    const filteredOrders = mockOrders.filter(order => order.status === activeTab);

    const getStatusText = (status: OrderStatus) => {
        if (isEnglish) return status;
        const statusMap: Record<OrderStatus, string> = {
            Active: "Activa",
            Filled: "Ejecutada",
            Cancelled: "Cancelada"
        };
        return statusMap[status] || status;
    };

    const getTabText = (tab: OrderStatus) => {
        if (isEnglish) return tab;
        const tabMap: Record<OrderStatus, string> = {
            Active: "Activa",
            Filled: "Ejecutada",
            Cancelled: "Cancelada"
        };
        return tabMap[tab] || tab;
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}</p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <div className="border-b border-[#292938]">
                    <nav className="-mb-px flex gap-6" aria-label="Tabs">
                        {(['Active', 'Filled', 'Cancelled'] as OrderStatus[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                    activeTab === tab
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-[#A0A0A0] hover:text-white hover:border-gray-500'
                                }`}
                            >
                                {getTabText(tab)}
                            </button>
                        ))}
                    </nav>
                </div>

                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#292938]">
                        <thead className="bg-[#121212]">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.pair}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.type}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.price}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.amount}</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">{t.headers.status}</th>
                                {activeTab === 'Active' && <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t.headers.actions}</span></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#292938]">
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-bold">{order.pair}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${typeColors[order.type]}`}>{order.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA] font-mono">${order.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">{order.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </td>
                                    {activeTab === 'Active' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-red-400 hover:text-red-500">{t.cancelButton}</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
