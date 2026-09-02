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
      description: "Dokumen tunggal pengatur testimoni. Buat 1 dokumen saja.",
    },
    {
      name: "manualTestimonials",
      title: "Daftar Testimoni",
      description: "Daftar testimoni yang akan ditampilkan di website. Tambah/hapus langsung di sini.",
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
    },
    {
      name: "hideIfEmpty",
      title: "Sembunyikan Section Jika Tidak Ada Data",
      type: "boolean",
      initialValue: true,
      description: "Jika true dan tidak ada testimoni, section testimoni di beranda otomatis hide.",
    },
  ],
  preview: {
    select: { title: "title" },
    prepare(selection) {
      return {
        title: selection.title || "Pengaturan Testimoni",
        subtitle: "Testimoni Manual",
      };
    },
  },
};
