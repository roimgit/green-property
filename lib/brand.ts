function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `#${[clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function mix(hex: string, target: { r: number; g: number; b: number }, weight: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const w = Math.max(0, Math.min(1, weight));
  return rgbToHex(rgb.r * (1 - w) + target.r * w, rgb.g * (1 - w) + target.g * w, rgb.b * (1 - w) + target.b * w);
}

function lighten(hex: string, amount: number) {
  return mix(hex, { r: 255, g: 255, b: 255 }, amount);
}
function darken(hex: string, amount: number) {
  return mix(hex, { r: 0, g: 0, b: 0 }, amount);
}

/**
 * Generate CSS overrides :root untuk semua token primary dari 1 warna.
 * Semua warna primary di @theme akan mengikuti hex ini.
 */
export function brandCss(primaryHex?: string | null): string {
  if (!primaryHex || !hexToRgb(primaryHex)) return "";
  const p = primaryHex.trim();
  // Turunan — dipakai untuk container / fixed / tint agar tetap harmonis
  const container = lighten(p, 0.18);
  const fixed = lighten(p, 0.82);
  const fixedDim = lighten(p, 0.62);
  const inverse = lighten(p, 0.55);
  const onFixedVariant = darken(p, 0.18);
  const tint = p;

  return `:root{--color-primary:${p};--color-primary-container:${container};--color-surface-tint:${tint};--color-primary-fixed:${fixed};--color-primary-fixed-dim:${fixedDim};--color-inverse-primary:${inverse};--color-on-primary-fixed-variant:${onFixedVariant};}`;
}
