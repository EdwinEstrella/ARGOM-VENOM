import React, { useState } from 'react';
import type { Currency } from '../types';

export const Withdraw: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState<Currency>('USDC');
    const [address, setAddress] = useState('');

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Withdraw Funds</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">Transfer funds from your bot wallet to an external wallet.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 flex flex-col gap-6 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6 h-fit">
                    <h2 className="text-white text-xl font-bold">Withdrawal Details</h2>
                    <div className="flex flex-col gap-4">
                        <label className="flex flex-col flex-1">
                            <div className="flex justify-between items-center pb-2">
                                <p className="text-[#EAEAEA] text-base font-medium leading-normal">Token to Withdraw</p>
                                <span className="text-sm text-[#A0A0A0]">Balance: 1,250.50 USDC</span>
                            </div>
                            <select
                                className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value as Currency)}
                            >
                                <option>USDC</option>
                                <option>SOL</option>
                                <option>ETH</option>
                            </select>
                        </label>

                        <label className="flex flex-col flex-1">
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Amount</p>
                            <div className="relative">
                                <input
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal"
                                    placeholder="0.0"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-bold">Max</button>
                            </div>
                        </label>

                        <label className="flex flex-col flex-1">
                            <p className="text-[#EAEAEA] text-base font-medium leading-normal pb-2">Recipient Address</p>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3c3c53] bg-[#121212] focus:border-primary h-12 placeholder:text-[#9d9db8] px-4 text-base font-normal leading-normal font-mono"
                                placeholder="Enter Solana or Ethereum address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                    </div>
                     <button
                        className="flex w-full mt-4 min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-12 px-4 bg-primary text-background-dark text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
                        disabled={!amount || !address}
                    >
                        Review Withdrawal
                    </button>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24 flex flex-col gap-4 rounded-xl border border-dashed border-[#292938] bg-[#1A1A1D]/50 p-6">
                        <h3 className="text-lg font-bold text-white">Important Notes</h3>
                        <ul className="list-disc list-inside text-sm text-[#A0A0A0] space-y-2">
                            <li>Double-check the recipient address. Transactions are irreversible.</li>
                            <li>Ensure the address network matches the selected token (e.g., SOL address for Solana tokens).</li>
                            <li>A network fee will be deducted from the withdrawal amount.</li>
                            <li>Withdrawals may take a few minutes to process.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
