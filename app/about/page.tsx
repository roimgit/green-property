import Image from "next/image";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getCompanyProfile, getPartnerLogos, imageUrl } from "@/lib/sanity/data";
import { MapDisplay } from "../contact/MapDisplay";

export default async function AboutPage() {
  const [profile, partnerLogos] = await Promise.all([
    getCompanyProfile(),
    getPartnerLogos(),
  ]);

  const companyName = profile?.companyName ?? "Green Property";
  const heroImage = imageUrl(profile?.heroImage) ?? "/images/hero-fallback.jpg";
  const logoImage = imageUrl(profile?.logo) ?? null;

  const descriptionText = (profile?.description ?? [])
    .map((block) =>
      (block.children ?? [])
        .map((child) => child.text ?? "")
        .join("")
    )
    .join("\n\n")
    .trim();

  const missionList =
    profile?.mission && profile.mission.length > 0
      ? profile.mission
      : [
          "Memberikan solusi properti yang strategis dan terpercaya.",
          "Membantu pelanggan menemukan kebutuhan hunian dan investasi yang tepat.",
          "Menyediakan layanan profesional, cepat, dan transparan.",
        ];

  const partnerItems = partnerLogos.length > 0
    ? partnerLogos.map((logo) => ({
        name: logo.namaPerusahaan ?? "Partner",
        url: imageUrl(logo.logo),
      }))
    : [];

  const mapsUrl = profile?.googleMapsUrl ?? null;

  return (
    <>
      <SiteHeader />
      <main className="bg-[#fafbf9] text-on-surface">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90">
          <div className="mx-auto max-w-[1400px] px-sm py-xl lg:px-xl">
            <div className="relative min-h-[560px] flex items-center">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
                <div className="space-y-8 lg:pr-6">
                  {logoImage && (
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white uppercase tracking-wider backdrop-blur-md">
                      <div className="relative h-6 w-6 overflow-hidden rounded-full bg-white/20 flex items-center justify-center">
                        <Image src={logoImage} alt="Logo" fill className="object-contain" />
                      </div>
                      Tentang Perusahaan
                    </div>
                  )}

                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
                      Tentang Kami
                    </h1>
                    <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                      Membangun masa depan properti yang berkelanjutan melalui inovasi, kepercayaan, dan dedikasi.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      href="/properties"
                      className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all shadow-lg"
                    >
                      Lihat Properti
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
                    >
                      Hubungi Kami
                      <span className="material-symbols-outlined text-sm">mail</span>
                    </Link>
                  </div>
                </div>

                <div className="relative h-[400px] lg:h-[500px] w-full lg:max-w-[620px] lg:justify-self-end">
                  <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                    {heroImage && (
                      <Image
                        src={heroImage}
                        alt={companyName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="relative py-20 lg:py-28">
          <div className="mx-auto max-w-[1400px] px-sm lg:px-xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 items-start">
              {/* Left Column - Profile & Info */}
              <div className="space-y-8">
                {/* Profile Card */}
                <div className="rounded-2xl border border-primary/15 bg-white p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="material-symbols-outlined text-primary text-lg">business</span>
                    </div>
                    <h2 className="text-2xl font-bold text-on-surface">Profil Kami</h2>
                  </div>

                  <div className="space-y-6">
                    {heroImage && (
                      <div className="relative h-56 rounded-xl overflow-hidden border border-primary/10">
                        <Image
                          src={heroImage}
                          alt={companyName}
                          fill
                          className="object-cover"
                          sizes="100%"
                        />
                      </div>
                    )}

                    <div className="space-y-4 text-base leading-relaxed text-on-surface-variant">
                      <p>{descriptionText || "Kami adalah perusahaan properti terdepan yang berkomitmen memberikan solusi investasi terbaik."}</p>
                    </div>
                  </div>
                </div>

                {/* Vision Card */}
                <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 to-primary/10 p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-3xl">visibility</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-3">Visi</h3>
                      <p className="text-on-surface-variant leading-relaxed">
                        {profile?.vision ?? "Menjadi platform properti terpercaya yang mentransformasi cara Indonesia berinvestasi."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Mission & Info Cards */}
              <div className="space-y-8">
                {/* Mission Card */}
                <div className="rounded-2xl border border-primary/15 bg-white p-8 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="material-symbols-outlined text-primary text-lg">flag</span>
                    </div>
                    <h3 className="text-2xl font-bold text-on-surface">Misi</h3>
                  </div>

                  <ul className="space-y-4">
                    {missionList.map((item, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 text-primary mt-1 material-symbols-outlined">check_circle</span>
                        <span className="text-on-surface-variant leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Location & Hours */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="rounded-2xl border border-primary/15 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                      <h4 className="font-bold text-on-surface">Lokasi</h4>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      {profile?.address ?? "Alamat belum tersedia"}
                    </p>
                  </div>

                  {/* Hours */}
                  <div className="rounded-2xl border border-primary/15 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                      <h4 className="font-bold text-on-surface">Jam Operasional</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Senin - Jumat</span>
                        <span className="font-semibold text-on-surface">{profile?.operationalHours?.weekdays ?? "08:00-17:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Sabtu</span>
                        <span className="font-semibold text-on-surface">{profile?.operationalHours?.weekend ?? "08:00-12:00"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-on-surface-variant">Minggu</span>
                        <span className="font-semibold text-on-surface">{profile?.operationalHours?.weekend2 ?? "Tutup"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="rounded-2xl border border-primary/15 bg-white p-8 lg:p-10 shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <span className="material-symbols-outlined text-primary">mail</span>
                    </div>
                    <h4 className="text-lg font-bold text-on-surface">Hubungi Kami</h4>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-on-surface-variant mb-1">Email</p>
                      <p className="font-semibold text-on-surface break-all">{profile?.contactEmail ?? "info@greenproperty.co.id"}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant mb-1">Telepon</p>
                      <p className="font-semibold text-on-surface">{profile?.contactPhone ?? "+62 21-XXXX-XXXX"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        {partnerItems.length > 0 && (
          <section className="bg-gradient-to-b from-primary/5 to-white py-20 lg:py-28 border-y border-primary/10">
            <div className="mx-auto max-w-[1400px] px-sm lg:px-xl">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mb-3">
                  Dipercaya oleh Mitra & Klien Kami
                </h2>
                <p className="text-on-surface-variant max-w-2xl mx-auto">
                  Bergabung dengan ratusan partner yang telah mempercayai kami sebagai solusi properti terbaik
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white lg:from-transparent to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white lg:from-transparent to-transparent z-10" />

                <div className="flex overflow-hidden">
                  <div className="flex animate-[marquee_80s_linear_infinite] gap-12 px-8">
                    {[...partnerItems, ...partnerItems].map((item, index) => (
                      <div
                        key={`${item.name}-${index}`}
                        className="flex items-center justify-center w-40 h-24 flex-shrink-0 group"
                      >
                        {item.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.url}
                            alt={item.name}
                            className="max-h-16 max-w-32 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-on-surface-variant">{item.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Map Section */}
        {profile?.latitude && profile?.longitude ? (
          <section className="py-20 lg:py-28">
            <div className="mx-auto max-w-[1400px] px-sm lg:px-xl">
              <div className="mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-on-surface mb-2">Kunjungi Kami</h2>
                <div className="flex items-center gap-3">
                  <div className="h-1 w-16 bg-primary rounded-full" />
                  <p className="text-on-surface-variant">Temukan lokasi kantor kami di peta interaktif</p>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden border border-primary/15 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
                <MapDisplay
                  latitude={profile.latitude}
                  longitude={profile.longitude}
                  address={profile.address}
                />
              </div>

              {mapsUrl && (
                <div className="mt-8 flex justify-center">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-full font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
                  >
                    <span className="material-symbols-outlined">location_on</span>
                    Buka di Google Maps
                  </a>
                </div>
              )}
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
