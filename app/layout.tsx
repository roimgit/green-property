import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getCompanyProfile, getSiteSettings } from "@/lib/sanity/data";
import { brandCss } from "@/lib/brand";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Green Property - Strategic Land Partner",
  /* SEO GOOGLE */
  verification: {
    google: "gBBE_Rgi4ec2R94H3A8AfIJn0AfsbtEq4qEjYhMlvR8"
  },
  description:
    "Solusi strategis properti industrial & residensial di Indonesia. Spesialis penyedia lahan untuk Vendor Hyundai.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [siteSettings, company] = await Promise.all([
    getSiteSettings().catch(() => null),
    getCompanyProfile().catch(() => null),
  ]);
  // Gabungan Setting Brand: primaryColor sekarang di companyProfile, fallback ke siteSettings lama
  const primary = company?.primaryColor || siteSettings?.primaryColor;
  const css = brandCss(primary);

  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} h-full antialiased`}
    >
      <head>
        {/* Material Symbols icon font — guarantees service icons render as
            glyphs (not text) on the frontend. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
