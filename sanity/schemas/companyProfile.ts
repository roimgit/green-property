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
      ],
    },
    {
      name: "ctaBanner",
      title: "CTA Banner (Beranda)",
      description:
        "Konfigurasi section CTA di halaman beranda. Jika heading, deskripsi, dan tombol semuanya dikosongkan, section CTA tidak akan ditampilkan sama sekali.",
      type: "object",
      fields: [
        {
          name: "heading",
          title: "Judul Utama",
          type: "string",
          description: "Judul besar di banner CTA.",
          initialValue: "Siap Memulai Proyek Anda?",
        },
        {
          name: "description",
          title: "Deskripsi",
          type: "text",
          rows: 3,
          description: "Kalimat penjelas pendek di bawah judul.",
          initialValue:
            "Tim ahli kami siap membantu Anda menemukan solusi lahan dan properti terbaik di Indonesia.",
        },
        {
          name: "buttonLabel",
          title: "Teks Tombol",
          type: "string",
          description: "Kosongkan jika tidak ingin menampilkan tombol.",
          initialValue: "Lihat Semua Kontak",
        },
        {
          name: "buttonHref",
          title: "Tujuan Tombol",
          type: "string",
          description:
            "Halaman dalam: tanpa slash awal contoh `contact`, `properties`. Eksternal: alamat lengkap contoh `https://wa.me/...`.",
          initialValue: "contact",
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
          name: "monday",
          title: "Senin",
          type: "string",
          description: "Contoh: 08:00 - 17:00 atau Tutup",
        },
        {
          name: "tuesday",
          title: "Selasa",
          type: "string",
          description: "Contoh: 08:00 - 17:00 atau Tutup",
        },
        {
          name: "wednesday",
          title: "Rabu",
          type: "string",
          description: "Contoh: 08:00 - 17:00 atau Tutup",
        },
        {
          name: "thursday",
          title: "Kamis",
          type: "string",
          description: "Contoh: 08:00 - 17:00 atau Tutup",
        },
        {
          name: "friday",
          title: "Jumat",
          type: "string",
          description: "Contoh: 08:00 - 17:00 atau Tutup",
        },
        {
          name: "saturday",
          title: "Sabtu",
          type: "string",
          description: "Contoh: 08:00 - 12:00 atau Tutup",
        },
        {
          name: "sunday",
          title: "Minggu",
          type: "string",
          description: "Contoh: Tutup atau 09:00 - 15:00",
        },
        {
          name: "weekdays",
          title: "Senin - Jumat (Grup / Legacy)",
          type: "string",
          description: "Contoh: 08:00 - 17:00 (digunakan jika jam per hari tidak diisi)",
        },
        {
          name: "weekend",
          title: "Sabtu (Grup / Legacy)",
          type: "string",
          description: "Contoh: 08:00 - 12:00",
        },
        {
          name: "weekend2",
          title: "Minggu (Grup / Legacy)",
          type: "string",
          description: "Contoh: Tutup",
        },
      ],
    },
  ],
};