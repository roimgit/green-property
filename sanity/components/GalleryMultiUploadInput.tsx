"use client";

import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
  type CSSProperties,
} from "react";
import {
  useClient,
  insert,
  set,
  type ArrayOfObjectsInputProps,
} from "sanity";

function generateKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").substring(0, 12);
  }
  return Math.random().toString(36).substring(2, 14);
}

export function GalleryMultiUploadInput(props: ArrayOfObjectsInputProps) {
  const { value, onChange, readOnly } = props;
  const client = useClient({ apiVersion: "2023-01-01" });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showBulkUrl, setShowBulkUrl] = useState(false);
  const [bulkUrlInput, setBulkUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Proses upload banyak file gambar ke Sanity Assets
  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const validFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/") ||
        /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(file.name)
      );

      if (validFiles.length === 0) {
        setErrorMessage("Tidak ada file gambar valid yang dipilih.");
        return;
      }

      setErrorMessage(null);
      setIsUploading(true);
      setProgressPercent(0);
      setProgressText(`Mempersiapkan pengunggahan ${validFiles.length} foto...`);

      const newItems: Array<{
        _type: "image";
        _key: string;
        asset: { _type: "reference"; _ref: string };
      }> = [];

      let failedCount = 0;

      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const currentNum = i + 1;
        const total = validFiles.length;
        const percent = Math.round(((i) / total) * 100);

        setProgressPercent(percent);
        setProgressText(`Mengunggah foto ${currentNum} dari ${total}: ${file.name}`);

        try {
          const asset = await client.assets.upload("image", file, {
            filename: file.name,
            contentType: file.type || undefined,
          });

          newItems.push({
            _type: "image",
            _key: generateKey(),
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          });
        } catch (err) {
          console.error(`Gagal mengunggah file ${file.name}:`, err);
          failedCount++;
        }
      }

      setProgressPercent(100);
      setProgressText("Menyimpan ke galeri...");

      if (newItems.length > 0) {
        if (!value || value.length === 0) {
          onChange(set(newItems));
        } else {
          onChange(insert(newItems, "after", [-1]));
        }
      }

      setIsUploading(false);
      setProgressPercent(0);
      setProgressText("");

      if (failedCount > 0) {
        setErrorMessage(
          `${failedCount} dari ${validFiles.length} foto gagal diunggah. Silakan periksa koneksi atau format file.`
        );
      }

      // Reset file input agar bisa memilih file yang sama lagi jika perlu
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [client, onChange, value]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadFiles(e.target.files);
      }
    },
    [uploadFiles]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!readOnly) setIsDragging(true);
  }, [readOnly]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (readOnly || isUploading) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files);
      }
    },
    [readOnly, isUploading, uploadFiles]
  );

  // Proses menambahkan banyak URL eksternal sekaligus
  const handleBulkUrlSubmit = useCallback(() => {
    const lines = bulkUrlInput
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && /^https?:\/\//i.test(l));

    if (lines.length === 0) {
      setErrorMessage("Tidak ada URL yang valid. Pastikan setiap URL diawali http:// atau https://");
      return;
    }

    setErrorMessage(null);
    const newItems = lines.map((url) => ({
      _type: "image" as const,
      _key: generateKey(),
      url,
    }));

    if (!value || value.length === 0) {
      onChange(set(newItems));
    } else {
      onChange(insert(newItems, "after", [-1]));
    }

    setBulkUrlInput("");
    setShowBulkUrl(false);
  }, [bulkUrlInput, onChange, value]);

  // Styling Styles
  const dropzoneStyle: CSSProperties = {
    border: `2px dashed ${isDragging ? "#10b981" : "#cbd5e1"}`,
    backgroundColor: isDragging ? "#f0fdf4" : "var(--card-bg-color, #ffffff)",
    borderRadius: 12,
    padding: "20px 16px",
    marginBottom: 16,
    textAlign: "center",
    transition: "all 0.2s ease-in-out",
    boxShadow: isDragging ? "0 0 0 4px rgba(16, 185, 129, 0.15)" : "none",
  };

  const buttonBaseStyle: CSSProperties = {
    padding: "9px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: readOnly || isUploading ? "not-allowed" : "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    transition: "background-color 0.15s ease",
  };

  return (
    <div>
      {/* Dropzone & Quick Upload Toolbar */}
      <div
        style={dropzoneStyle}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={readOnly || isUploading}
        />

        <div style={{ marginBottom: 10 }}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDragging ? "#10b981" : "#64748b"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ margin: "0 auto", display: "block" }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>

        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: isDragging ? "#047857" : "var(--card-fg-color, #1e293b)",
            marginBottom: 4,
          }}
        >
          {isDragging
            ? "Lepaskan foto di sini untuk mengunggah..."
            : "Upload Banyak Foto Galeri Sekaligus"}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#64748b",
            marginBottom: 14,
            maxWidth: 440,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Tarik & lepas banyak file foto ke kotak ini, atau pilih beberapa file dari komputer Anda (JPG, PNG, WebP, AVIF).
        </div>

        {/* Buttons Action */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={readOnly || isUploading}
            style={{
              ...buttonBaseStyle,
              backgroundColor: isUploading ? "#94a3b8" : "#059669",
              color: "#ffffff",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {isUploading ? "Mengunggah..." : "Pilih Banyak Foto (File Explorer)"}
          </button>

          <button
            type="button"
            onClick={() => setShowBulkUrl((prev) => !prev)}
            disabled={readOnly || isUploading}
            style={{
              ...buttonBaseStyle,
              backgroundColor: "transparent",
              color: "#475569",
              border: "1px solid #cbd5e1",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {showBulkUrl ? "Tutup Input URL" : "Tambah dari Banyak URL (Link)"}
          </button>
        </div>

        {/* Progress State Bar */}
        {isUploading && (
          <div style={{ marginTop: 16, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#059669",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              <span>{progressText}</span>
              <span>{progressPercent}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: 8,
                backgroundColor: "#e2e8f0",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#10b981",
                  transition: "width 0.25s ease-in-out",
                }}
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              color: "#b91c1c",
              fontSize: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              style={{
                background: "none",
                border: "none",
                color: "#b91c1c",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "0 4px",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Bulk URL Box */}
        {showBulkUrl && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              backgroundColor: "#f8fafc",
              textAlign: "left",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 600,
                color: "#334155",
                marginBottom: 6,
              }}
            >
              Masukkan URL Gambar (Satu URL per baris):
            </label>
            <textarea
              rows={4}
              value={bulkUrlInput}
              onChange={(e) => setBulkUrlInput(e.target.value)}
              placeholder="https://contoh.com/foto-1.jpg&#10;https://contoh.com/foto-2.jpg"
              style={{
                width: "100%",
                padding: 10,
                fontSize: 13,
                fontFamily: "monospace",
                borderRadius: 6,
                border: "1px solid #cbd5e1",
                boxSizing: "border-box",
                marginBottom: 10,
              }}
            />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowBulkUrl(false)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleBulkUrlSubmit}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "none",
                  background: "#059669",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Tambahkan Semua URL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Render list default Sanity Array tanpa tombol "+ Add Item" bawaan karena sudah ada Upload Multi */}
      <div className="hide-sanity-add-item">
        <style>{`
          .hide-sanity-add-item [data-testid*="add"],
          .hide-sanity-add-item [data-testid="array-functions"],
          .hide-sanity-add-item [data-testid*="ArrayFunctions"],
          .hide-sanity-add-item button[aria-label*="Add"],
          .hide-sanity-add-item button[aria-label*="Tambah"] {
            display: none !important;
          }
        `}</style>
        {props.renderDefault({
          ...props,
          arrayFunctions: () => null,
        })}
      </div>
    </div>
  );
}
