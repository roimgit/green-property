/**
 * Migrasi aman: copy teks hardcode CTA Banner ke dokumen companyProfile
 * yang belum memiliki field ctaBanner.
 *
 * - TIDAK menghapus dokumen apapun (tidak seperti seed-sanity.mjs).
 * - Hanya patch dokumen yang ctaBanner-nya kosong / field-nya belum lengkap.
 *
 * Run: node scripts/migrate-cta-banner.mjs
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

const DEFAULT_CTA = {
  heading: "Siap Memulai Proyek Anda?",
  description:
    "Tim ahli kami siap membantu Anda menemukan solusi lahan dan properti terbaik di Indonesia.",
  buttonLabel: "Lihat Semua Kontak",
  buttonHref: "contact",
};

async function main() {
  const docs = await client.fetch(
    `*[_type == "companyProfile"]{_id, ctaBanner{heading, description, buttonLabel, buttonHref}}`,
  );

  if (!docs.length) {
    console.log("Tidak ada dokumen companyProfile. Buat dulu via Studio / seed.");
    return;
  }

  for (const doc of docs) {
    const current = doc.ctaBanner ?? {};
    const patch = {};
    for (const [key, value] of Object.entries(DEFAULT_CTA)) {
      if (typeof current[key] !== "string" || current[key].trim() === "") {
        patch[key] = value;
      }
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  skip ${doc._id}: ctaBanner sudah lengkap`);
      continue;
    }

    await client.patch(doc._id).set({ ctaBanner: { ...current, ...patch } }).commit();
    console.log(`  patched ${doc._id}: ${Object.keys(patch).join(", ")}`);
  }

  console.log("Migrasi CTA selesai!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
