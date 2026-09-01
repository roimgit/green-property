"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Header logo image that fades in once loaded (native `onLoad` event), so the
 * brand never flashes an empty/partial frame while the asset is fetching.
 */
export default function LogoImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      onLoad={() => setLoaded(true)}
      onError={() => setLoaded(true)}
      className={`notranslate h-12 w-auto transition-opacity duration-700 ${
        loaded ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}