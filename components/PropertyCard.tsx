import Link from "next/link";
import type { Property } from "@/types/sanity";
import {
  imageUrl,
  getPrimaryPriceDisplay,
  getTransactionTypes,
} from "@/lib/sanity/data";
import { landAreaLabel, electricityValue } from "@/lib/sanity/specifications";

export default function PropertyCard({ property }: { property: Property }) {
  const img = imageUrl(property.mainImage);
  const priceDisplay = getPrimaryPriceDisplay(property);
  const transactionTypes = getTransactionTypes(property);

  // `category` could be a plain string (current schema) or a Sanity reference
  // object `{ _ref, _type }` from older documents. Only render a plain string
  // to avoid crashing the card render.
  const categoryLabel =
    typeof property.category === "string" ? property.category : null;

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
        {categoryLabel && (
          <span className="absolute top-3 left-3 z-10 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm">
            {categoryLabel}
          </span>
        )}
        {transactionTypes.length > 0 && (
          <div className="absolute top-3 right-3 z-10 flex flex-wrap gap-1 justify-end">
            {transactionTypes.map((tx) => (
              <span
                key={tx}
                className="bg-primary text-on-primary px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm"
              >
                {tx}
              </span>
            ))}
          </div>
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
            <span>{landAreaLabel(property) ?? "-"}</span>
          </div>
          {(electricityValue(property)) && (
            <div className="flex items-center gap-1" title="Daya Listrik">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>{electricityValue(property)}</span>
            </div>
          )}
        </div>

        <div className="pt-xs">
          <div className="font-price-display text-headline-sm font-bold text-primary tracking-tight line-clamp-1">
            {priceDisplay ?? "Harga Belum Diatur"}
          </div>
        </div>
      </div>
    </Link>
  );
}
