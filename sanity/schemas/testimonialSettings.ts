import type { SchemaTypeDefinition } from "sanity";
import { ImageInputWithUrl } from "../components/ImageInputWithUrl";

export const testimonialSettings: SchemaTypeDefinition = {
  name: "testimonialSettings",
  title: "Testimoni",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Judul Pengaturan",
      type: "string",
      initialValue: "Pengaturan Testimoni",
      description: "Dokumen tunggal untuk mengatur sumber testimoni di beranda. Buat 1 dokumen saja.",
    },
    {
      name: "source",
      title: "Sumber Testimoni",
      type: "string",
      initialValue: "manual",
      options: {
        list: [
          { title: "Input Manual (Sanity)", value: "manual" },
          { title: "Google Maps / Google Reviews", value: "google" },
          { title: "Gabungan (Manual + Google)", value: "combined" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "googleMapsUrl",
      title: "Link Google Maps",
      type: "string",
      description:
        "Tempel link Google Maps bisnis (contoh: https://maps.app.goo.gl/... atau https://www.google.com/maps/place/...). Dipakai untuk membantu menemukan Place ID. Wajib isi jika sumber = Google atau Gabungan.",
      hidden: ({ parent }) => parent?.source !== "google" && parent?.source !== "combined",
    },
    {
      name: "googlePlaceId",
      title: "Google Place ID",
      type: "string",
      description:
        "Place ID Google (contoh: ChIJ...). Jika dikosongkan, sistem akan mencoba mengekstrak dari Link Google Maps. Cara menemukan: cari bisnis di https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder",
      hidden: ({ parent }) => parent?.source !== "google" && parent?.source !== "combined",
    },
    {
      name: "maxReviews",
      title: "Jumlah Maksimal Review Ditampilkan",
      type: "number",
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(10),
      hidden: ({ parent }) => parent?.source !== "google" && parent?.source !== "combined",
    },
    {
      name: "manualTestimonials",
      title: "Daftar Testimoni Manual",
      description: "Isi testimoni yang akan ditampilkan jika Sumber = Manual atau Gabungan. Tambah/hapus langsung di sini. Data lama dari Item Testimoni (Legacy) sudah dimigrasikan ke sini dan bisa ditambah lagi.",
      type: "array",
      of: [
        {
          type: "object",
          name: "manualTestimonialItem",
          title: "Testimoni",
          fields: [
            { name: "nama", title: "Nama", type: "string", validation: (Rule) => Rule.required() },
            {
              name: "rating",
              title: "Rating",
              type: "number",
              validation: (Rule) => Rule.required().min(1).max(5).integer(),
              options: { list: [1, 2, 3, 4, 5].map((v) => ({ title: `${v}`, value: v })) },
            },
            { name: "kutipan", title: "Kutipan", type: "text", rows: 3, validation: (Rule) => Rule.required() },
            { name: "jabatan", title: "Jabatan / Keterangan", type: "string" },
            {
              name: "photo",
              title: "Foto / Avatar",
              type: "image",
              options: { hotspot: true },
              components: { input: ImageInputWithUrl },
              fields: [{ name: "alt", title: "Teks Alternatif", type: "string" }],
            },
          ],
          preview: {
            select: { title: "nama", subtitle: "jabatan" },
          },
        },
      ],
      hidden: ({ parent }) => parent?.source !== "manual" && parent?.source !== "combined",
    },
    {
      name: "hideIfEmpty",
      title: "Sembunyikan Section Jika Tidak Ada Data",
      type: "boolean",
      initialValue: true,
      description: "Jika true dan tidak ada testimoni (manual kosong atau Google gagal), section testimoni di beranda otomatis hide.",
    },
  ],
  preview: {
    select: { title: "title", source: "source" },
    prepare(selection) {
      const map: Record<string, string> = { manual: "Sumber: Manual", google: "Sumber: Google Maps", combined: "Sumber: Gabungan" };
      return {
        title: selection.title || "Pengaturan Testimoni",
        subtitle: map[selection.source] || "Sumber: Manual",
      };
    },
  },
};
