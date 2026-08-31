import Link from "next/link";
import { getPropertyList } from "@/lib/sanity/data";
import PropertyFilters from "./PropertyFilters";
import type { Property } from "@/types/sanity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Semua Listing Properti - Green Property",
};

export default async function PropertiesPage() {
  const properties: Property[] = await getPropertyList();

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-lg py-xl flex flex-col gap-lg">
      {/* Header */}
      <section className="flex flex-col gap-base">
        <nav className="text-on-surface-variant font-body-sm flex items-center gap-xs">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-semibold">Properti</span>
        </nav>
        <h1 className="font-display text-display text-on-surface">Semua Listing Properti</h1>
      </section>

      <PropertyFilters properties={properties} />
    </main>
  );
}
