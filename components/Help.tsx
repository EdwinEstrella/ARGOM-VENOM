import React from 'react';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <div className="border-b border-[#3c3c53] py-6">
        <h3 className="text-lg font-bold text-white">{question}</h3>
        <div className="text-[#A0A0A0] mt-2 space-y-2">{children}</div>
    </div>
);

export const Help: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Help & Support</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">Find answers to common questions and get help with the bot.</p>
            </div>

            <div className="flex flex-col gap-6 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold">Frequently Asked Questions</h2>
                <div>
                    <FaqItem question="How does the Auto-Buy bot work?">
                        <p>The Auto-Buy bot allows you to set up strategies to automatically purchase memecoins when certain conditions are met. You can configure the amount to invest, the target coin's contract address, and a trigger condition like a price dip, volume spike, or when new liquidity is added.</p>
                    </FaqItem>
                    <FaqItem question="What is slippage tolerance?">
                        <p>Slippage is the difference between the expected price of a trade and the price at which the trade is executed. Setting a slippage tolerance (e.g., 5%) means you are willing to accept a price that is up to 5% worse than the quoted price. This is important in volatile markets to ensure your transaction goes through.</p>
                    </FaqItem>
                    <FaqItem question="What is MEV Protection?">
                        <p>MEV (Maximal Extractable Value) refers to the maximum value that can be extracted from block production in excess of the standard block reward and gas fees. MEV protection helps shield your transactions from front-running bots that might try to profit from your trades, ensuring you get a better execution price.</p>
                    </FaqItem>
                    <FaqItem question="How do I connect my wallet?">
                        <p>Click the "Connect Wallet" button in the top-right corner of the header. You will be prompted to connect with a supported wallet provider (e.g., Phantom, Solflare). Follow the instructions in your wallet to approve the connection.</p>
                    </FaqItem>
                     <FaqItem question="Are there any risks involved?">
                        <p><strong>Yes, absolutely.</strong> Trading memecoins is extremely high-risk. Prices are incredibly volatile, and many projects can result in a total loss of investment (a "rug pull"). This tool is for advanced users who understand the risks. Never invest more than you are willing to lose.</p>
                    </FaqItem>
                </div>
            </div>

             <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                 <h2 className="text-white text-xl font-bold">Contact Support</h2>
                 <p className="text-[#A0A0A0]">If you can't find the answer here, please reach out to our support team on Telegram or Discord for assistance.</p>
                 <div className="flex gap-4 mt-2">
                     <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30">
                        Contact on Discord
                    </button>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold hover:bg-white/20">
                        Join Telegram
                    </button>
                 </div>
            </div>
        </div>
    );
};
