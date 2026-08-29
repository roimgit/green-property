import Link from "next/link";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/#about" },
  { label: "Kontak", href: "/#contact" },
];

export default function SiteHeader() {
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

        <button className="bg-primary-container text-on-primary px-6 py-2 rounded-full font-body-sm text-body-sm font-semibold hover:bg-primary transition-colors hidden sm:inline-flex">
          Hubungi Kami
        </button>
      </div>
    </header>
  );
}
