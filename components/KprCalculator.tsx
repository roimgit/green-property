"use client";

import { useMemo, useState } from "react";

function money(n: number): string {
  return n.toLocaleString("id-ID");
}

export default function KprCalculator({ price = 0 }: { price?: number }) {
  const [dp, setDp] = useState(20);
  const [tenor, setTenor] = useState(15);
  const [interest, setInterest] = useState(7.5);

  const installment = useMemo(() => {
    if (!price || price <= 0) return null;
    const principal = price * (1 - dp / 100);
    const monthlyRate = interest / 100 / 12;
    const months = tenor * 12;
    if (monthlyRate === 0) return principal / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * factor) / (factor - 1);
  }, [price, dp, tenor, interest]);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft">
      <div className="flex items-center gap-2 mb-sm">
        <span className="material-symbols-outlined text-primary">calculate</span>
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Simulasi KPR</h2>
      </div>
      <div className="flex flex-col gap-4 mt-md">
        <div>
          <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1">
            Harga Properti (Rp)
          </label>
          <input
            disabled
            value={price ? money(price) : "0"}
            className="w-full rounded-lg border-outline-variant bg-surface-container-low text-on-surface-variant font-body-sm text-body-sm font-semibold cursor-not-allowed px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <div className="w-1/3">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1">DP (%)</label>
            <select
              value={dp}
              onChange={(e) => setDp(Number(e.target.value))}
              className="w-full rounded-lg border-outline-variant bg-surface text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary px-3 py-2"
            >
              {[10, 20, 30].map((v) => (
                <option key={v} value={v}>
                  {v}%
                </option>
              ))}
            </select>
          </div>
          <div className="w-2/3">
            <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1">
              Tenor (Tahun)
            </label>
            <select
              value={tenor}
              onChange={(e) => setTenor(Number(e.target.value))}
              className="w-full rounded-lg border-outline-variant bg-surface text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary px-3 py-2"
            >
              {[5, 10, 15, 20].map((v) => (
                <option key={v} value={v}>
                  {v} Tahun
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block font-body-sm text-body-sm text-on-surface-variant mb-1">
            Suku Bunga Asumsi (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={interest}
            onChange={(e) => setInterest(Number(e.target.value))}
            className="w-full rounded-lg border-outline-variant bg-surface text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary px-3 py-2"
          />
        </div>
        <div className="mt-4 p-4 bg-surface-container rounded-lg border border-outline-variant/30">
          <p className="text-on-surface-variant font-body-sm text-body-sm text-center">
            Estimasi Cicilan per Bulan
          </p>
          <p className="font-price-display text-price-display text-primary text-center mt-1">
            {installment ? "Rp " + money(Math.round(installment)) : "-"}
          </p>
          <p className="text-on-surface-variant font-label-caps text-label-caps text-center mt-2 opacity-70">
            *Hanya estimasi kasar, bunga dapat berubah sewaktu-waktu sesuai kebijakan bank.
          </p>
        </div>
      </div>
    </div>
  );
}
