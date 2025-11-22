import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
    pageTitle: string;
    onMenuClick: () => void;
    onLogout?: () => void;
    currentUser?: string;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick, onLogout, currentUser }) => {
    const { isEnglish, setIsEnglish } = useLanguage();

    return (
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#292938] px-4 md:px-8">
            <div className="flex items-center gap-4">
                 <button onClick={onMenuClick} className="lg:hidden text-white">
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h1 className="text-xl font-bold text-white capitalize hidden sm:block">{pageTitle.replace('-', ' ')}</h1>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="form-input w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-10 placeholder:text-[#9d9db8] px-4 pl-10 text-base font-normal leading-normal"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">ES</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={isEnglish}
                            onChange={(e) => setIsEnglish(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#3c3c53] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-sm text-gray-400">EN</span>
                </div>
                {currentUser && (
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-[#2A2A2E] px-3 py-2 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-white text-sm font-medium">{currentUser}</span>
                        </div>
                        {onLogout && (
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 cursor-pointer overflow-hidden rounded-lg h-10 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                                title="Cerrar sesión"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        )}
                    </div>
                )}
                {!currentUser && (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">
                        Connect Wallet
                    </button>
                )}
            </div>
        </header>
    );
};