"use client";

import type { FieldProps } from "sanity";
import CurrencyRateWidget from "./CurrencyRateWidget";

/**
 * Wraps the Property `pricing` field with the live currency rate widget so
 * admins can reference current conversion rates while setting prices.
 */
export function PricingWithRate(props: FieldProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <CurrencyRateWidget />
      {props.renderDefault(props)}
    </div>
  );
}
