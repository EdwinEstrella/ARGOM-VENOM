import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { Page, OrderType } from '../types';
import { LogoIcon } from './icons/LogoIcon';

interface NavItemProps {
    icon: string;
    label: string;
    pageName: Page;
    currentPage: Page;
    setPage: (page: Page) => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, pageName, currentPage, setPage }) => {
    const isActive = currentPage === pageName;
    return (
        <button
            onClick={() => setPage(pageName)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive ? 'bg-primary text-background-dark' : 'text-[#A0A0A0] hover:bg-[#292938] hover:text-white'
            }`}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="text-sm font-bold">{label}</span>
        </button>
    );
};


interface SidebarProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    isOpen: boolean;
    onClose: () => void;
    openSwapModal: (type: OrderType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isOpen, onClose, openSwapModal }) => {
    const { isEnglish } = useLanguage();

    const navLabels = isEnglish ? {
        dashboard: 'Dashboard',
        positions: 'Positions',
        'limit-orders': 'Limit Orders',
        'dca-orders': 'DCA Orders',
        'copy-trade': 'Copy Trade',
        'lp-sniper': 'LP Sniper',
        'auto-buy': 'Auto-Buy Bot',
        bridge: 'Bridge',
        withdraw: 'Withdraw',
        settings: 'Settings',
        help: 'Help'
    } : {
        dashboard: 'Panel',
        positions: 'Posiciones',
        'limit-orders': 'Órdenes Límite',
        'dca-orders': 'Órdenes DCA',
        'copy-trade': 'Copy Trading',
        'lp-sniper': 'LP Sniper',
        'auto-buy': 'Bot Auto-Compra',
        bridge: 'Bridge',
        withdraw: 'Retirar',
        settings: 'Configuración',
        help: 'Ayuda'
    };

    const navItems = [
        { icon: 'dashboard', label: navLabels.dashboard, page: 'dashboard' },
        { icon: 'database', label: navLabels.positions, page: 'positions' },
        { icon: 'rule', label: navLabels['limit-orders'], page: 'limit-orders' },
        { icon: 'avg_pace', label: navLabels['dca-orders'], page: 'dca-orders' },
        { icon: 'person_add', label: navLabels['copy-trade'], page: 'copy-trade' },
    ];

    const tradeItems = [
        { icon: 'bolt', label: navLabels['lp-sniper'], page: 'lp-sniper' },
        { icon: 'smart_toy', label: navLabels['auto-buy'], page: 'auto-buy' },
        { icon: 'swap_horiz', label: navLabels.bridge, page: 'bridge' },
        { icon: 'account_balance_wallet', label: navLabels.withdraw, page: 'withdraw' },
    ];

    return (
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[#292938] bg-[#121212] p-4 transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-3 px-3 text-primary">
                    <LogoIcon />
                    <span className="text-lg font-black tracking-tighter text-white">ARGOM<span className="text-primary">VENOM</span></span>
                </div>
                <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>
            
             <div className="flex items-center gap-2 mt-2">
                <button onClick={() => openSwapModal('Buy')} className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 bg-green-500/20 text-green-400 hover:bg-green-500/30 font-bold text-sm">
                    <span className="material-symbols-outlined">add_shopping_cart</span> Buy
                </button>
                 <button onClick={() => openSwapModal('Sell')} className="flex-1 flex items-center justify-center gap-2 rounded-lg h-10 bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold text-sm">
                    <span className="material-symbols-outlined">sell</span> Sell
                </button>
            </div>

            <nav className="flex flex-1 flex-col gap-4 py-4 overflow-y-auto">
                <div className="flex flex-col gap-1">
                     <p className="px-3 text-xs font-semibold uppercase text-gray-500">Main</p>
                    {navItems.map(item => (
                        <NavItem key={item.page} icon={item.icon} label={item.label} pageName={item.page as Page} currentPage={currentPage} setPage={setPage} />
                    ))}
                </div>
                <div className="flex flex-col gap-1">
                     <p className="px-3 text-xs font-semibold uppercase text-gray-500">Trading</p>
                    {tradeItems.map(item => (
                        <NavItem key={item.page} icon={item.icon} label={item.label} pageName={item.page as Page} currentPage={currentPage} setPage={setPage} />
                    ))}
                </div>
            </nav>
            <div className="mt-auto flex flex-col gap-1">
                 <NavItem icon="settings" label={navLabels.settings} pageName="settings" currentPage={currentPage} setPage={setPage} />
                 <NavItem icon="help" label={navLabels.help} pageName="help" currentPage={currentPage} setPage={setPage} />
            </div>
        </aside>
    );
};