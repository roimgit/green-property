"use client";

import { useEffect, useState } from "react";

interface ConversionResult {
  idr: number | null;
  usd: number | null;
  krw: number | null;
}

// Selalu konversi ke ketiga mata uang ini secara otomatis.
const TARGET_CURRENCIES = ["idr", "usd", "krw"] as const;
type CurrencyCode = (typeof TARGET_CURRENCIES)[number];

const FORMATTERS: Record<CurrencyCode, Intl.NumberFormat> = {
  idr: new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }),
  usd: new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }),
  krw: new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 }),
};

const LABELS: Record<CurrencyCode, string> = {
  idr: " IDR",
  usd: " USD",
  krw: " KRW",
};

function formatValue(code: CurrencyCode, value: number): string {
  const formatter = FORMATTERS[code];
  return `${formatter.format(value)} ${LABELS[code].trim()}`;
}

export default function PriceConversion({
  amount,
  currency = "IDR",
}: {
  amount?: number;
  currency?: string;
}) {
  const [result, setResult] = useState<ConversionResult | null>(null);

  const base = (currency || "IDR").toUpperCase();
  const value = amount ?? 0;

  useEffect(() => {
    if (!value || value <= 0) return;

    let cancelled = false;

    fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Kurs gagal dimuat (${res.status})`);
        return res.json();
      })
      .then((data: { result?: string; rates?: Record<string, number> }) => {
        if (cancelled) return;
        if (data.result !== "success" || !data.rates) return;

        const toCurrency = (code: string): number | null => {
          if (base === code) return value;
          const rates = data.rates;
          if (rates && typeof rates[code] === "number") return value * rates[code];
          return null;
        };

        const next: ConversionResult = {
          idr: toCurrency("IDR"),
          usd: toCurrency("USD"),
          krw: toCurrency("KRW"),
        };

        if (!next.idr && !next.usd && !next.krw) return;
        setResult(next);
      })
      .catch(() => {
        // Kurs tidak tersedia — bagian konversi disembunyikan.
      });

    return () => {
      cancelled = true;
    };
  }, [value, base]);

  if (!value || value <= 0 || !result) return null;

  const rows = TARGET_CURRENCIES.filter((code) => {
    const val = result[code];
    return val !== null && val > 0 && code.toUpperCase() !== base;
  });

  if (rows.length === 0) return null;

  return (
    <div className="mt-3 rounded-xl border border-outline-variant bg-surface px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
        Estimasi Konversi
      </p>
      <div className="mt-1 flex flex-col gap-1 text-sm font-semibold text-on-surface notranslate">
        {rows.map((code) => (
          <p key={code}>{formatValue(code, result[code] as number)}</p>
        ))}
      </div>
      <p className="mt-1 text-[11px] text-on-surface-variant/80">
        * Kurs estimasi terkini, dapat berbeda saat transaksi.
      </p>
    </div>
  );
}
