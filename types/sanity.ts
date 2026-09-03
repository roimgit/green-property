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

export interface PropertySpecItem {
  label?: string;
  value?: string;
  icon?: string;
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
  specsList?: PropertySpecItem[];
}

export interface PricingEntry {
  transactionType?: "jual" | "sewa";
  /** Legacy: currency per harga (input sudah dihapus dari Studio). Tampilan memakai Mata Uang Default properti. */
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
  defaultCurrency?: string;
  pricing?: PricingEntry[];
  primaryPriceIndex?: number | string;
  status?: PropertyStatus;
  locationShort?: string;
  fullAddress?: string;
  googleMapsUrl?: string;
  latitude?: number;
  longitude?: number;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  specs?: PropertySpecs;
  specsList?: PropertySpecItem[];
  contact?: {
    _id?: string;
    name?: string;
    jabatan?: string;
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
  kprAvailable?: boolean;
  kprDownPaymentPercent?: number;
  kprInterestRate?: number;
  kprMaxTenorYears?: number;
  kprNotes?: string;
}

export interface OperationalHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  weekdays?: string;
  weekend?: string;
  weekend2?: string;
}

export interface TabBrowserLogo {
  mode?: "companyLogo" | "custom";
  image?: SanityImage;
}

export interface HeroBanner {
  image?: SanityImage;
  heading?: string;
  description?: string;
}

export interface CtaBanner {
  heading?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
}

export interface CompanyProfile {
  _id: string;
  _type: "companyProfile";
  title?: string;
  companyName?: string;
  primaryColor?: string;
  logo?: SanityImage;
  tabLogo?: TabBrowserLogo;
  heroBanner?: HeroBanner;
  ctaBanner?: CtaBanner;
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
  keteranganKerjasama?: PortableTextBlock[];
  testimoni?: string;
  testimoniPenulis?: string;
  dokumentasi?: SanityImage[];
}

export interface Testimonial {
  _id: string;
  nama?: string;
  rating?: number;
  kutipan?: string;
  jabatan?: string;
  photo?: SanityImage;
  urutanTampil?: number;
  videoLabel?: string;
  videoUrl?: string;
}

export interface TestimonialSettings {
  _id: string;
  _type: "testimonialSettings";
  title?: string;
  hideIfEmpty?: boolean;
  manualTestimonials?: Array<{
    _key?: string;
    nama?: string;
    rating?: number;
    kutipan?: string;
    jabatan?: string;
    photo?: SanityImage;
    videoLabel?: string;
    videoUrl?: string;
  }>;
}

export interface Service {
  _id: string;
  _type: "service";
  title?: string;
  icon?: string;
  subtitle?: string;
  // Legacy docs menyimpan string, docs baru menyimpan PortableText array
  desc?: string | PortableTextBlock[];
  url?: string;
  urutanTampil?: number;
}

export interface KerjasamaButton {
  label?: string;
  linkType?: "internal" | "external";
  href?: string;
  icon?: string;
}

export interface KerjasamaPoint {
  icon?: string;
  title?: string;
  desc?: string;
}

export interface KerjasamaSettings {
  _id: string;
  _type: "kerjasamaSettings";
  title?: string;
  heroBadge?: string;
  heroHeading?: PortableTextBlock[];
  heroDescription?: string;
  heroButtons?: KerjasamaButton[];
  points?: KerjasamaPoint[];
  ctaHeading?: string;
  ctaDescription?: string;
  ctaButtonLabel?: string;
  ctaButtonHref?: string;
}

export interface Contact {
  _id: string;
  _type: "contact";
  name?: string;
  jabatan?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  whatsappLink?: string;
  kakaoTalkNumber?: string;
  kakaoTalkLink?: string;
  email?: string;
}

export interface SiteSettings {
  _id: string;
  _type: "siteSettings";
  title?: string;
  primaryColor?: string;
}
