"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode, createElement } from "react";
import type { Language, Translations } from "./types";
import { bgTranslations } from "./bg";
import { enTranslations } from "./en";

const translationMap: Record<Language, Translations> = {
  bg: bgTranslations,
  en: enTranslations,
};

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Create a default context value
const defaultContextValue: TranslationContextType = {
  language: "bg",
  setLanguage: () => {},
  t: (key: string) => key,
};

const TranslationContext = createContext<TranslationContextType>(defaultContextValue);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let value: unknown = obj;

  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      console.warn(`Translation key not found: ${path}`);
      return path;
    }
  }

  return typeof value === "string" ? value : path;
}

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider = ({ children }: TranslationProviderProps): React.ReactElement | null => {
  const [language, setLanguageState] = useState<Language>("bg");
  const [isHydrated, setIsHydrated] = useState(false);
  const initializedRef = useRef(false);

  // Initialize from localStorage on client mount
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const savedLanguage = localStorage.getItem("buildtrustbg-language") as Language | null;
      if (savedLanguage && (savedLanguage === "bg" || savedLanguage === "en")) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLanguageState(savedLanguage);
      }
      setIsHydrated(true);
    }
  }, []);

  // Update document language when language changes
  useEffect(() => {
    if (isHydrated) {
      document.documentElement.lang = language;
    }
  }, [language, isHydrated]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("buildtrustbg-language", newLanguage);
  };

  const t = (key: string): string => {
    const translations = translationMap[language];
    return getNestedValue(translations as unknown as Record<string, unknown>, key);
  };

  if (!isHydrated) {
    return null;
  }

  const value: TranslationContextType = { language, setLanguage, t };

  return createElement(
    TranslationContext.Provider,
    { value },
    children
  );
}

export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
}
