/**
 * Bersihkan field lama (source, googleMapsUrl, googlePlaceId, maxReviews) dari
 * dokumen testimonialSettings agar tidak muncul error "Unknown fields found".
 *
 * Run: node scripts/clean-testimonial-settings.mjs
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

const REMOVED_FIELDS = ["source", "googleMapsUrl", "googlePlaceId", "maxReviews"];

async function main() {
  const ids = await client.fetch('*[_type == "testimonialSettings"]._id');

  if (ids.length === 0) {
    console.log("Tidak ada dokumen testimonialSettings.");
    return;
  }

  for (const id of ids) {
    const doc = await client.getDocument(id);
    const toUnset = REMOVED_FIELDS.filter((f) => doc && f in doc);
    if (toUnset.length === 0) {
      console.log(`${id}: bersih, tidak ada field yang perlu dihapus.`);
      continue;
    }
    await client.patch(id).unset(toUnset).commit();
    console.log(`${id}: dihapus field ${toUnset.join(", ")}.`);
  }

  console.log("Selesai!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
