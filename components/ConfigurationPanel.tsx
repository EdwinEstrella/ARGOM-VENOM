import React from 'react';
import type { Currency, TriggerType } from '../types';

interface ConfigurationPanelProps {
    amount: string;
    setAmount: (value: string) => void;
    currency: Currency;
    setCurrency: (value: Currency) => void;
    contractAddress: string;
    setContractAddress: (value: string) => void;
    trigger: TriggerType;
    setTrigger: (value: TriggerType) => void;
    triggerValue: string;
    setTriggerValue: (value: string) => void;
    slippage: number;
    setSlippage: (value: number) => void;
    gasFee: number;
    setGasFee: (value: number) => void;
}

const triggerOptions: { id: TriggerType, label: string }[] = [
    { id: 'priceDip', label: 'Price Dip' },
    { id: 'volumeSpike', label: 'Volume Spike' },
    { id: 'newLiquidity', label: 'New Liquidity' }
];

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    amount, setAmount, currency, setCurrency, contractAddress, setContractAddress,
    trigger, setTrigger, triggerValue, setTriggerValue, slippage, setSlippage,
    gasFee, setGasFee
}) => {
    
    const renderTriggerInput = () => {
        switch (trigger) {
            case 'priceDip':
                return (
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Price Dip Percentage (%)</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="e.g., 10 for a 10% dip"
                            type="number"
                            value={triggerValue}
                            onChange={(e) => setTriggerValue(e.target.value)}
                        />
                    </label>
                );
            case 'volumeSpike':
                 return (
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Volume Spike Percentage (%)</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="e.g., 200 for 200% spike"
                            type="number"
                            value={triggerValue}
                            onChange={(e) => setTriggerValue(e.target.value)}
                        />
                    </label>
                );
            case 'newLiquidity':
                return <div className="text-sm text-[#A0A0A0]">Bot will buy as soon as liquidity is added. No extra parameter needed.</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Investment Details</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Amount to Invest</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder="e.g., 1.5"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Payment Currency</p>
                        <select
                            className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value as Currency)}
                        >
                            <option>SOL</option>
                            <option>ETH</option>
                            <option>USDC</option>
                        </select>
                    </label>
                </div>
                <label className="flex flex-col flex-1">
                    <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Target Memecoin Contract Address</p>
                    <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                        placeholder="Paste contract address here"
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                    />
                </label>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Purchase Trigger</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {triggerOptions.map(option => (
                        <label key={option.id} className="flex items-center gap-3 rounded-lg border border-[#3c3c53] bg-[#121212] p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                            <input
                                type="radio"
                                name="trigger"
                                className="form-radio bg-[#3c3c53] border-[#3c3c53] text-primary focus:ring-primary focus:ring-offset-background-dark"
                                checked={trigger === option.id}
                                onChange={() => { setTrigger(option.id); setTriggerValue('')} }
                            />
                            <span className="font-medium text-sm">{option.label}</span>
                        </label>
                    ))}
                </div>
                {renderTriggerInput()}
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">Transaction Settings</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <label className="flex flex-col flex-1">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal">Slippage Tolerance</p>
                            <span className="text-primary font-bold">{slippage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="50"
                            step="0.1"
                            value={slippage}
                            onChange={(e) => setSlippage(parseFloat(e.target.value))}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal">Max Gas Fee (Gwei)</p>
                            <span className="text-primary font-bold">{gasFee}</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="500"
                            step="1"
                            value={gasFee}
                            onChange={(e) => setGasFee(parseInt(e.target.value))}
                        />
                    </label>
                </div>
            </div>
        </>
    );
};
