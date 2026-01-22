import React, { createContext } from "react";

interface LanguageContextType {
  language: "en" | "ru" | "uz";
  setLanguage: (lang: "en" | "ru" | "uz") => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
