"use client";

import { useState } from "react";
import type { Contact } from "@/types/sanity";

type Channel = "whatsapp" | "kakaoTalk" | "email";

const DEFAULT_MESSAGE =
  "Halo Tim Green Property, saya tertarik untuk mengetahui lebih lanjut mengenai informasi unit properti dan jadwal kunjungan *show unit*. Bisakah saya mendapatkan informasi detailnya? Terima kasih.";

const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  kakaoTalk: "KakaoTalk",
  email: "Email",
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M19.05 4.91A9.82 9.82 0 0 0 12.03 2C6.48 2 2.02 6.46 2.02 12c0 1.74.46 3.44 1.34 4.92L2 22l5.22-1.35a9.96 9.96 0 0 0 4.8 1.46h.01c5.54 0 10.01-4.46 10.01-10.01 0-2.68-1.04-5.2-2.95-7.09ZM12.04 19.1h-.01a8.28 8.28 0 0 1-4.22-1.16l-.3-.18-3.1.8.83-3.03-.2-.31A8.28 8.28 0 0 1 3.8 12a8.26 8.26 0 1 1 14.54 5.86 8.08 8.08 0 0 1 12.04 19.1Zm4.52-6.2c-.25-.12-1.47-.72-1.7-.81-.23-.09-.4-.13-.57.13-.17.25-.66.81-.81 1-.15.17-.3.2-.55.07-.25-.12-1.05-.38-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.3.37-.45.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.57-1.37-.78-1.88-.2-.49-.41-.42-.57-.43l-.48-.01c-.17 0-.43.06-.65.31-.22.25-.86.84-.86 2.05 0 1.2.88 2.38.99 2.55.12.17 1.71 2.6 4.14 3.64.58.25 1.02.4 1.37.51.58.19 1.1.16 1.51.1.46-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29Z"
      />
    </svg>
  );
}

function KakaoTalkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M12 3.2c5.42 0 9.8 3.46 9.8 7.72 0 4.25-4.38 7.72-9.8 7.72a12.6 12.6 0 0 1-2.15-.19L4.8 20.5l.74-2.67A7.3 7.3 0 0 1 2.2 10.9C2.2 6.66 6.58 3.2 12 3.2Zm-3.27 5.32h-.05c-.38 0-.68.28-.68.63 0 .35.3.63.68.63h1.7l1.52 1.92 1.06-1.92h1.7c.38 0 .68-.28.68-.63 0-.35-.3-.63-.68-.63h-5.28Zm-1.54 2.73h6.7c.38 0 .68.28.68.63 0 .35-.3.63-.68.63H7.19c-.38 0-.68-.28-.68-.63 0-.35.3-.63.68-.63Zm1.56 2.6h3.58c.38 0 .68.28.68.63 0 .35-.3.63-.68.63H8.75c-.38 0-.68-.28-.68-.63 0-.35.3-.63.68-.63Z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        fill="currentColor"
        d="M20 6.5A2.5 2.5 0 0 0 17.5 4h-11A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-11Zm-2.7 1.7-5.3 4.2-5.3-4.2h10.6Zm-10.8 8.8v-8.3l5.5 4.3 5.5-4.3v8.3H6.5Z"
      />
    </svg>
  );
}

