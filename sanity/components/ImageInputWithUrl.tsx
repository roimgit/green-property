"use client";

import {
  useState,
  useCallback,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import { set, unset, type ObjectInputProps, type Image } from "sanity";

type ImageValue = Image & { url?: string };

/**
 * Custom image input that supports both Sanity's default asset upload
 * (drag & drop / browse) AND the manual entry of an external image URL.
 *
 * - When the admin uploads a file, the standard Sanity asset flow is used and
 *   the stored value keeps an `asset` reference (`asset->{url}` resolves).
 * - When the admin pastes an external URL (and no asset is uploaded), the URL
 *   is stored directly on `value.url`, which the front end reads via
 *   `image?.url` fallback in `imageUrl()`.
 */
export function ImageInputWithUrl(props: ObjectInputProps<ImageValue>) {
  const { value, onChange, readOnly } = props;

  const [urlInput, setUrlInput] = useState<string>(
    typeof value?.url === "string" ? value.url : "",
  );

  const hasAsset = Boolean(value?.asset);
  const currentUrl = typeof value?.url === "string" ? value.url : "";

  const handleUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.currentTarget.value;
      setUrlInput(next);
      const trimmed = next.trim();

      // When a URL is being typed, drop any previously stored asset so the
      // external URL becomes the source of truth for this image.
      const patches: Array<ReturnType<typeof set | typeof unset>> = [
        set({ ...(value ?? {}), _type: "image", url: trimmed }),
      ];
      if (hasAsset) patches.push(unset(["asset"]));
      onChange(patches);
    },
    [onChange, value, hasAsset],
  );

  const handleClearUrl = useCallback(() => {
    setUrlInput("");
    if (hasAsset) {
      onChange(unset(["url"]));
    } else {
      onChange(unset());
    }
  }, [onChange, hasAsset]);

  const inputWrapStyle: CSSProperties = {
    border: "1px solid var(--card-border-color, #ccc)",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  };
  const labelStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#667085",
    marginBottom: 8,
    display: "block",
  };
  const hintStyle: CSSProperties = {
    fontSize: 12,
    color: "#667085",
    marginTop: 12,
  };

  return (
    <div>
      {/* Default Sanity image input: upload / browse assets */}
      {props.renderDefault(props)}

      <div style={inputWrapStyle}>
        <label style={labelStyle}>Atau masukkan URL gambar eksternal</label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="url"
            value={urlInput}
            onChange={handleUrlChange}
            placeholder="https://contoh.com/gambar.jpg"
            readOnly={readOnly}
            style={{
              flex: 1,
              padding: "9px 12px",
              border: "1px solid #d0d5dd",
              borderRadius: 8,
              fontSize: 14,
            }}
          />
          <button
            type="button"
            onClick={handleClearUrl}
            disabled={readOnly || (!urlInput && !currentUrl)}
            style={{
              padding: "9px 12px",
              border: "1px solid #d0d5dd",
              borderRadius: 8,
              background: currentUrl ? "#fff0f0" : "#fff",
              color: currentUrl ? "#b42318" : "#344054",
              cursor: readOnly ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {currentUrl ? "Hapus URL" : "Bersihkan"}
          </button>
        </div>

        {currentUrl && (
          <div>
            <div style={hintStyle}>Pratinjau tautan eksternal:</div>
            <img
              src={currentUrl}
              alt="Pratinjau gambar eksternal"
              style={{ maxWidth: 320, width: "100%", marginTop: 8 }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0.3";
              }}
              onLoad={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "1";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
