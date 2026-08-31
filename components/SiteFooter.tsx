import Link from "next/link";
import { sanityFetch, groq } from "@/lib/sanity/client";
import type { CompanyProfile } from "@/types/sanity";

const COMPANY_PROFILE_QUERY = groq`*[_type == "companyProfile"][0]{
  companyName,
  address,
  contactEmail,
  contactPhone,
}`;

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/#about" },
  { label: "Kontak", href: "/#contact" },
];

function CompanySection({ profile }: { profile: CompanyProfile | null }) {
  return (
    <div className="space-y-md">
      <div className="font-headline-md text-headline-md font-bold">
        {profile?.companyName ?? "Green Property"}
      </div>
      <div className="space-y-xs font-body-sm text-white/70">
        <p>{profile?.address ?? "Kawasan Industri Jababeka II, Cikarang Baru, Bekasi, Jawa Barat 17530"}</p>
        <p className="pt-2">
          Jam Operasional:
          <br />
          Senin - Jumat: 08:00 - 17:00
          <br />
          Sabtu: 08:00 - 12:00
        </p>
      </div>
    </div>
  );
}

export default async function SiteFooter() {
  let profile: CompanyProfile | null = null;
  try {
    // Best-effort: footer renders even if Sanity is unreachable.
    profile = (await sanityFetch<CompanyProfile | null>(COMPANY_PROFILE_QUERY)) ?? null;
  } catch {
    profile = null;
  }

  return (
    <footer className="w-full py-xl border-t border-primary/20 bg-gradient-to-b from-primary to-primary/95 text-white">
      <div className="max-w-container-max mx-auto px-sm lg:px-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-xl">
          <CompanySection profile={profile} />

          <div className="space-y-md">
            <h4 className="font-headline-sm text-headline-sm text-white font-semibold">Hubungi Kami</h4>
            <ul className="space-y-sm font-body-sm text-white/85">
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm flex-shrink-0">chat</span>
                <span>WhatsApp: +62 812-XXXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm flex-shrink-0">forum</span>
                <span>KakaoTalk: greenproperty_id</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm flex-shrink-0">mail</span>
                <span>{profile?.contactEmail ?? "info@greenproperty.co.id"}</span>
              </li>
              <li className="flex items-center gap-2 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-sm flex-shrink-0">call</span>
                <span>{profile?.contactPhone ?? "+62 21-XXXX-XXXX"}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-md">
            <h4 className="font-headline-sm text-headline-sm text-white font-semibold">Navigasi</h4>
            <ul className="space-y-sm font-body-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/85 hover:text-white transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-md flex flex-col justify-between">
            <h4 className="font-headline-sm text-headline-sm text-white font-semibold">Legal</h4>
            <div className="space-y-sm font-body-sm text-white/85">
              <p>© {new Date().getFullYear()} Green Property Indonesia. All rights reserved.</p>
              <div className="flex gap-md">
                <Link href="#" className="hover:text-white transition-colors font-medium">Privacy Policy</Link>
                <Link href="#" className="hover:text-white transition-colors font-medium">Terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
