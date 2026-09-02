import Image from "next/image";
import Link from "next/link";
import { getCompanyProfile, getPartnerLogos, getFormattedOperationalHours, imageUrl } from "@/lib/sanity/data";
import { MapDisplay } from "@/app/contact/MapDisplay";
import { CompanyProfile } from "@/types/sanity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tentang Kami - Green Property",
};

export default async function AboutPage() {
  const [profile, partnerLogos] = await Promise.all([
    getCompanyProfile(),
    getPartnerLogos(),
  ]);

  const companyName = profile?.companyName ?? "Green Property";
  const heroImage = imageUrl(profile?.heroBanner?.image) ?? "/hero.svg";

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
    <main className="bg-[#fafbf9] text-on-surface flex-grow">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/90 py-xl lg:py-24">
        <div className="max-w-container-max mx-auto px-sm lg:px-xl">
          <div className="relative flex flex-col lg:flex-row justify-between items-center gap-xl w-full">
            {/* Text Side - Extends wide horizontally */}
            <div className="flex-1 space-y-6 w-full">
              <div className="space-y-4">
                <h1 className="font-display text-display text-white leading-tight">
                  Tentang Kami
                </h1>
                <p className="font-body-lg text-body-lg text-white/90 leading-relaxed max-w-3xl">
                  Membangun masa depan properti yang berkelanjutan melalui inovasi, kepercayaan, dan dedikasi.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all shadow-md"
                >
                  Lihat Properti
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Image Side - Pushed to the right corner */}
            <div className="w-full lg:w-[460px] xl:w-[540px] h-[320px] lg:h-[400px] shrink-0 relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 ml-auto">
              {heroImage && (
                <Image
                  src={heroImage}
                  alt={companyName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 540px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Profil Kami Section - Wide Layout with Image in Right Corner */}
      <section className="py-xl">
        <div className="max-w-container-max mx-auto px-sm lg:px-xl space-y-lg">
          {/* Main Profil Card: Text stretches across, Image in top-right corner */}
          <div className="rounded-2xl border border-primary/15 bg-surface-container-lowest p-lg lg:p-xl shadow-soft">
            <div className="flex flex-col lg:flex-row gap-lg justify-between items-start">
              {/* Text Area - Extends horizontally */}
              <div className="flex-1 space-y-md">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <span className="material-symbols-outlined text-primary text-lg">business</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md font-bold text-on-surface">Profil Kami</h2>
                </div>

                <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-4">
                  {descriptionText ? (
                    descriptionText.split("\n\n").map((p, idx) => <p key={idx}>{p}</p>)
                  ) : (
                    <p>
                      Kami adalah perusahaan properti terdepan yang berkomitmen memberikan solusi investasi dan hunian terbaik di Indonesia.
                    </p>
                  )}
                </div>
              </div>

              {/* Image Box - Positioned in the Top-Right Corner */}
              {heroImage && (
                <div className="w-full lg:w-[420px] h-[260px] lg:h-[300px] shrink-0 relative rounded-2xl overflow-hidden border border-outline-variant/40 shadow-sm">
                  <Image
                    src={heroImage}
                    alt={companyName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 420px"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Visi & Misi Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            {/* Vision Card */}
            <div className="rounded-2xl border border-primary/15 bg-surface-container-lowest p-lg shadow-soft flex flex-col justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">visibility</span>
                </div>
                <div className="space-y-sm">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Visi Kami</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    {profile?.vision ?? "Menjadi platform properti terpercaya yang mentransformasi cara Indonesia berinvestasi."}
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="rounded-2xl border border-primary/15 bg-surface-container-lowest p-lg shadow-soft">
              <div className="flex items-center gap-3 mb-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">flag</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface">Misi Kami</h3>
              </div>

              <ul className="space-y-sm">
                {missionList.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-primary shrink-0 mt-0.5 material-symbols-outlined text-lg">check_circle</span>
                    <span className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Location & Operational Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <div className="rounded-2xl border border-primary/15 bg-surface-container-lowest p-lg shadow-soft">
              <div className="flex items-center gap-3 mb-sm">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Lokasi Kantor</h4>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-line">
                {profile?.address ?? "Alamat kantor belum tersedia."}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/15 bg-surface-container-lowest p-lg shadow-soft">
              <div className="flex items-center gap-3 mb-sm">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                  <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                </div>
                <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface">Jam Operasional</h4>
              </div>
              <div className="space-y-xs font-body-md text-body-md">
                {getFormattedOperationalHours(profile?.operationalHours).map((item, idx, arr) => (
                  <div
                    key={item.label}
                    className={`flex justify-between py-1.5 ${
                      idx < arr.length - 1 ? "border-b border-outline-variant/30" : ""
                    }`}
                  >
                    <span className="text-on-surface-variant font-medium">{item.label}</span>
                    <span className="font-semibold text-on-surface">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee Section */}
      {partnerItems.length > 0 && (
        <section className="bg-surface-container-lowest py-xl border-y border-outline-variant/40">
          <div className="max-w-container-max mx-auto px-sm lg:px-xl">
            <div className="text-center mb-lg">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">
                Dipercaya oleh Mitra &amp; Klien Kami
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Bergabung dengan mitra yang telah mempercayai kami sebagai solusi properti terbaik.
              </p>
            </div>

            <div className="relative overflow-hidden">
              <div className="flex animate-[marquee_80s_linear_infinite] gap-xl px-xl">
                {[...partnerItems, ...partnerItems].map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-center w-40 h-20 shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                  >
                    {item.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt={item.name} className="max-h-16 max-w-32 object-contain" />
                    ) : (
                      <span className="text-sm font-semibold text-on-surface-variant">{item.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Map Section */}
      {profile?.latitude && profile?.longitude ? (
        <section className="py-xl">
          <div className="max-w-container-max mx-auto px-sm lg:px-xl space-y-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">Kunjungi Kami</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Temukan lokasi kantor kami di peta interaktif</p>
            </div>

            <div className="rounded-3xl overflow-hidden border border-outline-variant shadow-soft">
              <MapDisplay
                latitude={profile.latitude}
                longitude={profile.longitude}
                address={profile.address}
              />
            </div>

            {mapsUrl && (
              <div className="flex justify-center pt-md">
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-3 rounded-full font-semibold shadow-md hover:bg-primary/90 transition-all"
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
  );
}
