import { prisma } from "@/lib/prisma";
import { sanityFetch, groq } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";

const COMPANY_PROFILE_QUERY = groq`*[_type == "companyProfile"]{_id, title}`;

export default async function Home() {
  const results: string[] = [];
  let propertyCount: number | null = null;

  // 1) Supabase / Prisma: count rows in the Property table (via PostgreSQL)
  try {
    propertyCount = await prisma.property.count();
    results.push(`Supabase (Prisma/PostgreSQL) connected: OK — Property rows: ${propertyCount}`);
  } catch (err) {
    results.push(
      `Supabase (Prisma/PostgreSQL) connected: FAIL — ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  // 2) Sanity: fetch companyProfile documents (may be empty)
  try {
    const companyProfiles = await sanityFetch<
      Array<{ _id: string; title: string | null }>
    >(COMPANY_PROFILE_QUERY);
    results.push(
      `Sanity connected: OK — companyProfile documents: ${companyProfiles.length}`,
    );
  } catch (err) {
    results.push(
      `Sanity connected: FAIL — ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", lineHeight: 1.6 }}>
      <h1>green-property — Connection verification</h1>
      <p>This page intentionally has no styling/design (setup only).</p>
      <ul style={{ paddingLeft: "1.5rem" }}>
        {results.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </main>
  );
}
