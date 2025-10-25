// Fix: Added DCAOrders component as a placeholder page.
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const DCAOrders: React.FC = () => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            title: "DCA Orders",
            subtitle: "Set up automated, periodic purchases of your favorite tokens. (Coming Soon)",
            constructionTitle: "Feature Under Construction",
            constructionText: "The ability to create and manage Dollar Cost Averaging (DCA) orders is coming soon. This will allow you to automatically invest a fixed amount into a token at regular intervals."
        },
        es: {
            title: "Órdenes DCA",
            subtitle: "Configura compras periódicas y automatizadas de tus tokens favoritos. (Próximamente)",
            constructionTitle: "Función en Construcción",
            constructionText: "La capacidad de crear y gestionar órdenes de Dollar Cost Averaging (DCA) llegará pronto. Esto te permitirá invertir automáticamente una cantidad fija en un token a intervalos regulares."
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}</p>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-[#292938] bg-[#1A1A1D]/50 p-12 items-center justify-center">
                <h2 className="text-white text-xl font-bold">{t.constructionTitle}</h2>
                <p className="text-[#A0A0A0] max-w-md text-center">{t.constructionText}</p>
            </div>
        </div>
    );
};
