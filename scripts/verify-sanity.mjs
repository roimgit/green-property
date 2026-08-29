import "dotenv/config";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-06-01",
  useCdn: false,
});

const props = await client.fetch('*[_type=="property"]{_id,title,slug,mainImage{asset->{url}},specs,facilities,isFeatured,price,status,transactionType,category,locationShort}[0...20]');
console.log("PROPERTIES:", props.length);
console.log(JSON.stringify(props[0], null, 2));
console.log("PROPERTY[1]:", JSON.stringify(props[1], null, 2));
const company = await client.fetch('*[_type=="companyProfile"][0]{companyName,address,logo{asset->{url}}}');
console.log("COMPANY:", JSON.stringify(company, null, 2));
const logos = await client.fetch('*[_type=="partnerLogo"]{namaPerusahaan,logo{asset->{url}},urutanTampil} | order(urutanTampil asc)');
console.log("LOGOS:", logos.length, JSON.stringify(logos[0], null, 2));
const t = await client.fetch('*[_type=="testimonial"][0]{nama,photo{asset->{url}},rating,kutipan}');
console.log("TESTIMONIAL[0]:", JSON.stringify(t, null, 2));
