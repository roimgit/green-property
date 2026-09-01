"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: {
          new (
            options: {
              pageLanguage: string;
              includedLanguages: string;
              layout: number;
            },
            elementId: string
          ): void;
          InlineLayout: { HORIZONTAL: number; VERTICAL: number; SIMPLE: number };
        };
      };
    };
    __gtTranslate?: (code: string) => void;
  }
}

// HORIZONTAL layout renders Google's native language <select>. We keep the widget
// completely hidden and drive it programmatically, so Google's own chrome
// (logo, "Translate" caption, "Powered by / Diberdayakan oleh") never appears.
const GOOGLE_LAYOUT = 1;

// Google Translate skips any element carrying the `notranslate` class. The Material
// Symbols icons are font ligatures ("chat", "person", ...), so we mark every
// .material-symbols-outlined span as notranslate to keep glyphs intact.
function markIconsNotranslate() {
  document.querySelectorAll(".material-symbols-outlined").forEach((el) => {
    if (!el.classList.contains("notranslate")) el.classList.add("notranslate");
  });
}

/**
 * Hidden Google Translation engine. Mounted once at the top of the header; it loads
 * the Google Translate element script and exposes window.__gtTranslate(code) to
 * translate the current page. The visible language dropdown is a custom UI that
 * calls this function (see LangSwitcher.tsx).
 */
export default function GoogleTranslate() {
  useEffect(() => {
    markIconsNotranslate();
    const iconObserver = new MutationObserver(() => markIconsNotranslate());
    iconObserver.observe(document.body, { childList: true, subtree: true });

    const scriptId = "google-translate-element-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(script);
    }

    window.googleTranslateElementInit = () => {
      if (window.google) {
        const layout =
          window.google.translate.TranslateElement.InlineLayout?.HORIZONTAL ??
          GOOGLE_LAYOUT;
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "id",
            includedLanguages: "id,ko,en",
            layout,
          },
          "google_translate_element"
        );
      }
    };

    if (window.google?.translate) {
      window.googleTranslateElementInit();
    }

    // Public API used by the custom dropdown to trigger Google's translation.
    window.__gtTranslate = (code: string) => {
      const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (select && Array.from(select.options).some((o) => o.value === code)) {
        select.value = code;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
      window.__lastGtLang = code;
      window.dispatchEvent(new CustomEvent("gt:lang", { detail: code }));
    };

    return () => {
      iconObserver.disconnect();
      delete window.googleTranslateElementInit;
      delete window.__gtTranslate;
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="hidden"
      aria-hidden="true"
    />
  );
}