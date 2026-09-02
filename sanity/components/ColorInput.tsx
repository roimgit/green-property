"use client";

import { useCallback, type ChangeEvent } from "react";
import { set, type StringInputProps } from "sanity";

function isHex(value: string) {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value.trim());
}

export function ColorInput(props: StringInputProps) {
  const { value, onChange, readOnly, elementProps } = props;
  const hex = typeof value === "string" ? value : "";

  const handleColor = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      onChange(set(e.target.value));
    },
    [onChange, readOnly],
  );

  const handleText = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (readOnly) return;
      onChange(set(e.target.value));
    },
    [onChange, readOnly],
  );

  const valid = !hex || isHex(hex);

  return (
    <div>
      {props.renderDefault(props)}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginTop: 10,
          padding: 8,
          border: "1px solid var(--card-border-color, #ddd)",
          borderRadius: 8,
        }}
      >
        <input
          type="color"
          value={isHex(hex) ? (hex.length === 4 ? hex + hex.slice(1) : hex) : "#00602c"}
          onChange={handleColor}
          disabled={readOnly}
          style={{ width: 44, height: 36, padding: 2, border: "1px solid #ccc", borderRadius: 6, cursor: readOnly ? "not-allowed" : "pointer" }}
          aria-label="Pilih warna"
        />
        <input
          type="text"
          id={elementProps.id}
          value={hex}
          onChange={handleText}
          placeholder="#00602c"
          readOnly={readOnly}
          style={{
            flex: 1,
            padding: "8px 10px",
            border: valid ? "1px solid #d0d5dd" : "1px solid #e5484d",
            borderRadius: 6,
            fontFamily: "monospace",
            fontSize: 14,
          }}
        />
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            border: "1px solid #ddd",
            background: valid && hex ? hex : "#00602c",
            flexShrink: 0,
          }}
          title={hex || "#00602c"}
        />
      </div>
      {!valid && <p style={{ color: "#e5484d", fontSize: 12, marginTop: 6 }}>Format harus hex #RRGGBB, contoh #00602c</p>}
    </div>
  );
}
