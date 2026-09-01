import { getContacts, getCompanyProfile } from "@/lib/sanity/data";
import type { Contact } from "@/types/sanity";
import { MapDisplay } from "./MapDisplay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hubungi Kami - Green Property",
};

export default async function ContactPage() {
  const contacts: Contact[] = await getContacts();
  const companyProfile = await getCompanyProfile();
  const mapsUrl = companyProfile?.googleMapsUrl || null;

  console.log('[ContactPage] Company Profile:', {
    address: companyProfile?.address,
    latitude: companyProfile?.latitude,
    longitude: companyProfile?.longitude,
    googleMapsUrl: companyProfile?.googleMapsUrl,
  });

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-lg py-xl flex flex-col gap-lg">
      {/* Header */}
      <section className="flex flex-col gap-base">
        <div>
          <h1 className="font-display text-display text-on-surface">Hubungi Kami</h1>
          <p className="text-on-surface-variant font-body-md mt-sm">
            Tim profesional Green Property siap membantu Anda menemukan properti impian. Hubungi kami untuk konsultasi gratis.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      {contacts.length > 0 ? (
        <div>
          <div className="flex flex-col gap-sm mb-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface">Tim Kontak Kami</h2>
            <div className="h-1 w-12 bg-primary rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="relative bg-white rounded-2xl border border-primary/15 p-6 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 overflow-hidden group flex flex-col h-full"
              >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/30"></div>
                
                {/* Header dengan nama dan jabatan */}
                <div className="flex flex-col gap-xs mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">person</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface line-clamp-2">
                      {contact.name || "Tim Sales"}
                    </h2>
                  </div>
                  <div className="h-0.5 w-8 bg-gradient-to-r from-primary to-primary/30 rounded-full mt-1" />
                </div>

                {/* Contact Details */}
                <div className="flex flex-col gap-3 mb-6 flex-1">
                  {/* Email */}
                  {contact.email && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg mt-0.5">
                        mail
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Email</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:underline font-body-sm break-all font-semibold transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone Number */}
                  {contact.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg mt-0.5">
                        phone
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">Telepon</p>
                        <a
                          href={`tel:${contact.phoneNumber}`}
                          className="text-primary hover:underline font-body-sm font-semibold transition-colors"
                        >
                          {contact.phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {contact.whatsappNumber && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg mt-0.5">
                        chat
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">WhatsApp</p>
                        {contact.whatsappLink ? (
                          <a
                            href={contact.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-body-sm font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            {contact.whatsappNumber}
                            <span className="material-symbols-outlined text-[10px]">
                              open_in_new
                            </span>
                          </a>
                        ) : (
                          <p className="text-on-surface font-body-sm font-medium">{contact.whatsappNumber}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* KakaoTalk */}
                  {contact.kakaoTalkNumber && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg mt-0.5">
                        forum
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-xs font-medium uppercase tracking-wider">KakaoTalk</p>
                        {contact.kakaoTalkLink ? (
                          <a
                            href={contact.kakaoTalkLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-body-sm font-semibold transition-colors inline-flex items-center gap-1"
                          >
                            {contact.kakaoTalkNumber}
                            <span className="material-symbols-outlined text-[10px]">
                              open_in_new
                            </span>
                          </a>
                        ) : (
                          <p className="text-on-surface font-body-sm font-medium">{contact.kakaoTalkNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Desain Baru yang Rapi & Proporsional */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-primary/10 mt-auto">
                  {/* Tombol WhatsApp */}
                  <a
                    href={contact.whatsappLink || "#"}
                    target={contact.whatsappLink ? "_blank" : undefined}
                    rel={contact.whatsappLink ? "noopener noreferrer" : undefined}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 text-center gap-1 ${
                      contact.whatsappLink
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    <span>WhatsApp</span>
                  </a>

                  {/* Tombol KakaoTalk */}
                  <a
                    href={contact.kakaoTalkLink || "#"}
                    target={contact.kakaoTalkLink ? "_blank" : undefined}
                    rel={contact.kakaoTalkLink ? "noopener noreferrer" : undefined}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 text-center gap-1 ${
                      contact.kakaoTalkLink
                        ? "bg-[#FEE500] text-[#3C1E1E] hover:bg-[#FDD835] shadow-sm hover:shadow active:scale-95 cursor-pointer"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">forum</span>
                    <span>KakaoTalk</span>
                  </a>

                  {/* Tombol Email */}
                  <a
                    href={contact.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}` : "#"}
                    target={contact.email ? "_blank" : undefined}
                    rel={contact.email ? "noopener noreferrer" : undefined}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all duration-200 text-center gap-1 border ${
                      contact.email
                        ? "bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 shadow-sm hover:shadow active:scale-95 cursor-pointer"
                        : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">mail</span>
                    <span>Email</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">
              contact_support
            </span>
          </div>
          <p className="text-on-surface-variant font-body-lg max-w-md">
            Belum ada data kontak tersedia. Silakan hubungi kami melalui email atau telepon.
          </p>
        </div>
      )}

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
                <p className="text-on-surface-variant font-body-md">
                  {companyProfile?.operationalHours ? (
                    <>
                      {companyProfile.operationalHours.weekdays && (
                        <>Senin - Jumat: {companyProfile.operationalHours.weekdays}<br /></>
                      )}
                      {companyProfile.operationalHours.weekend && (
                        <>Sabtu: {companyProfile.operationalHours.weekend}<br /></>
                      )}
                      {companyProfile.operationalHours.weekend2 && (
                        <>Minggu: {companyProfile.operationalHours.weekend2}</>
                      )}
                    </>
                  ) : (
                    <>Jam operasional tidak tersedia</>
                  )}
                </p>
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

          {/* Debug Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
            <p className="font-mono text-blue-900">
              📍 Lat: {companyProfile.latitude}, Lng: {companyProfile.longitude}
            </p>
            {mapsUrl && <p className="font-mono text-blue-900 mt-1">🔗 URL: {mapsUrl}</p>}
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