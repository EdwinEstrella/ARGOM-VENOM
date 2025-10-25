import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import type { SettingsType, GasSpeed } from '../types';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-[#3c3c53] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
);

const SettingsSection: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="flex flex-col gap-6 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
        <div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{title}</h2>
            <p className="text-[#A0A0A0] text-sm font-normal leading-normal mt-1">{description}</p>
        </div>
        <div className="border-t border-[#292938]"></div>
        <div className="flex flex-col gap-4">
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="flex items-center justify-between">
        <p className="text-[#EAEAEA] text-base font-medium">{label}</p>
        <div>{children}</div>
    </div>
);

export const Settings: React.FC = () => {
    const { isEnglish } = useLanguage();
    const [settings, setSettings] = useState<SettingsType>({
        gasSpeed: 'fast',
        customGasFee: 100,
        mevProtectBuys: true,
        mevProtectSells: false,
        autoBuy: true,
        autoSell: false,
        confirmTrades: true,
        defaultBuySlippage: 1.0,
        defaultSellSlippage: 1.5,
    });

    const translations = {
        en: {
            title: "Settings",
            subtitle: "Manage your account, preferences, and security settings.",
            transactionSpeed: {
                title: "Transaction Speed (Gas)",
                description: "Control priority and fees for your transactions.",
                customGasFee: "Custom Gas Fee (Gwei)"
            },
            mevProtection: {
                title: "MEV Protection",
                description: "Protect your trades from front-running bots.",
                buys: "MEV Protect (Buys)",
                sells: "MEV Protect (Sells)"
            },
            autoActions: {
                title: "Auto Actions",
                description: "Configure default automated behaviors.",
                autoBuy: "Auto Buy",
                autoSell: "Auto Sell",
                manualConfirmation: "Require Manual Confirmation"
            },
            wallet: {
                title: "Wallet",
                description: "Manage your connected wallet.",
                status: "Status",
                address: "Address",
                connected: "Connected"
            },
            buttons: {
                disconnect: "Disconnect",
                saveChanges: "Save Changes"
            }
        },
        es: {
            title: "Configuración",
            subtitle: "Gestiona tu cuenta, preferencias y configuraciones de seguridad.",
            transactionSpeed: {
                title: "Velocidad de Transacción (Gas)",
                description: "Controla la prioridad y tarifas de tus transacciones.",
                customGasFee: "Tarifa de Gas Personalizada (Gwei)"
            },
            mevProtection: {
                title: "Protección MEV",
                description: "Protege tus operaciones de bots de front-running.",
                buys: "Protección MEV (Compras)",
                sells: "Protección MEV (Ventas)"
            },
            autoActions: {
                title: "Acciones Automáticas",
                description: "Configura comportamientos automatizados predeterminados.",
                autoBuy: "Compra Automática",
                autoSell: "Venta Automática",
                manualConfirmation: "Requerir Confirmación Manual"
            },
            wallet: {
                title: "Billetera",
                description: "Gestiona tu billetera conectada.",
                status: "Estado",
                address: "Dirección",
                connected: "Conectada"
            },
            buttons: {
                disconnect: "Desconectar",
                saveChanges: "Guardar Cambios"
            }
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    const handleSettingChange = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
        setSettings(prev => ({...prev, [key]: value}));
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 flex flex-col gap-8">

                    <SettingsSection title={t.transactionSpeed.title} description={t.transactionSpeed.description}>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {(['fast', 'turbo', 'custom'] as GasSpeed[]).map(speed => (
                                <label key={speed} className="flex items-center gap-3 rounded-lg border border-[#3c3c53] bg-[#121212] p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                                    <input
                                        type="radio"
                                        name="gas-speed"
                                        className="form-radio bg-[#3c3c53] border-[#3c3c53] text-primary focus:ring-primary focus:ring-offset-background-dark"
                                        checked={settings.gasSpeed === speed}
                                        onChange={() => handleSettingChange('gasSpeed', speed)}
                                    />
                                    <span className="font-medium text-sm capitalize">{speed}</span>
                                </label>
                            ))}
                        </div>
                        {settings.gasSpeed === 'custom' && (
                            <SettingsRow label={t.transactionSpeed.customGasFee}>
                                <input
                                    type="number"
                                    className="form-input w-full max-w-[120px] min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-10 placeholder:text-[#9d9db8] px-3 text-base font-normal leading-normal text-right"
                                    value={settings.customGasFee}
                                    onChange={(e) => handleSettingChange('customGasFee', parseInt(e.target.value))}
                                />
                            </SettingsRow>
                        )}
                    </SettingsSection>

                    <SettingsSection title={t.mevProtection.title} description={t.mevProtection.description}>
                        <SettingsRow label={t.mevProtection.buys}>
                            <ToggleSwitch checked={settings.mevProtectBuys} onChange={(val) => handleSettingChange('mevProtectBuys', val)} />
                        </SettingsRow>
                        <SettingsRow label={t.mevProtection.sells}>
                            <ToggleSwitch checked={settings.mevProtectSells} onChange={(val) => handleSettingChange('mevProtectSells', val)} />
                        </SettingsRow>
                    </SettingsSection>

                     <SettingsSection title={t.autoActions.title} description={t.autoActions.description}>
                        <SettingsRow label={t.autoActions.autoBuy}>
                           <ToggleSwitch checked={settings.autoBuy} onChange={(val) => handleSettingChange('autoBuy', val)} />
                        </SettingsRow>
                         <SettingsRow label={t.autoActions.autoSell}>
                           <ToggleSwitch checked={settings.autoSell} onChange={(val) => handleSettingChange('autoSell', val)} />
                        </SettingsRow>
                        <SettingsRow label={t.autoActions.manualConfirmation}>
                           <ToggleSwitch checked={settings.confirmTrades} onChange={(val) => handleSettingChange('confirmTrades', val)} />
                        </SettingsRow>
                    </SettingsSection>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="sticky top-24 flex flex-col gap-8">
                       <SettingsSection title={t.wallet.title} description={t.wallet.description}>
                            <SettingsRow label={t.wallet.status}>
                                <span className="text-green-400 font-medium text-sm">{t.wallet.connected}</span>
                            </SettingsRow>
                            <SettingsRow label={t.wallet.address}>
                                <span className="font-mono text-sm text-white">0xAbc...fed</span>
                            </SettingsRow>
                            <button className="flex w-full mt-2 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-red-500/20 text-red-400 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-500/30">
                                {t.buttons.disconnect}
                            </button>
                        </SettingsSection>

                        <div className="flex flex-col gap-4">
                             <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">
                                {t.buttons.saveChanges}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};