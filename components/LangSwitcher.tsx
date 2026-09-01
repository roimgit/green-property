"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __gtTranslate?: (code: string) => void;
    __lastGtLang?: string;
  }
}

const OPTIONS = [
  { code: "id", label: "ID" },
  { code: "ko", label: "KOR" },
  { code: "en", label: "ENG" },
];

function currentCode() {
  if (typeof window === "undefined") return "id";
  return window.__lastGtLang ?? "id";
}

/**
 * Language switcher rendered as an inline segmented control (ID / KOR / ENG) —
 * no dropdown, so it stays tidy on mobile. Selecting an option calls the hidden
 * Google Translate engine (window.__gtTranslate) to translate the current page.
 */
export default function LangSwitcher() {
  const [code, setCode] = useState<string>(() => currentCode());

  // Keep all LangSwitcher instances (desktop nav + mobile menu) in sync.
  useEffect(() => {
    const onLang = (e: Event) => {
      setCode((e as CustomEvent<string>).detail);
    };
    window.addEventListener("gt:lang", onLang);
    return () => window.removeEventListener("gt:lang", onLang);
  }, []);

  const select = (langCode: string) => {
    setCode(langCode);
    window.__gtTranslate?.(langCode);
  };

  return (
    <div
      role="group"
      aria-label="Pilih bahasa terjemahan"
      translate="no"
      className="notranslate flex items-center gap-xs rounded-full border border-outline-variant bg-surface-container-lowest p-xs w-fit"
    >

      {OPTIONS.map((o) => {
        const isActive = o.code === code;
        return (
          <button
            key={o.code}
            type="button"
            aria-pressed={isActive}
            onClick={() => select(o.code)}
            className={`rounded-full px-3 py-1.5 text-body-sm font-body-sm font-semibold transition-colors ${isActive
              ? "bg-primary text-on-primary"
              : "text-on-surface hover:bg-surface-container-high"
              }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}