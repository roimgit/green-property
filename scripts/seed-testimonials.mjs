/**
 * Seed testimoni manual ke Sanity (testimonialSettings).
 *
 * Run: node scripts/seed-testimonials.mjs
 * Requires SANITY project id/dataset/token in .env
 */
import "dotenv/config";
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2024-06-01", useCdn: false });

const TESTIMONIALS = [
  {
    _key: "t1",
    nama: "Budi Santoso",
    rating: 5,
    kutipan: "Tim Green Property sangat profesional dan membantu kami menemukan lahan industri terbaik di Cikarang.",
    jabatan: "Direktur PT Mitra Industri",
  },
  {
    _key: "t2",
    nama: "Siti Rahmawati",
    rating: 5,
    kutipan: "Proses pembelian villa berjalan lancar. Layanan konsultasi mereka luar biasa.",
    jabatan: "Pembeli Villa di Bali",
  },
  {
    _key: "t3",
    nama: "Andi Wijaya",
    rating: 4,
    kutipan: "Solusi lahan yang strategis untuk ekosistem vendor Hyundai. Sangat direkomendasikan.",
    jabatan: "Manajer Supply Chain",
  },
];

async function main() {
  // Cari dokumen testimonialSettings yang sudah ada
  const existing = await client.fetch('*[_type == "testimonialSettings"][0]._id');

  if (existing) {
    // Update dokumen yang sudah ada
    await client
      .patch(existing)
      .set({ source: "manual", manualTestimonials: TESTIMONIALS })
      .commit();
    console.log(`Updated testimonialSettings (${existing}) dengan ${TESTIMONIALS.length} testimoni manual.`);
  } else {
    // Buat dokumen baru
    const doc = await client.create({
      _type: "testimonialSettings",
      title: "Pengaturan Testimoni",
      source: "manual",
      manualTestimonials: TESTIMONIALS,
      hideIfEmpty: true,
    });
    console.log(`Created testimonialSettings (${doc._id}) dengan ${TESTIMONIALS.length} testimoni manual.`);
  }

  console.log("Selesai!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
