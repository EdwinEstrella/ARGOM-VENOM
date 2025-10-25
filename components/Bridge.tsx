import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const networks = ['Solana', 'Ethereum', 'Base', 'Arbitrum'];
const tokens = ['USDC', 'WETH', 'WIF'];

export const Bridge: React.FC = () => {
    const { isEnglish } = useLanguage();
    const [fromNetwork, setFromNetwork] = useState('Solana');
    const [toNetwork, setToNetwork] = useState('Ethereum');
    const [token, setToken] = useState('USDC');
    const [amount, setAmount] = useState('');

    const translations = {
        en: {
            title: "Bridge Assets",
            subtitle: "Move your assets seamlessly across different chains.",
            crossChainTitle: "Cross-Chain Transfer",
            labels: {
                from: "From",
                to: "To",
                youWillReceive: "You will receive:",
                estimatedFee: "Estimated Fee:"
            },
            button: "Initiate Bridge"
        },
        es: {
            title: "Puentear Activos",
            subtitle: "Mueve tus activos sin problemas entre diferentes cadenas.",
            crossChainTitle: "Transferencia Entre Cadenas",
            labels: {
                from: "Desde",
                to: "Hacia",
                youWillReceive: "Recibirás:",
                estimatedFee: "Tarifa Estimada:"
            },
            button: "Iniciar Puenteo"
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    const handleSwapNetworks = () => {
        setFromNetwork(toNetwork);
        setToNetwork(fromNetwork);
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}</p>
            </div>

            <div className="max-w-2xl mx-auto w-full">
                <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                    <h2 className="text-white text-xl font-bold">{t.crossChainTitle}</h2>

                    {/* From Network */}
                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#121212] border border-[#3c3c53]">
                        <p className="text-sm text-[#A0A0A0]">{t.labels.from}</p>
                        <div className="flex justify-between items-center gap-4">
                            <select className="bg-transparent text-xl font-bold text-white w-full focus:outline-none appearance-none" value={fromNetwork} onChange={e => setFromNetwork(e.target.value)}>
                                {networks.map(net => <option key={net} value={net} className="bg-[#121212]">{net}</option>)}
                            </select>
                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="bg-transparent text-xl font-bold text-white w-48 text-right focus:outline-none"
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    {/* Swap Button */}
                    <div className="flex items-center justify-center my-[-1.25rem] z-10">
                        <button onClick={handleSwapNetworks} className="p-1.5 rounded-full bg-[#1A1A1D] border-4 border-[#3c3c53] hover:bg-primary/20 transition-colors">
                            <span className="material-symbols-outlined text-xl text-primary transform rotate-90">sync_alt</span>
                        </button>
                    </div>

                    {/* To Network */}
                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#121212] border border-[#3c3c53]">
                        <p className="text-sm text-[#A0A0A0]">{t.labels.to}</p>
                         <div className="flex justify-between items-center gap-4">
                            <select className="bg-transparent text-xl font-bold text-white w-full focus:outline-none appearance-none" value={toNetwork} onChange={e => setToNetwork(e.target.value)}>
                                 {networks.map(net => <option key={net} value={net} className="bg-[#121212]">{net}</option>)}
                            </select>
                            <div className="flex items-center gap-2 bg-[#292938] px-3 py-1.5 rounded-full text-white font-bold cursor-pointer">
                                <select className="bg-transparent focus:outline-none appearance-none" value={token} onChange={e => setToken(e.target.value)}>
                                     {tokens.map(t => <option key={t} value={t} className="bg-[#121212]">{t}</option>)}
                                </select>
                                <span className="material-symbols-outlined text-lg">expand_more</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-[#A0A0A0] mt-4 space-y-1">
                        <div className="flex justify-between">
                            <span>{t.labels.youWillReceive}</span>
                            <span className="text-white font-mono">{amount || '0.0'} {token}</span>
                        </div>
                         <div className="flex justify-between">
                            <span>{t.labels.estimatedFee}</span>
                            <span className="text-white font-mono">~0.005 ETH</span>
                        </div>
                    </div>

                    <button className="flex w-full mt-4 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={!amount}>
                        {t.button}
                    </button>
                </div>
            </div>

        </div>
    );
};
