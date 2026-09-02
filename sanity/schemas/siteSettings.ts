import { defineField, defineType } from "sanity";
import { ColorInput } from "../components/ColorInput";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Pengaturan Brand / Warna",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul",
      type: "string",
      initialValue: "Brand Settings",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryColor",
      title: "Primary Color Brand",
      description: "Warna utama brand (hex). Semua warna primary di website akan mengikuti warna ini. Contoh #00602c",
      type: "string",
      initialValue: "#00602c",
      validation: (Rule) =>
        Rule.required()
          .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { name: "hex color" })
          .error("Gunakan format hex #RRGGBB, contoh #00602c"),
      components: { input: ColorInput },
    }),
  ],
  preview: {
    select: { title: "title", primaryColor: "primaryColor" },
    prepare({ title, primaryColor }) {
      return {
        title: title || "Brand Settings",
        subtitle: primaryColor ? `Primary: ${primaryColor}` : "Belum diatur",
        media: () => null,
      };
    },
  },
});
