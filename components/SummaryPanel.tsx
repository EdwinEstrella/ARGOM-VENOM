import React from 'react';
import type { Currency, TriggerType } from '../types';

interface SummaryPanelProps {
    amount: string;
    currency: Currency;
    contractAddress: string;
    trigger: TriggerType;
    triggerValue: string;
    slippage: number;
    isActive: boolean;
    onActivate: () => void;
}

const StatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    if (isActive) {
        return (
            <div className="flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                <div className="size-2 rounded-full bg-green-400 animate-pulse"></div>
                Active
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
            <div className="size-2 rounded-full bg-red-400"></div>
            Inactive
        </div>
    );
};

export const SummaryPanel: React.FC<SummaryPanelProps> = ({
    amount, currency, contractAddress, trigger, triggerValue, slippage, isActive, onActivate
}) => {
    
    const truncateAddress = (address: string) => {
        if (!address || address.length < 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };

    const getTriggerText = () => {
        switch(trigger) {
            case 'priceDip': return `${triggerValue || '0'}% Price Dip`;
            case 'volumeSpike': return `${triggerValue || '0'}% Volume Spike`;
            case 'newLiquidity': return 'New Liquidity';
            default: return 'N/A';
        }
    }

    return (
        <div className="sticky top-8 flex flex-col gap-6">
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Strategy Summary</h2>
                    <StatusBadge isActive={isActive} />
                </div>
                <div className="flex flex-col gap-3 text-sm text-[#A0A0A0]">
                    <div className="flex justify-between border-b border-dashed border-[#3c3c53] py-2">
                        <span>Amount:</span>
                        <span className="font-bold text-white">{amount || '0'} {currency}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#3c3c53] py-2">
                        <span>Target:</span>
                        <span className="font-bold text-white truncate max-w-[150px]">{truncateAddress(contractAddress)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#3c3c53] py-2">
                        <span>Trigger:</span>
                        <span className="font-bold text-white">{getTriggerText()}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span>Slippage:</span>
                        <span className="font-bold text-white">{slippage}%</span>
                    </div>
                </div>
            </div>
            <button
                onClick={onActivate}
                className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all"
            >
                <span className="material-symbols-outlined text-xl">bolt</span>
                <span className="truncate">{isActive ? 'Deactivate Bot' : 'Activate Auto-Buy Bot'}</span>
            </button>
        </div>
    );
};
