import { useState, memo } from "react";
import type { LocalizedString } from "@/lib/api";

const LANGS = ["en", "ru", "uz"] as const;

const LANG_LABELS: Record<string, string> = {
  en: "EN",
  ru: "RU",
  uz: "UZ",
};

interface MultiLangInputProps {
  value: LocalizedString;
  onChange: (value: LocalizedString) => void;
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

export const MultiLangInput = memo(function MultiLangInput({
  value,
  onChange,
  label,
  required,
  multiline,
  rows = 3,
  placeholder,
}: MultiLangInputProps) {
  const [activeLang, setActiveLang] =
    useState<(typeof LANGS)[number]>("en");

  const handleChange = (text: string) => {
    onChange({ ...value, [activeLang]: text });
  };

  const isMissing = (lang: (typeof LANGS)[number]) =>
    required && !value[lang]?.trim();

  return (
    <div className="ml-input">
      <div className="ml-header">
        <label className="ml-label">
          {label} {required && "*"}
        </label>

        <div className="ml-tabs">
          {LANGS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`ml-tab 
                ${activeLang === lang ? "active" : ""} 
                ${isMissing(lang) ? "missing" : ""}`}
            >
              {LANG_LABELS[lang]}
              {isMissing(lang) && " !"}
            </button>
          ))}
        </div>
      </div>

      {multiline ? (
        <textarea
          value={value[activeLang] || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="ml-field"
          rows={rows}
          placeholder={
            placeholder
              ? `${placeholder} (${LANG_LABELS[activeLang]})`
              : `Enter in ${LANG_LABELS[activeLang]}`
          }
        />
      ) : (
        <input
          type="text"
          value={value[activeLang] || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="ml-field"
          placeholder={
            placeholder
              ? `${placeholder} (${LANG_LABELS[activeLang]})`
              : `Enter in ${LANG_LABELS[activeLang]}`
          }
        />
      )}

      <div className="ml-status">
        {LANGS.map((lang) => (
          <span
            key={lang}
            className={`ml-status-item ${
              value[lang]?.trim()
                ? "ml-status-ok"
                : "ml-status-empty"
            }`}
          >
            {LANG_LABELS[lang]}:{" "}
            {value[lang]?.trim() ? "✓" : "—"}
          </span>
        ))}
      </div>
    </div>
  );
});