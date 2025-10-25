import React, { useState } from 'react';
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

    const handleSettingChange = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
        setSettings(prev => ({...prev, [key]: value}));
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Settings</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">Manage your account, preferences, and security settings.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    
                    <SettingsSection title="Transaction Speed (Gas)" description="Control priority and fees for your transactions.">
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
                            <SettingsRow label="Custom Gas Fee (Gwei)">
                                <input
                                    type="number"
                                    className="form-input w-full max-w-[120px] min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-10 placeholder:text-[#9d9db8] px-3 text-base font-normal leading-normal text-right"
                                    value={settings.customGasFee}
                                    onChange={(e) => handleSettingChange('customGasFee', parseInt(e.target.value))}
                                />
                            </SettingsRow>
                        )}
                    </SettingsSection>

                    <SettingsSection title="MEV Protection" description="Protect your trades from front-running bots.">
                        <SettingsRow label="MEV Protect (Buys)">
                            <ToggleSwitch checked={settings.mevProtectBuys} onChange={(val) => handleSettingChange('mevProtectBuys', val)} />
                        </SettingsRow>
                        <SettingsRow label="MEV Protect (Sells)">
                            <ToggleSwitch checked={settings.mevProtectSells} onChange={(val) => handleSettingChange('mevProtectSells', val)} />
                        </SettingsRow>
                    </SettingsSection>

                     <SettingsSection title="Auto Actions" description="Configure default automated behaviors.">
                        <SettingsRow label="Auto Buy">
                           <ToggleSwitch checked={settings.autoBuy} onChange={(val) => handleSettingChange('autoBuy', val)} />
                        </SettingsRow>
                         <SettingsRow label="Auto Sell">
                           <ToggleSwitch checked={settings.autoSell} onChange={(val) => handleSettingChange('autoSell', val)} />
                        </SettingsRow>
                        <SettingsRow label="Require Manual Confirmation">
                           <ToggleSwitch checked={settings.confirmTrades} onChange={(val) => handleSettingChange('confirmTrades', val)} />
                        </SettingsRow>
                    </SettingsSection>
                </div>
                
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <div className="sticky top-24 flex flex-col gap-8">
                       <SettingsSection title="Wallet" description="Manage your connected wallet.">
                            <SettingsRow label="Status">
                                <span className="text-green-400 font-medium text-sm">Connected</span>
                            </SettingsRow>
                            <SettingsRow label="Address">
                                <span className="font-mono text-sm text-white">0xAbc...fed</span>
                            </SettingsRow>
                            <button className="flex w-full mt-2 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-red-500/20 text-red-400 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-red-500/30">
                                Disconnect
                            </button>
                        </SettingsSection>

                        <div className="flex flex-col gap-4">
                             <button className="flex w-full min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};