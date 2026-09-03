/**
 * Tambah 4 properti baru (tanpa hapus data) dengan tipe penjualan beraneka,
 * lengkap dengan foto utama + galeri, spesifikasi, KPR, dan koordinat peta.
 *
 * Run: node scripts/seed-extra-properties.mjs
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

// Gambar placeholder dari pool yang sudah dipakai seed (aida-public).
const IMG = {
  industrialLand:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAoM5RS9_Uh_GOlRh6gtUnrUX6txphVrSQRkgYvNQp-nkhirigbTQA41uiaH5xHhsYDryXhdg5PgXWFNaccHQAukHVlXAXvyhRhaXz1D4HnfO14B5OMEJjW9SNYSg0MQuj6tldEyENMnlm3KT4JLDYZkdGYltciUn1A4gBb3hD1__At2Y_bjidSF22soMrshZ7iWQlPv4my3mw8HjSej0hSXKZqfaG6oe5yp37CmJ3RFTWukbk01-4l",
  factoryGoldenHour:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6pZtkF3DKeql16nIGSyOv5Lmm8plcg1x6vi4OpvOxp_kth3f3yJcWxIYWF-0-2gDEHlRrTuWnlXpj1c2eaJyjd5YOFZfx7HzXNMM7Tj4zexsb3N0kEmdkR14Xs-EtkeB46zJ5JqaO0uO71V2KkDw2NNkgC-wbeZgxgzaieXwt5Ur6De9CaF4D4vbke0tjvFaNRBVCkB-Md1YRUCSmP0Vnk13eduNUkww4A1QwgF3rzgytapYbyyZy",
  emptyLandLot:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB51Z1DLuQXHlA4MHE5tH9Sq54IfCMxDVKvaaouqGVJdR6-QADxfnUuFrA64OSt6LrPJ2V0IzW_TtM2q_Pb5kg-IkAEchRYBUeUG1WLqcSDen8Q_qmK-b4lWpTFK2pxzjOiNh7BEvpUkFIbpv7UB06yL3-nTiCc6-IiSP7wf1RwcPXcalM5_5T0MuH7qOB4yeKsoQXFP5fQbm53fmVSkFNp5K6Hcut7VV9SOMt9SU93OEyX_FvZgSqk",
  logisticsHub:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvsKwSqdF5ipLtUCpGHDe2s5OrNomqsSZ_aXwk_f43Zp_q3q16v0bMTALXbPVJOS7usgxje-TSD5aj-bXmb4VTpI579LGStwh1TM8VLz2ds6hzFdFCJzIa0suEpZCKvbz58Jejd3sUoR89GWFd2gqFbTRTRe8bPRleKEVu1FpizXSR5HHz1oxcTqPnM15NZJchneM4MF-uE84MtHNd-v_DJgzdDK3sBL1KYloULKEqh4rQMrjEEHyp",
  villaCanggu:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqy9qYW2lGV-jJxJF0QbhgGxL4PYmyuJye5A7Oxch3InBbfLF0Slec_THLK3YeblBNrQ4Zs5OKgkwh4HiY1EdvgW1ZpuUwB1x7XBJ-_7_zeTG5Qo71Uk6GLzJAEz9ZC0IhTvP0pbqgMQhKX537wU6H5psMpgk5tuAyKElMG6cBwAlTpvIAqPOvkkUOU1ADiSEcxQVSBVO6FJxa55RPQWPfhNyPMkU23TsG7Z75KjuWNymB-Rj_UNPI",
  interiorLiving:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChEGA8B80YAeGAHEqmnpkDJtEvmG0bGvjf6LwJVRAcAjXXzet-u_ZbamOUdLrtqZnpLRRpYjf79M2O2DqjdH70R2IiQBFH_mfaooSazdqSiF2GRxlctxeNkYBfS-_lhBsnxIO7zUpuFbH7-Hi0QiG4ubaKVdGXOFnyprem9e0hgElRcfJ8r5Mb3rV4f7OoaB1bML0n5fapYQEdWYvmHDVW5G5W_dDvKIkIsZjYAMK57nDqvIHBfJ11",
  kitchenModern:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKRAe6NEav6ljHwSHjy7WM2HKSTVnC7oY8-V0q-15IY6uslJjHKzH3S5h0Z6XChFu05MmVMk72OXQht2pmS-kk2f6l8PKIvyA9a1aTfWr4OfMAKZWnBJdFSfKgWY3s7GMR8ijsTL9QykOv9f4KS3Luxep5604leQiPGB_wl65nKbNxELS7od7ZPewpBJM_rrI3XweDHAyBEK7ps3xOxjXhglr-hZTkKnNC4zf1H8KyhdNuu-q49IHT",
  bedroomMaster:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCucECvfd4p7HEtE7kyL0ha9y1Nv3tUO3xMb7NtjKuqUqdB2o9zEOxeOqmM_IzlVWwtSjWVY1kO8RVm7myh1t-O5cW-w_-aKIyLWZ6Klv8XsHw1A5fEpXRic3p4X0DL4KbB1K9fZv-GZ1fgtWSUOAtv99kFz-mkdXrSxSJkd4Gtn2mKP8_JVEdToO_CQ9Z52dgxmG72NY03wmC3zCQ3Bt6Wcv65d2HZlW1IfDPAq1IGVNyzwSjOw2bs",
};

async function uploadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return (await client.assets.upload("image", buffer, { filename, contentType: "image/jpeg" }))._id;
}

function imgRef(assetId, alt) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}

function portableText(text) {
  return [{ _type: "block", style: "normal", children: [{ _type: "span", text }] }];
}

const PROPERTIES = [
  {
    title: "Ruko 2 Lantai Sudirman",
    slug: "ruko-2-lantai-sudirman",
    category: "Land",
    defaultCurrency: "IDR",
    status: "Tersedia",
    locationShort: "Jakarta Pusat",
    fullAddress: "Jl. Jend. Sudirman, Jakarta Pusat, DKI Jakarta",
    lat: -6.2088,
    lng: 106.8222,
    kprAvailable: true,
    kprDownPaymentPercent: 20,
    kprInterestRate: 8.5,
    kprMaxTenorYears: 15,
    kprNotes: "Bekerja sama dengan beberapa bank untuk KPR ruko.",
    imageKey: "industrialLand",
    galleryKeys: ["industrialLand", "factoryGoldenHour"],
    pricing: [
      { transactionType: "jual", price: 12500000000, pricePeriod: "once" },
      { transactionType: "sewa", price: 150000000, pricePeriod: "year" },
    ],
    specsList: [
      { icon: "storefront", label: "Tipe Properti", value: "Ruko" },
      { icon: "crop_square", label: "Luas Bangunan", value: "250 m²" },
      { icon: "domain", label: "Lantai", value: "2 Lantai" },
      { icon: "bolt", label: "Daya Listrik", value: "11.000 VA" },
      { icon: "verified_user", label: "Sertifikat", value: "SHM" },
      { icon: "garage", label: "Parkir", value: "2 Mobil" },
    ],
    facilities: ["Akses Jalan Besar", "Area Komersial", "AC", "CCTV"],
    description: "Ruko strategis di koridor Sudirman dengan potensi bisnis tinggi. Akses mudah, dekat perkantoran dan fasilitas umum.",
    isFeatured: true,
  },
  {
    title: "Gudang Racking Cikarang",
    slug: "gudang-racking-cikarang",
    category: "Factory",
    defaultCurrency: "IDR",
    status: "Tersedia",
    locationShort: "Cikarang, Bekasi",
    fullAddress: "Kawasan Industri MM2100, Cikarang, Bekasi, Jawa Barat",
    lat: -6.349,
    lng: 107.126,
    kprAvailable: false,
    imageKey: "logisticsHub",
    galleryKeys: ["logisticsHub", "warehouseAlt"],
    pricing: [
      { transactionType: "sewa", price: 250000000, pricePeriod: "year" },
      { transactionType: "sewa", price: 22000000, pricePeriod: "month" },
    ],
    specsList: [
      { icon: "warehouse", label: "Tipe Properti", value: "Gudang" },
      { icon: "crop_square", label: "Luas Bangunan", value: "5.000 m²" },
      { icon: "villa", label: "Plafon", value: "10 meter" },
      { icon: "bolt", label: "Daya Listrik", value: "66.000 VA" },
      { icon: "local_fire_department", label: "Fire System", value: "Sprinkler" },
      { icon: "local_shipping", label: "Loading Dock", value: "8 Dock" },
    ],
    facilities: ["Loading Dock", "Fire System", "CCTV", "Parkir Truk"],
    description: "Gudang modern dengan sistem racking, dilengkapi loading dock dan fire protection. Cocok untuk distribusi skala besar.",
    isFeatured: false,
  },
  {
    title: "Villa Tropis Ubud",
    slug: "villa-tropis-ubud",
    category: "Residence",
    defaultCurrency: "IDR",
    status: "Tersedia",
    locationShort: "Ubud, Bali",
    fullAddress: "Jl. Raya Tegallalang, Ubud, Gianyar, Bali",
    lat: -8.4374,
    lng: 115.2768,
    kprAvailable: true,
    kprDownPaymentPercent: 25,
    kprInterestRate: 7.5,
    kprMaxTenorYears: 20,
    kprNotes: "KPR tersedia dengan DP fleksibel.",
    imageKey: "villaCanggu",
    galleryKeys: ["villaCanggu", "interiorLiving", "kitchenModern", "bedroomMaster"],
    pricing: [
      { transactionType: "jual", price: 4500000000, pricePeriod: "once" },
    ],
    specsList: [
      { icon: "cottage", label: "Tipe Properti", value: "Villa" },
      { icon: "crop_square", label: "Luas Tanah", value: "600 m²" },
      { icon: "foundation", label: "Luas Bangunan", value: "400 m²" },
      { icon: "king_bed", label: "Kamar Tidur", value: "4" },
      { icon: "bathtub", label: "Kamar Mandi", value: "4" },
      { icon: "pool", label: "Kolam Renang", value: "Pribadi" },
    ],
    facilities: ["Private Pool", "Tropical Garden", "Modern Kitchen", "WiFi"],
    description: "Villa tropis di kawasan tenang Ubud dengan kolam renang pribadi dan pemandangan sawah. Cocok untuk hunian maupun investasi.",
    isFeatured: true,
  },
  {
    title: "Kavling Pabrik MEA Cikarang",
    slug: "kavling-pabrik-mea-cikarang",
    category: "Land",
    defaultCurrency: "IDR",
    status: "Under Offer",
    locationShort: "Cikarang, Bekasi",
    fullAddress: "Musi & East Jakarta Industrial Park (MEA), Cikarang, Bekasi, Jawa Barat",
    lat: -6.328,
    lng: 107.114,
    kprAvailable: false,
    imageKey: "emptyLandLot",
    galleryKeys: ["emptyLandLot", "industrialLand"],
    pricing: [
      { transactionType: "jual", price: 18500000000, pricePeriod: "once" },
    ],
    specsList: [
      { icon: "landscape", label: "Tipe Properti", value: "Kavling" },
      { icon: "crop_square", label: "Luas Tanah", value: "2.200 m²" },
      { icon: "verified_user", label: "Sertifikat", value: "SHGB" },
      { icon: "add_road", label: "Akses", value: "Jalan Utama" },
      { icon: "bolt", label: "Daya Listrik", value: "Tersedia" },
    ],
    facilities: ["Akses Tol", "Drainase", "Halaman Luas"],
    description: "Kavling siap bangun di kawasan industri MEA dengan akses utama. Ideal untuk pabrik dan pergudangan.",
    isFeatured: true,
  },
];

// Gambar tambahan yang belum ada di IMG di atas
const EXTRA_URLS = {
  warehouseAlt:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvsKwSqdF5ipLtUCpGHDe2s5OrNomqsSZ_aXwk_f43Zp_q3q16v0bMTALXbPVJOS7usgxje-TSD5aj-bXmb4VTpI579LGStwh1TM8VLz2ds6hzFdFCJzIa0suEpZCKvbz58Jejd3sUoR89GWFd2gqFbTRTRe8bPRleKEVu1FpizXSR5HHz1oxcTqPnM15NZJchneM4MF-uE84MtHNd-v_DJgzdDK3sBL1KYloULKEqh4rQMrjEEHyp",
};

async function main() {
  const cache = {};
  async function image(key, alt) {
    const url = EXTRA_URLS[key] ?? IMG[key];
    if (!url) throw new Error(`No image for key: ${key}`);
    if (!cache[url]) {
      const name = `extra-${(cache[url] = Object.keys(cache).length + 1)}.jpg`;
      cache[url] = await uploadImage(url, name);
      console.log(`  uploaded ${name} <- ${key}`);
    }
    return imgRef(cache[url], alt);
  }

  for (const p of PROPERTIES) {
    const mainImage = await image(p.imageKey, p.title);
    const gallery = [];
    for (const g of p.galleryKeys) {
      gallery.push(await image(g, `${p.title} - ${g}`));
    }

    const doc = {
      _type: "property",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: p.category,
      defaultCurrency: p.defaultCurrency,
      status: p.status,
      locationShort: p.locationShort,
      fullAddress: p.fullAddress,
      latitude: p.lat,
      longitude: p.lng,
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`,
      kprAvailable: p.kprAvailable,
      kprDownPaymentPercent: p.kprDownPaymentPercent,
      kprInterestRate: p.kprInterestRate,
      kprMaxTenorYears: p.kprMaxTenorYears,
      kprNotes: p.kprNotes,
      mainImage,
      gallery,
      pricing: p.pricing.map((entry) => ({ _key: `e${Math.random().toString(36).slice(2, 8)}`, ...entry })),
      specsList: p.specsList,
      facilities: p.facilities,
      description: portableText(p.description),
      isFeatured: p.isFeatured,
    };

    const created = await client.create(doc);
    console.log(`created property: ${p.title} (${created._id})`);
  }

  console.log("Selesai! 4 properti baru ditambahkan.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
