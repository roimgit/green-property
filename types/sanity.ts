/**
 * Shared TypeScript types that mirror the Sanity schemas.
 * Kept loose around optional CMS fields.
 */

export type Category = "Land" | "Factory" | "Residence" | "Apartment";
export type TransactionType = "Jual" | "Sewa";
export type PropertyStatus = "Tersedia" | "Under Offer" | "Terjual";

export interface SanityImageCrop {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface SanityImage {
  _type?: "image";
  asset?: {
    url?: string;
    metadata?: { dimensions?: { width?: number; height?: number } };
  };
  alt?: string;
  url?: string;
  crop?: SanityImageCrop;
  hotspot?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface PropertySpecs {
  certificate?: string;
  landArea?: number;
  buildingArea?: number;
  furnishing?: string;
  bedrooms?: string;
  bathrooms?: string;
  floors?: number;
  electricity?: string;
  carport?: string;
  orientation?: string;
}

export interface PricingEntry {
  transactionType?: "jual" | "sewa";
  currency?: string;
  price?: number;
  pricePeriod?: string;
  priceUnit?: string;
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
  pricing?: PricingEntry[];
  primaryPriceIndex?: number | string;
  status?: PropertyStatus;
  locationShort?: string;
  fullAddress?: string;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  specs?: PropertySpecs;
  contact?: {
    _id?: string;
    name?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    whatsappLink?: string;
    kakaoTalkNumber?: string;
    kakaoTalkLink?: string;
    email?: string;
  };
  description?: PortableTextBlock[];
  facilities?: string[];
  isFeatured?: boolean;
}

export interface OperationalHours {
  weekdays?: string;
  weekend?: string;
  weekend2?: string;
}

export interface TabBrowserLogo {
  mode?: "companyLogo" | "custom";
  image?: SanityImage;
}

export interface CompanyProfile {
  _id: string;
  _type: "companyProfile";
  title?: string;
  companyName?: string;
  logo?: SanityImage;
  tabLogo?: TabBrowserLogo;
  heroImage?: SanityImage;
  description?: PortableTextBlock[];
  vision?: string;
  mission?: string[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  operationalHours?: OperationalHours;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
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
