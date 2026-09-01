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
  status,
  locationShort,
  fullAddress,
  isFeatured,
  mainImage{asset->{url},url,alt},
  gallery[]{asset->{url},url,alt},
  specs,
  facilities
} | order(_createdAt desc)`;

const PROPERTY_BY_SLUG_QUERY = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category,
  transactionType,
  price,
  status,
  locationShort,
  fullAddress,
  isFeatured,
  mainImage{asset->{url},url,alt},
  gallery[]{asset->{url},url,alt},
  specs,
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
  status,
  locationShort,
  isFeatured,
  mainImage{asset->{url},url,alt},
  specs
}`;

const COMPANY_QUERY = groq`*[_type == "companyProfile"][0]{
  _id,
  title,
  companyName,
  logo{asset->{url},url,alt},
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
export function imageUrl(image?: SanityImage): string | null {
  return image?.asset?.url ?? image?.url ?? null;
}

/** Format a numeric price into an Indonesian Rupiah "Rp ..." string. */
export function formatPrice(price?: number): string | null {
  if (!price || price <= 0) return null;
  return "Rp " + price.toLocaleString("id-ID");
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
