import type { SchemaTypeDefinition } from "sanity";
import { ImageInputWithUrl } from "../components/ImageInputWithUrl";

/** Dokumen "Logo Kerjasama" (partnerLogo). */
export const partnerLogo: SchemaTypeDefinition = {
  name: "partnerLogo",
  title: "Kerjasama",
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
      components: { input: ImageInputWithUrl },
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
    {
      name: "keteranganKerjasama",
      title: "Keterangan Kerjasama",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
      ],
      description:
        "Jelaskan kerja sama dengan perusahaan ini — misalnya pemasok material, tenant kawasan industri, kontraktor, dll.",
    },
    {
      name: "testimoni",
      title: "Testimoni Perusahaan",
      type: "text",
      rows: 4,
      description: "Kutipan/opini dari perusahaan ini (misal: testimoni dari Hyundai).",
    },
    {
      name: "testimoniPenulis",
      title: "Penulis Testimoni",
      type: "string",
      description: "Contoh: Direktur PT Hyundai ... atau 'Perwakilan Hyundai'",
    },
    {
      name: "dokumentasi",
      title: "Foto Dokumentasi (Album)",
      type: "array",
      of: [
        {
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
      ],
      description: "Album foto dokumentasi kegiatan, penyerahan unit, atau momen bersama perusahaan ini.",
    },
  ],
  preview: {
    select: {
      title: "namaPerusahaan",
      media: "logo",
      dokumentasi: "dokumentasi",
    },
    prepare(selection) {
      const { title, media, dokumentasi } = selection;
      const jumlah = Array.isArray(dokumentasi) ? dokumentasi.length : 0;
      return {
        title,
        media,
        subtitle: jumlah > 0 ? `${jumlah} foto dokumentasi` : "Tanpa dokumentasi",
      };
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
