import type { SchemaTypeDefinition } from "sanity";
import { companyProfile } from "./schemas/companyProfile";
import { testimonial } from "./schemas/testimonial";
import { partnerLogo } from "./schemas/partnerLogo";
import property from "./schemas/property";
import { category } from "./schemas/category";
import { contact } from "./schemas/contact";

export const schemaTypes: SchemaTypeDefinition[] = [
  companyProfile,
  testimonial,
  partnerLogo,
  category,
  contact,
  property
];
