/**
 * Shared TypeScript types that mirror the Sanity schemas.
 * Kept loose around optional CMS fields.
 */

export type Category = "Land" | "Factory" | "Residence" | "Apartment";
export type TransactionType = "Jual" | "Sewa";
export type PropertyStatus = "Tersedia" | "Under Offer" | "Terjual";

export interface SanityImage {
  _type?: "image";
  asset?: {
    url?: string;
  };
  alt?: string;
  url?: string;
}

export interface PropertySpecs {
  certificate?: string;
  landArea?: number;
  buildingArea?: number;
  bedrooms?: string;
  bathrooms?: string;
  floors?: number;
  electricity?: string;
  carport?: string;
  orientation?: string;
}

export interface PortableTextBlock {
  _type: "block";
  style?: string;
  _key?: string;
  children?: Array<{
    _type: "span";
    text?: string;
    _key?: string;
  }>;
  markDefs?: unknown[];
  listItem?: string;
}

export interface Property {
  _id: string;
  _type: "property";
  title?: string;
  slug?: { current?: string };
  category?: Category;
  transactionType?: TransactionType;
  price?: number;
  status?: PropertyStatus;
  locationShort?: string;
  fullAddress?: string;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  specs?: PropertySpecs;
  description?: PortableTextBlock[];
  facilities?: string[];
  isFeatured?: boolean;
}

export interface CompanyProfile {
  _id: string;
  _type: "companyProfile";
  title?: string;
  companyName?: string;
  logo?: SanityImage;
  heroImage?: SanityImage;
  description?: PortableTextBlock[];
  vision?: string;
  mission?: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export interface PartnerLogo {
  _id: string;
  namaPerusahaan?: string;
  logo?: SanityImage;
  urutanTampil?: number;
  url?: string;
}

export interface Testimonial {
  _id: string;
  nama?: string;
  rating?: number;
  kutipan?: string;
  jabatan?: string;
  photo?: SanityImage;
  urutanTampil?: number;
}

export interface Service {
  _id: string;
  _type: "service";
  title?: string;
  icon?: string;
  desc?: string;
  url?: string;
  urutanTampil?: number;
}

export interface Contact {
  _id: string;
  _type: "contact";
  name?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  whatsappLink?: string;
  kakaoTalkNumber?: string;
  kakaoTalkLink?: string;
  email?: string;
}
