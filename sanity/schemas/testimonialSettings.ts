import type { SchemaTypeDefinition } from "sanity";
import { GoogleMapsUrlInput } from "../components/GoogleMapsUrlInput";

export const testimonialSettings: SchemaTypeDefinition = {
  name: "testimonialSettings",
  title: "Pengaturan Testimoni (Beranda)",
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
        "Tempel link Google Maps bisnis (contoh: https://maps.app.goo.gl/... atau https://www.google.com/maps/place/...). Dipakai untuk membantu menemukan Place ID. Wajib isi jika sumber = Google.",
      components: { input: GoogleMapsUrlInput },
      hidden: ({ parent }) => parent?.source !== "google",
    },
    {
      name: "googlePlaceId",
      title: "Google Place ID",
      type: "string",
      description:
        "Place ID Google (contoh: ChIJ...). Jika dikosongkan, sistem akan mencoba mengekstrak dari Link Google Maps. Cara menemukan: cari bisnis di https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder",
      hidden: ({ parent }) => parent?.source !== "google",
    },
    {
      name: "maxReviews",
      title: "Jumlah Maksimal Review Ditampilkan",
      type: "number",
      initialValue: 6,
      validation: (Rule) => Rule.min(1).max(10),
      hidden: ({ parent }) => parent?.source !== "google",
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
      return {
        title: selection.title || "Pengaturan Testimoni",
        subtitle: selection.source === "google" ? "Sumber: Google Maps" : "Sumber: Manual",
      };
    },
  },
};
