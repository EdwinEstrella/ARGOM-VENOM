import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LanguageContextType {
    isEnglish: boolean;
    setIsEnglish: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [isEnglish, setIsEnglish] = useState(true);

    useEffect(() => {
        // Detectar el idioma del dispositivo
        const userLanguage = navigator.language || navigator.languages?.[0];
        const isEnglishDevice = userLanguage?.startsWith('en');
        setIsEnglish(isEnglishDevice);
    }, []);

    return (
        <LanguageContext.Provider value={{ isEnglish, setIsEnglish }}>
            {children}
        </LanguageContext.Provider>
    );
};