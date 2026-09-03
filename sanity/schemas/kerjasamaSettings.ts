import type { SchemaTypeDefinition } from "sanity";
import { MaterialIconInput } from "../components/MaterialIconInput";

const button = {
  name: "kerjasamaButton",
  title: "Tombol",
  type: "object",
  fields: [
    { name: "label", title: "Teks Tombol", type: "string" },
    {
      name: "linkType",
      title: "Jenis Tujuan",
      type: "string",
      initialValue: "internal",
      options: {
        list: [
          { title: "Halaman dalam situs", value: "internal" },
          { title: "Link eksternal (URL)", value: "external" },
        ],
      },
    },
    {
      name: "href",
      title: "Path / URL",
      type: "string",
      hidden: ({ parent }: { parent?: { linkType?: string } }) => !parent?.linkType,
    },
    {
      name: "icon",
      title: "Ikon (Material Symbols)",
      type: "string",
      description: "Contoh: groups, apartment, mail.",
    },
  ],
  preview: {
    select: { label: "label", href: "href", icon: "icon" },
    prepare(selection: { label?: string; href?: string; icon?: string }) {
      return {
        title: selection.label || "(Tanpa label)",
        subtitle: selection.icon ? `ikon: ${selection.icon}` : selection.href || "",
      };
    },
  },
} as const;

/** Dokumen tunggal untuk konten halaman Kerjasama (hero, poin keunggulan, CTA). */
export const kerjasamaSettings: SchemaTypeDefinition = {
  name: "kerjasamaSettings",
  title: "Kerjasama",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Judul Pengaturan",
      type: "string",
      initialValue: "Pengaturan Kerjasama",
      description: "Dokumen tunggal. Buat 1 dokumen saja.",
    },
    {
      name: "heroBadge",
      title: "Hero: Label Atas",
      type: "string",
      description: "Contoh: Kerjasama & Kemitraan.",
    },
    {
      name: "heroHeading",
      title: "Hero: Judul Utama",
      type: "array",
      of: [{ type: "block" }],
      description: "Judul besar banner. Gunakan <br> untuk baris baru.",
    },
    {
      name: "heroDescription",
      title: "Hero: Deskripsi",
      type: "text",
      rows: 4,
    },
    {
      name: "heroButtons",
      title: "Hero: Tombol",
      type: "array",
      of: [button],
    },
    {
      name: "points",
      title: "Poin Keunggulan",
      type: "array",
      of: [
        {
          type: "object",
          name: "kerjasamaPoint",
          title: "Poin",
          fields: [
            {
              name: "icon",
              title: "Ikon (Material Symbols)",
              type: "string",
              components: { input: MaterialIconInput },
            },
            { name: "title", title: "Judul", type: "string" },
            { name: "desc", title: "Deskripsi", type: "text", rows: 3 },
          ],
          preview: {
            select: { icon: "icon", title: "title" },
            prepare(selection) {
              return {
                title: selection.title || "(Tanpa judul)",
                subtitle: selection.icon ? `ikon: ${selection.icon}` : "",
              };
            },
          },
        },
      ],
    },
    {
      name: "ctaHeading",
      title: "CTA: Judul",
      type: "string",
    },
    {
      name: "ctaDescription",
      title: "CTA: Deskripsi",
      type: "text",
      rows: 3,
    },
    {
      name: "ctaButtonLabel",
      title: "CTA: Teks Tombol",
      type: "string",
    },
    {
      name: "ctaButtonHref",
      title: "CTA: Tujuan Tombol",
      type: "string",
      description: "Halaman dalam tanpa slash awal (contoh `contact`), atau URL lengkap.",
    },
  ],
  preview: {
    select: { title: "title" },
    prepare(selection) {
      return { title: selection.title || "Pengaturan Kerjasama" };
    },
  },
};
