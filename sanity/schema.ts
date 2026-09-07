import type { SchemaTypeDefinition } from "sanity";
import { companyProfile } from "./schemas/companyProfile";
import property from "./schemas/property";
import { category } from "./schemas/category";
import { contact } from "./schemas/contact";

export const schemaTypes: SchemaTypeDefinition[] = [
  companyProfile,
  category,
  contact,
  property,
];
