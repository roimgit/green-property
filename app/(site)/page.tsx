import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import HeroBannerImage from "@/components/HeroBannerImage";
import {
  getPropertyList,
  getCompanyProfile,
  imageUrl,
} from "@/lib/sanity/data";

export const dynamic = "force-dynamic";

const HERO_IMAGE_FALLBACK = "/hero.svg";

export default async function Home() {
  const [properties, company] = await Promise.all([
    getPropertyList(),
    getCompanyProfile(),
  ]);

  const featured = properties.filter((p) => p.isFeatured);
  const unggulan = (featured.length > 0 ? featured : properties).slice(0, 9);
  const heroBanner = company?.heroBanner;
  const showHero =
    heroBanner !== undefined &&
    heroBanner !== null &&
    (heroBanner.image !== undefined ||
      heroBanner.heading !== undefined ||
      heroBanner.description !== undefined);
  const heroImage = showHero
    ? imageUrl(heroBanner.image) ?? HERO_IMAGE_FALLBACK
    : null;
  const ctaBanner = company?.ctaBanner;
  const showCta = Boolean(
    ctaBanner?.heading?.trim() ||
      ctaBanner?.description?.trim() ||
      ctaBanner?.buttonLabel?.trim(),
  );

  return (
    <main className="pt-24 pb-xl">
      {/* ===== Hero ===== */}
      {heroImage && (
        <section className="max-w-container-max mx-auto px-4 lg:px-8 mb-xl">
          <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-soft group">

            {/* Background Image — rendered via onLoad (fade-in after loaded) */}
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
              <HeroBannerImage
                src={heroImage}
                alt={heroBanner?.image?.alt ?? "Banner properti strategis Green Property"}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/90 via-on-background/60 to-transparent z-0" />

            {/* Content Container - Memisahkan Posisi dan Lebar */}
            <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16 z-10 w-full">

              {/* Inner Wrapper untuk membatasi lebar teks */}
              <div className="max-w-2xl lg:max-w-3xl">
                <h1 className="font-display text-display text-surface-container-lowest mb-md drop-shadow-md leading-tight">
                  {heroBanner?.heading ??
                    "Solusi Strategis Properti Industrial &amp; Residensial di Indonesia"}
                </h1>
                <p className="font-body-lg text-body-lg text-surface-bright mb-lg">
                  {heroBanner?.description ??
                    "Spesialis penyedia lahan untuk Vendor Hyundai dan hunian eksklusif dengan layanan terpercaya."}
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ===== Listing Unggulan ===== */}
      <section className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
        <div className="flex justify-between items-end mb-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Listing Unggulan</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Properti industrial pilihan dengan lokasi strategis.
            </p>
          </div>
          <Link
            href="/properties"
            className="hidden md:flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            View All Listings <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {unggulan.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter mb-lg">
            {unggulan.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl text-center">
            <p className="font-body-md text-on-surface-variant">
              Belum ada listing unggulan. Tambahkan properti di Sanity Studio.
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Link
            href="/properties"
            className="bg-primary text-on-primary px-10 py-3 rounded-full font-bold hover:bg-surface-tint transition-colors shadow-md"
          >
            Lihat Semua Properti
          </Link>
        </div>
      </section>

      {/* ===== CTA Banner ===== */}
      {showCta && (
        <section className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
          <div className="rounded-xl p-xl text-center shadow-lg flex flex-col items-center gap-lg bg-primary">
            <div className="space-y-sm">
              {ctaBanner?.heading?.trim() && (
                <h2 className="font-display text-display text-white">{ctaBanner.heading}</h2>
              )}
              {ctaBanner?.description?.trim() && (
                <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto">
                  {ctaBanner.description}
                </p>
              )}
            </div>
            {ctaBanner?.buttonLabel?.trim() && (
              <div className="flex flex-col md:flex-row gap-md">
                {(() => {
                  const href = ctaBanner.buttonHref?.trim() || "contact";
                  const className =
                    "border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors";
                  if (/^https?:/.test(href)) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                        {ctaBanner.buttonLabel}
                      </a>
                    );
                  }
                  return (
                    <Link href={href.startsWith("/") ? href : `/${href}`} className={className}>
                      {ctaBanner.buttonLabel}
                    </Link>
                  );
                })()}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
