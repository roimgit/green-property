"use client";

import { useState, useEffect, useMemo, type ChangeEvent, type CSSProperties } from "react";
import { set, type StringInputProps } from "sanity";

/**
 * Curated list of Material Symbols icon names relevant to a property /
 * industrial / residential business. Editors can search and pick visually.
 */
const ICONS: string[] = [
  // Land & industrial
  "landscape",
  "terrain",
  "map",
  "pin_drop",
  "apartment",
  "domain",
  "factory",
  "warehouse",
  "business",
  "location_city",
  "corporate_fare",
  "home",
  "house",
  "home_work",
  "villa",
  "holiday_village",
  "meeting_room",
  "storefront",
  "store",
  "business_center",
  // Commercial / sales
  "attach_money",
  "payments",
  "sell",
  "currency_exchange",
  "price_change",
  "receipt_long",
  "request_quote",
  "handshake",
  "verified",
  "verified_user",
  "check_circle",
  "star",
  "trending_up",
  "trending_down",
  "show_chart",
  "insights",
  "monitoring",
  // Building / construction
  "construction",
  "hard_hat",
  "engineering",
  "architecture",
  "design_services",
  "handyman",
  "electric_bolt",
  "bolt",
  "water_drop",
  "gas_meter",
  "solar_power",
  "power",
  "lightbulb",
  "door_sliding",
  "window",
  "grid_view",
  "foundation",
  "roofing",
  "stairs",
  "security",
  "door_front",
  "key",
  "lock",
  "vpn_key",
  // Transport & logistics
  "local_shipping",
  "truck",
  "directions_car",
  "car_rental",
  "commute",
  "airport_shuttle",
  "garage",
  "directions_bus",
  "train",
  "flight",
  "local_parking",
  "parking",
  // Lifestyle / residence
  "family_restroom",
  "groups",
  "person",
  "people",
  "bed",
  "king_bed",
  "chair",
  "coffee",
  "restaurant",
  "pool",
  "fitness_center",
  "spa",
  "park",
  "forest",
  "yard",
  "local_florist",
  "nature",
  "wifi",
  "sensors",
  "local_cafe",
  "breakfast_dining",
  // Contact / communication
  "call",
  "phone_in_talk",
  "chat",
  "forum",
  "email",
  "markunread_mailbox",
  "support_agent",
  "headset_mic",
  "schedule",
  "event",
  "calendar_month",
  "clock",
  "update",
  // Misc useful
  "arrow_forward",
  "arrow_outward",
  "open_in_new",
  "link",
  "location_on",
  "distance",
  "percent",
  "calculate",
  "savings",
  "account_balance",
  "real_estate_agent",
];

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
  maxHeight: 240,
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

  const [search, setSearch] = useState("");
  const [fontReady, setFontReady] = useState(false);

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
    if (!q) return ICONS;
    return ICONS.filter((name) => name.toLowerCase().includes(q));
  }, [search]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.currentTarget.value);

  const handleSelect = (name: string) => {
    if (readOnly) return;
    onChange(set(name));
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
        <label style={labelStyle}>Atau pilih ikon &amp; cari namanya</label>

        <input
          type="search"
          value={search}
          onChange={handleSearch}
          placeholder="Cari ikon, contoh: factory, home, map"
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
          {filtered.length} ikon tersedia ·{" "}
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
            filtered.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => handleSelect(name)}
                disabled={readOnly}
                title={name}
                style={cellStyle(name === icon)}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontFamily: '"Material Symbols Outlined"',
                    fontSize: 26,
                    color: name === icon ? "#1f7a3f" : "#333",
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
              Ikon &quot;{search}&quot; tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
