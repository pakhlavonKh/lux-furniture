import { useState, useEffect } from "react";
import { LanguageContext } from "./LanguageContextType";
import enTranslations from "@/locales/en.json";
import ruTranslations from "@/locales/ru.json";
import uzTranslations from "@/locales/uz.json";

export type Language = "en" | "ru" | "uz";

type TranslationsType = typeof enTranslations;

const translations: Record<Language, TranslationsType> = {
  en: enTranslations,
  ru: ruTranslations,
  uz: uzTranslations,
};

export function getTranslations(language: Language): TranslationsType {
  return translations[language] || translations.en;
}

export function getNestedTranslation(
  translations: TranslationsType,
  key: string,
  defaultValue: string = key
): string {
  const keys = key.split(".");
  let value: any = translations;

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k];
    } else {
      return defaultValue;
    }
  }

  return typeof value === "string" ? value : defaultValue;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or default to "en"
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("language") as Language | null;
      return saved || "en";
    }
    return "en";
  });

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const t = (key: string): string => {
    const translations = getTranslations(language);
    return getNestedTranslation(translations, key, key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
