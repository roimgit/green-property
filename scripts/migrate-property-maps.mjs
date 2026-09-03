/**
 * Migrasi aman: isi koordinat peta properti yang belum punya lat/lng.
 *
 * - TIDAK menghapus dokumen apapun.
 * - Hanya patch properti yang latitude/longitude-nya masih kosong.
 * - Koordinat di bawah adalah perkiraan area (khususnya Patria Park);
 *   sempurnakan via Studio: Property Listing -> Link Google Maps.
 *
 * Run: node scripts/migrate-property-maps.mjs
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

// Perkiraan koordinat per slug properti.
const COORDS_BY_SLUG = {
  "apt-kemang-village": { lat: -6.2607, lng: 106.8133 }, // Kemang Village, Jaksel
  "apt-essence-dharmawangsa": { lat: -6.241, lng: 106.7985 }, // Dharmawangsa, Jaksel
  "apt-pakubuwono-residence": { lat: -6.2422, lng: 106.7885 }, // Pakubuwono, Jaksel
  "apt-patria-park": { lat: -6.2245, lng: 106.8956 }, // Jakarta Timur (perkiraan, mohon verifikasi)
  "apt-pondok-indah-residence": { lat: -6.2679, lng: 106.7843 }, // Pondok Indah, Jaksel
  "apt-senopati-suites": { lat: -6.2348, lng: 106.8079 }, // Senopati, Jaksel
};

async function main() {
  const docs = await client.fetch(
    `*[_type == "property"]{_id, "slug": slug.current, latitude, longitude, googleMapsUrl}`
  );

  if (!docs.length) {
    console.log("Tidak ada dokumen property.");
    return;
  }

  for (const doc of docs) {
    if (typeof doc.latitude === "number" && typeof doc.longitude === "number") {
      console.log(`  skip ${doc.slug}: sudah ada koordinat`);
      continue;
    }

    const coords = COORDS_BY_SLUG[doc.slug];
    if (!coords) {
      console.log(`  skip ${doc.slug}: tidak ada perkiraan koordinat, isi manual via Studio`);
      continue;
    }

    const patch = { latitude: coords.lat, longitude: coords.lng };
    if (!doc.googleMapsUrl) {
      patch.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    }

    await client.patch(doc._id).set(patch).commit();
    console.log(`  patched ${doc.slug}: ${coords.lat}, ${coords.lng}`);
  }

  console.log("Migrasi peta properti selesai!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
