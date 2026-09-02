import { sanityFetch, groq } from "@/lib/sanity/client";
import type {
  Property,
  PricingEntry,
  CompanyProfile,
  OperationalHours,
  PartnerLogo,
  Testimonial,
  TestimonialSettings,
  Contact,
  Service,
  SanityImage,
} from "@/types/sanity";

const PROPERTY_LIST_QUERY = groq`*[_type == "property"]{
  _id,
  title,
  slug,
  "category": coalesce(category->title, category),
  transactionType,
  price,
  pricing,
  primaryPriceIndex,
  status,
  locationShort,
  fullAddress,
  isFeatured,
  mainImage{asset->{url},url,alt},
  gallery[]{asset->{url},url,alt},
  specs,
  specsList,
  contact->{_id,name,jabatan,phoneNumber,whatsappNumber,whatsappLink,kakaoTalkNumber,kakaoTalkLink,email},
  facilities
} | order(_createdAt desc)`;

const PROPERTY_BY_SLUG_QUERY = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  "category": coalesce(category->title, category),
  transactionType,
  price,
  pricing,
  primaryPriceIndex,
  status,
  locationShort,
  fullAddress,
  isFeatured,
  mainImage{asset->{url},url,alt},
  gallery[]{asset->{url},url,alt},
  specs,
  specsList,
  contact->{_id,name,jabatan,phoneNumber,whatsappNumber,whatsappLink,kakaoTalkNumber,kakaoTalkLink,email},
  facilities,
  description
}`;

const SIMILAR_PROPERTIES_QUERY = groq`*[_type == "property" && slug.current != $slug][0...3]{
  _id,
  title,
  slug,
  "category": coalesce(category->title, category),
  transactionType,
  price,
  pricing,
  primaryPriceIndex,
  status,
  locationShort,
  isFeatured,
  mainImage{asset->{url},url,alt},
  specs,
  specsList,
  contact->{_id,name,jabatan,phoneNumber,whatsappNumber,whatsappLink,kakaoTalkNumber,kakaoTalkLink,email}
}`;

const COMPANY_QUERY = groq`*[_type == "companyProfile"][0]{
  _id,
  title,
  companyName,
  logo{asset->{url,metadata{dimensions{width,height}}},url,alt},
  tabLogo{mode,image{asset->{url,metadata{dimensions{width,height}}},url,alt,crop,hotspot}},
  heroBanner{
    image{asset->{url},url,crop,hotspot,alt},
    heading,
    description,
    links
  },
  description,
  vision,
  mission,
  contactEmail,
  contactPhone,
  address,
  operationalHours,
  googleMapsUrl,
  latitude,
  longitude
}`;

const LOGOS_QUERY = groq`*[_type == "partnerLogo"]{
  _id,
  namaPerusahaan,
  logo{asset->{url},url,alt},
  urutanTampil,
  url
} | order(urutanTampil asc)`;

const TESTIMONIALS_QUERY = groq`*[_type == "testimonial"]{
  _id,
  nama,
  rating,
  kutipan,
  jabatan,
  photo{asset->{url},url,alt},
  urutanTampil
} | order(urutanTampil asc)`;

const CONTACTS_QUERY = groq`*[_type == "contact"]{
  _id,
  name,
  jabatan,
  phoneNumber,
  whatsappNumber,
  whatsappLink,
  kakaoTalkNumber,
  kakaoTalkLink,
  email
}`;

const SERVICES_QUERY = groq`*[_type == "service"]{
  _id,
  title,
  icon,
  desc,
  url,
  urutanTampil
} | order(urutanTampil asc)`;

const CATEGORIES_QUERY = groq`*[_type == "category"]{
  _id,
  title,
  slug
} | order(title asc)`;

const TESTIMONIAL_SETTINGS_QUERY = groq`*[_type == "testimonialSettings"][0]{
  _id,
  title,
  source,
  googleMapsUrl,
  googlePlaceId,
  maxReviews,
  hideIfEmpty
}`;

/** Extract a usable image URL from a Sanity image field. */
export function imageUrl(image?: SanityImage | null): string | null {
  return image?.asset?.url ?? image?.url ?? null;
}

/**
 * Build a square, center-cropped CDN URL that respects the crop the admin set in
 * Sanity Studio (crop rect + fitted to a square favicon canvas). Falls back to a
 * plain center crop when no crop/metadata is stored.
 */
export function croppedImageUrl(
  image?: SanityImage | null,
  size = 128,
): string | null {
  const base = imageUrl(image);
  if (!base) return null;

  const crop = image?.crop;
  const dims = image?.asset?.metadata?.dimensions;

  if (crop && dims?.width && dims?.height) {
    const x = Math.round(crop.left * dims.width);
    const y = Math.round(crop.top * dims.height);
    const w = Math.round(dims.width - (crop.left + crop.right) * dims.width);
    const h = Math.round(dims.height - (crop.top + crop.bottom) * dims.height);
    return `${base}?rect=${x},${y},${w},${h}&w=${size}&h=${size}&fit=crop`;
  }

  return `${base}?w=${size}&h=${size}&fit=crop`;
}

/** Resolve the browser-tab favicon source: separate upload when mode is
 *  "custom", otherwise the company logo as fallback. */
export function tabLogoImage(profile: CompanyProfile | null): SanityImage | null {
  const tab = profile?.tabLogo;
  if (tab?.mode === "custom") return tab.image ?? null;
  return profile?.logo ?? null;
}

/** Format a numeric price into an Indonesian Rupiah "Rp ..." string. */
export function formatPrice(price?: number): string | null {
  if (!price || price <= 0) return null;
  return "Rp " + price.toLocaleString("id-ID");
}

/** Format price with flexible currency support (USD, IDR, EUR, etc.) */
export function formatPriceWithCurrency(price?: number, currency?: string): string | null {
  if (!price || price <= 0) return null;
  const curr = (currency ?? "IDR").toUpperCase();
  
  if (curr === "USD" || curr === "US$") {
    return "$" + price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  if (curr === "IDR" || curr === "RP") {
    return "Rp " + price.toLocaleString("id-ID");
  }
  if (curr === "EUR" || curr === "€") {
    return "€" + price.toLocaleString("de-DE", { maximumFractionDigits: 0 });
  }
  return `${curr} ${price.toLocaleString("id-ID")}`;
}

/**
 * Get the primary pricing entry of a property based on sanity schema rules:
 * - If pricing array has 1 item, return that item.
 * - If pricing array has > 1 items, return item at primaryPriceIndex.
 * - If pricing array is empty/missing, fallback to root price.
 */
export function getPrimaryPricingEntry(property: Property): PricingEntry | null {
  const pricing = property.pricing;
  if (Array.isArray(pricing) && pricing.length > 0) {
    if (pricing.length === 1) {
      return pricing[0];
    }
    const idx = Number(property.primaryPriceIndex);
    if (!Number.isNaN(idx) && idx >= 0 && idx < pricing.length) {
      return pricing[idx];
    }
    return pricing[0];
  }
  if (property.price && property.price > 0) {
    return {
      price: property.price,
      currency: "IDR",
      transactionType: (property.transactionType ?? "jual").toLowerCase() as "jual" | "sewa",
    };
  }
  return null;
}

/**
 * Get numerical price amount of the primary price for sorting and range filtering.
 */
export function getPrimaryPriceAmount(property: Property): number {
  const entry = getPrimaryPricingEntry(property);
  if (entry?.price && entry.price > 0) return entry.price;
  if (property.price && property.price > 0) return property.price;
  return 0;
}

/**
 * Format primary price with currency, period (e.g. / thn, / bln), and unit for display.
 */
export function getPrimaryPriceDisplay(property: Property): string | null {
  const entry = getPrimaryPricingEntry(property);
  if (!entry || !entry.price || entry.price <= 0) {
    if (property.price && property.price > 0) {
      return formatPriceWithCurrency(property.price, "IDR");
    }
    return null;
  }

  const basePrice = formatPriceWithCurrency(entry.price, entry.currency ?? "IDR");
  if (!basePrice) return null;

  let suffix = "";
  if (entry.pricePeriod) {
    const periodMap: Record<string, string> = {
      year: " / thn",
      month: " / bln",
      day: " / hr",
      once: "",
    };
    suffix += periodMap[entry.pricePeriod] ?? ` / ${entry.pricePeriod}`;
  }

  if (entry.priceUnit) {
    suffix += ` (${entry.priceUnit})`;
  }

  return `${basePrice}${suffix}`;
}

/**
 * Format a single PricingEntry object from property.ts pricing array into a human readable string.
 * Example output:
 * - "Jual: Rp 1.500.000.000"
 * - "Sewa: Rp 50.000.000 / thn (Per Hektar)"
 */
export function formatPricingEntry(entry: PricingEntry): string {
  const txLabel = entry.transactionType?.toLowerCase() === "sewa" ? "Sewa" : "Jual";
  const formattedPrice = entry.price
    ? formatPriceWithCurrency(entry.price, entry.currency ?? "IDR")
    : null;

  if (!formattedPrice) return `${txLabel}: Harga belum diatur`;

  let periodStr = "";
  if (entry.pricePeriod) {
    const periodMap: Record<string, string> = {
      year: " / thn",
      month: " / bln",
      day: " / hr",
      once: "",
    };
    periodStr = periodMap[entry.pricePeriod] ?? ` / ${entry.pricePeriod}`;
  }

  let unitStr = "";
  if (entry.priceUnit && entry.priceUnit.trim()) {
    unitStr = ` (${entry.priceUnit.trim()})`;
  }

  return `${txLabel}: ${formattedPrice}${periodStr}${unitStr}`;
}

/** Normalize a contact number to WhatsApp-ready Indonesia format (e.g. 0812... -> 62812...). */
export function normalizeWhatsAppNumber(number?: string | null): string {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;

  return digits;
}

/** Convert Sanity portable text blocks or string into a plain text string. */
export function portableTextToText(blocks?: unknown): string {
  if (!blocks) return "";
  if (typeof blocks === "string") return blocks;
  if (Array.isArray(blocks)) {
    return blocks
      .map((block) => {
        if (typeof block === "string") return block;
        if (typeof block === "object" && block !== null) {
          const children = (block as { children?: Array<{ text?: string }> }).children;
          if (Array.isArray(children)) {
            return children
              .map((c) => (typeof c === "object" && c !== null ? c.text ?? "" : String(c)))
              .join("");
          }
          if ("text" in block && typeof (block as { text?: unknown }).text === "string") {
            return (block as { text: string }).text;
          }
        }
        return "";
      })
      .filter(Boolean)
      .join("\n\n");
  }
  return "";
}

export async function getPropertyList(): Promise<Property[]> {
  try {
    return await sanityFetch<Property[]>(PROPERTY_LIST_QUERY);
  } catch {
    return [];
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    return (await sanityFetch<Property | null>(PROPERTY_BY_SLUG_QUERY, { slug })) ?? null;
  } catch {
    return null;
  }
}

export async function getSimilarProperties(slug: string): Promise<Property[]> {
  try {
    return await sanityFetch<Property[]>(SIMILAR_PROPERTIES_QUERY, { slug });
  } catch {
    return [];
  }
}

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  try {
    return (await sanityFetch<CompanyProfile | null>(COMPANY_QUERY)) ?? null;
  } catch {
    return null;
  }
}

/** Utility to format operational hours for display. Smartly groups consecutive days with identical hours while displaying custom individual days. */
export function getFormattedOperationalHours(hours?: OperationalHours | null): Array<{ label: string; value: string }> {
  if (!hours) {
    return [
      { label: "Senin - Jumat", value: "08:00 - 17:00" },
      { label: "Sabtu", value: "08:00 - 12:00" },
      { label: "Minggu", value: "Tutup" },
    ];
  }

  const DAY_KEYS = [
    { key: "monday", name: "Senin" },
    { key: "tuesday", name: "Selasa" },
    { key: "wednesday", name: "Rabu" },
    { key: "thursday", name: "Kamis" },
    { key: "friday", name: "Jumat" },
    { key: "saturday", name: "Sabtu" },
    { key: "sunday", name: "Minggu" },
  ] as const;

  const filledDays: Array<{ name: string; value: string }> = [];
  for (const d of DAY_KEYS) {
    const val = hours[d.key as keyof OperationalHours];
    if (typeof val === "string" && val.trim().length > 0) {
      filledDays.push({ name: d.name, value: val.trim() });
    }
  }

  if (filledDays.length > 0) {
    const result: Array<{ label: string; value: string }> = [];
    let i = 0;
    while (i < filledDays.length) {
      let j = i;
      while (j + 1 < filledDays.length && filledDays[j + 1].value === filledDays[i].value) {
        j++;
      }

      let label = "";
      if (i === j) {
        label = filledDays[i].name;
      } else {
        label = `${filledDays[i].name} - ${filledDays[j].name}`;
      }
      result.push({ label, value: filledDays[i].value });
      i = j + 1;
    }
    return result;
  }

  // Fallback to legacy fields (weekdays, weekend, weekend2)
  return [
    { label: "Senin - Jumat", value: hours.weekdays ?? "08:00 - 17:00" },
    { label: "Sabtu", value: hours.weekend ?? "08:00 - 12:00" },
    { label: "Minggu", value: hours.weekend2 ?? "Tutup" },
  ].filter((item) => Boolean(item.value && item.value.trim().length > 0));
}

export async function getPartnerLogos(): Promise<PartnerLogo[]> {
  try {
    return await sanityFetch<PartnerLogo[]>(LOGOS_QUERY);
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await sanityFetch<Testimonial[]>(TESTIMONIALS_QUERY);
  } catch {
    return [];
  }
}

export async function getTestimonialSettings(): Promise<TestimonialSettings | null> {
  try {
    return (await sanityFetch<TestimonialSettings | null>(TESTIMONIAL_SETTINGS_QUERY)) ?? null;
  } catch {
    return null;
  }
}

/** Extract Place ID dari URL Google Maps jika admin tidak mengisi field googlePlaceId. */
function extractPlaceIdFromUrl(url?: string | null): string | null {
  if (!url) return null;
  // Pola ?place_id=ChIJ... atau &place_id=...
  const m1 = url.match(/[?&]place_id=([^&]+)/i);
  if (m1) return decodeURIComponent(m1[1]);
  // Pola /place/.../data=...!1s0x...:0x... (hex place id kadang dalam data)
  // fallback: cari ChIJ... (27+ char)
  const m2 = url.match(/(ChIJ[0-9A-Za-z_-]{20,})/);
  if (m2) return m2[1];
  return null;
}

interface GoogleReview {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
  profile_photo_url?: string;
  time?: number;
}

/** Ambil reviews dari Google Places API (classic). Kembalikan array Testimonial yang kompatibel. */
async function fetchGoogleReviews(placeId: string, maxReviews = 6): Promise<Testimonial[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.warn("[testimonials] GOOGLE_PLACES_API_KEY belum diset, skip Google Reviews");
    return [];
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=reviews,rating,user_ratings_total&key=${encodeURIComponent(apiKey)}&language=id`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { status?: string; result?: { reviews?: GoogleReview[] } };
    if (json.status !== "OK" || !json.result?.reviews) return [];
    const reviews = json.result.reviews.slice(0, maxReviews);
    return reviews.map((r, idx) => ({
      _id: `google-${placeId}-${r.time ?? idx}`,
      nama: r.author_name ?? "Google User",
      rating: typeof r.rating === "number" ? r.rating : 5,
      kutipan: r.text ?? "",
      jabatan: r.relative_time_description ? `Google Reviews · ${r.relative_time_description}` : "Google Reviews",
      photo: r.profile_photo_url ? ({ url: r.profile_photo_url } as SanityImage) : undefined,
      urutanTampil: idx,
    }));
  } catch {
    return [];
  }
}

