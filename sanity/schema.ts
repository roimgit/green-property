import type { SchemaTypeDefinition } from "sanity";
import { companyProfile } from "./schemas/companyProfile";
import { testimonialSettings } from "./schemas/testimonialSettings";
import { testimonial } from "./schemas/testimonial";
import { kerjasamaSettings } from "./schemas/kerjasamaSettings";
import { partnerLogo } from "./schemas/partnerLogo";
import { service } from "./schemas/service";
import property from "./schemas/property";
import { category } from "./schemas/category";
import { contact } from "./schemas/contact";

export const schemaTypes: SchemaTypeDefinition[] = [
  companyProfile,
  testimonialSettings,
  testimonial,
  kerjasamaSettings,
  partnerLogo,
  service,
  category,
  contact,
  property,
];
