import Link from "next/link";
import { sanityFetch, groq } from "@/lib/sanity/client";
import type { CompanyProfile, Contact } from "@/types/sanity";

const COMPANY_PROFILE_QUERY = groq`*[_type == "companyProfile"][0]{
  companyName,
  address,
  contactEmail,
  contactPhone,
  operationalHours {
    weekdays,
    weekend,
    weekend2
  }
}`;

const CONTACTS_QUERY = groq`*[_type == "contact"]{
  _id,
  name,
  phoneNumber,
  whatsappNumber,
  whatsappLink,
  kakaoTalkNumber,
  kakaoTalkLink,
  email
} | order(_createdAt asc)`;

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Properti", href: "/properties" },
  { label: "Land Provider Hyundai", href: "/#land-provider" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
];

function ContactLink({ contacts }: { contacts: Contact[] }) {
  const hasContacts = contacts.some((contact) => contact.name || contact.email || contact.phoneNumber || contact.whatsappNumber);

  if (!hasContacts) {
    return (
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-full bg-white px-sm py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
      >
        <span className="material-symbols-outlined text-base">mail</span>
        <span>Hubungi Kami</span>
      </Link>
    );
  }

  return (
    <Link
      href="/contact"
      className="inline-flex items-center gap-2 rounded-full bg-white px-sm py-3 text-sm font-semibold text-primary shadow-sm transition-colors hover:bg-primary/5"
    >
      <span className="material-symbols-outlined text-base">mail</span>
      <span>Hubungi Kami</span>
    </Link>
  );
}

function CompanySection({ profile }: { profile: CompanyProfile | null }) {
  const operationalHours = [
    { label: "Senin - Jumat", value: profile?.operationalHours?.weekdays ?? "08:00 - 17:00" },
    { label: "Sabtu", value: profile?.operationalHours?.weekend ?? "08:00 - 12:00" },
    { label: "Minggu", value: profile?.operationalHours?.weekend2 ?? "Tutup" },
  ].filter((item) => item.value && item.value.trim().length > 0);

  return (
    <div className="space-y-md">
      <div className="font-headline-md text-headline-md font-bold text-white">
        {profile?.companyName ?? "Green Property"}
      </div>
      <div className="space-y-sm font-body-sm text-white/75">
        <p className="leading-relaxed">{profile?.address ?? "Kawasan Industri Jababeka II, Cikarang Baru, Bekasi, Jawa Barat 17530"}</p>

        <div className="rounded-xl border border-white/10 bg-white/5 p-sm">
          <p className="mb-2 text-sm font-semibold text-white">Jam Operasional</p>
          <div className="space-y-1 text-sm text-white/80">
            {operationalHours.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3">
                <span>{item.label}</span>
                <span className="text-right font-medium text-white/90">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function SiteFooter() {
  let profile: CompanyProfile | null = null;
  let contacts: Contact[] = [];

  try {
    profile = (await sanityFetch<CompanyProfile | null>(COMPANY_PROFILE_QUERY)) ?? null;
  } catch {
    profile = null;
  }

  try {
    contacts = (await sanityFetch<Contact[]>(CONTACTS_QUERY)) ?? [];
  } catch {
    contacts = [];
  }

  return (
    <footer className="w-full border-t border-primary/20 bg-gradient-to-b from-primary to-primary/95 py-lg text-white">
      <div className="mx-auto max-w-container-max px-sm lg:px-xl">
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_0.9fr]">
          <CompanySection profile={profile} />

          <div className="space-y-md">
            <h4 className="font-headline-sm text-headline-sm font-semibold text-white">Navigasi</h4>
            <ul className="space-y-sm font-body-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/85 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-md">
            <ContactLink contacts={contacts} />
          </div>
        </div>

        <div className="mt-lg border-t border-white/10 pt-md text-sm text-white/75">
          © {new Date().getFullYear()} Green Property Indonesia. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
