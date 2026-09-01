import type { SchemaTypeDefinition } from "sanity";
import { ImageInputWithUrl } from "../components/ImageInputWithUrl";

/** Dokumen "Tentang Kami" (companyProfile) — singelton-ish company info. */
export const companyProfile: SchemaTypeDefinition = {
  name: "companyProfile",
  title: "Tentang Kami",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "companyName",
      title: "Nama Perusahaan",
      type: "string",
    },
    {
      name: "logo",
      title: "Logo Perusahaan",
      type: "image",
      options: { hotspot: true },
      components: { input: ImageInputWithUrl },
      fields: [
        {
          name: "alt",
          title: "Teks Alternatif",
          type: "string",
        },
      ],
    },
    {
      name: "heroImage",
      title: "Gambar Hero (Beranda)",
      type: "image",
      options: { hotspot: true },
      components: { input: ImageInputWithUrl },
      fields: [
        {
          name: "alt",
          title: "Teks Alternatif",
          type: "string",
        },
      ],
    },
    {
      name: "description",
      title: "Deskripsi",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "vision",
      title: "Visi",
      type: "text",
      rows: 3,
    },
    {
      name: "mission",
      title: "Misi",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "contactEmail",
      title: "Email Kontak",
      type: "string",
    },
    {
      name: "contactPhone",
      title: "Telepon Kontak",
      type: "string",
    },
    {
      name: "address",
      title: "Alamat",
      type: "string",
    },
    {
      name: "googleMapsUrl",
      title: "Link Google Maps",
      type: "string",
      description: "Gunakan EMBED CODE dari Google Maps untuk hasil terbaik. Buka maps > Bagikan > Embed map > copy src URL. Atau paste link reguler: https://maps.app.goo.gl/... atau https://www.google.com/maps/...",
    },
    {
      name: "operationalHours",
      title: "Jam Operasional",
      type: "object",
      fields: [
        {
          name: "weekdays",
          title: "Senin - Jumat",
          type: "string",
          description: "Contoh: 08:00 - 17:00 atau Tutup",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "weekend",
          title: "Sabtu",
          type: "string",
          description: "Contoh: 09:00 - 15:00 atau Tutup (kosongkan jika libur)",
        },
        {
          name: "weekend2",
          title: "Minggu",
          type: "string",
          description: "Contoh: 09:00 - 15:00 atau Tutup (kosongkan jika libur)",
        },
      ],
    },
  ],
};