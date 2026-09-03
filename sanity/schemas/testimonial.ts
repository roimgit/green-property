import type { SchemaTypeDefinition } from "sanity";
import { ImageInputWithUrl } from "../components/ImageInputWithUrl";

/** Dokumen "Testimoni" (testimonial) — legacy items, tetap dibaca sebagai fallback. Untuk input baru, gunakan Testimoni (pengaturan) dengan sumber Manual. */
export const testimonial: SchemaTypeDefinition = {
  name: "testimonial",
  title: "Item Testimoni (Legacy)",
  type: "document",
  fields: [
    {
      name: "nama",
      title: "Nama",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
      options: {
        list: [
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
          { title: "4", value: 4 },
          { title: "5", value: 5 },
        ],
      },
    },
    {
      name: "kutipan",
      title: "Kutipan",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    },
    {
      name: "jabatan",
      title: "Jabatan / Keterangan",
      type: "string",
      description: "Contoh: Direktur PT Maju Bersama, atau 'Pembeli Rumah'",
    },
    {
      name: "videoLabel",
      title: "Label Video / Platform",
      type: "string",
      description: "Contoh: YouTube, Instagram, TikTok. Dijadikan teks tombol di halaman Testimoni.",
    },
    {
      name: "videoUrl",
      title: "Link Video / Sosmed",
      type: "url",
      description: "Tempel link YouTube / Instagram / TikTok / sosmed untuk melihat testimoni lewat video.",
    },
    {
      name: "photo",
      title: "Foto / Avatar",
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
      name: "urutanTampil",
      title: "Urutan Tampil",
      type: "number",
      description: "Semakin kecil angkanya, semakin awal tampil.",
    },
  ],
  preview: {
    select: {
      title: "nama",
      subtitle: "jabatan",
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
