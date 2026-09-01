"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
} from "react";
import {
  PatchEvent,
  set,
  unset,
  useFormCallbacks,
  useFormValue,
  type StringInputProps,
} from "sanity";
import { isProbablyMapsUrl, parseCoordinates } from "@/lib/maps/coordinates";

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
  const formLatitude = useFormValue(["latitude"]) as number | undefined;
  const formLongitude = useFormValue(["longitude"]) as number | undefined;
  const { onChange: onDocumentChange } = useFormCallbacks();

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const requestId = useRef(0);

  const applyCoordinates = useCallback(
    (lat: number, lng: number) => {
      onDocumentChange(
        PatchEvent.from([set(lat, ["latitude"]), set(lng, ["longitude"])]),
      );
    },
    [onDocumentChange],
  );

  const clearCoordinates = useCallback(() => {
    onDocumentChange(
      PatchEvent.from([unset(["latitude"]), unset(["longitude"])]),
    );
  }, [onDocumentChange]);

  const resolveFromUrl = useCallback(
    async (nextUrl: string) => {
      const trimmed = nextUrl.trim();
      if (!trimmed) {
        setStatus("idle");
        setMessage(null);
        return;
      }

      const local = parseCoordinates(trimmed);
      if (local) {
        applyCoordinates(local.lat, local.lng);
        setStatus("idle");
        setMessage(null);
        return;
      }

      if (!isProbablyMapsUrl(trimmed)) {
        setStatus("error");
        setMessage("Tempel URL Google Maps yang valid.");
        return;
      }

      const id = ++requestId.current;
      setStatus("loading");
      setMessage("Mengambil koordinat dari link...");

      try {
        const response = await fetch(
          `/api/maps-coordinates?url=${encodeURIComponent(trimmed)}`,
        );
        const data = (await response.json()) as {
          latitude?: number;
          longitude?: number;
          error?: string;
        };

        if (id !== requestId.current) return;

        if (!response.ok || data.latitude == null || data.longitude == null) {
          setStatus("error");
          setMessage(
            data.error ||
              "Koordinat tidak ditemukan. Short link gagal diurai; tempel URL Maps lengkap atau isi lat/lng manual.",
          );
          return;
        }

        applyCoordinates(data.latitude, data.longitude);
        setStatus("idle");
        setMessage(null);
      } catch {
        if (id !== requestId.current) return;
        setStatus("error");
        setMessage("Gagal menghubungi server untuk membaca koordinat.");
      }
    },
    [applyCoordinates],
  );

  const lastResolvedUrl = useRef<string | null>(null);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = url.trim();
      const alreadyHaveCoords =
        formLatitude !== undefined &&
        formLatitude !== null &&
        formLongitude !== undefined &&
        formLongitude !== null;

      if (lastResolvedUrl.current === trimmed) return;
      if (lastResolvedUrl.current === null && alreadyHaveCoords && trimmed) {
        lastResolvedUrl.current = trimmed;
        return;
      }
      lastResolvedUrl.current = trimmed;
      void resolveFromUrl(url);
    }, 500);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value;
    onChange(next ? set(next) : unset());
    if (!next.trim()) {
      clearCoordinates();
      setStatus("idle");
      setMessage(null);
    }
  };

  const hasCoords =
    formLatitude !== undefined &&
    formLongitude !== undefined &&
    formLatitude !== null &&
    formLongitude !== null;

  const handleCopy = async () => {
    if (!hasCoords) return;
    await navigator.clipboard.writeText(`${formLatitude},${formLongitude}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={wrapStyle}>
      <p style={{ margin: 0, fontSize: 12, color: "#667085" }}>
        {schemaType.description ||
          "Tempel link Google Maps. Koordinat terisi otomatis."}
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

      {status === "loading" && (
        <div style={{ fontSize: 12, color: "#667085" }}>{message}</div>
      )}

      {hasCoords && (
        <div style={infoStyle}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>
            Koordinat otomatis
          </div>
          <div style={rowStyle}>
            <code>
              {Number(formLatitude).toFixed(6)}, {Number(formLongitude).toFixed(6)}
            </code>
            <button type="button" onClick={handleCopy} style={buttonStyle}>
              {copied ? "Tersalin" : "Salin"}
            </button>
            <button
              type="button"
              onClick={() => void resolveFromUrl(url)}
              disabled={readOnly || !url}
              style={buttonStyle}
            >
              Generate ulang
            </button>
            <button
              type="button"
              onClick={clearCoordinates}
              disabled={readOnly}
              style={buttonStyle}
            >
              Hapus
            </button>
          </div>
        </div>
      )}

      {status === "error" && !hasCoords && message && (
        <div style={warnStyle}>{message}</div>
      )}
    </div>
  );
}
