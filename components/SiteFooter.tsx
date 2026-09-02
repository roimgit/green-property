import Link from "next/link";
import { sanityFetch, groq } from "@/lib/sanity/client";
import type { CompanyProfile } from "@/types/sanity";
import { getFormattedOperationalHours } from "@/lib/sanity/data";

const COMPANY_PROFILE_QUERY = groq`*[_type == "companyProfile"][0]{
  companyName,
  address,
  operationalHours {
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    weekdays,
    weekend,
    weekend2
  }
}`;

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

export default async function SiteFooter() {
  let profile: CompanyProfile | null = null;

  try {
    profile = (await sanityFetch<CompanyProfile | null>(COMPANY_PROFILE_QUERY)) ?? null;
  } catch {
    profile = null;
  }

  const hoursList = getFormattedOperationalHours(profile?.operationalHours);

  return (
    <footer className="w-full border-t border-primary/20 bg-gradient-to-r from-primary via-primary to-[#114227] text-white py-10">
      <div className="mx-auto max-w-container-max px-sm lg:px-xl space-y-8">
        {/* Spacious 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          {/* Column 1: Brand & Alamat Kantor */}
          <div className="space-y-3">
            <h3 className="font-headline-md text-headline-md font-bold text-white tracking-wide">
              {profile?.companyName ?? "Green Property"}
            </h3>
            <div className="flex items-start gap-2 text-xs text-white/80 leading-relaxed">
              <span className="material-symbols-outlined text-amber-300 text-base shrink-0 mt-0.5">
                location_on
              </span>
              <span>
                {profile?.address ?? "Kawasan Industri Jababeka II, Cikarang Baru, Bekasi, Jawa Barat 17530"}
              </span>
            </div>
            {profile?.contactEmail && (
              <div className="flex items-center gap-2 text-xs text-white/80">
                <span className="material-symbols-outlined text-amber-300 text-base shrink-0">mail</span>
                <span>{profile.contactEmail}</span>
              </div>
            )}
            {profile?.contactPhone && (
              <div className="flex items-center gap-2 text-xs text-white/80">
                <span className="material-symbols-outlined text-amber-300 text-base shrink-0">call</span>
                <span>{profile.contactPhone}</span>
              </div>
            )}
          </div>

          {/* Column 2: Navigasi Links */}
          <div className="space-y-3">
            <h4 className="font-headline-sm text-sm font-bold text-white uppercase tracking-wider">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs text-white/85">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-amber-300 transition-colors inline-block py-0.5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Jam Operasional */}
          <div className="space-y-3">
            <h4 className="font-headline-sm text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-300 text-base">schedule</span>
              Jam Operasional
            </h4>
            <div className="space-y-1.5 text-xs text-white/85">
              {hoursList.map((item) => (
                <div key={item.label} className="flex justify-between border-b border-white/10 pb-1">
                  <span className="text-white/70">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Hubungi Kami CTA */}
          <div className="space-y-3 lg:text-right">
            <h4 className="font-headline-sm text-sm font-bold text-white uppercase tracking-wider">
              Solusi Properti
            </h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Dapatkan konsultasi gratis untuk hunian dan investasi properti terbaik.
            </p>
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-bold text-sm shadow-md transition-all hover:bg-amber-300 hover:text-slate-900 active:bg-amber-400 active:scale-95 border border-white/90"
              >
                <span className="material-symbols-outlined text-base">mail</span>
                <span>Hubungi Kami</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-white/60 pt-4 border-t border-white/15 gap-2">
          <span>© {new Date().getFullYear()} {profile?.companyName ?? "Green Property Indonesia"}. All rights reserved.</span>
          <span>Solusi Properti Terpercaya &amp; Profesional</span>
        </div>
      </div>
    </footer>
  );
}