function getChannelUrl(contact: Contact, channel: Channel, message: string) {
  if (channel === "whatsapp") {
    const whatsappNumber = contact.whatsappNumber?.replace(/\D/g, "") || "";
    const baseUrl = contact.whatsappLink || (whatsappNumber ? `https://wa.me/${whatsappNumber}` : "");

    if (!baseUrl) return "";
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}text=${encodeURIComponent(message)}`;
  }

  if (channel === "kakaoTalk") {
    if (contact.kakaoTalkLink) {
      const separator = contact.kakaoTalkLink.includes("?") ? "&" : "?";
      return `${contact.kakaoTalkLink}${separator}text=${encodeURIComponent(message)}`;
    }
    return "";
  }

  if (channel === "email") {
    if (!contact.email) return "";
    return `mailto:${contact.email}?subject=${encodeURIComponent("Informasi Properti")}&body=${encodeURIComponent(message)}`;
  }

  return "";
}

export function ContactActionCards({ contacts }: { contacts: Contact[] }) {
  const [selected, setSelected] = useState<{ contact: Contact; channel: Channel } | null>(null);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const handleOpenComposer = (contact: Contact, channel: Channel) => {
    setSelected({ contact, channel });
    setMessage(DEFAULT_MESSAGE);
  };

  const handleSend = () => {
    if (!selected) return;

    const url = getChannelUrl(selected.contact, selected.channel, message);
    if (!url) return;

    if (selected.channel === "email") {
      window.location.href = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const activeContactName = selected?.contact.name || "Tim Kontak";

  return (
    <>
      {contacts.length > 0 ? (
        <div>
          <div className="mb-lg flex flex-col gap-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface">Tim Kontak Kami</h2>
            <div className="h-1 w-12 rounded-full bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-xl"
              >
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/30" />

                <div className="mb-4 flex flex-col gap-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <span className="material-symbols-outlined text-xl text-primary">person</span>
                    </div>
                    <h2 className="line-clamp-2 font-headline-sm text-headline-sm text-on-surface">
                      {contact.name || "Tim Sales"}
                    </h2>
                  </div>
                  <div className="mt-1 h-0.5 w-8 rounded-full bg-gradient-to-r from-primary to-primary/30" />
                </div>

                <div className="mb-6 flex flex-1 flex-col gap-3">
                  {contact.email && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">mail</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Email</p>
                        <a href={`mailto:${contact.email}`} className="break-all font-body-sm font-semibold text-primary transition-colors hover:underline">
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">phone</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Telepon</p>
                        <a href={`tel:${contact.phoneNumber}`} className="font-body-sm font-semibold text-primary transition-colors hover:underline">
                          {contact.phoneNumber}
                        </a>
                      </div>
                    </div>
                  )}

                  {contact.whatsappNumber && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">chat</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">WhatsApp</p>
                        <p className="font-body-sm font-medium text-on-surface">{contact.whatsappNumber}</p>
                      </div>
                    </div>
                  )}

                  {contact.kakaoTalkNumber && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">forum</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">KakaoTalk</p>
                        <p className="font-body-sm font-medium text-on-surface">{contact.kakaoTalkNumber}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-auto grid grid-cols-3 gap-2 border-t border-primary/10 pt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "whatsapp")}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-emerald-600 px-2 py-2.5 text-center text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 active:scale-95"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "kakaoTalk")}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-[#FEE500] px-2 py-2.5 text-center text-xs font-semibold text-[#3C1E1E] shadow-sm transition-all duration-200 hover:bg-[#FDD835] active:scale-95"
                    aria-label="KakaoTalk"
                  >
                    <KakaoTalkIcon />
                    <span>KakaoTalk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "email")}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-primary/20 bg-primary/5 px-2 py-2.5 text-center text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary/10 active:scale-95"
                    aria-label="Email"
                  >
                    <EmailIcon />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-md py-2xl text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-4xl text-primary">contact_support</span>
          </div>
          <p className="max-w-md font-body-lg text-on-surface-variant">
            Belum ada data kontak tersedia. Silakan hubungi kami melalui email atau telepon.
          </p>
        </div>
      )}

      {selected && (
        <section className="mt-xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-lg shadow-sm">
          <div className="mb-md flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Menghubungi</p>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {activeContactName} via {CHANNEL_LABELS[selected.channel]}
              </h3>
            </div>
          </div>

          <label className="mb-2 block text-sm font-medium text-on-surface">
            Pesan {CHANNEL_LABELS[selected.channel]}
          </label>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={7}
            className="w-full rounded-xl border border-primary/20 bg-white p-md text-sm text-on-surface shadow-inner outline-none transition-colors focus:border-primary"
          />

          <div className="mt-md flex justify-end">
            <button
              type="button"
              onClick={handleSend}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Kirim
            </button>
          </div>
        </section>
      )}
    </>
  );
}
