'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type Language = 'es' | 'en' | 'fr' | 'pt';

export interface LanguageOption {
  code: Language;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
];

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translate: (textObject: Record<string, string> | undefined) => string;
  commonTranslate: (key: string) => string;
  currentLanguageOption: LanguageOption | undefined;
}

const defaultLanguage: Language = 'es';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    const storedLang = localStorage.getItem('globalStopLanguage') as Language | null;
    if (storedLang && LANGUAGES.some(l => l.code === storedLang)) {
      setLanguageState(storedLang);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = storedLang;
      }
    } else {
      if (typeof document !== 'undefined') {
        document.documentElement.lang = defaultLanguage;
      }
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('globalStopLanguage', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, []);

  const translate = useCallback(
    (textObject: Record<string, string> | undefined): string => {
      if (!textObject) return '';
      return textObject[language] || textObject[defaultLanguage] || textObject['en'] || Object.values(textObject)[0] || '';
    },
    [language]
  );

  const commonTranslate = useCallback((key: string) => {
    return key; // Placeholder implementation
  }, []);

  const currentLanguageOption = useMemo(() => {
    return LANGUAGES.find(l => l.code === language);
  }, [language]);

  const contextValue = useMemo(() => {
    return { language, setLanguage, translate, commonTranslate, currentLanguageOption };
  }, [language, setLanguage, translate, commonTranslate, currentLanguageOption]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}