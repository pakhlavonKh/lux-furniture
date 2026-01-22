import enTranslations from "./en.json";
import ruTranslations from "./ru.json";
import uzTranslations from "./uz.json";

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

export { translations };
