import Link from "next/link";
import type { PartnerLogo, KerjasamaButton } from "@/types/sanity";
import {
  getCompanyProfile,
  getEffectiveTestimonials,
  getPartnerLogos,
  getKerjasamaSettings,
  imageUrl,
  portableTextToText,
} from "@/lib/sanity/data";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kerjasama - Green Property",
};

function renderButton(button: KerjasamaButton, className: string) {
  const content = (
    <>
      {button.icon && <span className="material-symbols-outlined text-lg">{button.icon}</span>}
      {button.label}
    </>
  );
  const href = button.href || "#";
  const isInternal = button.linkType === "internal" || /^(?!https?:)./.test(href);

  if (isInternal) {
    return (
      <Link key={button.label ?? href} href={href} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <a key={button.label ?? href} href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  );
}

async function PartnerLogoMarquee({ partners }: { partners: PartnerLogo[] }) {
  const items = partners.map((p) => ({
    name: p.namaPerusahaan ?? "Partner",
    url: imageUrl(p.logo),
  }));

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <section className="bg-surface-container-lowest py-xl overflow-hidden border-y border-outline-variant/40">
      <div className="max-w-container-max mx-auto px-sm lg:px-xl mb-lg text-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Dipercaya oleh Mitra &amp; Klien Kami
        </h2>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface-container-lowest to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface-container-lowest to-transparent z-10" />

        <div className="flex overflow-hidden group">
          <div className="flex animate-[marquee_25s_linear_infinite] group-hover:[animation-play-state:paused] gap-xl px-xl">
            {doubled.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-center justify-center w-40 h-20 shrink-0 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
              >
                {item.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.url} alt={item.name} className="max-h-16 max-w-32 object-contain" />
                ) : (
                  <span className="text-sm font-bold text-on-surface-variant">{item.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerCard({ partner }: { partner: PartnerLogo }) {
  const logoUrl = imageUrl(partner.logo);
  const desc = (portableTextToText(partner.keteranganKerjasama) || "").trim();

  const inner = (
    <article className="group h-full bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-md shadow-soft hover:shadow-xl hover:-translate-y-1 hover:border-secondary transition-all duration-300 flex flex-col gap-md">
      <div className="h-24 flex items-center justify-center rounded-xl bg-surface-container-low border border-outline-variant/40 p-4 overflow-hidden">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={partner.namaPerusahaan ?? "Partner"}
            className="max-h-16 max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span className="font-headline-md text-headline-md font-bold text-primary text-center">
            {partner.namaPerusahaan ?? "Partner"}
          </span>
        )}
      </div>

      <div className="flex-grow flex flex-col gap-sm">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
          {partner.namaPerusahaan ?? "Partner"}
        </h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
          {desc || "Bermitra strategis bersama Green Property untuk mendukung ekosistem properti industrial &amp; residensial Indonesia."}
        </p>
      </div>

      {partner.url && (
        <span className="inline-flex items-center gap-1 text-primary font-semibold text-body-sm">
          Kunjungi Website <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </span>
      )}
    </article>
  );

  return partner.url ? (
    <a href={partner.url} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

export default async function KerjasamaPage() {
  const [partners, testimonials, company, settings] = await Promise.all([
    getPartnerLogos(),
    getEffectiveTestimonials(),
    getCompanyProfile(),
    getKerjasamaSettings(),
  ]);

  const documentation = partners.flatMap(
    (p) =>
      p.dokumentasi?.map((img, i) => ({
        company: p.namaPerusahaan ?? "Partner",
        url: imageUrl(img) ?? "",
        alt: img?.alt ?? `Dokumentasi ${p.namaPerusahaan ?? "partner"} ${i + 1}`,
      })) ?? [],
  );

  const companyName = company?.companyName ?? "Green Property";

  const heroHeading = portableTextToText(settings?.heroHeading)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const points = settings?.points?.filter((p) => p?.title || p?.desc) ?? [];
  const heroButtons = (settings?.heroButtons ?? []).filter((b) => b?.label);
  const ctaHref = settings?.ctaButtonHref?.trim() || "contact";

  return (
    <main className="bg-[#fafbf9] text-on-surface flex-grow">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden bg-primary py-xl lg:py-24">
        {/* Decorative blur circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 -left-32 w-96 h-96 rounded-full bg-secondary/30 blur-3xl" />

        <div className="relative max-w-container-max mx-auto px-sm lg:px-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-xl items-center">
            <div className="space-y-md">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 w-fit">
                <span className="material-symbols-outlined text-amber-300 text-base">handshake</span>
                <span className="font-label-caps text-label-caps text-white">
                  {settings?.heroBadge?.trim() || "Kerjasama & Kemitraan"}
                </span>
              </div>

              <h1 className="font-display text-display text-white leading-tight">
                {heroHeading.length > 0 ? (
                  heroHeading.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < heroHeading.length - 1 && <br className="hidden md:block" />}
                    </span>
                  ))
                ) : (
                  <>
                    Mitra Strategis untuk
                    <br className="hidden md:block" /> Setiap Langkah Bisnis
                  </>
                )}
              </h1>
              <p className="font-body-lg text-body-lg text-white/90 leading-relaxed max-w-2xl">
                {settings?.heroDescription?.trim() ||
                  `Kami membangun kepercayaan melalui kolaborasi nyata — bersama hingga ${partners.length} mitra perusahaan yang telah mempercayakan solusi lahan dan propertinya kepada ${companyName}.`}
              </p>

              {heroButtons.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-2">
                  {heroButtons.map((button) => (
                    <div key={button.label ?? button.href} className="contents">
                      {renderButton(
                        button,
                        "inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-amber-300 hover:text-slate-900 transition-all shadow-md active:scale-95",
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats Stack */}
            <div className="grid grid-cols-2 gap-md">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-md text-center space-y-1">
                <div className="font-display text-4xl font-bold text-white">
                  {partners.length}
                  <span className="text-amber-300">+</span>
                </div>
                <div className="font-body-sm text-body-sm text-white/85">Mitra Perusahaan</div>
              </div>
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-md text-center space-y-1">
                <div className="font-display text-4xl font-bold text-white">
                  {testimonials.length}
                  <span className="text-amber-300">+</span>
                </div>
                <div className="font-body-sm text-body-sm text-white/85">Testimoni Klien</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Partnership Points ===== */}
      {points.length > 0 && (
        <section className="max-w-container-max mx-auto px-sm lg:px-xl -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {points.map((point, idx) => (
              <div
                key={`${point.title ?? "point"}-${idx}`}
                className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-md shadow-soft flex items-start gap-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">{point.icon || "handshake"}</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">
                    {point.title}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== Partner Cards ===== */}
      {partners.length > 0 && (
        <section className="max-w-container-max mx-auto px-sm lg:px-xl py-xl">
          <div className="text-center mb-lg">
            <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps mb-md">
              PARTNER &amp; KOLABORASI
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">
              Partner Perusahaan Kami
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Sebuah jalan panjang dibangun bersama. Berikut mitra yang telah bekerja sama
              dengan kami dalam berbagai proyek industrial &amp; properti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {partners.map((partner) => (
              <PartnerCard key={partner._id} partner={partner} />
            ))}
          </div>
        </section>
      )}

      <PartnerLogoMarquee partners={partners} />

      {/* ===== Testimonials ===== */}
      {testimonials.length > 0 && (
        <section className="py-xl">
          <div className="max-w-container-max mx-auto px-sm lg:px-xl">
            <div className="text-center mb-lg">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps mb-md">
                TESTIMONI KLIEN
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">
                Kata Mereka Tentang Kami
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Pengalaman langsung dari klien dan mitra yang telah membangun bersama kami.
              </p>
              <Link
                href="/testimoni"
                className="mt-md inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                Lihat Semua Testimoni <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="relative bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-md shadow-soft flex flex-col gap-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="absolute top-4 right-5 font-display text-6xl text-secondary/20 leading-none select-none">
                    &rdquo;
                  </span>
                  <div className="flex gap-1 text-secondary">
                    {Array.from({ length: t.rating ?? 0 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-sm">star</span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant flex-grow leading-relaxed line-clamp-3" title={t.kutipan}>
                    &ldquo;{t.kutipan}&rdquo;
                  </p>
                  <div className="flex items-center gap-sm pt-sm border-t border-outline-variant/40">
                    <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shrink-0">
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
          </div>
        </section>
      )}

      {/* ===== Documentation ===== */}
      {documentation.length > 0 && (
        <section id="momen-mitra" className="py-xl bg-surface-container-low border-y border-outline-variant/40 scroll-mt-24">
          <div className="max-w-container-max mx-auto px-sm lg:px-xl">
            <div className="text-center mb-lg">
              <div className="inline-block px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps mb-md">
                DOKUMENTASI
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-xs">
                Momen Bersama Mitra
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                Kenangan kolaborasi, penyerahan unit, dan kegiatan bersama partner kami.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {documentation.map((doc, i) => (
                <div
                  key={`${doc.company}-${i}`}
                  className={`relative rounded-2xl overflow-hidden group border border-outline-variant/40 shadow-soft ${i % 3 === 1 ? "lg:mt-8" : ""
                    }`}
                >
                  <div className="relative h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={doc.url}
                      alt={doc.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-white/90 text-base">business</span>
                    <span className="font-body-sm text-body-sm font-semibold text-white">{doc.company}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA ===== */}
      {(settings?.ctaHeading?.trim() ||
        settings?.ctaDescription?.trim() ||
        settings?.ctaButtonLabel?.trim()) && (
        <section className="max-w-container-max mx-auto px-sm lg:px-xl py-xl">
          <div className="rounded-3xl p-xl text-center shadow-lg flex flex-col items-center gap-lg bg-primary relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="relative space-y-sm">
              {settings?.ctaHeading?.trim() && (
                <h2 className="font-display text-display text-white">{settings.ctaHeading}</h2>
              )}
              {settings?.ctaDescription?.trim() && (
                <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto">
                  {settings.ctaDescription}
                </p>
              )}
            </div>
            {settings?.ctaButtonLabel?.trim() && (
              <div className="relative">
                {renderButton(
                  {
                    label: settings.ctaButtonLabel,
                    href: ctaHref,
                    linkType: /^https?:/.test(ctaHref) ? "external" : "internal",
                    icon: "mail",
                  },
                  "inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-amber-300 hover:text-slate-900 transition-all shadow-md active:scale-95",
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}