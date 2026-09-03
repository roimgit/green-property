"use client";

import { useMemo, useState } from "react";
import { calculateKpr, formatPriceWithCurrency } from "@/lib/sanity/data";

const TENOR_PRESETS = [5, 10, 15, 20, 25, 30];

export default function KprCalculator({
  price,
  currency = "IDR",
  defaultDownPaymentPercent = 20,
  defaultInterestRate = 8,
  maxTenorYears = 20,
  notes,
}: {
  price: number;
  currency?: string;
  defaultDownPaymentPercent?: number;
  defaultInterestRate?: number;
  maxTenorYears?: number;
  notes?: string;
}) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(defaultDownPaymentPercent);
  const [interestRate, setInterestRate] = useState(defaultInterestRate);
  const [tenorYears, setTenorYears] = useState(() =>
    Math.min(15, Math.max(1, Math.floor(maxTenorYears || 20))),
  );

  const tenorOptions = useMemo(
    () => TENOR_PRESETS.filter((t) => t <= Math.max(1, Math.floor(maxTenorYears || 20))),
    [maxTenorYears],
  );

  const simulation = useMemo(
    () => calculateKpr(price, downPaymentPercent, interestRate, tenorYears),
    [price, downPaymentPercent, interestRate, tenorYears],
  );

  const format = (value: number) => formatPriceWithCurrency(value, currency) ?? "-";

  return (
    <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant shadow-soft">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">calculate</span>
        Simulasi Pembayaran
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
        Atur uang muka, tenor, dan suku bunga untuk melihat estimasi angsuran KPR.
      </p>

      <div className="flex flex-col gap-md">
          {/* Input DP */}
          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <label
                htmlFor="kpr-dp"
                className="font-body-sm text-body-sm font-semibold text-on-surface"
              >
                Uang Muka (DP)
              </label>
              <span className="font-body-sm text-body-sm font-bold text-primary notranslate">
                {downPaymentPercent}% • {format(simulation.downPaymentAmount)}
              </span>
            </div>
            <input
              id="kpr-dp"
              type="range"
              min={0}
              max={90}
              step={1}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          {/* Input tenor */}
          <div className="flex flex-col gap-xs">
            <span className="font-body-sm text-body-sm font-semibold text-on-surface">
              Tenor Pinjaman
            </span>
            <div className="flex flex-wrap gap-2">
              {tenorOptions.map((tenor) => (
                <button
                  key={tenor}
                  type="button"
                  onClick={() => setTenorYears(tenor)}
                  aria-pressed={tenorYears === tenor}
                  className={
                    "px-4 py-2 rounded-full font-body-sm text-body-sm font-semibold border transition-colors " +
                    (tenorYears === tenor
                      ? "bg-primary text-on-primary border-primary"
                      : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary")
                  }
                >
                  {tenor} thn
                </button>
              ))}
            </div>
          </div>

          {/* Input bunga */}
          <div className="flex flex-col gap-xs">
            <label
              htmlFor="kpr-rate"
              className="font-body-sm text-body-sm font-semibold text-on-surface"
            >
              Suku Bunga (% per tahun)
            </label>
            <input
              id="kpr-rate"
              type="number"
              min={0}
              max={30}
              step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-40 px-sm py-2 border border-outline-variant rounded-lg font-body-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface"
            />
          </div>

          {/* Hasil simulasi */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-md flex flex-col gap-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Angsuran per bulan
              </span>
              <span className="font-price-display text-xl font-bold text-primary notranslate">
                {format(simulation.monthlyInstallment)}
              </span>
            </div>
            <div className="border-t border-outline-variant/50 pt-sm grid grid-cols-1 sm:grid-cols-2 gap-x-lg gap-y-xs font-body-sm text-body-sm">
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Harga properti</span>
                <span className="font-semibold text-on-surface notranslate">{format(simulation.price)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Uang muka</span>
                <span className="font-semibold text-on-surface notranslate">
                  {format(simulation.downPaymentAmount)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Jumlah pinjaman</span>
                <span className="font-semibold text-on-surface notranslate">{format(simulation.loanAmount)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Tenor</span>
                <span className="font-semibold text-on-surface">
                  {simulation.tenorYears} tahun ({simulation.tenorMonths}x)
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Total bunga</span>
                <span className="font-semibold text-on-surface notranslate">
                  {format(simulation.totalInterest)}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-on-surface-variant">Total pembayaran</span>
                <span className="font-semibold text-on-surface notranslate">
                  {format(simulation.totalPayment)}
                </span>
              </div>
            </div>
          </div>

          {notes?.trim() && (
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {notes}
            </p>
          )}
          <p className="font-body-sm text-body-sm text-on-surface-variant/80 leading-relaxed">
            * Hasil di atas adalah estimasi dengan metode anuitas dan dapat berbeda dengan
            perhitungan resmi bank.
          </p>
        </div>
    </div>
  );
}
