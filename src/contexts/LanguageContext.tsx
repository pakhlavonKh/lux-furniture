import { useState } from "react";
import { LanguageContext } from "./LanguageContextType";
import { getNestedTranslation, getTranslations, type Language } from "@/locales";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

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
