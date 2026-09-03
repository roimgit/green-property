/**
 * Seed demo content into Sanity.
 *
 * Uploads the design's placeholder images as Sanity assets, then creates
 * property / companyProfile / partnerLogo / testimonial documents so the
 * pages can render real data from Sanity.
 *
 * Run:  node scripts/seed-sanity.mjs
 * Requires SANITY project id/dataset/token in .env (loaded by dotenv below).
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

// ---- Placeholder images from the /design HTML files --------------------------
const IMG = {
  heroIndustrial:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCiSB-a2lXNFnoNG_Uo7kf37dTWTGx4PoRNpJY0cYUl6C3tIaDq9J6tl2YYjZ6QuCOdjhZZvcljXr8uD3YNQmZWlF0Wnvu-6lQzqpHH-7MiZy6ewHby99Yq6_IFn5koOWX_WXSCkV38h4sgXqCV7HshWNyIw8qSZqovhlJO1cHvYz7stqQxAeiYWWIrrXaGqAGnhx9UPmwjRZr0bz05HnjRRp8eIChiVDGaUxyGFz_XfvI-nee1GGlN",
  industrialLand:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAoM5RS9_Uh_GOlRh6gtUnrUX6txphVrSQRkgYvNQp-nkhirigbTQA41uiaH5xHhsYDryXhdg5PgXWFNaccHQAukHVlXAXvyhRhaXz1D4HnfO14B5OMEJjW9SNYSg0MQuj6tldEyENMnlm3KT4JLDYZkdGYltciUn1A4gBb3hD1__At2Y_bjidSF22soMrshZ7iWQlPv4my3mw8HjSej0hSXKZqfaG6oe5yp37CmJ3RFTWukbk01-4l",
  smartFactory:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBYEq1eKagJ6Ifinwf17Ckwl7lUFeAIgxDtw_vutoOB7FfE-K-W7FFzEYtrKFj-Eji7Zx85t1e0vhNKMxM4Lz-w2eo4HcDFA_MDcBB16grS1kLjO3IYwk2ZYVoXra-sz81fjolSHIRP-BByOmyO1ypYQENnCdDxmHgnFDsxE58Fn8_YCs6puCRhV36qbYpcMs7U0527TNbM5uslR8Y3qZUxYd6RlZ9KN-8I2JeN5tdYmTRQHK0hfGx8",
  logisticsHub:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAvsKwSqdF5ipLtUCpGHDe2s5OrNomqsSZ_aXwk_f43Zp_q3q16v0bMTALXbPVJOS7usgxje-TSD5aj-bXmb4VTpI579LGStwh1TM8VLz2ds6hzFdFCJzIa0suEpZCKvbz58Jejd3sUoR89GWFd2gqFbTRTRe8bPRleKEVu1FpizXSR5HHz1oxcTqPnM15NZJchneM4MF-uE84MtHNd-v_DJgzdDK3sBL1KYloULKEqh4rQMrjEEHyp",
  factoryGoldenHour:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD6pZtkF3DKeql16nIGSyOv5Lmm8plcg1x6vi4OpvOxp_kth3f3yJcWxIYWF-0-2gDEHlRrTuWnlXpj1c2eaJyjd5YOFZfx7HzXNMM7Tj4zexsb3N0kEmdkR14Xs-EtkeB46zJ5JqaO0uO71V2KkDw2NNkgC-wbeZgxgzaieXwt5Ur6De9CaF4D4vbke0tjvFaNRBVCkB-Md1YRUCSmP0Vnk13eduNUkww4A1QwgF3rzgytapYbyyZy",
  emptyLandLot:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB51Z1DLuQXHlA4MHE5tH9Sq54IfCMxDVKvaaouqGVJdR6-QADxfnUuFrA64OSt6LrPJ2V0IzW_TtM2q_Pb5kg-IkAEchRYBUeUG1WLqcSDen8Q_qmK-b4lWpTFK2pxzjOiNh7BEvpUkFIbpv7UB06yL3-nTiCc6-IiSP7wf1RwcPXcalM5_5T0MuH7qOB4yeKsoQXFP5fQbm53fmVSkFNp5K6Hcut7VV9SOMt9SU93OEyX_FvZgSqk",
  warehouseModern:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAIkhiokD_HL7rubeaL_tbvuhosqfs5kVyYk7jdU6KgY4cnaRLkS-LHQDf1tCVAnbiyS_A7pk1G7HmxMHpgY3g1IRBG8a6tCinP9ZaMDVjNRUFQNe8dinpOeMXE_DUUUOQka7pbXxvs5j-D0UWYOBj1RYUI6P6m3IcfS8Id9a6sgDn5lJxDuDCAQcO_7UOqHW5_j7LerEUorKYLq7LdHcJiQnWN6dPajrr83o9G1AzRUld2LbRPbue6",
  villaCanggu:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBqy9qYW2lGV-jJxJF0QbhgGxL4PYmyuJye5A7Oxch3InBbfLF0Slec_THLK3YeblBNrQ4Zs5OKgkwh4HiY1EdvgW1ZpuUwB1x7XBJ-_7_zeTG5Qo71Uk6GLzJAEz9ZC0IhTvP0pbqgMQhKX537wU6H5psMpgk5tuAyKElMG6cBwAlTpvIAqPOvkkUOU1ADiSEcxQVSBVO6FJxa55RPQWPfhNyPMkU23TsG7Z75KjuWNymB-Rj_UNPI",
  interiorLiving:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuChEGA8B80YAeGAHEqmnpkDJtEvmG0bGvjf6LwJVRAcAjXXzet-u_ZbamOUdLrtqZnpLRRpYjf79M2O2DqjdH70R2IiQBFH_mfaooSazdqSiF2GRxlctxeNkYBfS-_lhBsnxIO7zUpuFbH7-Hi0QiG4ubaKVdGXOFnyprem9e0hgElRcfJ8r5Mb3rV4f7OoaB1bML0n5fapYQEdWYvmHDVW5G5W_dDvKIkIsZjYAMK57nDqvIHBfJ11",
  kitchenModern:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDKRAe6NEav6ljHwSHjy7WM2HKSTVnC7oY8-V0q-15IY6uslJjHKzH3S5h0Z6XChFu05MmVMk72OXQht2pmS-kk2f6l8PKIvyA9a1aTfWr4OfMAKZWnBJdFSfKgWY3s7GMR8ijsTL9QykOv9f4KS3Luxep5604leQiPGB_wl65nKbNxELS7od7ZPewpBJM_rrI3XweDHAyBEK7ps3xOxjXhglr-hZTkKnNC4zf1H8KyhdNuu-q49IHT",
  bedroomMaster:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCucECvfd4p7HEtE7kyL0ha9y1Nv3tUO3xMb7NtjKuqUqdB2o9zEOxeOqmM_IzlVWwtSjWVY1kO8RVm7myh1t-O5cW-w_-aKIyLWZ6Klv8XsHw1A5fEpXRic3p4X0DL4KbB1K9fZv-GZ1fgtWSUOAtv99kFz-mkdXrSxSJkd4Gtn2mKP8_JVEdToO_CQ9Z52dgxmG72NY03wmC3zCQ3Bt6Wcv65d2HZlW1IfDPAq1IGVNyzwSjOw2bs",
  bathroomLux:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCYB3GX4d9ToJC6RLAqZmumQFls_qFA9QXy8HUwNLSh0D4f4W52mXSmEPEjS7cLjFMw7eTaX-aWBJGf4A_q048D3T_SshiuyTjxww5S-Q0bF5swFfMHHjFoAOr0rILZfOu4DhYfn0xWrjGTiW_DFUcjosgd4T5AaxSfbSx9zoQJAMTyqaSwbSNzwV_dGkB21SBDWbEIKqNvlOKOv-UMpdb78ypY-y1g80nr-eL_Gdkf85gQhW5vyXVx",
  villaSeminyak:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuATWo8vhBo58uxcw4ZP1aWCwS1MDYPdWNKZQC_8KtWebjulDvepeL9YXW6EC27iD9YLF1NnjH4o4GemMlxwylMtoOGatWP-meMftIvcrKtJB108ZFXtqV5nHb9lDd2kebX7s4oaKJ34X0D2HtVU9II9_YwGquFJq2759MwAiIBs2_XRy_QyvMJbSel7lw32IZR4sAxb2ESnbIXnfQSpS9wdJIPX7wuf27b-3KLrKjuiD3dQKnyhUSYv",
  estateUluwatu:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvldBViqLf3nwkPcUnZEpGd2a8GJ_pehlA6sTUkcbpNFRuDbbwbkH5mV-AY0jBOXjvzBveOHic2r-tuqGKjaCmY6w-BUoVpLY8VO1gwv3F7vMv4tpFTz59kUSKIno6iwV4AEVdimrVyXuggoyxaHYDrYDqKFDjaGD576ic55kJ3hT7MnT65SvfXzVanQyBfy6fIB_TkVzLcmyBVpiti7EilzGlZvHxSQNNmzL-4opHWj1iBwv53TlM",
  villaPererenan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAM8ttmxQWLciHliNg5OnhLKf0NJuS38pTVBTlUmUPUeiC7H2BViuSM4t5HyKlpyrixGBv4O_DP-WlxMMIk_7gICYypQc1REuFPTBtzhQtH49_IR6zywNSJEvIWn3_baNApUBtfkeHaVZpVQF5BuLCZBUchAjpG0Psjr-ZQuHWmrOaC3r-ak_jCmMrw3gihPPGJXl8S2EwVEN90VF8LMdG6oCO8-EpAWust1V5j7ip6XfvhkvmSWM_o",
  mapPlaceholder:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAODdb1TjavYT_YOvGs9NdO_2-2F--HOP3ptu9el8SqcIC3nekkpH1rqfgMi7er0vpjU1aAv8ZU5zr3CYSXalrIswvB8xT5-ep7fLlP3V3MGBrH92rwaRb7hVIeeQgiVmrDxYBM_0JGxu3x0kXh27a7uOM7tFpnGsQOFeQcGe3Rd-0E4VSCeQ8LVa68WUh1DXoZbMJETGoFx4cCQ50eDEMw-trlZ9MDRw5eVbFGyDkyAzbHLbTb_krj",
  emptyState:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAsP_UxII83ms-FixfXIiOanvONKWZuk8W0dXSbqICM96gNpB3SL1u15oNRsq6lNY851MSuzs5J4MOKw53UgF-Up98VIBbqBwhqVA5ll1eDMZ6o_ddwORDSupYmvCaYMn_ptiBvBCkIPmLQVDInGgn__XBCMoh_0OH8f2sHJtDc-leGnJw9U3ookybGujZ0w7dmT15zphEe8K_ZbxaPJWH6zgUaVkhmTze9N4ZbNib9dvv0nLdQoRaR",
};

async function uploadImage(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: "image/jpeg",
  });
  return asset._id;
}

function imgRef(assetId, alt) {
  return { _type: "image", asset: { _type: "reference", _ref: assetId }, alt };
}

function portableText(text) {
  return [
    {
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text }],
    },
  ];
}

async function deleteExisting() {
  const docs = await client.fetch('*[_type in ["property","companyProfile","partnerLogo","testimonial"]]._id');
  if (docs.length) {
    await client.delete({ query: '*[_type in ["property","companyProfile","partnerLogo","testimonial"]]' });
  }
  return docs;
}

async function main() {
  console.log("Cleaning existing content documents...");
  await deleteExisting();

  // Upload images (dedupe by key)
  const cache = {};
  async function image(url, alt) {
    if (!cache[url]) {
      const name = `seed-${(cache[url] = Object.keys(cache).length + 1)}.jpg`;
      cache[url] = await uploadImage(url, name);
      console.log(`  uploaded asset ${cache[url]} <- ${url.slice(0, 70)}...`);
    }
    return imgRef(cache[url], alt);
  }

  console.log("Seeding properties...");
  const properties = [
    {
      title: "Kawasan Industri Cikarang",
      slug: "kawasan-industri-cikarang",
      category: "Factory",
      transactionType: "Jual",
      price: 15000000000,
      status: "Tersedia",
      locationShort: "Cikarang, Bekasi",
      fullAddress: "Jl. Industri Utama, Cikarang, Bekasi, Jawa Barat",
      mainImage: "factoryGoldenHour",
      gallery: ["factoryGoldenHour", "industrialLand"],
      specs: {
        certificate: "SHGB",
        landArea: 5000,
        buildingArea: 3500,
        electricity: "10k VA",
        floors: 2,
      },
      description: "Kawasan industri modern dengan akses langsung ke tol, siap untuk operasional pabrik dan gudang.",
      facilities: ["Akses Tol", "Gate 24 Jam", "CCTV", "Fire System"],
      isFeatured: true,
    },
    {
      title: "Kavling Komersial TB Simatupang",
      slug: "kavling-komersial-tb-simatupang",
      category: "Land",
      transactionType: "Jual",
      price: 45000000000,
      status: "Tersedia",
      locationShort: "Jakarta Selatan",
      fullAddress: "TB Simatupang, Jakarta Selatan, DKI Jakarta",
      mainImage: "emptyLandLot",
      gallery: ["emptyLandLot", "industrialLand"],
      specs: {
        certificate: "SHM",
        landArea: 2500,
      },
      description: "Kavling komersial strategis di koridor TB Simatupang dengan potensi pengembangan tinggi.",
      facilities: ["Zona Komersial", "Akses Jalan Besar"],
      isFeatured: true,
    },
    {
      title: "Gudang Modern Karawang",
      slug: "gudang-modern-karawang",
      category: "Factory",
      transactionType: "Sewa",
      price: 120000000,
      status: "Tersedia",
      locationShort: "KIIC, Karawang",
      fullAddress: "Kawasan Industri KIIC, Karawang, Jawa Barat",
      mainImage: "warehouseModern",
      gallery: ["warehouseModern", "logisticsHub"],
      specs: {
        certificate: "SHGB",
        landArea: 3200,
        buildingArea: 3200,
        electricity: "20k VA",
        floors: 1,
      },
      description: "Gudang modern di kawasan industri KIIC, cocok untuk distribusi dan pergudangan skala besar.",
      facilities: ["Dock Loading", "Fire System", "CCTV", "Parkir Luas"],
      isFeatured: false,
    },
    {
      title: "Delta Silicon Plot 8A",
      slug: "delta-silicon-plot-8a",
      category: "Land",
      transactionType: "Jual",
      price: 0,
      status: "Tersedia",
      locationShort: "Cikarang, West Java",
      fullAddress: "Delta Silicon, Cikarang, Jawa Barat",
      mainImage: "industrialLand",
      gallery: ["industrialLand", "emptyLandLot"],
      specs: {
        certificate: "SHGB",
        landArea: 50000,
      },
      description: "Prime 5-hectare plot with direct toll access. Ideal for heavy manufacturing.",
      facilities: ["Akses Tol", "Listrik Tinggi", "Drainase"],
      isFeatured: true,
    },
    {
      title: "GIIC Smart Factory B",
      slug: "giic-smart-factory-b",
      category: "Factory",
      transactionType: "Jual",
      price: 0,
      status: "Tersedia",
      locationShort: "GIIC, Bekasi",
      fullAddress: "Greenland International Industrial Center, Bekasi",
      mainImage: "smartFactory",
      gallery: ["smartFactory", "factoryGoldenHour"],
      specs: {
        certificate: "SHGB",
        landArea: 12500,
        buildingArea: 12500,
        electricity: "High Cap",
        floors: 1,
      },
      description: "Turnkey smart factory building ready for automated assembly lines.",
      facilities: ["Turnkey", "Listrik Tinggi", "Loading Dock", "CCTV"],
      isFeatured: true,
    },
    {
      title: "Logistics Hub K-1",
      slug: "logistics-hub-k-1",
      category: "Factory",
      transactionType: "Sewa",
      price: 0,
      status: "Under Offer",
      locationShort: "Karawang",
      fullAddress: "Kawasan Industri, Karawang, Jawa Barat",
      mainImage: "logisticsHub",
      gallery: ["logisticsHub", "warehouseModern"],
      specs: {
        certificate: "SHGB",
        landArea: 80000,
        buildingArea: 80000,
      },
      description: "Massive warehouse space optimized for high-volume distribution.",
      facilities: ["40 Docks", "Listrik Tinggi", "Gudang Dingin"],
      isFeatured: false,
    },
    {
      title: "Modern Tropical Villa in Canggu",
      slug: "modern-tropical-villa-in-canggu",
      category: "Residence",
      transactionType: "Jual",
      price: 12500000000,
      status: "Tersedia",
      locationShort: "Canggu, Bali",
      fullAddress: "Jl. Batu Bolong, Canggu, Bali",
      mainImage: "villaCanggu",
      gallery: ["villaCanggu", "interiorLiving", "kitchenModern", "bedroomMaster", "bathroomLux"],
      specs: {
        certificate: "SHM (Hak Milik)",
        landArea: 500,
        buildingArea: 350,
        bedrooms: "4 + 1",
        bathrooms: "4 + 1",
        floors: 2,
        electricity: "7700 Watt",
        carport: "2 Mobil",
        orientation: "Selatan",
      },
      description: "Nikmati perpaduan sempurna antara kemewahan modern dan ketenangan tropis di villa eksklusif ini. Terletak di jantung Canggu, properti ini menawarkan privasi absolut dengan pemandangan sawah yang menakjubkan. Desain arsitektur terbuka memungkinkan cahaya alami dan sirkulasi udara yang maksimal, menyatu dengan alam.",
      facilities: ["Private Pool", "Tropical Garden", "Modern Kitchen", "High-Speed Internet", "24/7 Security Area", "Full AC Rooms"],
      isFeatured: true,
    },
    {
      title: "Minimalist Villa Seminyak",
      slug: "minimalist-villa-seminyak",
      category: "Residence",
      transactionType: "Jual",
      price: 8200000000,
      status: "Tersedia",
      locationShort: "Seminyak, Bali",
      fullAddress: "Seminyak, Bali",
      mainImage: "villaSeminyak",
      gallery: ["villaSeminyak", "interiorLiving"],
      specs: {
        certificate: "SHM",
        landArea: 250,
        buildingArea: 200,
        bedrooms: "3",
        bathrooms: "3",
        floors: 1,
      },
      description: "Minimalist white villa with geometric design and private pool in Seminyak.",
      facilities: ["Private Pool", "Garden"],
      isFeatured: false,
    },
    {
      title: "Cliffside Estate Uluwatu",
      slug: "cliffside-estate-uluwatu",
      category: "Residence",
      transactionType: "Jual",
      price: 25000000000,
      status: "Tersedia",
      locationShort: "Uluwatu, Bali",
      fullAddress: "Uluwatu, Bali",
      mainImage: "estateUluwatu",
      gallery: ["estateUluwatu", "interiorLiving", "bathroomLux"],
      specs: {
        certificate: "SHM",
        landArea: 800,
        buildingArea: 600,
        bedrooms: "5",
        bathrooms: "6",
        floors: 2,
      },
      description: "Grand tropical estate on a gentle cliff with infinity pool overlooking the ocean.",
      facilities: ["Infinity Pool", "Ocean View", "Garden"],
      isFeatured: false,
    },
  ];

  for (const p of properties) {
    const mainImage = await image(IMG[p.mainImage], p.title);
    const gallery = [];
    for (const g of p.gallery) {
      gallery.push(await image(IMG[g], `${p.title} - ${g}`));
    }
    const doc = {
      _type: "property",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      category: p.category,
      transactionType: p.transactionType,
      price: p.price,
      status: p.status,
      locationShort: p.locationShort,
      fullAddress: p.fullAddress,
      mainImage,
      gallery,
      specs: { ...p.specs },
      description: portableText(p.description),
      facilities: p.facilities,
      isFeatured: p.isFeatured,
    };
    const created = await client.create(doc);
    console.log(`  created property: ${p.title} (${created._id})`);
  }

  console.log("Seeding company profile...");
  const logo = await image(IMG.emptyState, "Green Property Logo");
  const heroImage = await image(IMG.heroIndustrial, "Green Property Hero");
  await client.create({
    _type: "companyProfile",
    title: "Tentang Green Property",
    slug: { _type: "slug", current: "about-green-property" },
    companyName: "Green Property Indonesia",
    logo,
    heroBanner: {
      image: heroImage,
      heading: "Solusi Strategis Properti Industrial & Residensial di Indonesia",
      description:
        "Spesialis penyedia lahan untuk Vendor Hyundai dan hunian eksklusif dengan layanan terpercaya.",
      links: [
        {
          label: "Lihat Properti",
          linkType: "internal",
          href: "properties",
          style: "primary",
        },
        {
          label: "Hubungi Kami via WhatsApp",
          linkType: "external",
          href: "https://wa.me/62894934394",
          style: "ghost",
          icon: "chat",
        },
      ],
    },
    description: portableText(
      "Green Property adalah spesialis penyedia lahan untuk ekosistem vendor Hyundai serta penyedia properti industrial dan residensial eksklusif di Indonesia dengan layanan terpercaya.",
    ),
    vision: "Menjadi mitra lahan dan properti strategis terdepan untuk ekosistem industri di Indonesia.",
    mission: [
      "Menyediakan lahan strategis yang terintegrasi dengan rantai pasok industri otomotif.",
      "Memberikan solusi properti industrial dan residensial berkualitas tinggi.",
      "Menjaga integritas dan layanan terpercaya bagi setiap mitra dan klien.",
    ],
    contactEmail: "info@greenproperty.co.id",
    contactPhone: "+62 21-XXXX-XXXX",
    address: "Kawasan Industri Jababeka II, Cikarang Baru, Bekasi, Jawa Barat 17530",
    ctaBanner: {
      heading: "Siap Memulai Proyek Anda?",
      description:
        "Tim ahli kami siap membantu Anda menemukan solusi lahan dan properti terbaik di Indonesia.",
      buttonLabel: "Lihat Semua Kontak",
      buttonHref: "contact",
    },
  });
  console.log("  created companyProfile");

  console.log("Seeding partner logos...");
  const partners = [
    { namaPerusahaan: "PT Mitra Industri", urutanTampil: 1 },
    { namaPerusahaan: "Karya Bangun Sejahtera", urutanTampil: 2 },
    { namaPerusahaan: "Sinar Logistik Nusantara", urutanTampil: 3 },
    { namaPerusahaan: "Cahaya Properti Group", urutanTampil: 4 },
    { namaPerusahaan: "Jaya Steel Indonesia", urutanTampil: 5 },
  ];
  for (const partner of partners) {
    const logoRef = await image(IMG.emptyState, partner.namaPerusahaan);
    await client.create({
      _type: "partnerLogo",
      namaPerusahaan: partner.namaPerusahaan,
      logo: logoRef,
      urutanTampil: partner.urutanTampil,
    });
    console.log(`  created partnerLogo: ${partner.namaPerusahaan}`);
  }

  console.log("Seeding testimonials...");
  const testimonials = [
    {
      nama: "Budi Santoso",
      rating: 5,
      kutipan: "Tim Green Property sangat profesional dan membantu kami menemukan lahan industri terbaik di Cikarang.",
      jabatan: "Direktur PT Mitra Industri",
      urutanTampil: 1,
    },
    {
      nama: "Siti Rahmawati",
      rating: 5,
      kutipan: "Proses pembelian villa berjalan lancar. Layanan konsultasi mereka luar biasa.",
      jabatan: "Pembeli Villa di Bali",
      urutanTampil: 2,
    },
    {
      nama: "Andi Wijaya",
      rating: 4,
      kutipan: "Solusi lahan yang strategis untuk ekosistem vendor Hyundai. Sangat direkomendasikan.",
      jabatan: "Manajer Supply Chain",
      urutanTampil: 3,
    },
  ];
  for (const t of testimonials) {
    const photo = await image(IMG.emptyState, t.nama);
    await client.create({
      _type: "testimonial",
      nama: t.nama,
      rating: t.rating,
      kutipan: t.kutipan,
      jabatan: t.jabatan,
      photo,
      urutanTampil: t.urutanTampil,
    });
    console.log(`  created testimonial: ${t.nama}`);
  }

  console.log("Seed complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
