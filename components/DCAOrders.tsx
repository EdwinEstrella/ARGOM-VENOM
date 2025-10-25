// Fix: Added DCAOrders component as a placeholder page.
import React from 'react';

export const DCAOrders: React.FC = () => {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">DCA Orders</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">Set up automated, periodic purchases of your favorite tokens. (Coming Soon)</p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-[#292938] bg-[#1A1A1D]/50 p-12 items-center justify-center">
                <h2 className="text-white text-xl font-bold">Feature Under Construction</h2>
                <p className="text-[#A0A0A0] max-w-md text-center">The ability to create and manage Dollar Cost Averaging (DCA) orders is coming soon. This will allow you to automatically invest a fixed amount into a token at regular intervals.</p>
            </div>
        </div>
    );
};
