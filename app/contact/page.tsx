import Link from "next/link";
import { getContacts } from "@/lib/sanity/data";
import type { Contact } from "@/types/sanity";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hubungi Kami - Green Property",
};

export default async function ContactPage() {
  const contacts: Contact[] = await getContacts();

  return (
    <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-lg py-xl flex flex-col gap-lg">
      {/* Breadcrumb */}
      <section className="flex flex-col gap-base">
        <nav className="text-on-surface-variant font-body-sm flex items-center gap-xs">
          <Link href="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-semibold">Hubungi Kami</span>
        </nav>
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
                className="bg-white rounded-xl border border-primary/20 p-lg shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 overflow-hidden group"
              >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary/20"></div>
                
                {/* Header dengan nama dan jabatan */}
                <div className="flex flex-col gap-sm mb-lg">
                  <div className="flex items-center gap-sm">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary text-xl">person</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">
                      {contact.name || "Tim Sales"}
                    </h2>
                  </div>
                  <div className="h-0.5 w-8 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
                </div>

                {/* Contact Details */}
                <div className="flex flex-col gap-md mb-lg">
                  {/* Email */}
                  {contact.email && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg">
                        mail
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-body-sm font-medium">Email</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:text-primary font-body-md break-all font-semibold transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone Number */}
                  {contact.phoneNumber && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg">
                        phone
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-body-sm font-medium">Telepon</p>
                        <a
                          href={`tel:${contact.phoneNumber}`}
                          className="text-primary hover:text-primary font-body-md font-semibold transition-colors"
                        >
                          {contact.phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {contact.whatsappNumber && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg">
                        chat
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-body-sm font-medium">WhatsApp</p>
                        {contact.whatsappLink ? (
                          <a
                            href={contact.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary font-body-md font-semibold transition-colors"
                          >
                            {contact.whatsappNumber}
                            <span className="material-symbols-outlined text-xs align-text-bottom ml-xs">
                              open_in_new
                            </span>
                          </a>
                        ) : (
                          <p className="text-on-surface font-body-md">{contact.whatsappNumber}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* KakaoTalk */}
                  {contact.kakaoTalkNumber && (
                    <div className="flex items-start gap-md">
                      <span className="material-symbols-outlined text-primary flex-shrink-0 text-lg">
                        person
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface-variant text-body-sm font-medium">KakaoTalk</p>
                        {contact.kakaoTalkLink ? (
                          <a
                            href={contact.kakaoTalkLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary font-body-md font-semibold transition-colors"
                          >
                            {contact.kakaoTalkNumber}
                            <span className="material-symbols-outlined text-xs align-text-bottom ml-xs">
                              open_in_new
                            </span>
                          </a>
                        ) : (
                          <p className="text-on-surface font-body-md">{contact.kakaoTalkNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-sm pt-lg border-t border-primary/10">
                  {contact.whatsappLink && (
                    <a
                      href={contact.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-primary text-on-primary px-md py-sm rounded-full font-body-sm font-semibold hover:bg-primary hover:shadow-md transition-all duration-200 text-center flex items-center justify-center gap-xs active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">message</span>
                      Chat WhatsApp
                    </a>
                  )}
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="w-full bg-primary/10 text-primary px-md py-sm rounded-full font-body-sm font-semibold hover:bg-primary/20 transition-all duration-200 text-center flex items-center justify-center gap-xs border border-primary/20 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-sm">mail</span>
                      Email
                    </a>
                  )}
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
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex gap-md">
              <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">
                  location_on
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                  Lokasi Kantor
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Jl. Jenderal Sudirman No. 1<br />
                  Jakarta, Indonesia
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-lg border border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="flex gap-md">
              <div className="w-14 h-14 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-2xl">
                  schedule
                </span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                  Jam Operasional
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Senin - Jumat: 08.00 - 17.00<br />
                  Sabtu - Minggu: Tutup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
