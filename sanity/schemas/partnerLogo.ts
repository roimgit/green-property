import type { SchemaTypeDefinition } from "sanity";

/** Dokumen "Logo Kerjasama" (partnerLogo). */
export const partnerLogo: SchemaTypeDefinition = {
  name: "partnerLogo",
  title: "Logo Kerjasama",
  type: "document",
  fields: [
    {
      name: "namaPerusahaan",
      title: "Nama Perusahaan",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: "alt",
          title: "Teks Alternatif",
          type: "string",
        },
      ],
    },
    {
      name: "urutanTampil",
      title: "Urutan Tampil",
      type: "number",
      description: "Semakin kecil angkanya, semakin awal tampil.",
    },
    {
      name: "url",
      title: "URL (opsional)",
      type: "url",
    },
  ],
  preview: {
    select: {
      title: "namaPerusahaan",
      media: "logo",
    },
  },
  orderings: [
    {
      title: "Urutan Tampil (naik)",
      name: "urutanTampilAsc",
      by: [{ field: "urutanTampil", direction: "asc" }],
    },
  ],
};
