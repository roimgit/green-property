"use client";

import Link from "next/link";
import { useState } from "react";
import GoogleTranslate from "@/components/GoogleTranslate";
import LangSwitcher from "@/components/LangSwitcher";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default function SiteHeader({ children }: { children?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full top-0 sticky z-50 bg-white border-b border-primary/15 shadow-sm">
      {/* Hidden Google translation engine (loaded once). The visible dropdown is
          LangSwitcher, which drives this engine programmatically. */}
      <GoogleTranslate />

      <div className="flex justify-between items-center h-20 px-sm lg:px-xl max-w-container-max mx-auto font-body-md text-body-md">
        {children ?? (
          <Link
            href="/"
            className="font-headline-md text-headline-md font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Green Property
          </Link>
        )}

        <nav className="hidden min-[1350px]:flex items-center gap-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface hover:text-primary transition-colors font-body-md text-body-md"
            >
              {link.label}
            </Link>
          ))}
          {/* Translation dropdown — aligned with the navigation on desktop */}
          <LangSwitcher />
        </nav>

        <div className="flex items-center gap-sm">
          <Link
            href="/contact"
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all hidden sm:inline-flex"
          >
            Hubungi Kami
          </Link>

          <button
            className="hidden max-[1350px]:inline-flex text-on-surface p-2 hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined notranslate text-[28px]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`hidden max-[1350px]:block absolute top-20 left-0 w-full bg-white border-b border-primary/15 shadow-lg transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <nav className="flex flex-col p-md gap-sm bg-white">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-on-surface hover:text-primary py-2 font-body-md text-body-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {/* Translation dropdown — sits directly below the navigation links */}
          <div className="pt-xs border-t border-primary/10">
            <LangSwitcher />
          </div>
          <button className="bg-primary text-on-primary px-6 py-3 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all w-full sm:hidden">
            <Link
              href="/contact"
              className="mt-sm bg-primary text-on-primary px-6 py-3 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all w-full sm:hidden"
              onClick={() => setIsMenuOpen(false)}
            >
              Hubungi Kami
            </Link>
          </button>
        </nav>
      </div>
    </header>
  );
}