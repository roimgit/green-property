"use client";

import { useMemo, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types/sanity";

const CATEGORIES = ["Land", "Factory", "Residence", "Apartment"];

export default function PropertyFilters({
  properties,
}: {
  properties: Property[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState<string>("Jual");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("Terbaru");
  const [applied, setApplied] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const applyFilters = () => {
    setApplied(true);
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setTransactionType("Jual");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setSort("Terbaru");
    setApplied(false);
  };

  const filtered = useMemo(() => {
    let list = [...properties];

    if (applied) {
      if (selectedCategories.length > 0) {
        list = list.filter((p) => p.category && selectedCategories.includes(p.category));
      }
      if (transactionType) {
        list = list.filter((p) => p.transactionType === transactionType);
      }
      if (minPrice) {
        list = list.filter((p) => (p.price ?? 0) >= Number(minPrice));
      }
      if (maxPrice) {
        list = list.filter((p) => (p.price ?? Infinity) <= Number(maxPrice));
      }
      if (location) {
        const loc = location.toLowerCase();
        list = list.filter(
          (p) =>
            p.locationShort?.toLowerCase().includes(loc) ||
            p.fullAddress?.toLowerCase().includes(loc),
        );
      }
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.locationShort?.toLowerCase().includes(q) ||
          p.fullAddress?.toLowerCase().includes(q),
      );
    }

    if (sort === "Harga Terendah") {
      list = list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "Harga Tertinggi") {
      list = list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return list;
  }, [properties, query, selectedCategories, transactionType, minPrice, maxPrice, location, sort, applied]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.locationShort) set.add(p.locationShort.split(",")[0].trim());
    });
    return Array.from(set);
  }, [properties]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-5 gap-gutter">
      {/* Sidebar Filter */}
      <aside className="lg:col-span-1 flex flex-col gap-md">
        <div className="bg-surface-container-lowest p-md rounded-xl card-shadow border border-outline-variant/30 flex flex-col gap-lg">
          {/* Kategori */}
          <div className="flex flex-col gap-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Kategori</h3>
            <div className="flex flex-col gap-xs">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-sm cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
                  />
                  <span className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipe Transaksi */}
          <div className="flex flex-col gap-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Tipe Transaksi</h3>
            <div className="flex bg-surface-container p-1 rounded-lg">
              {["Jual", "Sewa"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTransactionType(t)}
                  className={
                    "flex-1 py-2 text-center rounded-md font-body-sm transition-colors " +
                    (transactionType === t
                      ? "bg-surface-container-lowest shadow-sm font-semibold text-primary"
                      : "text-on-surface-variant hover:text-on-surface")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Harga */}
          <div className="flex flex-col gap-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Harga (Rp)</h3>
            <div className="flex gap-sm">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-sm py-2 border border-outline-variant rounded-lg font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
              <input
                type="text"
                inputMode="numeric"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-sm py-2 border border-outline-variant rounded-lg font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Lokasi */}
          <div className="flex flex-col gap-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Lokasi</h3>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-sm py-3 border border-outline-variant rounded-lg font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest appearance-none"
            >
              <option value="">Semua Lokasi</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={applyFilters}
            className="w-full py-3 bg-primary text-on-primary rounded-full font-headline-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Terapkan Filter
          </button>
        </div>
      </aside>

      {/* Right Column */}
      <section className="lg:col-span-4 flex flex-col gap-lg">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-sm">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari properti..."
              className="w-full pl-10 pr-sm py-3 border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest"
            />
          </div>
          <div className="flex items-center gap-sm w-full md:w-auto">
            <span className="font-body-sm text-on-surface-variant whitespace-nowrap">Urutkan:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-sm py-2 border border-outline-variant rounded-lg font-body-sm text-on-surface focus:border-primary outline-none bg-surface-container-lowest"
            >
              <option>Terbaru</option>
              <option>Harga Terendah</option>
              <option>Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter">
            {filtered.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-md bg-surface-container-lowest rounded-xl border border-outline-variant/30">
            <div className="flex flex-col gap-xs">
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Properti tidak ditemukan
              </h3>
              <p className="font-body-md text-on-surface-variant max-w-md mx-auto">
                Coba ubah kriteria pencarian atau hapus beberapa filter untuk melihat lebih banyak hasil.
              </p>
            </div>
            <button
              onClick={resetFilters}
              className="px-6 py-2 border-2 border-primary text-primary rounded-full font-headline-sm font-semibold hover:bg-primary hover:text-white transition-colors mt-sm"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>
    </section>
  );
}
