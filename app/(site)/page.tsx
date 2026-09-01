import Link from "next/link";
import Image from "next/image";
import PropertyCard from "@/components/PropertyCard";
import {
  getPropertyList,
  getCompanyProfile,
  getPartnerLogos,
  getTestimonials,
  getServices,
  imageUrl,
} from "@/lib/sanity/data";
import type { Service } from "@/types/sanity";

export const dynamic = "force-dynamic";

const HERO_IMAGE_FALLBACK = "/hero.svg";

const SERVICES_FALLBACK: Service[] = [
  {
    _id: "fallback-1",
    _type: "service",
    icon: "landscape",
    title: "Industrial Land",
    desc: "industrial plots optimized for manufacturing.",
    urutanTampil: 1,
  },
  {
    _id: "fallback-2",
    _type: "service",
    icon: "factory",
    title: "Turnkey Factories",
    desc: "ready-to-operate facilities built to international standards.",
    urutanTampil: 2,
  },
  {
    _id: "fallback-3",
    _type: "service",
    icon: "real_estate_agent",
    title: "Executive Residence",
    desc: "luxury housing for management staff.",
    urutanTampil: 3,
  },
  {
    _id: "fallback-4",
    _type: "service",
    icon: "apartment",
    title: "Staff Apartments",
    desc: "high-density, comfortable living solutions.",
    urutanTampil: 4,
  },
];

const ECOSYSTEM_POINTS = [
  "Proksimitas Strategis ke Pabrik Perakitan Utama",
  "Infrastruktur Teroptimasi untuk Logistik Berat",
  "Dukungan Perizinan & Regulasi yang Komprehensif",
];

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
            <div className="flex animate-[marquee_80s_linear_infinite] gap-xl px-xl">
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
  const [properties, testimonials, company, services] = await Promise.all([
    getPropertyList(),
    getTestimonials(),
    getCompanyProfile(),
    getServices(),
  ]);

  const featured = properties.filter((p) => p.isFeatured);
  const unggulan = (featured.length > 0 ? featured : properties).slice(0, 8);
  const heroImage = imageUrl(company?.heroImage) ?? HERO_IMAGE_FALLBACK;
  const serviceItems = services.length > 0 ? services : SERVICES_FALLBACK;

  return (
    <main className="pt-24 pb-xl">
      {/* ===== Hero ===== */}
      <section className="max-w-container-max mx-auto px-4 lg:px-8 mb-xl">
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden shadow-soft group">

          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center w-full h-full transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-on-background/90 via-on-background/60 to-transparent z-0" />

          {/* Content Container - Memisahkan Posisi dan Lebar */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16 z-10 w-full">

            {/* Inner Wrapper untuk membatasi lebar teks */}
            <div className="max-w-2xl lg:max-w-3xl">
              <h1 className="font-display text-display text-surface-container-lowest mb-md drop-shadow-md leading-tight">
                Solusi Strategis Properti Industrial &amp; Residensial di Indonesia
              </h1>
              <p className="font-body-lg text-body-lg text-surface-bright mb-lg">
                Spesialis penyedia lahan untuk Vendor Hyundai dan hunian eksklusif dengan layanan terpercaya.
              </p>

              {/* Button Group - Ditambah flex-wrap agar responsif di mobile */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/properties"
                  className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-body-md text-body-md font-semibold hover:bg-primary transition-colors shadow-sm text-center"
                >
                  Lihat Properti
                </Link>
                <Link
                  href="/contact"
                  className="bg-transparent border-2 border-surface-container-lowest text-surface-container-lowest backdrop-blur-sm px-8 py-3 rounded-full font-body-md text-body-md font-semibold hover:bg-surface-container-lowest/20 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">chat</span> Hubungi Kami via WhatsApp
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== Service Portfolio ===== */}
      <section className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
        <div className="mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Service Portfolio</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Comprehensive solutions for industrial setup and corporate living.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {serviceItems.map((service) => {
            const cardContent = (
              <>
                <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mb-md shrink-0">
                  <span
                    className="material-symbols-outlined text-primary text-[32px]"
                    style={{ fontFamily: '"Material Symbols Outlined"' }}
                  >
                    {service.icon || "landscape"}
                  </span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-sm">
                  {service.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  <span className="font-bold text-primary">Jual &amp; Sewa</span>{" "}
                  {service.desc}
                </p>
              </>
            );
            const cardClassName =
              "h-full bg-surface-container-lowest border border-outline-variant p-lg rounded-xl shadow-soft hover:-translate-y-1 hover:shadow-md hover:border-primary-container transition-all duration-300 flex flex-col";

            return service.url ? (
              <a
                key={service._id}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClassName}
              >
                {cardContent}
              </a>
            ) : (
              <div key={service._id} className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== Ecosystem (Land Provider Hyundai) ===== */}
      <section id="land-provider" className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-stretch bg-surface-container-low rounded-xl overflow-hidden border border-surface-container-highest shadow-soft">
          <div className="relative h-[400px] md:h-auto overflow-hidden">
            <Image
              src={HERO_IMAGE_FALLBACK}
              alt="Industrial park landscape"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-lg md:p-xl flex flex-col justify-center">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps mb-md w-fit">
              LAND PROVIDER FOR HYUNDAI VENDOR
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
              Spesialis Land Provider untuk Ekosistem Vendor Hyundai
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              Kami menyediakan solusi lahan strategis yang terintegrasi penuh dengan rantai pasok industri otomotif.
            </p>
            <ul className="space-y-md mb-xl">
              {ECOSYSTEM_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-sm">
                  <span className="material-symbols-outlined" style={{ color: "#C6A15B" }}>
                    check_circle
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">{point}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="w-fit bg-transparent border-2 px-8 py-3 rounded-full font-body-md text-body-md font-semibold transition-all hover:bg-surface-container-highest flex items-center gap-2"
              style={{ borderColor: "#C6A15B", color: "#C6A15B" }}
            >
              Lihat Studi Kasus <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg">
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
          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Apa Kata Klien Kami</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Testimoni dari mitra dan klien yang telah bekerja sama dengan kami.
            </p>
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
                <p className="font-body-md text-body-md text-on-surface-variant flex-grow">
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
      <section className="max-w-container-max mx-auto px-sm lg:px-xl mb-xl">
        <div className="rounded-xl p-xl text-center shadow-lg flex flex-col items-center gap-lg bg-[#155C2E]">
          <div className="space-y-sm">
            <h2 className="font-display text-display text-white">Siap Memulai Proyek Anda?</h2>
            <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto">
              Tim ahli kami siap membantu Anda menemukan solusi lahan dan properti terbaik di Indonesia.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-md">
            <Link
              href="/contact"
              className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-md"
            >
              <span className="material-symbols-outlined">chat</span> Chat via WhatsApp
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              Lihat Semua Kontak
            </Link>
          </div>
        </div>
      </section>

      <PartnerLogoMarquee />
    </main>
  );
}
