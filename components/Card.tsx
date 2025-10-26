import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`flex flex-col gap-6 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6 ${className}`}>
            <div>
                <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">{title}</h2>
            </div>
            <div className="border-t border-[#292938]"></div>
            <div className="flex flex-col gap-4">
                {children}
            </div>
        </div>
    );
};