type MapDisplayProps = {
  latitude?: number | string | null;
  longitude?: number | string | null;
  address?: string;
};

function toCoord(value: number | string | null | undefined): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

export function MapDisplay({ latitude, longitude, address }: MapDisplayProps) {
  const lat = toCoord(latitude);
  const lng = toCoord(longitude);

  if (lat === null || lng === null) {
    return (
      <div
        style={{ height: "400px", width: "100%" }}
        className="flex items-center justify-center bg-red-50 rounded border border-red-200"
      >
        <p className="text-red-600 text-center">Koordinat tidak tersedia.</p>
      </div>
    );
  }

  const query = `${lat},${lng}`;
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;

  return (
    <iframe
      title={address || "Lokasi kantor"}
      src={src}
      className="w-full border-0 block"
      style={{ height: "400px" }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}
