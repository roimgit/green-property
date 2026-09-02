import { config as loadEnv } from "dotenv";
import path from "node:path";
import { createClient } from "@sanity/client";

// Pusatkan memuat .env dari root repo seperti yang dilakukan sanity.cli.ts,
// sehingga skrip bisa dipanggil dari folder `sanity/` maupun root.
loadEnv({ path: path.resolve(process.cwd(), "../.env") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });

/**
 * Migrasi spesifikasi properti: menyalin data `specs` (object lama) ke
 * `specsList` (array fleksibel yang baru).
 *
 * Default = dry-run (FOREACH / periksa hasil, TIDAK menulis apa pun).
 * Set `SANITY_API_TOKEN` di `.env`(memuat otomatis) lalu jalankan dari root:
 *
 *   PowerShell  : $env:WRITE="1"; node sanity/node_modules/.bin/sanity exec migrations/migrate-specs-to-flexible-list.ts
 *   Caution     : atau jalankan hanya saat Anda yakin, dengan env APPLY=1 / WRITE=1
 *
 * Tanpa token/`WRITE=1` skrip hanya mencetak rencana migrasi (dry-run).
 */

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error("Gagal: NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET belum diset.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-06-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const LEGACY_SPECS: Array<{
  key: string;
  label: string;
  icon: string;
  valueOf: (specs: Record<string, unknown>) => string | undefined;
}> = [
  { key: "certificate", label: "Sertifikat", icon: "verified_user", valueOf: (s) => str(s.certificate) },
  {
    key: "landArea",
    label: "Luas Tanah",
    icon: "landscape",
    valueOf: (s) => (typeof s.landArea === "number" ? `${s.landArea.toLocaleString("id-ID")} m²` : undefined),
  },
  {
    key: "buildingArea",
    label: "Luas Bangunan",
    icon: "foundation",
    valueOf: (s) => (typeof s.buildingArea === "number" ? `${s.buildingArea.toLocaleString("id-ID")} m²` : undefined),
  },
  { key: "furnishing", label: "Kondisi Interior", icon: "chair", valueOf: (s) => str(s.furnishing) },
  { key: "bedrooms", label: "Kamar Tidur", icon: "king_bed", valueOf: (s) => str(s.bedrooms) },
  { key: "bathrooms", label: "Kamar Mandi", icon: "bathtub", valueOf: (s) => str(s.bathrooms) },
  {
    key: "floors",
    label: "Jumlah Lantai",
    icon: "stairs",
    valueOf: (s) => (typeof s.floors === "number" ? `${s.floors} Lantai` : undefined),
  },
  { key: "electricity", label: "Daya Listrik", icon: "bolt", valueOf: (s) => str(s.electricity) },
  { key: "carport", label: "Garasi / Carport", icon: "garage", valueOf: (s) => str(s.carport) },
  { key: "orientation", label: "Hadap", icon: "explore", valueOf: (s) => str(s.orientation) },
];

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;
}

function buildSpecsList(specs: Record<string, unknown>) {
  return LEGACY_SPECS.map((def) => ({ def, value: def.valueOf(specs) }))
    .filter((entry) => entry.value !== undefined)
    .map((entry, index) => ({
      _type: "specItem",
      _key: `${entry.def.key}-${index}`,
      icon: entry.def.icon,
      label: entry.def.label,
      value: entry.value,
    }));
}

type MigrationResult = { updated: number; skipped: number; mutated: number; failed: number };

async function run(): Promise<MigrationResult> {
  const props = await client.fetch<Array<{ _id: string; specs?: Record<string, unknown>; specsList?: unknown[] }>>(
    `*[_type == "property" && defined(specs)]{ _id, specs, specsList }`,
  );

  let updated = 0;
  let skipped = 0;
  let mutated = 0;
  let failed = 0;

  for (const doc of props) {
    if (!doc.specs || typeof doc.specs !== "object") {
      skipped++;
      continue;
    }
    if (Array.isArray(doc.specsList) && doc.specsList.length > 0) {
      console.log(`[lewati] ${doc._id} — specsList sudah terisi`);
      skipped++;
      continue;
    }

    const list = buildSpecsList(doc.specs);
    if (list.length === 0) {
      skipped++;
      continue;
    }

    const title = await docTitle(doc._id);
    console.log(`[tulis] ${doc._id}${title ? ` (${title})` : ""}: ${list.length} item`);

    try {
      if (process.env.APPLY === "1" || process.env.WRITE === "1") {
        await client
          .patch(doc._id)
          .set({ specsList: list })
          .unset(["specs"])
          .commit();
        mutated++;
      }
      updated++;
    } catch (err) {
      console.error(`[gagal] ${doc._id}: ${err}`);
      failed++;
    }
  }

  console.log(JSON.stringify({ updated, skipped, mutated, failed }, null, 2));
  return { updated, skipped, mutated, failed };
}

const titles: Record<string, string> = {};
async function docTitle(id: string): Promise<string> {
  if (titles[id]) return titles[id];
  const result = await client.fetch<{ title?: string } | null>(`*[_id == $id][0]{title}`, { id });
  const title = result?.title ?? "";
  titles[id] = title;
  return title;
}

run().catch((err) => {
  console.error("Migrasi gagal:", err);
  process.exitCode = 1;
});