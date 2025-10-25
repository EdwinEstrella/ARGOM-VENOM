import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { OrderType } from '../../types';

interface SwapModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: OrderType;
}

export const SwapModal: React.FC<SwapModalProps> = ({ isOpen, onClose, type }) => {
    const { isEnglish } = useLanguage();
    const [fromAmount, setFromAmount] = useState('1.0');
    const [toAmount, setToAmount] = useState('350.87');

    if (!isOpen) return null;

    const fromToken = type === 'Buy' ? 'SOL' : 'WIF';
    const toToken = type === 'Buy' ? 'WIF' : 'SOL';

    const translations = {
        en: {
            title: `${type} Token`,
            youPay: "You pay",
            youReceive: "You receive",
            balance: "Balance:",
            confirmButton: `Confirm ${type}`
        },
        es: {
            title: type === 'Buy' ? 'Comprar Token' : 'Vender Token',
            youPay: "Pagas",
            youReceive: "Recibes",
            balance: "Balance:",
            confirmButton: type === 'Buy' ? 'Confirmar Compra' : 'Confirmar Venta'
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="relative flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] w-full max-w-md m-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                     <h2 className="text-white text-xl font-bold">{t.title}</h2>
                     <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                     </button>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#121212] border border-[#3c3c53]">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#A0A0A0]">{t.youPay}</span>
                        <span className="text-sm text-[#A0A0A0]">{t.balance} 25.4 SOL</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <input
                            type="number"
                            value={fromAmount}
                            onChange={e => setFromAmount(e.target.value)}
                            className="bg-transparent text-3xl font-bold text-white w-full focus:outline-none"
                        />
                        <div className="flex items-center gap-2 bg-[#292938] px-3 py-1.5 rounded-full text-white font-bold cursor-pointer">
                            {fromToken} <span className="material-symbols-outlined text-lg">expand_more</span>
                        </div>
                    </div>
                </div>

                 <div className="flex items-center justify-center my-[-1.25rem] z-10">
                    <div className="p-1.5 rounded-full bg-[#1A1A1D] border-4 border-[#3c3c53]">
                        <span className="material-symbols-outlined text-xl text-primary">arrow_downward</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2 p-4 rounded-lg bg-[#121212] border border-[#3c3c53]">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#A0A0A0]">{t.youReceive}</span>
                        <span className="text-sm text-[#A0A0A0]">{t.balance} 0 WIF</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                        <input
                            type="number"
                            value={toAmount}
                            readOnly
                            className="bg-transparent text-3xl font-bold text-white w-full focus:outline-none"
                        />
                         <div className="flex items-center gap-2 bg-[#292938] px-3 py-1.5 rounded-full text-white font-bold cursor-pointer">
                            {toToken} <span className="material-symbols-outlined text-lg">expand_more</span>
                        </div>
                    </div>
                </div>

                <button className={`flex w-full mt-4 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 text-background-dark text-base font-bold tracking-[0.015em] transition-all ${type === 'Buy' ? 'bg-green-400 hover:bg-green-500' : 'bg-red-400 hover:bg-red-500'}`}>
                    {t.confirmButton}
                </button>
            </div>
        </div>
    );
};