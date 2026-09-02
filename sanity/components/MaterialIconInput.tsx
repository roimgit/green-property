"use client";

import { useState, useEffect, useMemo, type ChangeEvent, type CSSProperties } from "react";
import { set, type StringInputProps } from "sanity";
import { MATERIAL_SYMBOLS } from "./materialSymbolsList";

/**
 * Picker ikon Material Symbols. Menampilkan SEMUA ligature yang tersedia di
 * font Material Symbols (3.900+ nama), dengan kotak pencarian, lazy load via
 * tombol "Tampilkan lebih banyak", dan tombol ikuti nama untuk item yang aktif.
 */

/** Berapa banyak ikon yang dirender bertahap dalam satu halaman grid. */
const PAGE_SIZE = 400;

const LINK = "https://fonts.google.com/icons";

const boxStyle: CSSProperties = {
  border: "1px solid var(--card-border-color, #ccc)",
  borderRadius: 8,
  padding: 12,
  marginTop: 12,
};
const labelStyle: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#667085",
  marginBottom: 8,
  display: "block",
};
const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))",
  gap: 6,
  marginTop: 10,
  maxHeight: 300,
  overflowY: "auto",
};
const cellStyle = (active: boolean): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 2,
  padding: "8px 4px",
  borderRadius: 8,
  border: active ? "2px solid #1f7a3f" : "1px solid #e4e7ec",
  background: active ? "#e8f3ec" : "#fff",
  cursor: "pointer",
});

export function MaterialIconInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props;
  const icon = typeof value === "string" ? value.trim() : "";
  const [activeIcon, setActiveIcon] = useState<string | undefined>(icon || "landscape");
  const [search, setSearch] = useState("");
  const [fontReady, setFontReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Ikuti nilai saat Sanity mengubahnya dari luar (mis. reset/draft).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync nilai eksternal
    setActiveIcon(icon || undefined);
  }, [icon]);

  // Force the glyph font to finish loading so icons render as symbols (not
  // text/ligature fallback) before/while the grid is shown.
  useEffect(() => {
    let cancelled = false;
    const fontFamily = '"Material Symbols Outlined"';
    const load = async () => {
      try {
        await document.fonts.load(`24px ${fontFamily}`);
        await document.fonts.ready;
      } catch {
        /* ignore: still show the grid */
      }
      if (!cancelled) setFontReady(true);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return MATERIAL_SYMBOLS;
    return MATERIAL_SYMBOLS.filter((name) => name.toLowerCase().includes(q));
  }, [search]);

  const visible = search.trim() ? filtered.slice(0, 600) : filtered.slice(0, visibleCount);
  const hasMore = search.trim() ? filtered.length > 600 : visibleCount < filtered.length;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setVisibleCount(PAGE_SIZE);
    setSearch(e.currentTarget.value);
  };

  const handleSelect = (name: string) => {
    if (readOnly) return;
    setActiveIcon(name);
    onChange(set(name));
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleShowMore = () => {
    if (search.trim()) return;
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div>
      {/* Ensure the Material Symbols glyph font is actually loaded inside the
          Sanity Studio (its styles may not inherit the app's global CSS). */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
      />
      {props.renderDefault(props)}

      <div style={boxStyle}>
        <label style={labelStyle}>Pilih ikon &amp; cari namanya</label>

        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Cari ikon (mis. factory, home, map, pool)"
          readOnly={readOnly}
          style={{
            width: "100%",
            padding: "9px 12px",
            border: "1px solid #d0d5dd",
            borderRadius: 8,
            fontSize: 14,
            boxSizing: "border-box",
          }}
        />

        <div style={{ marginTop: 8, fontSize: 12, color: "#667085" }}>
          {filtered.length.toLocaleString("id-ID")} ikon tersedia
          {!search.trim() && visibleCount < filtered.length
            ? ` · menampilkan ${visibleCount.toLocaleString("id-ID")}`
            : ""}{" "}
          <a
            href={LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1f7a3f" }}
          >
            Lihat semua ikon di Google Fonts →
          </a>
        </div>

        <div style={gridStyle}>
          {!fontReady ? (
            <div
              style={{
                gridColumn: "1 / -1",
                fontSize: 13,
                color: "#667085",
                padding: 12,
                textAlign: "center",
              }}
            >
              Memuat ikon…
            </div>
          ) : (
            visible.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                disabled={readOnly}
                title={name}
                style={cellStyle(name === activeIcon)}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontFamily: '"Material Symbols Outlined"',
                    fontSize: 26,
                    color: name === activeIcon ? "#1f7a3f" : "#333",
                  }}
                  aria-hidden="true"
                >
                  {name}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    lineHeight: 1.1,
                    textAlign: "center",
                    color: "#667085",
                    wordBreak: "break-all",
                  }}
                >
                  {name}
                </span>
              </button>
            ))
          )}
          {fontReady && filtered.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                fontSize: 13,
                color: "#667085",
                padding: 12,
                textAlign: "center",
              }}
            >
              Ikon &quot;{search}&quot; tidak ditemukan.{" "}
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1f7a3f",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                }}
              >
                Reset pencarian
              </button>
            </div>
          )}
        </div>

        {hasMore && fontReady && (
          <button
            type="button"
            onClick={handleShowMore}
            disabled={readOnly}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d0d5dd",
              borderRadius: 8,
              background: "#fff",
              fontSize: 13,
              color: "#1f7a3f",
              cursor: "pointer",
            }}
          >
            Tampilkan lebih banyak ikon
          </button>
        )}
      </div>
    </div>
  );
}