"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Hero/banner image that reveals itself only once the source has finished
 * loading (driven by the native image `onLoad` event). Until then it stays
 * transparent, so the banner never flashes a partially-loaded frame.
 */
export default function HeroBannerImage({
  src,
  alt = "Banner",
}: {
  src: string;
  alt?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes="100vw"
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`object-cover transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}