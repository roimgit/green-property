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
  service: icons.component,
  contact: icons.users,
  partnerLogo: icons["ok-hand"],
  testimonial: icons.comment,
  testimonialSettings: icons.comment,
  kerjasamaSettings: icons.cog,
};

// Satu menu "Kerjasama" berisi dua bagian: Pengaturan (singleton) & Daftar Mitra.
const kerjasamaStructure = (S: StructureBuilder) =>
  S.listItem()
    .title("Kerjasama")
    .icon(icons["ok-hand"])
    .child(
      S.list()
        .title("Kerjasama")
        .items([
          S.listItem()
            .title("Pengaturan Kerjasama")
            .icon(icons.cog)
            .id("kerjasamaSettings")
            .schemaType("kerjasamaSettings")
            .child(S.editor().id("kerjasamaSettings-edit").schemaType("kerjasamaSettings").documentId("ibcbYQ95LLchzW6UJm8Rx2")),
          S.documentTypeListItem("partnerLogo").title("Daftar Mitra").icon(icons["ok-hand"]),
        ]),
    );

// Satu menu "Testimoni" berisi dua bagian: Pengaturan & Item Testimoni.
const testimoniStructure = (S: StructureBuilder) =>
  S.listItem()
    .title("Testimoni")
    .icon(icons.comment)
    .child(S.documentTypeList("testimonial").title("Testimoni"));

const GROUPED_TYPES = new Set([
  "kerjasamaSettings",
  "partnerLogo",
  "testimonialSettings",
  "testimonial",
]);

const withIcons = (S: StructureBuilder) =>
  S.documentTypeListItems().map((item) => {
    const id = item.getId() ?? "";
    if (GROUPED_TYPES.has(id)) return null;
    const Icon = MENU_ICONS[id];
    return Icon ? item.icon(Icon) : item;
  });

export default defineConfig({
  name: "green-property",
  title: "Green Property Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([kerjasamaStructure(S), testimoniStructure(S), ...withIcons(S).filter((x) => x !== null)]),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
