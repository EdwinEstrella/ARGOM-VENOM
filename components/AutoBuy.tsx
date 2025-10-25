import React, { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ConfigurationPanel } from './ConfigurationPanel';
import { SummaryPanel } from './SummaryPanel';
import { ActiveStrategiesTable } from './ActiveStrategiesTable';
import type { Strategy, Currency, TriggerType } from '../types';

interface AutoBuyProps {
  strategies: Strategy[];
  onCancelStrategy: (id: number) => void;
}

export const AutoBuy: React.FC<AutoBuyProps> = ({ strategies, onCancelStrategy }) => {
  const { isEnglish } = useLanguage();
  const [amount, setAmount] = useState<string>('1.5');
  const [currency, setCurrency] = useState<Currency>('SOL');
  const [contractAddress, setContractAddress] = useState<string>('0xAbc...fed');
  const [trigger, setTrigger] = useState<TriggerType>('priceDip');
  const [triggerValue, setTriggerValue] = useState<string>('10');
  const [slippage, setSlippage] = useState<number>(5);
  const [gasFee, setGasFee] = useState<number>(100);
  const [isActive, setIsActive] = useState<boolean>(false);

  const translations = {
    en: {
      title: "Auto-Buy Memecoins",
      subtitle: "Set up and manage your automated memecoin purchasing strategies. ",
      warning: "Please be aware of the high risks involved."
    },
    es: {
      title: "Auto-Compra de Memecoins",
      subtitle: "Configura y gestiona tus estrategias automatizadas de compra de memecoins. ",
      warning: "Por favor, ten en cuenta los altos riesgos involucrados."
    }
  };

  const t = isEnglish ? translations.en : translations.es;

  const handleActivate = useCallback(() => {
    setIsActive(prev => !prev);
    // In a real app, you would submit the strategy to a backend here.
    // For this demo, we just toggle the state.
  }, []);

  const configProps = {
    amount, setAmount,
    currency, setCurrency,
    contractAddress, setContractAddress,
    trigger, setTrigger,
    triggerValue, setTriggerValue,
    slippage, setSlippage,
    gasFee, setGasFee,
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
        <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}<span className="text-red-500/80">{t.warning}</span></p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ConfigurationPanel {...configProps} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-1">
          <SummaryPanel
            amount={amount}
            currency={currency}
            contractAddress={contractAddress}
            trigger={trigger}
            triggerValue={triggerValue}
            slippage={slippage}
            isActive={isActive}
            onActivate={handleActivate}
          />
        </div>
      </div>
      <div className="mt-8">
        <ActiveStrategiesTable strategies={strategies} onCancel={onCancelStrategy} />
      </div>
    </div>
  );
};