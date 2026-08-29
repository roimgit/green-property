import Link from "next/link";
import type { Property } from "@/types/sanity";
import { imageUrl, formatPrice } from "@/lib/sanity/data";

function formatArea(area?: number): string | null {
  if (!area) return null;
  return area.toLocaleString("id-ID") + " m²";
}

export default function PropertyCard({ property }: { property: Property }) {
  const img = imageUrl(property.mainImage);
  const price = formatPrice(property.price);
  const specs = property.specs;
  const transactionLabel = property.transactionType === "Sewa" ? "Sewa" : "Jual";

  return (
    <Link
      href={`/properties/${property.slug?.current ?? property._id}`}
      className="group relative bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/50 shadow-soft hover:shadow-md transition-all cursor-pointer flex flex-col"
    >
      <div className="relative h-60 w-full overflow-hidden bg-surface-container-low">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={property.title ?? "Properti"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-surface-container-low" />
        )}
        {property.category && (
          <span className="absolute top-3 left-3 z-10 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm">
            {property.category}
          </span>
        )}
        {transactionLabel && (
          <span className="absolute top-3 right-3 z-10 bg-primary text-on-primary px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm">
            {transactionLabel}
          </span>
        )}
      </div>

      <div className="p-sm flex flex-col gap-sm flex-grow">
        <div className="flex flex-col gap-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="font-body-sm line-clamp-1">
              {property.locationShort ?? property.fullAddress ?? "Lokasi"}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center text-on-surface-variant font-body-sm border-t border-outline-variant/30 pt-sm mt-auto">
          <div className="flex items-center gap-1" title="Luas Tanah">
            <span className="material-symbols-outlined text-[18px]">aspect_ratio</span>
            <span>{formatArea(specs?.landArea) ?? "-"}</span>
          </div>
          {specs?.electricity && (
            <div className="flex items-center gap-1" title="Daya Listrik">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{specs.electricity}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-end mt-sm">
          <div className="font-price-display text-price-display text-primary">
            {price ?? "Hubungi Kami"}
          </div>
          <span
            className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center"
            title="Hubungi via WhatsApp"
          >
            <span className="material-symbols-outlined">chat</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
