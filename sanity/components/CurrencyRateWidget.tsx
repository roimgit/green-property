"use client";

import { useEffect, useState } from "react";

const API_URL = "https://open.er-api.com/v6/latest/USD";

interface Rates {
  IDR: number;
  KRW: number;
  USD: number;
  SGD: number;
}

const s = {
  card: {
    border: "1px solid var(--card-border-color, #d0d5dd)",
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
    background: "#f0f9f1",
  } as const,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  } as const,
  title: {
    fontSize: 13,
    fontWeight: 700,
    color: "#195f30",
    margin: 0,
  } as const,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
    marginTop: 12,
  } as const,
  item: {
    border: "1px solid #e5e8ef",
    borderRadius: 8,
    padding: "10px 12px",
    background: "#fff",
  } as const,
  label: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    color: "#667085",
    marginBottom: 4,
  } as const,
  value: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1d21",
    margin: 0,
  } as const,
  hint: {
    fontSize: 11,
    color: "#667085",
    marginTop: 8,
  } as const,
  refresh: {
    fontSize: 12,
    border: "1px solid #d0d5dd",
    background: "#fff",
    borderRadius: 6,
    padding: "4px 10px",
    cursor: "pointer",
    color: "#344054",
  } as const,
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 13,
    color: "#667085",
  } as const,
};

/**
 * Live exchange rate widget shown in the Sanity Studio (attached to the
 * Property `pricing` field). Lets admins reference current USD-based rates
 * when setting prices in different currencies.
 */
export default function CurrencyWidget() {
  const [rates, setRates] = useState<Rates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const loadRates = () => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRates(data.rates as Rates);
        setUpdatedAt(new Date());
      })
      .catch((err) => setError(err.message || "Gagal memuat kurs"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleRefresh = () => {
    setError(null);
    setLoading(true);
    loadRates();
  };

  const items: Array<{ label: string; value: string }> = rates
    ? [
        { label: "Rupiah Indonesia (IDR)", value: `Rp ${rates.IDR.toLocaleString("id-ID", { maximumFractionDigits: 0 })}` },
        { label: "Won Korea (KRW)", value: `${rates.KRW.toLocaleString("ko-KR", { maximumFractionDigits: 0 })}` },
        { label: "US Dollar (USD)", value: `$ ${rates.USD.toLocaleString("en-US", { maximumFractionDigits: 2 })}` },
        { label: "Dolar Singapura (SGD)", value: `S$ ${rates.SGD.toLocaleString("en-SG", { maximumFractionDigits: 2 })}` },
      ]
    : [];

  return (
    <div style={s.card}>
      <div style={s.header}>
        <p style={s.title}>Live Exchange Rate (USD)</p>
        <button
          type="button"
          style={s.refresh}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div style={s.row}>
          <span aria-hidden>⏳</span> Mengambil data kurs...
        </div>
      ) : error ? (
        <div>
          <div style={{ ...s.row, color: "#b42318" }}>
            ⚠️ Gagal memuat kurs ({error})
          </div>
          <button
            type="button"
            style={{ ...s.refresh, marginTop: 8 }}
            onClick={loadRates}
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <div style={s.grid}>
          {items.map((it) => (
            <div key={it.label} style={s.item}>
              <div style={s.label}>{it.label}</div>
              <p style={s.value}>{it.value}</p>
              <p style={s.hint}>per 1 USD</p>
            </div>
          ))}
        </div>
      )}

      {updatedAt && (
        <p style={s.hint}>
          Diperbarui: {updatedAt.toLocaleTimeString("id-ID")} · Sumber: open.er-api.com
        </p>
      )}
    </div>
  );
}
