import { getContacts, getCompanyProfile, getFormattedOperationalHours } from "@/lib/sanity/data";
import type { Contact } from "@/types/sanity";
import { MapDisplay } from "./MapDisplay";
import { ContactActionCards } from "@/components/ContactActionCards";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hubungi Kami - Green Property",
};

export default async function ContactPage() {
  const contacts: Contact[] = await getContacts();
  const companyProfile = await getCompanyProfile();
  const mapsUrl = companyProfile?.googleMapsUrl || null;

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-lg py-xl flex flex-col gap-lg">
      {/* Header */}
      <section className="flex flex-col gap-base">
        <div>
          <h1 className="font-display text-display text-on-surface">Hubungi Kami</h1>
          <p className="text-on-surface-variant font-body-md mt-sm">
            Tim profesional Green Property siap membantu Anda menemukan properti impian. Hubungi kami untuk konsultasi.
          </p>
        </div>
      </section>

      <ContactActionCards contacts={contacts} />

      {/* Additional Contact Info Section */}
      <section className="mt-xl pt-xl border-t border-primary/20 flex flex-col gap-lg">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
            Informasi Tambahan
          </h2>
          <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex gap-md">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">
                  location_on
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                  Lokasi Kantor
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  {companyProfile?.address || "Alamat tidak tersedia"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex gap-md">
              <div className="w-14 h-14 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">
                  schedule
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                  Jam Operasional
                </h3>
                <div className="text-on-surface-variant font-body-md space-y-1">
                  {getFormattedOperationalHours(companyProfile?.operationalHours).map((item) => (
                    <div key={item.label} className="flex justify-between gap-4">
                      <span>{item.label}:</span>
                      <span className="font-semibold text-on-surface">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section with Leaflet */}
      {companyProfile?.latitude && companyProfile?.longitude ? (
        <section className="mt-xl flex flex-col gap-md">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
              Lokasi Kami di Peta
            </h2>
            <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-primary/20 hover:border-primary/40 transition-all">
            <MapDisplay
              latitude={companyProfile.latitude}
              longitude={companyProfile.longitude}
              address={companyProfile?.address}
            />
          </div>

          {/* Additional action buttons */}
          <div className="flex gap-md flex-wrap">
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-64 bg-primary text-on-primary px-lg py-md rounded-xl font-semibold hover:bg-primary hover:shadow-lg transition-all flex items-center justify-center gap-md text-center"
              >
                <span className="material-symbols-outlined">location_on</span>
                Buka di Google Maps
              </a>
            )}
            <a
              href={`https://www.google.com/maps/search/${encodeURIComponent(companyProfile?.address || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-64 bg-primary/10 text-primary px-lg py-md rounded-xl font-semibold hover:bg-primary/20 transition-all flex items-center justify-center gap-md text-center border border-primary/20"
            >
              <span className="material-symbols-outlined">directions</span>
              Lihat Rute
            </a>
          </div>
        </section>
      ) : (
        <section className="mt-xl pt-xl border-t border-primary/20 flex flex-col gap-lg">
          <div className="text-center">
            <p className="text-on-surface-variant font-body-lg">
              ⚠️ Koordinat peta belum tersedia. Silakan update di Sanity Studio.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}