import type { PropertySpecItem, PropertySpecs } from "@/types/sanity";

interface SpecEntry {
  label: string;
  icon: string;
  value?: string;
}

const LEGACY_SPEC_META: Record<string, { label: string; icon: string }> = {
  certificate: { label: "Sertifikat", icon: "verified_user" },
  landArea: { label: "Luas Tanah", icon: "landscape" },
  buildingArea: { label: "Luas Bangunan", icon: "foundation" },
  furnishing: { label: "Kondisi Interior", icon: "chair" },
  bedrooms: { label: "Kamar Tidur", icon: "king_bed" },
  bathrooms: { label: "Kamar Mandi", icon: "bathtub" },
  floors: { label: "Jumlah Lantai", icon: "stairs" },
  electricity: { label: "Daya Listrik", icon: "bolt" },
  carport: { label: "Garasi / Carport", icon: "garage" },
  orientation: { label: "Hadap", icon: "explore" },
};

function legacySpecsToItems(specs?: PropertySpecs): SpecEntry[] {
  if (!specs) return [];
  const entries: SpecEntry[] = [];

  const push = (key: string, value?: string) => {
    const resolved = value;
    if (!resolved) return;
    const meta = LEGACY_SPEC_META[key];
    if (!meta) return;
    entries.push({ label: meta.label, icon: meta.icon, value: resolved });
  };

  push("certificate", specs.certificate);
  push("landArea", specs.landArea ? specs.landArea.toLocaleString("id-ID") + " m²" : undefined);
  push("buildingArea", specs.buildingArea ? specs.buildingArea.toLocaleString("id-ID") + " m²" : undefined);
  push("furnishing", specs.furnishing);
  push("bedrooms", specs.bedrooms);
  push("bathrooms", specs.bathrooms);
  push("floors", specs.floors ? specs.floors + " Lantai" : undefined);
  push("electricity", specs.electricity);
  push("carport", specs.carport);
  push("orientation", specs.orientation);

  return entries;
}

export function normalizeSpecs(specs?: PropertySpecs): SpecEntry[] {
  const flexible = (specs?.specsList ?? []).filter(
    (item: PropertySpecItem) => item && (item.label || item.value),
  );

  if (flexible.length > 0) {
    return toSpecEntries(flexible);
  }

  return legacySpecsToItems(specs);
}

export function toSpecEntries(items: PropertySpecItem[]): SpecEntry[] {
  return items
    .filter((item) => item && (item.label || item.value))
    .map((item) => ({
      label: item.label?.trim() || "Spesifikasi",
      icon: item.icon || "check_circle",
      value: item.value?.trim() || "",
    }));
}

/**
 * Spesifikasi properti sesuai schema `property.ts`: kolom utamanya adalah
 * `specsList` (array fleksibel icon + label + value di level dokumen).
 * Fallback ke objek `specs` lama bila `specsList` belum terisi.
 */
export function normalizePropertySpecs(
  property?: { specs?: PropertySpecs; specsList?: PropertySpecItem[] } | null,
): SpecEntry[] {
  if (Array.isArray(property?.specsList) && property.specsList.length > 0) {
    return toSpecEntries(property.specsList);
  }
  return normalizeSpecs(property?.specs);
}

export function specValue(specs: PropertySpecs | undefined, label: RegExp): string | undefined {
  for (const item of specs?.specsList ?? []) {
    if (item.label && label.test(item.label.toLowerCase())) return item.value;
  }
  return undefined;
}

export function landAreaLabel(specs?: PropertySpecs): string | undefined {
  if (specs?.landArea) return specs.landArea.toLocaleString("id-ID") + " m²";
  return specValue(specs, /(tanah|land)/i);
}

export function electricityValue(specs?: PropertySpecs): string | undefined {
  if (specs?.electricity) return specs.electricity;
  return specValue(specs, /(listrik|watt|va|electricity|power)/i);
}