/** Pilihan admin: ambil testimoni dari Sanity manual ATAU Google Maps. Jika sumber=google tapi gagal/kosong, kembalikan [] agar section hide (opsional). */
export async function getEffectiveTestimonials(): Promise<Testimonial[]> {
  const settings = await getTestimonialSettings();
  // default manual jika belum ada dokumen pengaturan
  if (settings?.source === "google") {
    const placeId = (settings.googlePlaceId?.trim() || extractPlaceIdFromUrl(settings.googleMapsUrl) || "").trim();
    if (!placeId) return [];
    const google = await fetchGoogleReviews(placeId, settings.maxReviews ?? 6);
    return google;
  }
  return getTestimonials();
}

export async function getContacts(): Promise<Contact[]> {
  try {
    return await sanityFetch<Contact[]>(CONTACTS_QUERY);
  } catch {
    return [];
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    return await sanityFetch<Service[]>(SERVICES_QUERY);
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const list = await sanityFetch<Array<{ title?: string }>>(CATEGORIES_QUERY);
    return list.map((c) => c.title).filter((t): t is string => Boolean(t));
  } catch {
    return [];
  }
}

/**
 * Extract all unique transaction types ("Jual", "Sewa") available for a property.
 * If a property has both Jual and Sewa pricing entries, returns ["Jual", "Sewa"].
 */
export function getTransactionTypes(property: Property): string[] {
  const typesSet = new Set<string>();

  if (Array.isArray(property.pricing) && property.pricing.length > 0) {
    property.pricing.forEach((entry) => {
      if (entry.transactionType) {
        const normalized = entry.transactionType.toLowerCase() === "sewa" ? "Sewa" : "Jual";
        typesSet.add(normalized);
      }
    });
  }

  if (typesSet.size === 0 && property.transactionType) {
    const normalized = property.transactionType.toLowerCase() === "sewa" ? "Sewa" : "Jual";
    typesSet.add(normalized);
  }

  if (typesSet.size === 0) {
    typesSet.add("Jual");
  }

  return Array.from(typesSet);
}
