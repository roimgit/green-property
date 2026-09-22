/**
 * Sanity Studio configuration.
 * Embedded in the Next.js app at /studio.
 */
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schema";
import type { StructureBuilder } from "sanity/structure";
import { icons } from "@sanity/icons";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Ikon per menu agar tidak monoton.
const MENU_ICONS: Record<string, React.ComponentType> = {
  companyProfile: icons.cog,
  property: icons.cube,
  category: icons.tag,
  contact: icons.users,
};

const withIcons = (S: StructureBuilder) =>
  S.documentTypeListItems().map((item) => {
    const id = item.getId() ?? "";
    const Icon = MENU_ICONS[id];
    return Icon ? item.icon(Icon) : item;
  });

export default defineConfig({
  name: "green-property",
  title: "Green Property Studio",
  projectId,
  dataset,
  basePath: "/studio",
  releases: {
    enabled: false,
  },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items(withIcons(S).filter((x) => x !== null)),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
