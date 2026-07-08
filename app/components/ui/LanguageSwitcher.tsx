"use client";

import { useTranslation } from "@/app/lib/i18n";
import { useState, useRef, useEffect } from "react";
import type { Language } from "@/app/lib/i18n";

const LANGUAGES: { code: Language; flag: string; label: string }[] = [
  { code: "bg", flag: "🇧🇬", label: "BG" },
  { code: "en", flag: "🇬🇧", label: "EN" },
];

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-[#0F4C81] active:scale-95 md:px-4"
        title={t("language.selectLanguage")}
        aria-label={t("language.selectLanguage")}
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="hidden sm:inline">{currentLang?.label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-32 rounded-lg border border-slate-200/80 bg-white/95 shadow-lg backdrop-blur-sm">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-2 text-sm font-medium transition first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code
                  ? "bg-[#F58220]/10 text-[#F58220]"
                  : "text-slate-700 hover:bg-slate-50/50 hover:text-[#0F4C81]"
              }`}
              aria-label={`Switch to ${lang.label}`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>
                {lang.code === "bg" ? t("language.bulgarian") : t("language.english")}
              </span>
              {language === lang.code && (
                <svg className="ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
