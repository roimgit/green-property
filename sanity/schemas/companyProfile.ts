import type { SchemaTypeDefinition } from "sanity";
import { ImageInputWithUrl } from "../components/ImageInputWithUrl";
import { GoogleMapsUrlInput } from "../components/GoogleMapsUrlInput";
import { ColorInput } from "../components/ColorInput";

/** Dokumen "Setting Brand" — gabungan Tentang Kami + Pengaturan Brand/Warna (singleton). */
export const companyProfile: SchemaTypeDefinition = {
  name: "companyProfile",
  title: "Setting Brand",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Judul",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "primaryColor",
      title: "Primary Color Brand",
      description: "Warna utama brand (hex). Semua warna primary di website akan mengikuti warna ini. Contoh #00602c — kosongkan untuk pakai default #00602c",
      type: "string",
      initialValue: "#00602c",
      validation: (Rule) =>
        Rule.regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { name: "hex color" }).error(
          "Gunakan format hex #RRGGBB, contoh #00602c",
        ),
      components: { input: ColorInput },
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
      name: "tabLogo",
      title: "Logo Tab Browser",
      description:
        "Pilih apakah favicon tab diambil dari logo perusahaan, atau unggah gambar terpisah.",
      type: "object",
      fields: [
        {
          name: "mode",
          title: "Sumber Logo Tab Browser",
          type: "string",
          initialValue: "companyLogo",
          options: {
            layout: "radio",
            list: [
              { title: "Gunakan logo perusahaan", value: "companyLogo" },
              { title: "Upload logo terpisah", value: "custom" },
            ],
          },
        },
        {
          name: "image",
          title: "Upload Logo Tab Browser",
          type: "image",
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.mode !== "custom",
          fields: [
            {
              name: "alt",
              title: "Teks Alternatif",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "heroBanner",
      title: "Hero Banner (Beranda)",
      description:
        "Konfigurasi section banner di halaman beranda. Jika field ini dikosongkan, section hero tidak akan ditampilkan sama sekali.",
      type: "object",
      fields: [
        {
          name: "image",
          title: "Gambar Latar",
          type: "image",
          options: { hotspot: true },
          components: { input: ImageInputWithUrl },
          description:
            "Wajib diisi agar banner tampil. Disarankan lebar-lebar dengan rasio 16:6 (mis. 1920×720).",
          fields: [
            {
              name: "alt",
              title: "Teks Alternatif",
              type: "string",
            },
          ],
        },
        {
          name: "heading",
          title: "Judul Utama",
          type: "string",
          description: "Judul besar di atas banner.",
        },
        {
          name: "description",
          title: "Deskripsi",
          type: "text",
          rows: 3,
          description: "Kalimat penjelas pendek di bawah judul.",
        },
        {
          name: "links",
          title: "Tombol (LINK / CTA)",
          type: "array",
          description: "Tambah atau hapus tombol. Kosongkan array jika tidak ingin ada tombol.",
          of: [
            {
              type: "object",
              name: "heroLink",
              title: "Tombol",
              fields: [
                {
                  name: "label",
                  title: "Teks Tombol",
                  type: "string",
                },
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
                  description:
                    "Halaman dalam: tanpa slash awal contoh `properties`, `contact`. Eksternal: alamat lengkap contoh `https://wa.me/...`.",
                  hidden: ({ parent }) =>
                    !parent?.linkType || (parent?.linkType !== "internal" && parent?.linkType !== "external"),
                },
                {
                  name: "style",
                  title: "Gaya Tombol",
                  type: "string",
                  initialValue: "primary",
                  options: {
                    list: [
                      { title: "Utama (isi hijau gelap)", value: "primary" },
                      { title: "Outline (garis terang)", value: "ghost" },
                    ],
                  },
                },
                {
                  name: "icon",
                  title: "Ikon (Material Symbols)",
                  type: "string",
                  description: "Ikon opsional di samping teks tombol, misal `chat`, `arrow_forward`, `mail`.",
                },
              ],
              preview: {
                select: {
                  label: "label",
                  href: "href",
                  icon: "icon",
                },
                prepare(selection) {
                  return {
                    title: selection.label || "(Tanpa label)",
                    subtitle: selection.icon ? `ikon: ${selection.icon}` : selection.href || "",
                  };
                },
              },
            },
          ],
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
      description: "Tempel link Google Maps (termasuk short link). Latitude dan longitude terisi otomatis.",
      components: { input: GoogleMapsUrlInput },
    },
    {
      name: "latitude",
      title: "Latitude (Garis Lintang)",
      type: "number",
      description: "Terisi otomatis dari link Maps. Bisa diubah manual jika perlu.",
      validation: (Rule) => Rule.min(-90).max(90),
    },
    {
      name: "longitude",
      title: "Longitude (Garis Bujur)",
      type: "number",
      description: "Terisi otomatis dari link Maps. Bisa diubah manual jika perlu.",
      validation: (Rule) => Rule.min(-180).max(180),
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