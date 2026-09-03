/**
 * Backfill koordinat peta untuk properti yang belum punya latitude/longitude.
 * Amat perkiraan area — presisikan via Studio (Link Google Maps).
 * Run: node scripts/backfill-property-coords.mjs
 */
import "dotenv/config";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-06-01",
  useCdn: false,
});

// Perkiraan koordinat berdasar slug / lokasi
const COORDS = {
  "kawasan-industri-cikarang": { lat: -6.349, lng: 107.151 },
  "kavling-komersial-tb-simatupang": { lat: -6.2969, lng: 106.8101 },
  "gudang-modern-karawang": { lat: -6.3227, lng: 107.2959 },
  "delta-silicon-plot-8a": { lat: -6.2912, lng: 107.1728 },
  "giic-smart-factory-b": { lat: -6.2496, lng: 107.151 },
  "logistics-hub-k-1": { lat: -6.3227, lng: 107.2959 },
  "modern-tropical-villa-in-canggu": { lat: -8.6455, lng: 115.1405 },
  "minimalist-villa-seminyak": { lat: -8.6914, lng: 115.1593 },
  "cliffside-estate-uluwatu": { lat: -8.8291, lng: 115.0849 },
};

async function main() {
  const docs = await client.fetch(
    `*[_type == "property"]{_id, "slug": slug.current, latitude, longitude, googleMapsUrl}`
  );

  for (const doc of docs) {
    if (typeof doc.latitude === "number" && typeof doc.longitude === "number") continue;
    const coords = COORDS[doc.slug];
    if (!coords) {
      console.log(`skip ${doc.slug}: tanpa perkiraan koordinat`);
      continue;
    }
    const patch = { latitude: coords.lat, longitude: coords.lng };
    if (!doc.googleMapsUrl) {
      patch.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    }
    await client.patch(doc._id).set(patch).commit();
    console.log(`patched ${doc.slug}: ${coords.lat}, ${coords.lng}`);
  }
  console.log("Backfill koordinat selesai!");
}

main().catch((e) => { console.error(e); process.exit(1); });
