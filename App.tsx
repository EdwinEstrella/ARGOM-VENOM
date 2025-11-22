import React, { useState, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login.tsx';
import { AutoBuy } from './components/AutoBuy';
import { Positions } from './components/Positions';
import { LimitOrders } from './components/LimitOrders';
import { DCAOrders } from './components/DCAOrders';
import { NewPairs } from './components/NewPairs';
import { Bridge } from './components/Bridge';
import { Withdraw } from './components/Withdraw';
import { TelegramScraper } from './components/TelegramScraper';
import { Settings } from './components/Settings';
import { Help } from './components/Help';
import { SwapModal } from './components/modals/SwapModal';
import type { Page, OrderType, Strategy } from './types';
import { StrategyStatus } from './types';

// Mock data for active strategies
const mockStrategies: Strategy[] = [
    { id: 1, status: StrategyStatus.Active, targetCoin: '0x123...abc', condition: 'Price Dip > 15%', amount: '1.0 SOL' },
    { id: 2, status: StrategyStatus.Executing, targetCoin: '0x456...def', condition: 'New Liquidity', amount: '0.5 SOL' },
    { id: 3, status: StrategyStatus.Completed, targetCoin: '0x789...ghi', condition: 'Volume Spike > 300%', amount: '250 USDC' },
];

const PlaceholderPage: React.FC<{title: string, description: string}> = ({title, description}) => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            constructionTitle: "Feature Under Construction",
            constructionText: "This page is currently under development. Please check back later."
        },
        es: {
            constructionTitle: "Función en Construcción",
            constructionText: "Esta página está actualmente en desarrollo. Por favor, vuelve más tarde."
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{description}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-[#292938] bg-[#1A1A1D]/50 p-12 items-center justify-center">
                <h2 className="text-white text-xl font-bold">{t.constructionTitle}</h2>
                <p className="text-[#A0A0A0] max-w-md text-center">{t.constructionText}</p>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [page, setPage] = useState<Page>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [swapModalType, setSwapModalType] = useState<OrderType>('Buy');
    const [strategies, setStrategies] = useState<Strategy[]>(mockStrategies);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<string>('');
    const [telegramConfig, setTelegramConfig] = useState({
        apiId: '34391980',
        apiHash: 'b827ab78baa27abb6ecfc09d08a499bf',
        phone: '+5492664553929',
        groups: ['CryptoEnfermosChat'],
        keywords: ['dexscreener.com', 'pump.fun', 'x.com', 'twitter.com', 'solana', 'token'],
        isActive: false
    });

    const handleCancelStrategy = (id: number) => {
        setStrategies(prev => prev.filter(s => s.id !== id));
    };
    
    const openSwapModal = useCallback((type: OrderType = 'Buy') => {
        setSwapModalType(type);
        setIsSwapModalOpen(true);
        setIsSidebarOpen(false); // Close sidebar when opening modal
    }, []);

    const closeSwapModal = useCallback(() => {
        setIsSwapModalOpen(false);
    }, []);

    const handleLogin = (authenticated: boolean, user: string) => {
        setIsAuthenticated(authenticated);
        setCurrentUser(user);
        if (authenticated) {
            setPage('dashboard');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentUser('');
        // Limpiar sesión del localStorage
        localStorage.removeItem('argomVenomSession');
        setPage('dashboard');
    };

    const handleTelegramConfigChange = (config: any) => {
        setTelegramConfig(config);
    };

    const PageRenderer: React.FC = () => {
    const { isEnglish } = useLanguage();

    const translations = {
        copyTrade: {
            title: isEnglish ? "Copy Trade" : "Copy Trading",
            description: isEnglish ? "Automatically copy the trades of profitable wallets." : "Copia automáticamente las operaciones de billeteras rentables."
        }
    };

    switch (page) {
        case 'dashboard':
            return <Dashboard setPage={setPage} openSwapModal={openSwapModal} />;
        case 'positions':
            return <Positions />;
        case 'limit-orders':
            return <LimitOrders />;
        case 'dca-orders':
             return <DCAOrders />;
        case 'copy-trade':
            return <PlaceholderPage title={translations.copyTrade.title} description={translations.copyTrade.description} />;
        case 'lp-sniper':
            return <NewPairs />;
        case 'auto-buy':
            return <AutoBuy strategies={strategies} onCancelStrategy={handleCancelStrategy} />;
        case 'bridge':
            return <Bridge />;
        case 'withdraw':
            return <Withdraw />;
        case 'telegram-scraper':
            return <TelegramScraper config={telegramConfig} onConfigChange={handleTelegramConfigChange} />;
        case 'settings':
            return <Settings />;
        case 'help':
            return <Help />;
        default:
            // A good fallback for any unhandled page type
            return <Dashboard setPage={setPage} openSwapModal={openSwapModal} />;
    }
};

const renderPage = () => <PageRenderer />;

    const handleSetPage = (newPage: Page) => {
        setPage(newPage);
        setIsSidebarOpen(false); // Close sidebar on navigation
    }

    // Si no está autenticado, mostrar pantalla de login
    if (!isAuthenticated) {
        return (
            <LanguageProvider>
                <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        <Login
                            onLogin={handleLogin}
                            isAuthenticated={isAuthenticated}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
            </LanguageProvider>
        );
    }

    // Si está autenticado, mostrar la aplicación completa
    return (
        <LanguageProvider>
            <div className="flex h-screen bg-[#0D0D0F] text-white overflow-hidden">
                <Sidebar
                    currentPage={page}
                    setPage={handleSetPage}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    openSwapModal={openSwapModal}
                />
                <div className="flex flex-1 flex-col overflow-y-auto">
                    <Header pageTitle={page} onMenuClick={() => setIsSidebarOpen(true)} onLogout={handleLogout} currentUser={currentUser} />
                    <main className="flex-1 p-4 md:p-8">
                        {renderPage()}
                    </main>
                </div>
                {isSwapModalOpen && (
                    <SwapModal
                        isOpen={isSwapModalOpen}
                        onClose={closeSwapModal}
                        type={swapModalType}
                    />
                )}
            </div>
        </LanguageProvider>
    );
};

export default App;
