import Link from "next/link";
import type { Property } from "@/types/sanity";
import {
  imageUrl,
  getPrimaryPriceDisplay,
  getTransactionTypes,
} from "@/lib/sanity/data";
import { normalizePropertySpecs } from "@/lib/sanity/specifications";

export default function PropertyCard({ property }: { property: Property }) {
  const img = imageUrl(property.mainImage);
  const priceDisplay = getPrimaryPriceDisplay(property);
  const transactionTypes = getTransactionTypes(property);
  const displaySpecs = normalizePropertySpecs(property).slice(0, 6);

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
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1">
          {categoryLabel && (
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm">
              {categoryLabel}
            </span>
          )}
          {transactionTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
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
          {property.status && (
            <span className="inline-flex items-center gap-1 bg-surface/90 backdrop-blur text-on-surface px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm border border-outline-variant/40">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {property.status}
            </span>
          )}
          {property.kprAvailable && (
            <span className="inline-flex items-center gap-1 bg-primary text-on-primary px-3 py-1 rounded-full font-label-caps text-label-caps uppercase shadow-sm">
              <span className="material-symbols-outlined text-[14px]">account_balance</span>
              KPR
            </span>
          )}
        </div>
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

        {displaySpecs.length > 0 && (
          <div className="grid grid-cols-2 gap-x-sm gap-y-1.5 border-t border-outline-variant/30 pt-sm">
            {displaySpecs.map((s, i) =>
              s.value ? (
                <div
                  key={`${s.label}-${i}`}
                  className="flex items-center gap-1.5 text-on-surface-variant font-body-sm min-w-0"
                  title={s.label}
                >
                  <span className="material-symbols-outlined text-[16px] text-primary shrink-0 leading-none">
                    {s.icon || "check_circle"}
                  </span>
                  <span className="truncate font-semibold text-on-surface">{s.value}</span>
                </div>
              ) : null,
            )}
          </div>
        )}

        <div className="pt-xs mt-auto">
          <div className="font-price-display text-body-lg font-bold text-primary tracking-tight line-clamp-2 notranslate">
            {priceDisplay ?? "Harga Belum Tersedia"}
          </div>
        </div>
      </div>
    </Link>
  );
}
