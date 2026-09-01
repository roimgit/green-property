"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full top-0 sticky z-50 bg-white border-b border-primary/15 shadow-sm">
      <div className="flex justify-between items-center h-20 px-sm lg:px-xl max-w-container-max mx-auto font-body-md text-body-md">
        <Link
          href="/"
          className="font-headline-md text-headline-md font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Green Property
        </Link>

        <nav className="hidden md:flex items-center gap-md">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-on-surface hover:text-primary transition-colors font-body-md text-body-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-sm">
          <Link
            href="/contact"
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all hidden sm:inline-flex"
          >
            Hubungi Kami
          </Link>
          
          <button 
            className="md:hidden text-on-surface p-2 hover:text-primary transition-colors"
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
        className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-primary/15 shadow-lg transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col p-md gap-md bg-white">
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
          <Link
            href="/contact"
            className="mt-sm bg-primary text-on-primary px-6 py-3 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary/90 active:scale-95 transition-all w-full sm:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            Hubungi Kami
          </Link>
        </nav>
      </div>
    </header>
  );
}
