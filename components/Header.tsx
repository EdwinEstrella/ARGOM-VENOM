import React from 'react';

interface HeaderProps {
    pageTitle: string;
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ pageTitle, onMenuClick }) => {
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
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">
                    Connect Wallet
                </button>
            </div>
        </header>
    );
};