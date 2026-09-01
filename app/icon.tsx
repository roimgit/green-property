import { ImageResponse } from "next/og";
import { croppedImageUrl, getCompanyProfile, tabLogoImage } from "@/lib/sanity/data";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Fallback favicon: primary-green "GP" chip when no logo is uploaded/fetchable. */
function fallbackIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#00602c",
          borderRadius: 14,
          fontSize: 30,
          fontWeight: 800,
          color: "#ffffff",
        }}
      >
        GP
      </div>
    ),
    { ...size }
  );
}

/** Camel-case branch only produced for the company logo. */
function logoIcon(logoUrl: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt=""
          width={64}
          height={64}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}

/** Browser-tab favicon source: separate upload (mode=custom) or company logo,
 *  rendered with the Sanity crop applied. */
export default async function Icon() {
  let iconUrl: string | null = null;
  try {
    const profile = await getCompanyProfile();
    iconUrl = croppedImageUrl(tabLogoImage(profile), 128) ?? null;
  } catch {
    iconUrl = null;
  }

  return iconUrl ? logoIcon(iconUrl) : fallbackIcon();
}