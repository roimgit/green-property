"use client";

import { useRef, useState, useEffect } from "react";
import { PortableText } from "@portabletext/react";
import type { Service } from "@/types/sanity";

interface ServiceCarouselProps {
  services: Service[];
}

export default function ServiceCarousel({ services }: ServiceCarouselProps) {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainer.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);

      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  useEffect(() => {
    checkScroll();
  }, [services]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainer.current) return;

    const scrollAmount = 320; // width of card (w-80 = 320px) + gap (gap-gutter)
    const { scrollLeft } = scrollContainer.current;

    scrollContainer.current.scrollTo({
      left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className={`absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          canScrollLeft
            ? "bg-primary text-on-primary hover:bg-primary-container shadow-md cursor-pointer"
            : "bg-surface-container-low text-on-surface-variant cursor-not-allowed opacity-50"
        }`}
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>

      {/* Carousel Container */}
      <div
        ref={scrollContainer}
        className="flex gap-gutter overflow-x-hidden scroll-smooth items-stretch"
      >
        {services.map((service) => {
          const cardContent = (
            <>
              {/* Top accent bar */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/30 rounded-t-xl" />

              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-on-primary flex items-center justify-center mb-md shadow-md shadow-primary/20">
                  <span
                    className="material-symbols-outlined text-on-primary text-[34px]"
                    style={{ fontFamily: '"Material Symbols Outlined"' }}
                  >
                    {service.icon || "landscape"}
                  </span>
                </div>
                {service.subtitle && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold uppercase tracking-wide mb-2">
                    {service.subtitle}
                  </span>
                )}
                <h3 className="font-headline-md text-headline-md text-on-surface font-bold mb-sm">
                  {service.title}
                </h3>
                <div className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {typeof service.desc === "string" ? (
                    service.desc
                  ) : service.desc && service.desc.length > 0 ? (
                    <PortableText value={service.desc} />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </>
          );

          const cardClassName =
            "relative flex-shrink-0 w-80 bg-surface-container-lowest border border-outline-variant p-lg rounded-2xl shadow-soft overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:border-primary transition-all duration-300 flex flex-col";

          return service.url ? (
            <a
              key={service._id}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClassName}
            >
              {cardContent}
            </a>
          ) : (
            <div key={service._id} className={cardClassName}>
              {cardContent}
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className={`absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          canScrollRight
            ? "bg-primary text-on-primary hover:bg-primary-container shadow-md cursor-pointer"
            : "bg-surface-container-low text-on-surface-variant cursor-not-allowed opacity-50"
        }`}
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>
    </div>
  );
}
