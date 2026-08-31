import type { SchemaTypeDefinition } from "sanity";
import { companyProfile } from "./schemas/companyProfile";
import { testimonial } from "./schemas/testimonial";
import { partnerLogo } from "./schemas/partnerLogo";
import { service } from "./schemas/service";
import property from "./schemas/property";

export const schemaTypes: SchemaTypeDefinition[] = [
  companyProfile,
  testimonial,
  partnerLogo,
  service,
  property
];
