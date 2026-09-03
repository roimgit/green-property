/**
 * Migrasi aman: isi Mata Uang Default properti yang masih kosong dengan "IDR".
 * Harga per entry yang sudah punya currency sendiri tidak diubah (tetap prioritas).
 *
 * Run: node scripts/migrate-property-currency.mjs
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

async function main() {
  const docs = await client.fetch(
    `*[_type == "property" && !defined(defaultCurrency)]{_id, "slug": slug.current}`
  );

  if (!docs.length) {
    console.log("Semua properti sudah punya mata uang default.");
    return;
  }

  for (const doc of docs) {
    await client.patch(doc._id).set({ defaultCurrency: "IDR" }).commit();
    console.log(`  patched ${doc.slug}: defaultCurrency = IDR`);
  }

  console.log("Migrasi mata uang properti selesai!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
