import { NextResponse } from "next/server";
import { parseCoordinates } from "@/lib/maps/coordinates";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
};

async function followRedirects(startUrl: string, maxHops = 8): Promise<{
  url: string;
  html: string;
}> {
  let current = startUrl;
  let html = "";

  for (let i = 0; i < maxHops; i++) {
    const fromUrl = parseCoordinates(current);
    if (fromUrl) return { url: current, html };

    const response = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: BROWSER_HEADERS,
    });

    const location = response.headers.get("location");
    if (location && response.status >= 300 && response.status < 400) {
      current = new URL(location, current).toString();
      continue;
    }

    html = await response.text();
    current = response.url || current;
    break;
  }

  return { url: current, html };
}

export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url")?.trim();
  if (!raw) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  try {
    const direct = parseCoordinates(raw);
    if (direct) {
      return NextResponse.json({
        latitude: direct.lat,
        longitude: direct.lng,
        resolvedUrl: raw,
      });
    }

    const target = raw.startsWith("http") ? raw : `https://${raw}`;
    const { url, html } = await followRedirects(target);
    const fromResolved =
      parseCoordinates(url) || parseCoordinates(html) || null;

    if (!fromResolved) {
      return NextResponse.json(
        { error: "Koordinat tidak ditemukan di URL tersebut." },
        { status: 422 },
      );
    }

    return NextResponse.json({
      latitude: fromResolved.lat,
      longitude: fromResolved.lng,
      resolvedUrl: url,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Gagal membaca koordinat dari URL Maps.",
      },
      { status: 500 },
    );
  }
}
