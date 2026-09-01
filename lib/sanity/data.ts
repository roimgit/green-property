import { sanityFetch, groq } from "@/lib/sanity/client";
import type {
  Property,
  CompanyProfile,
  PartnerLogo,
  Testimonial,
  Contact,
  Service,
  SanityImage,
} from "@/types/sanity";

const PROPERTY_LIST_QUERY = groq`*[_type == "property"]{
  _id,
  title,
  slug,
  category,
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
  contact->{_id,name,phoneNumber,whatsappNumber,whatsappLink,kakaoTalkNumber,kakaoTalkLink,email},
  facilities
} | order(_createdAt desc)`;

const PROPERTY_BY_SLUG_QUERY = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category,
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
  contact->{_id,name,phoneNumber,whatsappNumber,whatsappLink,kakaoTalkNumber,kakaoTalkLink,email},
  facilities,
  description
}`;

const SIMILAR_PROPERTIES_QUERY = groq`*[_type == "property" && slug.current != $slug][0...3]{
  _id,
  title,
  slug,
  category,
  transactionType,
  price,
  pricing,
  primaryPriceIndex,
  status,
  locationShort,
  isFeatured,
  mainImage{asset->{url},url,alt},
  specs,
  contact->{_id,name,phoneNumber,whatsappNumber,whatsappLink,kakaoTalkNumber,kakaoTalkLink,email}
}`;

const COMPANY_QUERY = groq`*[_type == "companyProfile"][0]{
  _id,
  title,
  companyName,
  logo{asset->{url,metadata{dimensions{width,height}}},url,alt},
  tabLogo{mode,image{asset->{url,metadata{dimensions{width,height}}},url,alt,crop,hotspot}},
  heroImage{asset->{url},url,alt},
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

/** Normalize a contact number to WhatsApp-ready Indonesia format (e.g. 0812... -> 62812...). */
export function normalizeWhatsAppNumber(number?: string | null): string {
  const digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;

  return digits;
}

/** Convert Sanity portable text blocks into a plain text string. */
export function portableTextToText(blocks?: Array<{ children?: Array<{ text?: string }> }>): string {
  if (!blocks) return "";
  return blocks
    .map((block) => (block.children ?? []).map((c) => c.text ?? "").join(""))
    .join("\n\n");
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
