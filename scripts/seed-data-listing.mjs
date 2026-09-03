import "dotenv/config";
import { createClient } from "@sanity/client";

const c = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production", token: process.env.SANITY_API_TOKEN, apiVersion: "2024-06-01", useCdn: false });

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function pt(text) {
  return [{ _type: "block", style: "normal", children: [{ _type: "span", text }] }];
}

// Kategori yang sudah ada (id dari Sanity)
const CAT = {
  apartment: "55cdc0f7-5b9a-4600-9d30-36c963f2c4d5",
  land: "92b099f6-a961-4bda-8ad7-72aaa984fd0f",
  factory: "e9992de0-d812-4938-82e6-b9d0ff2afce2",
  residence: "f4b93a6a-c071-44ee-9498-12815986eb7a",
  komersial: null, // dibuat nanti
};

// Antar kategori Komersial bila belum ada
const existingKomersial = await c.fetch(`*[_type == "category" && title == "Komersial"][0]._id`);
if (existingKomersial) CAT.komersial = existingKomersial;

// ---- Data 41 listing ----
// field: title, cat (kode), cur (IDR/USD), status(single/both), sewa:null|{price,period},
// specs: array [icon,label,value], loc(string), addr(string), hargaJual:number|null, unitHarga?:string, furn/legal extras
const L = [
  { t: "Apt. Pondok Indah Rsdnc", cat: "apartment", loc: "Pondok Indah, Jakarta Selatan", addr: "Tower Kartika, Lantai 31 - Pondok Indah, Jakarta Selatan", jual: 9000000000, specs: [["crop_square","Luas","159 Sqm"],["chair","Kondisi","Unfurnished"],["king_bed","Kamar Tidur","4 BR"]] },
  { t: "Apt. Senopati Suites", cat: "apartment", loc: "Senopati, Jakarta Selatan", addr: "Senopati, Jakarta Selatan", jual: 7500000000, sewa: { price: 3000, period: "month", cur: "USD" }, specs: [["crop_square","Luas","165 Sqm"],["chair","Kondisi","Furnished"],["king_bed","Kamar Tidur","2 BR"]] },
  { t: "Apt. Fatmawati City", cat: "apartment", loc: "Fatmawati, Jakarta Selatan", addr: "Tower Corona, Lantai 12 - Fatmawati, Jakarta Selatan", jual: 2800000000, specs: [["crop_square","Luas","71 Sqm"],["chair","Kondisi","Unfurnished"],["king_bed","Kamar Tidur","2 BR"]] },
  { t: "Apt. Hampton's Park", cat: "apartment", loc: "Jakarta Selatan", addr: "Tower B, Lantai 8", jual: 2500000000, specs: [["crop_square","Luas","152 sqm, 3 BR"],["chair","Kondisi","Unfurnished"]] },
  { t: "Office space di LA'VENUE", cat: "komersial", loc: "Ps. Minggu, Jakarta Selatan", addr: "Jl. Raya Ps. Minggu, Jakarta Selatan - Lantai 12", jual: 7500000000, sewa: { price: 200000, period: "month" }, specs: [["crop_square","Luas","184 sqm"],["chair","Kondisi","Full Furnished"]] },
  { t: "Ruko Mega Cilegon", cat: "komersial", loc: "Cilegon, Banten", addr: "Cilegon, Banten", jual: 1000000000, specs: [["crop_square","Luas Tanah","60 m²"],["foundation","Luas Bangunan","120 m², 2 lantai"],["verified_user","Legalitas","SHGB"]] },
  { t: "Ex Gudang", cat: "factory", loc: "Buah Batu, Bandung", addr: "Marga Sari, Buah Batu, Bandung", jual: 48000000000, specs: [["crop_square","Luas Tanah","6.360 m²"],["foundation","Luas Bangunan","1.700 m²"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Parung Serpong, Banten", addr: "Parung Serpong, Banten", jual: 29830000000, specs: [["crop_square","Luas Tanah","19.889 m²"]] },
  { t: "Ex Pabrik Garment", cat: "factory", loc: "Karawang, Jawa Barat", addr: "Kawasan Industri Mitra, Karawang", jual: 47000000000, specs: [["crop_square","Luas Tanah","4.050 m²"],["foundation","Luas Bangunan","7.392 m²"]] },
  { t: "Kavling Industri siap bangun", cat: "land", loc: "Busan, Tangerang", addr: "Kawasan industri Busan, Tangerang", jual: 9849600000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","5.472 m²"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Kebayoran Lama, Jakarta Selatan", addr: "Jl. Gandaria, Kebayoran Lama, Jakarta Selatan", jual: 560000000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","14.000 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Subang, Jawa Barat", addr: "Subang (1,5 km dari exit tol Subang)", jual: 25072450000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","38.573 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Cilegon, Banten", addr: "Cilegon, Banten", jual: 13200000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","6.600 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Ex Pabrik Molding", cat: "factory", loc: "Rangkas Bitung, Serang, Banten", addr: "Rangkas Bitung, Serang, Banten", jual: null, sewa: { price: 185700000, period: "month", unitHarga: "Per m² bln" }, specs: [["crop_square","Luas Tanah","6.190 m²"],["foundation","Luas Bangunan","2.786 m²"]] },
  { t: "Apt. Pakubuwono Residence", cat: "apartment", loc: "Kebayoran, Jakarta Selatan", addr: "Tower Cottonwood, Lantai 22 - Pakubuwono, Jakarta Selatan", jual: 12000000000, specs: [["crop_square","Luas","153 Sqm"],["chair","Kondisi","Unfurnished"],["king_bed","Kamar Tidur","4 BR"]] },
  { t: "Apt. Essence Dharmawangsa", cat: "apartment", loc: "Dharmawangsa, Jakarta Selatan", addr: "Tower South, Lantai 21 - Dharmawangsa, Jakarta Selatan", jual: 3750000000, specs: [["crop_square","Luas","166 sqm"],["chair","Kondisi","Unfurnished"],["king_bed","Kamar Tidur","3 BR"]] },
  { t: "Apt. Kusuma Candra", cat: "apartment", loc: "Jakarta Selatan", addr: "Tower C, Lantai 3AM - Kusuma Candra", jual: 4500000000, specs: [["crop_square","Luas","151 sqm, 3 BR"],["chair","Kondisi","Unfurnished"]] },
  { t: "Apt. Kemang Jaya", cat: "apartment", loc: "Kemang, Jakarta Selatan", addr: "Tower A, Lantai 23 - Kemang Jaya", jual: 2500000000, specs: [["crop_square","Luas","166 sqm, 2 BR"],["chair","Kondisi","Furnished"]] },
  { t: "Ruko 2 unit (gandeng)", cat: "komersial", loc: "Kebayoran Baru, Jakarta Selatan", addr: "Jl. Wijaya, Kebayoran Baru, Jakarta Selatan", jual: 9000000000, specs: [["crop_square","Luas Tanah","120 sqm"],["foundation","Luas Bangunan","240 sqm (4 lantai)"]] },
  { t: "Office space di Gedung SUDIRMAN78", cat: "komersial", loc: "Sudirman, Jakarta Pusat", addr: "Gedung Sudirman 78, Lantai 8", jual: 23000000000, specs: [["crop_square","Luas","338,70 m²"]] },
  { t: "Ex Gudang", cat: "factory", loc: "Cigombong, Bogor", addr: "Cigombong, Bogor, Jawa Barat", jual: 57500000000, specs: [["crop_square","Luas Tanah","20.913 m²"],["foundation","Luas Bangunan","8.217 m²"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Parung Serpong, Banten", addr: "Parung Serpong, Banten", jual: 3950000000, specs: [["crop_square","Luas Tanah","1.315 m²"]] },
  { t: "Ex Pabrik Assembly Otomotif", cat: "factory", loc: "Karawang, Jawa Barat", addr: "Karawang, Jawa Barat", jual: 55000000000, specs: [["crop_square","Luas Tanah","36.290 m²"],["foundation","Luas Bangunan","7.696 m²"]] },
  { t: "Pabrik karbon active", cat: "factory", cur: "USD", loc: "Tangerang", addr: "Kawasan industri Baja Emas, Tangerang", jual: 1500000, specs: [["crop_square","Luas Tanah","2.941 m²"],["foundation","Luas Bangunan","1.254 m²"]] },
  { t: "Ex Pabrik", cat: "factory", loc: "Bekasi", addr: "Jl. Medan Satria, Bekasi", jual: 284272000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","35.534 m²"],["foundation","Luas Bangunan","15.654 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Subang, Jawa Barat", addr: "Kota Subang, Jawa Barat", jual: 47169500000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","134.770 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Tanah Kosong (sawah)", cat: "land", loc: "Karawang, Jawa Barat", addr: "Karawang, Jawa Barat", jual: 2323800000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","15.492 m²"]] },
  { t: "Ex Pabrik", cat: "factory", loc: "Karawang Timur", addr: "Karawang Timur, Jawa Barat", jual: 13897500000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","9.265 m²"],["foundation","Luas Bangunan","950 m²"]] },
  { t: "Apt. Patria Park", cat: "apartment", loc: "Jakarta Timur", addr: "Patria Park, Lantai 5", jual: 1200000000, specs: [["crop_square","Luas","84 sqm"],["chair","Kondisi","Furnished"],["king_bed","Kamar Tidur","2 BR"]] },
  { t: "Apt. Kemang Village", cat: "apartment", loc: "Kemang, Jakarta Selatan", addr: "Tower Cosmo, Lantai 22 - Kemang Village", jual: 2300000000, specs: [["crop_square","Luas","105 sqm"],["chair","Kondisi","Semi furnished"]] },
  { t: "Apt. Griya Pancoran / Mountain Park", cat: "apartment", loc: "Pancoran, Jakarta Selatan", addr: "Griya Pancoran / Mountain Park, Lantai 7", jual: 2500000000, specs: [["crop_square","Luas","149 sqm, 3 BR"],["chair","Kondisi","Furnished"]] },
  { t: "Rumah di dalam cluster exclusive", cat: "residence", loc: "Jati Padang, Jakarta Selatan", addr: "Jati Padang, Jakarta Selatan", jual: 4400000000, specs: [["crop_square","Luas Tanah","169 sqm"],["foundation","Luas Bangunan","192 sqm (3 lantai)"],["king_bed","Kamar Tidur","3 BR"]] },
  { t: "Apt. Essence Dharmawangsa", cat: "apartment", loc: "Dharmawangsa, Jakarta Selatan", addr: "Tower South, Lantai 31 - Dharmawangsa", jual: 4500000000, specs: [["crop_square","Luas","181 sqm"],["chair","Kondisi","Semi furnished"]] },
  { t: "Ex Pabrik", cat: "factory", loc: "Cireundeuk, Ciputat, Tangsel", addr: "Cireundeuk, Ciputat, Tangerang Selatan", jual: 106074000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","11.786 m²"],["foundation","Luas Bangunan","7.000 m²"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Serang, Banten", addr: "Serang, Banten", jual: 27309000000, specs: [["crop_square","Luas Tanah","30.344 m²"]] },
  { t: "Ex Pabrik Bola", cat: "factory", loc: "Cikarang, Bekasi", addr: "Jl. Setu Tambun - Cikarang", jual: 50000000000, specs: [["crop_square","Luas Tanah","8.995 m²"],["foundation","Luas Bangunan","3.445 m²"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Jonggol, Bogor", addr: "Jl. Puncak 2, Jonggol", jual: 11550000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","7.700 m²"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Cilegon, Banten", addr: "Cilegon (Dekat PCI)", jual: 5060000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","4.400 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Ex Workshop", cat: "factory", loc: "Rawamangun, Jakarta Timur", addr: "Rawamangun, Jakarta Timur", jual: 9750000000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","650 m²"],["foundation","Luas Bangunan","688 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Tanah Kosong", cat: "land", loc: "Jati Uwung, Tangerang", addr: "Jati Uwung, Kota Tangerang", jual: 138213500000, unitHarga: "Per m²", specs: [["crop_square","Luas Tanah","37.355 m²"],["verified_user","Legalitas","SHGB"]] },
  { t: "Ex Pabrik Garment", cat: "factory", cur: "USD", loc: "Majalengka, Jawa Barat", addr: "Majalengka, Jawa Barat", jual: 4000000, specs: [["crop_square","Luas Tanah","21.201 m²"],["foundation","Luas Bangunan","10.000 m²"]] },
];

// Pastikan kategori Komersial ada
if (!CAT.komersial) {
  const doc = await c.create({ _type: "category", title: "Komersial", slug: { _type: "slug", current: "komersial" } });
  CAT.komersial = doc._id;
  console.log("created category Komersial:", doc._id);
}

let created = 0;
const existingTitles = new Set(
  (await c.fetch(`*[_type == "property"]{title}`)).map((p) => (p.title ?? "").toLowerCase()),
);

for (const it of L) {
  if (existingTitles.has(it.t.toLowerCase())) {
    console.log("skip (sudah ada):", it.t);
    continue;
  }

  const pricing = [];
  if (it.jual) pricing.push({ _key: "j" + Math.random().toString(36).slice(2, 7), transactionType: "jual", price: it.jual, pricePeriod: "once", priceUnit: it.unitHarga });
  if (it.sewa) {
    const cur = it.sewa.cur ?? "IDR";
    pricing.push({ _key: "s" + Math.random().toString(36).slice(2, 7), transactionType: "sewa", price: it.sewa.price, pricePeriod: it.sewa.period, priceUnit: it.sewa.unitHarga });
  }
  const defaultCurrency = it.cur === "USD" ? "USD" : "IDR";

  const doc = {
    _type: "property",
    title: it.t,
    slug: { _type: "slug", current: slugify(it.t) },
    category: { _type: "reference", _ref: CAT[it.cat] },
    defaultCurrency,
    status: "Tersedia",
    locationShort: it.loc,
    fullAddress: it.addr,
    pricing,
    specsList: it.specs.map(([icon, label, value]) => ({ icon, label, value })),
    description: pt(`${it.t} di ${it.loc}. ${it.specs.map(([, l, v]) => `${l}: ${v}`).join(", ")}. Untuk informasi lebih lanjut silakan hubungi tim kami.`),
  };

  await c.create(doc);
  created++;
  console.log("created:", it.t);
}

console.log(`Selesai. Dibuat ${created} properti baru.`);
