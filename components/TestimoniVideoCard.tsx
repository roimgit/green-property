"use client";

import { useState } from "react";
import { getYouTubeVideoId } from "@/lib/sanity/data";

export default function TestimoniVideoCard({
  url,
  label,
  nama,
}: {
  url: string;
  label?: string;
  nama?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoId = getYouTubeVideoId(url);

  // YouTube: embed video
  if (videoId) {
    const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-outline-variant/50 bg-black shadow-sm">
        {playing ? (
          <iframe
            src={embedSrc}
            title={`Video testimoni ${nama ?? ""}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt={`Thumbnail video ${nama ?? "testimoni"}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            {/* overlay play button */}
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Putar video ${nama ?? "testimoni"}`}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40 group"
            >
              <span className="w-16 h-16 flex items-center justify-center rounded-full bg-white/90 text-primary shadow-lg group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </span>
            </button>
          </>
        )}
      </div>
    );
  }

  // Non-YouTube: tampilkan sebagai tombol link eksternal
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-primary/90 transition-colors"
    >
      <span className="material-symbols-outlined text-[18px]">play_circle</span>
      Tonton Testimoni{label?.trim() ? ` - ${label.trim()}` : ""}
    </a>
  );
}
