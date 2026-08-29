"use client";

import { useState } from "react";
import type { SanityImage } from "@/types/sanity";
import { imageUrl } from "@/lib/sanity/data";

export default function PropertyGallery({ images }: { images: SanityImage[] }) {
  const urls = images.map((img) => imageUrl(img)).filter(Boolean) as string[];
  const [active, setActive] = useState(0);

  if (urls.length === 0) return null;

  return (
    <div className="flex flex-col gap-sm relative group cursor-pointer">
      <div className="w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden bg-surface-container">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={urls[active]}
          alt="Property view"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      {urls.length > 1 && (
        <div className="flex gap-sm overflow-x-auto no-scrollbar py-2">
          {urls.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={url}
              alt={`Thumbnail ${i + 1}`}
              onClick={() => setActive(i)}
              className={
                "h-24 w-32 rounded-lg object-cover cursor-pointer transition-opacity " +
                (i === active ? "opacity-100 border-2 border-primary" : "opacity-70 hover:opacity-100")
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
