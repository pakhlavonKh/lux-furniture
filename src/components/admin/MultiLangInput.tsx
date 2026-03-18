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
  const [activeLang, setActiveLang] = useState<(typeof LANGS)[number]>("en");

  const inputCls =
    "w-full px-4 py-2 border border-border bg-transparent text-sm rounded focus:border-foreground focus:outline-none transition-colors";

  const handleChange = (text: string) => {
    onChange({ ...value, [activeLang]: text });
  };

  const isMissing = (lang: (typeof LANGS)[number]) =>
    required && !value[lang]?.trim();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-caption font-medium">
          {label} {required && "*"}
        </label>
        <div className="flex border border-border rounded overflow-hidden">
          {LANGS.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLang(lang)}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                activeLang === lang
                  ? "bg-foreground text-background"
                  : isMissing(lang)
                  ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  : "hover:bg-secondary"
              }`}
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
          className={inputCls}
          rows={rows}
          placeholder={placeholder ? `${placeholder} (${LANG_LABELS[activeLang]})` : `Enter in ${LANG_LABELS[activeLang]}`}
        />
      ) : (
        <input
          type="text"
          value={value[activeLang] || ""}
          onChange={(e) => handleChange(e.target.value)}
          className={inputCls}
          placeholder={placeholder ? `${placeholder} (${LANG_LABELS[activeLang]})` : `Enter in ${LANG_LABELS[activeLang]}`}
        />
      )}
      <div className="flex gap-1 mt-1">
        {LANGS.map((lang) => (
          <span
            key={lang}
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              value[lang]?.trim()
                ? "bg-green-500/10 text-green-600"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {LANG_LABELS[lang]}: {value[lang]?.trim() ? "✓" : "—"}
          </span>
        ))}
      </div>
    </div>
  );
});
