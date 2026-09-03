"use client";

import { useMemo, useRef, useState } from "react";
import PropertyCard from "@/components/PropertyCard";
import type { Property } from "@/types/sanity";
import { getPrimaryPriceAmount } from "@/lib/sanity/data";

const DEFAULT_CATEGORIES = ["Land", "Factory", "Residence", "Apartment"];
const PAGE_SIZE = 12;

export default function PropertyFilters({
  properties,
  allCategories = [],
}: {
  properties: Property[];
  allCategories?: string[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [transactionType, setTransactionType] = useState<string>("Semua");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [kprOnly, setKprOnly] = useState(false);
  const [sort, setSort] = useState("Terbaru");
  // Snapshot filter sidebar yang aktif — hanya berubah saat klik "Terapkan Filter".
  const [appliedFilters, setAppliedFilters] = useState({
    categories: [] as string[],
    transactionType: "Semua",
    minPrice: "",
    maxPrice: "",
    location: "",
    kprOnly: false,
  });
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLElement | null>(null);

  const availableCategories = useMemo(() => {
    const set = new Set<string>();

    if (Array.isArray(allCategories)) {
      allCategories.forEach((cat) => {
        if (cat && cat.trim()) set.add(cat.trim());
      });
    }

    properties.forEach((p) => {
      if (typeof p.category === "string" && p.category.trim()) {
        set.add(p.category.trim());
      }
    });

    if (set.size === 0) {
      DEFAULT_CATEGORIES.forEach((cat) => set.add(cat));
    }

    return Array.from(set).sort();
  }, [allCategories, properties]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters({
      categories: selectedCategories,
      transactionType,
      minPrice,
      maxPrice,
      location,
      kprOnly,
    });
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategories([]);
    setTransactionType("Semua");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setKprOnly(false);
    setSort("Terbaru");
    setPage(1);
    setAppliedFilters({
      categories: [],
      transactionType: "Semua",
      minPrice: "",
      maxPrice: "",
      location: "",
      kprOnly: false,
    });
  };

  const filtered = useMemo(() => {
    let list = [...properties];

    if (appliedFilters.categories.length > 0) {
      list = list.filter(
        (p) => typeof p.category === "string" && appliedFilters.categories.includes(p.category),
      );
    }
    if (appliedFilters.transactionType && appliedFilters.transactionType !== "Semua") {
      const target = appliedFilters.transactionType.toLowerCase();
      list = list.filter((p) => {
        if (Array.isArray(p.pricing) && p.pricing.length > 0) {
          return p.pricing.some(
            (entry) => entry.transactionType?.toLowerCase() === target,
          );
        }
        return p.transactionType?.toLowerCase() === target;
      });
    }
    if (appliedFilters.minPrice && !Number.isNaN(Number(appliedFilters.minPrice))) {
      list = list.filter(
        (p) => getPrimaryPriceAmount(p) >= Number(appliedFilters.minPrice),
      );
    }
    if (appliedFilters.maxPrice && !Number.isNaN(Number(appliedFilters.maxPrice))) {
      list = list.filter(
        (p) => getPrimaryPriceAmount(p) <= Number(appliedFilters.maxPrice),
      );
    }
    if (appliedFilters.location) {
      const loc = appliedFilters.location.toLowerCase();
      list = list.filter(
        (p) =>
          p.locationShort?.toLowerCase() === loc ||
          p.locationShort?.toLowerCase().includes(loc) ||
          p.fullAddress?.toLowerCase().includes(loc),
      );
    }
    if (appliedFilters.kprOnly) {
      list = list.filter((p) => p.kprAvailable);
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
      list = list.sort((a, b) => getPrimaryPriceAmount(a) - getPrimaryPriceAmount(b));
    } else if (sort === "Harga Tertinggi") {
      list = list.sort((a, b) => getPrimaryPriceAmount(b) - getPrimaryPriceAmount(a));
    }

    return list;
  }, [properties, query, appliedFilters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const pageNumbers = useMemo(() => {
    const pages: Array<number | "ellipsis"> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    if (safePage > 3) pages.push("ellipsis");
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }, [totalPages, safePage]);

  const goToPage = (target: number) => {
    setPage(Math.min(totalPages, Math.max(1, target)));
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const locations = useMemo(() => {
    const set = new Set<string>();
    properties.forEach((p) => {
      if (p.locationShort && p.locationShort.trim()) {
        set.add(p.locationShort.trim());
      }
    });
    return Array.from(set).sort();
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
              {availableCategories.map((cat) => (
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
              {["Semua", "Jual", "Sewa"].map((t) => (
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

          {/* Pembayaran */}
          <div className="flex flex-col gap-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Pembayaran</h3>
            <label className="flex items-center gap-sm cursor-pointer group">
              <input
                type="checkbox"
                checked={kprOnly}
                onChange={(e) => setKprOnly(e.target.checked)}
                className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
              />
              <span className="font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                Hanya yang bisa KPR
              </span>
            </label>
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
      <section ref={resultsRef} className="lg:col-span-4 flex flex-col gap-lg scroll-mt-28">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-sm">
          <div className="relative w-full md:w-96">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Cari properti..."
              className="w-full pl-10 pr-sm py-3 border border-outline-variant rounded-xl font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest"
            />
          </div>
          <div className="flex items-center gap-sm w-full md:w-auto">
            <span className="font-body-sm text-on-surface-variant whitespace-nowrap">Urutkan:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
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
          <>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Menampilkan {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} dari {filtered.length}{" "}
              properti
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
              {paged.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Navigasi halaman properti"
                className="flex items-center justify-center gap-2 mt-md"
              >
                <button
                  type="button"
                  onClick={() => goToPage(safePage - 1)}
                  disabled={safePage === 1}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-outline-variant font-body-sm text-body-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  Sebelumnya
                </button>

                {pageNumbers.map((item, i) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 font-body-sm text-on-surface-variant"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      aria-current={item === safePage ? "page" : undefined}
                      className={
                        "min-w-10 h-10 px-3 rounded-full font-body-sm text-body-sm font-semibold transition-colors " +
                        (item === safePage
                          ? "bg-primary text-on-primary"
                          : "border border-outline-variant text-on-surface hover:border-primary hover:text-primary")
                      }
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => goToPage(safePage + 1)}
                  disabled={safePage === totalPages}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-outline-variant font-body-sm text-body-sm font-semibold text-on-surface transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:pointer-events-none"
                >
                  Berikutnya
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </nav>
            )}
          </>
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
