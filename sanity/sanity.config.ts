/**
 * Sanity Studio configuration.
 * Embedded in the Next.js app at /studio.
 */
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  name: "green-property",
  title: "Green Property Studio",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [structureTool()],
  // 2. Tambahkan baris ini untuk memblokir tab "Releases" agar tidak muncul:
  tools: (prevTools) => prevTools.filter((tool) => tool.name !== 'releases'),
  schema: {
    types: schemaTypes,
  },
});
