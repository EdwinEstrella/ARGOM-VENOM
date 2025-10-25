import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PlayStoreButton } from './ui/play-store-button';
import { AppStoreButton } from './ui/app-store-button';

const FaqItem: React.FC<{ question: string; children: React.ReactNode }> = ({ question, children }) => (
    <div className="border-b border-[#3c3c53] py-6">
        <h3 className="text-lg font-bold text-white">{question}</h3>
        <div className="text-[#A0A0A0] mt-2 space-y-2">{children}</div>
    </div>
);

export const Help: React.FC = () => {
    const { isEnglish } = useLanguage();

    const translations = {
        en: {
            title: "Help & Support",
            subtitle: "Find answers to common questions and get help with the bot.",
            faqTitle: "Frequently Asked Questions",
            contactTitle: "Contact Support",
            contactText: "If you can't find the answer here, please reach out to our support team on Telegram or Discord for assistance.",
            discordButton: "Contact on Discord",
            telegramButton: "Join Telegram",
            downloadClientButton: "Download Client",
            faq1: {
                question: "How does the Auto-Buy bot work?",
                answer: "The Auto-Buy bot allows you to set up strategies to automatically purchase memecoins when certain conditions are met. You can configure the amount to invest, the target coin's contract address, and a trigger condition like a price dip, volume spike, or when new liquidity is added."
            },
            faq2: {
                question: "What is slippage tolerance?",
                answer: "Slippage is the difference between the expected price of a trade and the price at which the trade is executed. Setting a slippage tolerance (e.g., 5%) means you are willing to accept a price that is up to 5% worse than the quoted price. This is important in volatile markets to ensure your transaction goes through."
            },
            faq3: {
                question: "What is MEV Protection?",
                answer: "MEV (Maximal Extractable Value) refers to the maximum value that can be extracted from block production in excess of the standard block reward and gas fees. MEV protection helps shield your transactions from front-running bots that might try to profit from your trades, ensuring you get a better execution price."
            },
            faq4: {
                question: "How do I connect my wallet?",
                answer: "Click the \"Connect Wallet\" button in the top-right corner of the header. You will be prompted to connect with a supported wallet provider (e.g., Phantom, Solflare). Follow the instructions in your wallet to approve the connection."
            },
            faq5: {
                question: "Are there any risks involved?",
                answer: "<strong>Yes, absolutely.</strong> Trading memecoins is extremely high-risk. Prices are incredibly volatile, and many projects can result in a total loss of investment (a \"rug pull\"). This tool is for advanced users who understand the risks. Never invest more than you are willing to lose."
            },
            faq6: {
                question: "How do I download the client?",
                answer: "To download the ARGOM-VENOM client, click the download button that appears in this section. The client will give you access to all the bot's features directly from your device."
            }
        },
        es: {
            title: "Ayuda y Soporte",
            subtitle: "Encuentra respuestas a preguntas frecuentes y obtén ayuda con el bot.",
            faqTitle: "Preguntas Frecuentes",
            contactTitle: "Contactar Soporte",
            contactText: "Si no encuentras la respuesta aquí, por favor contacta a nuestro equipo de soporte en Telegram o Discord para asistencia.",
            discordButton: "Contactar en Discord",
            telegramButton: "Unirse a Telegram",
            downloadClientButton: "Descargar Cliente",
            faq1: {
                question: "¿Cómo funciona el bot Auto-Buy?",
                answer: "El bot Auto-Buy te permite configurar estrategias para comprar automáticamente memecoins cuando se cumplan ciertas condiciones. Puedes configurar el monto a invertir, la dirección del contrato del token objetivo y una condición de activación como una caída de precio, aumento de volumen o cuando se añada nueva liquidez."
            },
            faq2: {
                question: "¿Qué es la tolerancia de deslizamiento (slippage)?",
                answer: "El slippage es la diferencia entre el precio esperado de una operación y el precio al que se ejecuta realmente. Establecer una tolerancia de slippage (ej: 5%) significa que estás dispuesto a aceptar un precio hasta un 5% peor que el precio cotizado. Esto es importante en mercados volátiles para asegurar que tu transacción se complete."
            },
            faq3: {
                question: "¿Qué es la Protección MEV?",
                answer: "MEV (Valor Máximo Extraíble) se refiere al valor máximo que puede extraerse de la producción de bloques además de la recompensa estándar de bloque y las tarifas de gas. La protección MEV ayuda a proteger tus transacciones de bots de front-running que podrían intentar beneficiarse de tus operaciones, asegurando un mejor precio de ejecución."
            },
            faq4: {
                question: "¿Cómo conecto mi billetera?",
                answer: "Haz clic en el botón \"Connect Wallet\" en la esquina superior derecha del encabezado. Se te solicitará conectar con un proveedor de billetera compatible (ej: Phantom, Solflare). Sigue las instrucciones en tu billetera para aprobar la conexión."
            },
            faq5: {
                question: "¿Hay riesgos involucrados?",
                answer: "<strong>Sí, absolutamente.</strong> Trading memecoins es extremadamente riesgoso. Los precios son increíblemente volátiles y muchos proyectos pueden resultar en una pérdida total de la inversión (un \"rug pull\"). Esta herramienta es para usuarios avanzados que entienden los riesgos. Nunca inviertas más de lo que estás dispuesto a perder."
            },
            faq6: {
                question: "¿Cómo descargo el cliente?",
                answer: "Para descargar el cliente de ARGOM-VENOM, haz clic en el botón de descarga que aparece en esta sección. El cliente te dará acceso a todas las funcionalidades del bot directamente desde tu dispositivo."
            }
        }
    };

    const t = isEnglish ? translations.en : translations.es;

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">{t.title}</h1>
                <p className="text-[#A0A0A0] text-base font-normal leading-normal">{t.subtitle}</p>
            </div>

            <div className="flex flex-col gap-6 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                <h2 className="text-white text-xl font-bold">{t.faqTitle}</h2>
                <div>
                    <FaqItem question={t.faq1.question}>
                        <p dangerouslySetInnerHTML={{ __html: t.faq1.answer }}></p>
                    </FaqItem>
                    <FaqItem question={t.faq2.question}>
                        <p>{t.faq2.answer}</p>
                    </FaqItem>
                    <FaqItem question={t.faq3.question}>
                        <p>{t.faq3.answer}</p>
                    </FaqItem>
                    <FaqItem question={t.faq4.question}>
                        <p>{t.faq4.answer}</p>
                    </FaqItem>
                     <FaqItem question={t.faq5.question}>
                        <p dangerouslySetInnerHTML={{ __html: t.faq5.answer }}></p>
                    </FaqItem>
                    <FaqItem question={t.faq6.question}>
                        <p>{t.faq6.answer}</p>
                    </FaqItem>
                </div>
            </div>

             <div className="flex flex-col gap-4 rounded-xl border border-[#292938] bg-[#1A1A1D] p-6">
                 <h2 className="text-white text-xl font-bold">{t.contactTitle}</h2>
                 <p className="text-[#A0A0A0]">{t.contactText}</p>
                 <div className="flex gap-4 mt-2 flex-wrap">
                     <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary/20 text-primary text-sm font-bold hover:bg-primary/30">
                        {t.discordButton}
                    </button>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-white/10 text-white text-sm font-bold hover:bg-white/20">
                        {t.telegramButton}
                    </button>
                     <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-green-500/20 text-green-400 text-sm font-bold hover:bg-green-500/30">
                        {t.downloadClientButton}
                    </button>
                    <div className="flex items-center gap-2">
                        <PlayStoreButton
                            className="border-[#3c3c53] bg-transparent hover:bg-[#292938] hover:border-primary text-gray-300 hover:text-white"
                        />
                        <AppStoreButton
                            className="border-[#3c3c53] bg-transparent hover:bg-[#292938] hover:border-primary text-gray-300 hover:text-white"
                        />
                    </div>
                 </div>
            </div>
        </div>
    );
};
