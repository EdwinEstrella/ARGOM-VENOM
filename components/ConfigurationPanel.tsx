import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
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

export const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    amount, setAmount, currency, setCurrency, contractAddress, setContractAddress,
    trigger, setTrigger, triggerValue, setTriggerValue, slippage, setSlippage,
    gasFee, setGasFee
}) => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            sections: {
                investment: "Investment Details",
                trigger: "Purchase Trigger",
                transaction: "Transaction Settings"
            },
            labels: {
                amountToInvest: "Amount to Invest",
                paymentCurrency: "Payment Currency",
                targetContract: "Target Memecoin Contract Address",
                slippageTolerance: "Slippage Tolerance",
                maxGasFee: "Max Gas Fee (Gwei)",
                priceDipPercent: "Price Dip Percentage (%)",
                volumeSpikePercent: "Volume Spike Percentage (%)"
            },
            placeholders: {
                amount: "e.g., 1.5",
                contract: "Paste contract address here",
                priceDip: "e.g., 10 for a 10% dip",
                volumeSpike: "e.g., 200 for 200% spike"
            },
            triggers: {
                priceDip: "Price Dip",
                volumeSpike: "Volume Spike",
                newLiquidity: "New Liquidity"
            },
            newLiquidityNote: "Bot will buy as soon as liquidity is added. No extra parameter needed."
        },
        es: {
            sections: {
                investment: "Detalles de Inversión",
                trigger: "Disparador de Compra",
                transaction: "Configuración de Transacción"
            },
            labels: {
                amountToInvest: "Monto a Invertir",
                paymentCurrency: "Moneda de Pago",
                targetContract: "Dirección de Contrato del Memecoin Objetivo",
                slippageTolerance: "Tolerancia de Slippage",
                maxGasFee: "Tarifa Máxima de Gas (Gwei)",
                priceDipPercent: "Porcentaje de Caída de Precio (%)",
                volumeSpikePercent: "Porcentaje de Aumento de Volumen (%)"
            },
            placeholders: {
                amount: "ej: 1.5",
                contract: "Pega la dirección del contrato aquí",
                priceDip: "ej: 10 para una caída del 10%",
                volumeSpike: "ej: 200 para un aumento del 200%"
            },
            triggers: {
                priceDip: "Caída de Precio",
                volumeSpike: "Aumento de Volumen",
                newLiquidity: "Nueva Liquidez"
            },
            newLiquidityNote: "El bot comprará tan pronto se añada liquidez. No se necesita parámetro adicional."
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    const triggerOptions: { id: TriggerType, label: string }[] = [
        { id: 'priceDip', label: t.triggers.priceDip },
        { id: 'volumeSpike', label: t.triggers.volumeSpike },
        { id: 'newLiquidity', label: t.triggers.newLiquidity }
    ];

    const renderTriggerInput = () => {
        switch (trigger) {
            case 'priceDip':
                return (
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">{t.labels.priceDipPercent}</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder={t.placeholders.priceDip}
                            type="number"
                            value={triggerValue}
                            onChange={(e) => setTriggerValue(e.target.value)}
                        />
                    </label>
                );
            case 'volumeSpike':
                 return (
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">{t.labels.volumeSpikePercent}</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder={t.placeholders.volumeSpike}
                            type="number"
                            value={triggerValue}
                            onChange={(e) => setTriggerValue(e.target.value)}
                        />
                    </label>
                );
            case 'newLiquidity':
                return <div className="text-sm text-[#A0A0A0]">{t.newLiquidityNote}</div>;
            default:
                return null;
        }
    };

    return (
        <>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{t.sections.investment}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">{t.labels.amountToInvest}</p>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                            placeholder={t.placeholders.amount}
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">{t.labels.paymentCurrency}</p>
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
                    <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">{t.labels.targetContract}</p>
                    <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                        placeholder={t.placeholders.contract}
                        value={contractAddress}
                        onChange={(e) => setContractAddress(e.target.value)}
                    />
                </label>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{t.sections.trigger}</h2>
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
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{t.sections.transaction}</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <label className="flex flex-col flex-1">
                        <div className="flex items-center justify-between pb-2">
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal">{t.labels.slippageTolerance}</p>
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
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal">{t.labels.maxGasFee}</p>
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
