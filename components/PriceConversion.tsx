"use client";

import { useEffect, useState } from "react";

interface ConversionResult {
  usd: number | null;
  krw: number | null;
}

function formatUSD(value: number): string {
  return (
    value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " USD"
  );
}

function formatKRW(value: number): string {
  return (
    value.toLocaleString("ko-KR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) + " WON"
  );
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

        const toUsd =
          base === "USD"
            ? value
            : typeof data.rates.USD === "number"
              ? value * data.rates.USD
              : null;
        const toKrw =
          base === "KRW"
            ? value
            : typeof data.rates.KRW === "number"
              ? value * data.rates.KRW
              : null;

        if (toUsd === null && toKrw === null) return;
        setResult({ usd: toUsd, krw: toKrw });
      })
      .catch(() => {
        // Kurs tidak tersedia — bagian konversi disembunyikan.
      });

    return () => {
      cancelled = true;
    };
  }, [value, base]);

  if (!value || value <= 0 || !result) return null;

  return (
    <div className="mt-3 rounded-xl border border-outline-variant bg-surface px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-on-surface-variant">
        Estimasi Konversi
      </p>
      <div className="mt-1 flex flex-col gap-1 text-sm font-semibold text-on-surface notranslate">
        {result.usd !== null && base !== "USD" && <p>{formatUSD(result.usd)}</p>}
        {result.krw !== null && base !== "KRW" && <p>{formatKRW(result.krw)}</p>}
      </div>
      <p className="mt-1 text-[11px] text-on-surface-variant/80">
        * Kurs estimasi terkini, dapat berbeda saat transaksi.
      </p>
    </div>
  );
}
