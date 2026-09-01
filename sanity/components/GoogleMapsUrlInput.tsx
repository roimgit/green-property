"use client";

import {
  useCallback,
  useState,
  type CSSProperties,
  type ChangeEvent,
} from "react";
import {
  set,
  unset,
  useDocumentOperation,
  useFormValue,
  type StringInputProps,
} from "sanity";

function parseCoordinates(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  const bangMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (bangMatch) {
    return { lat: parseFloat(bangMatch[1]), lng: parseFloat(bangMatch[2]) };
  }

  try {
    const urlObj = new URL(url);
    const qParam = urlObj.searchParams.get("q") ?? urlObj.searchParams.get("query");
    const llParam = urlObj.searchParams.get("ll");
    const candidate = qParam || llParam;
    if (candidate) {
      const qMatch = candidate.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
      if (qMatch) {
        return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
      }
    }
  } catch {
    // not a full URL (short link, etc.)
  }

  return null;
}

const wrapStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
};
const rowStyle: CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};
const buttonStyle: CSSProperties = {
  padding: "8px 12px",
  border: "1px solid #d0d5dd",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  fontSize: 13,
};
const infoStyle: CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #b6d4fe",
  background: "#f0f7ff",
  fontSize: 13,
};
const warnStyle: CSSProperties = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ffe69c",
  background: "#fff3cd",
  fontSize: 13,
  color: "#856404",
};

export function GoogleMapsUrlInput(props: StringInputProps) {
  const { value, onChange, readOnly, schemaType } = props;
  const url = typeof value === "string" ? value : "";
  const latitude = useFormValue(["latitude"]) as number | undefined;
  const longitude = useFormValue(["longitude"]) as number | undefined;
  const documentId = useFormValue(["_id"]) as string | undefined;
  const documentType = useFormValue(["_type"]) as string | undefined;
  const publishedId = documentId?.replace(/^drafts\./, "") ?? "";
  const { patch } = useDocumentOperation(publishedId, documentType ?? "companyProfile");
  const [copied, setCopied] = useState(false);

  const applyCoordinates = useCallback(
    (lat: number, lng: number) => {
      if (!publishedId) return;
      patch.execute([{ set: { latitude: lat, longitude: lng } }]);
    },
    [patch, publishedId],
  );

  const clearCoordinates = useCallback(() => {
    if (!publishedId) return;
    patch.execute([{ unset: ["latitude", "longitude"] }]);
  }, [patch, publishedId]);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value;
    onChange(next ? set(next) : unset());
    const coords = parseCoordinates(next);
    if (coords) applyCoordinates(coords.lat, coords.lng);
  };

  const handleExtractClick = () => {
    const coords = parseCoordinates(url);
    if (coords) applyCoordinates(coords.lat, coords.lng);
  };

  const handleCopy = async () => {
    if (latitude === undefined || longitude === undefined) return;
    await navigator.clipboard.writeText(`${latitude},${longitude}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const hasCoords = latitude !== undefined && longitude !== undefined;

  return (
    <div style={wrapStyle}>
      <p style={{ margin: 0, fontSize: 12, color: "#667085" }}>
        {schemaType.description ||
          "Tempel link Google Maps. Koordinat akan diisi otomatis jika URL mengandung lat/lng."}
      </p>
      <input
        type="url"
        value={url}
        onChange={handleUrlChange}
        placeholder="https://maps.app.goo.gl/... atau https://www.google.com/maps/..."
        readOnly={readOnly}
        style={{
          width: "100%",
          padding: "9px 12px",
          border: "1px solid #d0d5dd",
          borderRadius: 8,
          fontSize: 14,
        }}
      />

      <div style={rowStyle}>
        <button
          type="button"
          onClick={handleExtractClick}
          disabled={readOnly || !url}
          style={buttonStyle}
        >
          Ekstrak koordinat
        </button>
        <button
          type="button"
          onClick={clearCoordinates}
          disabled={readOnly || !hasCoords}
          style={buttonStyle}
        >
          Hapus koordinat
        </button>
      </div>

      {hasCoords && (
        <div style={infoStyle}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>Koordinat terisi</div>
          <div style={rowStyle}>
            <code>
              {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
            </code>
            <button type="button" onClick={handleCopy} style={buttonStyle}>
              {copied ? "Tersalin" : "Salin"}
            </button>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc", display: "inline-block", marginTop: 8 }}
          >
            Lihat di Google Maps
          </a>
        </div>
      )}

      {url && !hasCoords && (
        <div style={warnStyle}>
          URL singkat biasanya tidak berisi koordinat. Isi Latitude dan Longitude
          secara manual, atau tempel URL Maps lengkap yang mengandung @lat,lng.
        </div>
      )}
    </div>
  );
}
