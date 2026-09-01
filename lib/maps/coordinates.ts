export type LatLng = { lat: number; lng: number };

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function valid(lat: number, lng: number): LatLng | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return { lat, lng };
}

/** Ambil lat/lng dari URL Maps lengkap, embed, atau HTML hasil redirect. */
export function parseCoordinates(input: string): LatLng | null {
  const text = safeDecode(input);

  const marker = text.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (marker) {
    const found = valid(parseFloat(marker[1]), parseFloat(marker[2]));
    if (found) return found;
  }

  const at = text.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (at) {
    const found = valid(parseFloat(at[1]), parseFloat(at[2]));
    if (found) return found;
  }

  const named = [
    /[?&#](?:q|query|ll|center|sll)=(-?\d+\.?\d*)[,\s+]+(-?\d+\.?\d*)/i,
    /\/search\/(-?\d+\.?\d*),\+?(-?\d+\.?\d*)/,
    /\/maps\/place\/(-?\d+\.?\d*),\+?(-?\d+\.?\d*)/,
  ];
  for (const pattern of named) {
    const match = text.match(pattern);
    if (match) {
      const found = valid(parseFloat(match[1]), parseFloat(match[2]));
      if (found) return found;
    }
  }

  return null;
}

export function isProbablyMapsUrl(value: string): boolean {
  return /(?:google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.)/i.test(
    value,
  );
}
