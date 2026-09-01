"use client";

import { useState } from "react";
import type { SanityImage } from "@/types/sanity";
import { imageUrl } from "@/lib/sanity/data";

export default function PropertyGallery({ images }: { images: SanityImage[] }) {
  const urls = images.map((img) => imageUrl(img)).filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  if (urls.length === 0) return null;

  const showPrev = () => setActive((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  const showNext = () => setActive((prev) => (prev === urls.length - 1 ? 0 : prev + 1));

  return (
    <div className="flex flex-col gap-sm relative group">
      <div className="relative w-full h-[300px] md:h-[520px] overflow-hidden rounded-2xl border border-outline-variant/60 bg-surface-container shadow-soft">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urls[active]}
          alt="Property view"
          className="h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-[1.02]"
        />

        <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 md:p-5">
          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface shadow-sm backdrop-blur-sm">
            Gallery {active + 1}/{urls.length}
          </span>
          {urls.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-on-surface shadow-sm transition hover:bg-white"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-on-surface shadow-sm transition hover:bg-white"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          )}
        </div>

        {urls.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
            {urls.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setActive(i)}
                className={
                  "h-2.5 w-2.5 rounded-full transition-all " +
                  (i === active ? "w-8 bg-white" : "bg-white/60 hover:bg-white/90")
                }
              />
            ))}
          </div>
        )}
      </div>

      {urls.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-6">
          {urls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={
                "relative overflow-hidden rounded-xl border transition-all duration-200 " +
                (i === active ? "border-primary shadow-sm ring-2 ring-primary/20" : "border-outline-variant/70 opacity-75 hover:opacity-100")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="h-20 w-full object-cover sm:h-24"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
