/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

const src = path.resolve(
  __dirname,
  "../node_modules/@material-symbols/font-400/index.d.ts",
);
const out = path.resolve(__dirname, "../sanity/components/materialSymbolsList.ts");

const content = fs.readFileSync(src, "utf8");
const names = [];
for (const line of content.split("\n")) {
  const m = line.match(/^\s*"([^"]+)"/);
  if (m) names.push(m[1]);
}

const lines = [
  "// Daftar lengkap nama ikon Material Symbols (diekstrak dari @material-symbols/font-400).",
  "// Bandingkan dengan grid ikon yang akhirnya dirender: semua nama di sini adalah ligature yang tersedia di font.",
  "// Pembaruan daftar: `node scripts/generate-material-symbols.cjs`",
  "",
  "export const MATERIAL_SYMBOLS: string[] = [",
];
for (const name of names) lines.push(`  "${name}",`);
lines.push("];", "");

fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`WROTE ${names.length} names to ${out}`);