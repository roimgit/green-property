"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/#about" },
  { label: "Kontak", href: "/#contact" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full top-0 sticky z-50 bg-surface dark:bg-surface-dim/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center h-20 px-sm lg:px-xl max-w-container-max mx-auto font-body-md text-body-md">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold text-primary"
        >
          Green Property
        </Link>

        <nav className="hidden md:flex items-center gap-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface-variant hover:text-primary transition-colors font-body-md text-body-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-sm">
          <button className="bg-primary-container text-on-primary px-6 py-2 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors hidden sm:inline-flex">
            Hubungi Kami
          </button>
          
          <button 
            className="md:hidden text-on-surface-variant p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[28px]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-surface border-b border-outline-variant/30 shadow-lg transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col p-md gap-md bg-surface">
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
          <button className="mt-sm bg-primary-container text-on-primary px-6 py-3 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors w-full sm:hidden">
            Hubungi Kami
          </button>
        </nav>
      </div>
    </header>
  );
}
