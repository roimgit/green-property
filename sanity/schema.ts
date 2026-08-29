import type { SchemaTypeDefinition } from "sanity";
import { companyProfile } from "./schemas/companyProfile";
import { testimonial } from "./schemas/testimonial";
import { partnerLogo } from "./schemas/partnerLogo";

export const schemaTypes: SchemaTypeDefinition[] = [
  companyProfile,
  testimonial,
  partnerLogo,
];
