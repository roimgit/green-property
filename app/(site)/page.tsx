import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import HeroBannerImage from "@/components/HeroBannerImage";
import ServiceCarousel from "./ServiceCarousel";
import {
  getPropertyList,
  getCompanyProfile,
  getPartnerLogos,
  getEffectiveTestimonials,
  getServices,
  imageUrl,
} from "@/lib/sanity/data";

export const dynamic = "force-dynamic";

const HERO_IMAGE_FALLBACK = "/hero.svg";

const ALBUM_SECTION_LABEL = "ALBUM KERJASAMA";

async function PartnerLogoMarquee() {
  const logos = await getPartnerLogos();
  if (logos.length === 0) return null;

  const items = logos.map((l) => ({
    name: l.namaPerusahaan ?? "Partner",
    url: imageUrl(l.logo),
  }));

  const doubled = [...items, ...items];

  return (
    <section className="bg-surface-container-lowest py-xl overflow-hidden">
      <div className="max-w-container-max mx-auto px-sm lg:px-xl mb-lg text-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Dipercaya oleh Mitra & Klien Kami
        </h2>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-container-lowest to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-container-lowest to-transparent z-10" />

        <div className="flex flex-col gap-lg">
          <div className="group flex overflow-hidden">
            <div className="flex animate-[marquee_25s_linear_infinite] gap-xl px-xl">
              {doubled.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center w-40 h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 font-bold text-outline"
                >
                  {item.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.name} className="max-h-16 max-w-32 object-contain" />
                  ) : (
                    item.name
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function Home() {
  const [properties, testimonials, company, services, partners] = await Promise.all([
    getPropertyList(),
    getEffectiveTestimonials(),
    getCompanyProfile(),
    getServices(),
    getPartnerLogos(),
  ]);

  const documentation = partners.flatMap(
    (p) =>
      p.dokumentasi?.map((img, i) => ({
        company: p.namaPerusahaan ?? "Partner",
        url: imageUrl(img) ?? "",
        alt: img?.alt ?? `Dokumentasi ${p.namaPerusahaan ?? "partner"} ${i + 1}`,
      })) ?? [],
  );

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

      {/* ===== Service Portfolio ===== */}
      {services.length > 0 && (
        <section className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Layanan</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Solusi lengkap untuk kebutuhan industri dan hunian perusahaan.
            </p>
          </div>
          <div className="px-6">
            <ServiceCarousel services={services} />
          </div>
        </section>
      )}

      {/* ===== Album Kerjasama ===== */}
      {documentation.length > 0 && (
      <section className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-md mb-lg">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps mb-md">
              {ALBUM_SECTION_LABEL}
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Momen Kerjasama Bersama Mitra
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Dokumentasi kolaborasi nyata kami bersama para partner. Klik album untuk melihat detail kerjasama.
            </p>
          </div>
          <Link
            href="/kerjasama#momen-mitra"
            className="hidden md:inline-flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            Lihat Detail Kerjasama <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {documentation.length > 0 ? (
          <Link
            href="/kerjasama#momen-mitra"
            aria-label="Lihat album kerjasama di halaman Kerjasama"
            className="group relative grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[140px] md:auto-rows-[180px]"
          >
            {documentation.slice(0, 8).map((doc, i) => (
              <div
                key={`${doc.company}-${i}`}
                className={`relative rounded-xl overflow-hidden border border-outline-variant/40 shadow-soft ${
                  i === 0 ? "row-span-2" : ""
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={doc.url}
                  alt={doc.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-white/90 text-base">business</span>
                  <span className="font-body-sm text-body-sm font-semibold text-white">
                    {doc.company}
                  </span>
                </div>
              </div>
            ))}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/90 text-primary px-6 py-2 rounded-full font-semibold text-body-sm shadow-md flex items-center gap-2">
                Lihat Album <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </Link>
        ) : (
          <Link
            href="/kerjasama#momen-mitra"
            className="group flex flex-col items-center justify-center gap-sm rounded-xl bg-surface-container-low border border-outline-variant/40 shadow-soft p-xl text-center hover:bg-surface-container-lowest transition-colors"
          >
            <span className="material-symbols-outlined text-4xl text-primary/60">photo_library</span>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              Album Kerjasama
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Lihat dokumentasi momen kerjasama kami bersama para mitra di halaman Kerjasama.
            </p>
            <span className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold text-body-sm mt-sm group-hover:bg-surface-tint transition-colors">
              Lihat Detail Kerjasama <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </Link>
        )}

        <Link
          href="/kerjasama#momen-mitra"
          className="md:hidden flex items-center justify-center gap-1 text-primary font-semibold mt-md"
        >
          Lihat Detail Kerjasama <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
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

      {/* ===== Testimonials ===== */}
      {testimonials.length > 0 && (
        <section id="about" className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
          <div className="mb-lg flex flex-col md:flex-row md:items-end md:justify-between gap-sm">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Apa Kata Klien Kami</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Testimoni dari mitra dan klien yang telah bekerja sama dengan kami.
              </p>
            </div>
            <Link
              href="/testimoni"
              className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              Lihat Semua Testimoni <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-soft flex flex-col gap-sm"
              >
                <div className="flex gap-1 text-secondary">
                  {Array.from({ length: t.rating ?? 0 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow line-clamp-3" title={t.kutipan}>
                  “{t.kutipan}”
                </p>
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                    {(t.nama ?? "?").charAt(0)}
                  </div>
                  <div>
                    <div className="font-body-md text-body-md font-semibold text-on-surface">{t.nama}</div>
                    {t.jabatan && (
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{t.jabatan}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

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

      <PartnerLogoMarquee />
    </main>
  );
}
