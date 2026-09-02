"use client";

import { useState } from "react";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      if (typeof window !== "undefined") {
        const input = document.createElement("input");
        input.value = window.location.href;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={
        "w-full flex justify-center items-center gap-2 px-6 py-3 border-2 font-body-md text-body-md font-semibold rounded-full transition-all duration-300 shadow-xs " +
        (copied
          ? "border-[#25D366] bg-[#25D366]/10 text-[#25D366]"
          : "border-outline-variant text-on-surface hover:bg-surface-container-low hover:border-primary hover:text-primary")
      }
    >
      <span className="material-symbols-outlined text-[20px]">
        {copied ? "check_circle" : "link"}
      </span>
      {copied ? "Link URL Tersalin!" : "Salin Link URL"}
    </button>
  );
}
