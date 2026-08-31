import type { SchemaTypeDefinition } from "sanity";
import { MaterialIconInput } from "../components/MaterialIconInput";

export const service: SchemaTypeDefinition = {
  name: "service",
  title: "Layanan (Service Portfolio)",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) =>
        Rule.required().max(40).warning("Disarankan maksimal 40 karakter agar muat di kartu."),
    },
    {
      name: "icon",
      title: "Ikon (Material Symbols)",
      type: "string",
      description:
        "Nama ikon Material Symbols. Pilih dari panel di bawah, atau cari nama di https://fonts.google.com/icons",
      components: { input: MaterialIconInput },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "desc",
      title: "Deskripsi",
      type: "string",
      description: "Deskripsi layanan setelah label 'Jual & Sewa'.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "url",
      title: "URL Tujuan (opsional)",
      type: "url",
      description: "Link saat kartu layanan diklik. Kosongkan jika tidak ada.",
    },
    {
      name: "urutanTampil",
      title: "Urutan Tampil",
      type: "number",
      description: "Semakin kecil angkanya, semakin awal tampil.",
    },
  ],
  preview: {
    select: { title: "title", subtitle: "icon" },
  },
  orderings: [
    {
      title: "Urutan Tampil (naik)",
      name: "urutanTampilAsc",
      by: [{ field: "urutanTampil", direction: "asc" }],
    },
  ],
};
