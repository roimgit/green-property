"use client";

import { useState, useEffect, useCallback } from "react";
import type { SanityImage } from "@/types/sanity";
import { imageUrl } from "@/lib/sanity/data";

export default function PropertyGallery({ images }: { images: SanityImage[] }) {
  const urls = images.map((img) => imageUrl(img)).filter(Boolean) as string[];
  const [active, setActive] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (urls.length === 0) return null;


  const showPrev = useCallback(() => {
    setActive((prev) => (prev === 0 ? urls.length - 1 : prev - 1));
  }, [urls.length]);

  const showNext = useCallback(() => {
    setActive((prev) => (prev === urls.length - 1 ? 0 : prev + 1));
  }, [urls.length]);

  const openLightbox = (index: number) => {
    setActive(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  // Keyboard navigation for Lightbox modal
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, showNext, showPrev]);

  return (
    <div className="flex flex-col gap-md relative">
      {/* Main Image Slider Container */}
      <div className="relative w-full h-[340px] sm:h-[420px] md:h-[540px] overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface-container-low shadow-soft group">
        {/* Main Image - Click to Open Fullscreen Lightbox */}
        <button
          type="button"
          onClick={() => openLightbox(active)}
          className="w-full h-full cursor-zoom-in relative block"
          title="Klik untuk membuka layar penuh"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={urls[active]}
            alt={`Property photo ${active + 1}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
        </button>

        {/* Expand / Fullscreen Button (Top Right) */}
        <button
          type="button"
          onClick={() => openLightbox(active)}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105 shadow-md"
          title="Buka Layar Penuh"
        >
          <span className="material-symbols-outlined text-[22px]">fullscreen</span>
        </button>

        {/* Navigation Arrows (Sides) */}
        {urls.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:bg-black/75 hover:scale-105 shadow-md"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all opacity-80 hover:opacity-100 hover:bg-black/75 hover:scale-105 shadow-md"
            >
              <span className="material-symbols-outlined text-[24px]">chevron_right</span>
            </button>
          </>
        )}

        {/* Center Dots Pagination */}
        {urls.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2">
            {urls.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setActive(i)}
                className={
                  "h-2.5 rounded-full transition-all duration-300 shadow-sm " +
                  (i === active
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/60 hover:bg-white/90")
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {urls.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
          {urls.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={
                "relative overflow-hidden rounded-xl border transition-all duration-200 h-16 sm:h-20 " +
                (i === active
                  ? "border-primary ring-2 ring-primary/30 opacity-100 scale-[1.02]"
                  : "border-outline-variant/60 opacity-60 hover:opacity-100")
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Thumbnail ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300">
          {/* Top Bar: Counter & Close Button */}
          <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex justify-between items-center z-50 text-white bg-gradient-to-b from-black/80 to-transparent">
            <span className="text-sm md:text-base font-semibold tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
              {active + 1} / {urls.length}
            </span>
            <button
              type="button"
              onClick={closeLightbox}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md"
              title="Tutup (Esc)"
            >
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
          </div>

          {/* Fullscreen Main Image Container */}
          <div className="relative w-full h-full max-w-7xl max-h-[88vh] p-4 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={urls[active]}
              alt={`Fullscreen photo ${active + 1}`}
              className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
            />
          </div>

          {/* Lightbox Side Navigation Arrows */}
          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous photo"
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all"
              >
                <span className="material-symbols-outlined text-[32px]">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={showNext}
                aria-label="Next photo"
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all"
              >
                <span className="material-symbols-outlined text-[32px]">chevron_right</span>
              </button>
            </>
          )}

          {/* Lightbox Center Dots Indicator */}
          {urls.length > 1 && (
            <div className="absolute bottom-6 inset-x-0 z-50 flex items-center justify-center gap-2">
              {urls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    "h-2.5 rounded-full transition-all duration-300 " +
                    (i === active ? "w-8 bg-white" : "w-2.5 bg-white/40 hover:bg-white/80")
                  }
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
