import Link from "next/link";
import { notFound } from "next/navigation";
import PropertyGallery from "@/components/PropertyGallery";
import PropertyCard from "@/components/PropertyCard";
import PropertyInquiryForm from "@/components/PropertyInquiryForm";
import CopyLinkButton from "@/components/CopyLinkButton";
import {
  getPropertyBySlug,
  getSimilarProperties,
  getCompanyProfile,
  formatPriceWithCurrency,
  normalizeWhatsAppNumber,
  portableTextToText,
} from "@/lib/sanity/data";
import { normalizePropertySpecs } from "@/lib/sanity/specifications";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

function SpecRow({ label, value, icon }: { label: string; value?: string | number; icon?: string }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between items-center gap-2 py-2 border-b border-outline-variant/50">
      <span className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
        {icon && (
          <span className="material-symbols-outlined text-[18px] text-primary">{icon}</span>
        )}
        {label}
      </span>
      <span className="text-on-surface font-body-md text-body-md font-semibold">{value}</span>
    </div>
  );
}

function PriceMetaBadge({ label, value }: { label: string; value?: string | number }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="rounded-xl border border-outline-variant bg-surface px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">{label}</p>
      <p className="mt-1 text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}

const FACILITY_ICONS: Record<string, string> = {
  pool: "pool",
  kolam: "pool",
  garden: "yard",
  taman: "yard",
  kitchen: "kitchen",
  dapur: "kitchen",
  internet: "wifi",
  wifi: "wifi",
  security: "security",
  keamanan: "security",
  satpam: "security",
  "24/7": "security",
  ac: "ac_unit",
  pendingin: "ac_unit",
  tol: "directions_car",
  akses: "directions_car",
  jalan: "add_road",
  dock: "local_shipping",
  loading: "local_shipping",
  logistik: "local_shipping",
  cctv: "videocam",
  fire: "local_fire_department",
  pemadam: "local_fire_department",
  parking: "local_parking",
  parkir: "local_parking",
  garasi: "garage",
  storage: "warehouse",
  gudang: "warehouse",
  pabrik: "factory",
  listrik: "bolt",
  power: "bolt",
  air: "water_drop",
  pam: "water_drop",
  pos: "shield",
  pagar: "fence",
};

function facilityIcon(facility: string): string {
  const lower = facility.toLowerCase();
  for (const key of Object.keys(FACILITY_ICONS)) {
    if (lower.includes(key)) return FACILITY_ICONS[key];
  }
  return "check_circle";
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const [property, similar, company] = await Promise.all([
    getPropertyBySlug(slug),
    getSimilarProperties(slug),
    getCompanyProfile(),
  ]);

  if (!property) {
    notFound();
  }

  const hasValidImage = (img: unknown) => {
    const u = (img as { asset?: { url?: string }; url?: string })?.asset?.url ?? (img as { url?: string })?.url;
    return typeof u === "string" && u.trim() !== "";
  };
  const galleryValid = (property.gallery ?? []).filter(hasValidImage);
  const galleryImages =
    galleryValid.length > 0
      ? galleryValid
      : hasValidImage(property.mainImage)
        ? [property.mainImage as NonNullable<typeof property.mainImage>]
        : [];
  const pricingItems = Array.isArray(property.pricing) ? property.pricing : [];
  const selectedPricingIndex = Number(property.primaryPriceIndex ?? 0);
  const selectedPricing =
    pricingItems.length > 0
      ? pricingItems[Number.isFinite(selectedPricingIndex) && selectedPricingIndex >= 0 && selectedPricingIndex < pricingItems.length
          ? selectedPricingIndex
          : 0]
      : undefined;
  const displayPrice = selectedPricing?.price ? formatPriceWithCurrency(selectedPricing.price, selectedPricing.currency ?? "IDR") : formatPriceWithCurrency(property.price, "IDR");
  const transactionLabel = selectedPricing?.transactionType
    ? selectedPricing.transactionType === "jual"
      ? "Jual"
      : "Sewa"
    : property.transactionType ?? "";
  const pricingEntries = pricingItems.length > 0
    ? pricingItems.map((entry, index) => ({
        ...entry,
        id: `${entry.transactionType ?? "entry"}-${index}`,
        displayTransaction: entry.transactionType === "sewa" ? "Sewa" : entry.transactionType === "jual" ? "Jual" : "Jual",
        displayCurrency: entry.currency ?? "IDR",
        displayPrice: entry.price ? formatPriceWithCurrency(entry.price, entry.currency ?? "IDR") : formatPriceWithCurrency(property.price, "IDR"),
      }))
    : property.price
      ? [{
          id: "fallback",
          transactionType: (property.transactionType ?? "jual").toLowerCase(),
          displayTransaction: property.transactionType === "Sewa" ? "Sewa" : "Jual",
          displayCurrency: "IDR",
          displayPrice: formatPriceWithCurrency(property.price, "IDR"),
          currency: "IDR",
          price: property.price,
          pricePeriod: undefined as string | undefined,
          priceUnit: undefined as string | undefined,
        }]
      : [];
  const specs = property.specs;
  const displaySpecs = normalizePropertySpecs(property);
  const description = portableTextToText(property.description);
  const category =
    typeof property.category === "string" ? property.category : "";
  const waNumber = normalizeWhatsAppNumber(property.contact?.whatsappNumber ?? property.contact?.phoneNumber ?? company?.contactPhone ?? "0894934394");
  const telNumber = property.contact?.phoneNumber ?? company?.contactPhone ?? "0894934394";
  const furnishingText =
    specs?.furnishing ??
    displaySpecs.find((s) => /interior|furnishing|furnished/i.test(s.label))?.value ??
    "Belum diatur";

  const specWrapper = (label: string, value?: string | number, icon?: string) => (
    <SpecRow label={label} value={value} icon={icon} />
  );

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-lg py-md md:py-lg flex flex-col gap-lg">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 font-body-sm text-body-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/properties" className="hover:text-primary transition-colors">Properti</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span aria-current="page" className="text-on-surface font-medium line-clamp-1">
          {property.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          <div className="flex flex-col gap-2">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
              <span>{property.fullAddress ?? property.locationShort ?? "Lokasi"}</span>
            </div>
          </div>

          <div className="relative">
            {property.status && (
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                <span className="bg-secondary text-on-secondary font-label-caps text-label-caps px-3 py-1 rounded-full shadow-sm">
                  {transactionLabel.toUpperCase()}
                </span>
                {category && (
                  <span className="bg-surface/90 backdrop-blur text-primary font-label-caps text-label-caps px-3 py-1 rounded-full shadow-sm border border-outline-variant/30">
                    {category.toUpperCase()}
                  </span>
                )}
              </div>
            )}
            <PropertyGallery images={galleryImages} />
          </div>

          {/* Struktur Harga & Transaksi (dari property.ts) */}
          {pricingEntries.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft flex flex-col gap-md">
              <div className="flex items-center justify-between border-b border-outline-variant/50 pb-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">payments</span>
                  Struktur Harga &amp; Transaksi
                </h2>
                <span className="text-body-sm text-on-surface-variant font-medium">
                  {pricingEntries.length} Opsi Transaksi
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {pricingEntries.map((entry, idx) => {
                  const isPrimary =
                    Number(property.primaryPriceIndex ?? 0) === idx ||
                    (pricingEntries.length === 1 && idx === 0);
                  return (
                    <div
                      key={entry.id}
                      className={`p-md rounded-xl border transition-all ${
                        isPrimary
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-surface-container-low border-outline-variant/50"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-xs">
                        <span className="font-label-caps text-label-caps uppercase px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                          {entry.displayTransaction}
                        </span>
                        {isPrimary && (
                          <span className="text-xs bg-primary text-on-primary px-2.5 py-0.5 rounded-full font-semibold">
                            Harga Utama
                          </span>
                        )}
                      </div>
                      <div className="font-price-display text-xl font-bold text-primary mt-sm">
                        {entry.displayPrice}
                      </div>
                      <div className="mt-xs text-xs text-on-surface-variant flex flex-wrap gap-x-3 gap-y-1 pt-1">
                        {entry.pricePeriod && (
                          <span>
                            Periode: <strong className="text-on-surface">{entry.pricePeriod}</strong>
                          </span>
                        )}
                        {entry.priceUnit && (
                          <span>
                            Unit: <strong className="text-on-surface">{entry.priceUnit}</strong>
                          </span>
                        )}
                        {entry.currency && (
                          <span>
                            Mata Uang: <strong className="text-on-surface">{entry.currency}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Specification Table */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Spesifikasi Properti</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-sm gap-x-lg">
              {displaySpecs.length > 0 ? (
                displaySpecs.map((s, i) => (
                  <SpecRow key={`${s.label}-${i}`} label={s.label} value={s.value} icon={s.icon} />
                ))
              ) : (
                <>
                  {specWrapper("Tipe Properti", category, "domain")}
                  {specWrapper("Sertifikat", specs?.certificate, "verified_user")}
                  {specWrapper(
                    "Luas Tanah",
                    specs?.landArea ? specs.landArea.toLocaleString("id-ID") + " m²" : undefined,
                    "landscape",
                  )}
                  {specWrapper(
                    "Luas Bangunan",
                    specs?.buildingArea ? specs.buildingArea.toLocaleString("id-ID") + " m²" : undefined,
                    "foundation",
                  )}
                  {specWrapper("Kamar Tidur", specs?.bedrooms, "king_bed")}
                  {specWrapper("Kamar Mandi", specs?.bathrooms, "bathtub")}
                  {specWrapper("Jumlah Lantai", specs?.floors ? specs.floors + " Lantai" : undefined, "stairs")}
                  {specWrapper("Daya Listrik", specs?.electricity, "bolt")}
                  {specWrapper("Garasi / Carport", specs?.carport, "garage")}
                  {specWrapper("Hadap", specs?.orientation, "explore")}
                </>
              )}
            </div>
          </div>

          {/* Description & Facilities */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Deskripsi Properti</h2>
            <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed space-y-4">
              {description ? (
                description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>Deskripsi properti belum tersedia.</p>
              )}
            </div>

            {property.facilities && property.facilities.length > 0 && (
              <div className="mt-xl pt-lg border-t border-outline-variant/40">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">verified</span>
                  Fasilitas Utama
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                  {property.facilities.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md shadow-xs hover:border-primary/40 transition-colors"
                    >
                      <span className="material-symbols-outlined text-primary text-[22px]">
                        {facilityIcon(f)}
                      </span>
                      <span className="font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-xl rounded-2xl border border-primary/15 bg-primary/5 p-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
                Kelengkapan Unit
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Kondisi properti ini adalah <span className="font-semibold text-primary">{furnishingText}</span>. Unit tersedia dengan kebutuhan tinggal yang sesuai dengan pilihan Anda, baik untuk hunian pribadi maupun kebutuhan investasi.
              </p>
            </div>
          </div>

          {/* Location / Full Address */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Alamat Lengkap</h2>
            <p className="text-on-surface-variant font-body-md text-body-md leading-relaxed whitespace-pre-line">
              {property.fullAddress ?? property.locationShort ?? "Alamat lengkap belum tersedia."}
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-lg relative">
          <div className="sticky top-[100px] flex flex-col gap-lg">
            {/* Pricing & CTAs */}
            <div className="bg-surface-container-lowest rounded-xl p-md border-t-4 border-t-primary border-x border-b border-outline-variant shadow-soft">
              <div className="mb-sm">
                <p className="text-on-surface-variant font-body-sm text-body-sm">Harga Penawaran</p>
                <h2 className="font-price-display text-price-display text-primary mt-1">
                  {displayPrice ?? "Hubungi Kami"}
                </h2>
                {transactionLabel && (
                  <p className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {transactionLabel}
                  </p>
                )}
                <p className="text-on-surface-variant font-body-sm text-body-sm mt-1">
                  Status:{" "}
                  <span className="text-primary font-semibold flex items-center inline-flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" /> {property.status ?? "Tersedia"}
                  </span>
                </p>
                {selectedPricing && (
                  <div className="mt-3 space-y-2 border-t border-outline-variant/50 pt-3">
                    <PriceMetaBadge label="Tipe Transaksi" value={transactionLabel || (selectedPricing.transactionType === "sewa" ? "Sewa" : "Jual")} />
                    <PriceMetaBadge label="Mata Uang" value={selectedPricing.currency ?? "IDR"} />
                    <PriceMetaBadge label="Periode Harga" value={selectedPricing.pricePeriod || "-"} />
                    <PriceMetaBadge label="Unit Harga" value={selectedPricing.priceUnit || "-"} />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 mt-lg">
                <a
                  href="#property-inquiry-form"
                  className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-body-md text-body-md font-semibold rounded-full hover:bg-[#20b75a] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    chat
                  </span>
                  Chat WhatsApp
                </a>
                <a
                  href={telNumber ? `tel:${telNumber}` : "#"}
                  className="w-full flex justify-center items-center gap-2 px-6 py-3 border-2 border-primary text-primary font-body-md text-body-md font-semibold rounded-full hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined">call</span>
                  Telepon Sekarang
                </a>
                <CopyLinkButton />
              </div>
            </div>

            {/* Centralized Contact */}
            <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft">
              <div className="flex items-center gap-3 mb-md pb-md border-b border-outline-variant/50">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                  <span className="material-symbols-outlined text-[28px]">domain</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-primary">
                    {company?.companyName ?? "Green Property"}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Corporate Agency</p>
                </div>
              </div>

              <PropertyInquiryForm
                propertyTitle={property.title ?? "properti ini"}
                waNumber={waNumber}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Similar Properties */}
      {similar.length > 0 && (
        <section className="mt-xl border-t border-outline-variant/50 pt-xl">
          <div className="flex justify-between items-end mb-lg">
            <div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Properti Serupa
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                Properti lain yang mungkin Anda minati.
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden md:inline-block font-body-sm text-body-sm text-primary font-semibold hover:underline"
            >
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {similar.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
