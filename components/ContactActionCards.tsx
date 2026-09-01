"use client";

import { useState } from "react";
import type { Contact } from "@/types/sanity";

type Channel = "whatsapp" | "kakaoTalk" | "email";

const DEFAULT_MESSAGE =
  "Halo Tim Green Property, perkenalkan saya [Nama Anda] dari [Alamat Anda]. Saya tertarik untuk mengetahui lebih lanjut mengenai informasi unit properti dan jadwal kunjungan show unit. Bisakah saya mendapatkan informasi detailnya? Terima kasih.";

const CHANNEL_LABELS: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  kakaoTalk: "KakaoTalk",
  email: "Email",
};

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-7 w-7 drop-shadow-sm">
      <defs>
        <linearGradient id="waGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#2BE37D" />
          <stop offset="100%" stopColor="#1FAE5A" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#waGradient)" />
      <path
        d="M41.9 22.1c-1.1-1.9-2.8-3-5.4-3.3-2.7-.3-5.4.4-7.9 2.1-2.4 1.7-4.1 4.1-5.2 7.1-1.1 3-1.1 6.2.2 9.1.6.9 1.4 1.8 2.4 2.5l-1.3 3.9 4.1-1.4c1.1.7 2.3 1.2 3.6 1.5 3 .8 6.1.5 8.8-.9 2.7-1.4 4.7-3.7 5.5-6.6 1-3.2.5-6.9-1.8-9.9Zm-8.1 16.4c-1.6 0-3.2-.4-4.6-1.2l-.3-.2-2.4.8.8-2.2-.2-.3c-1.4-2.2-1.8-4.8-1-7.4.8-2.6 2.6-4.8 5.1-6.1 2.5-1.3 5.5-1.5 8.1-.5 2.5 1 4.5 3 5.6 5.5 1.1 2.5 1 5.3-.2 7.7-1.3 2.4-3.5 4.2-6 5.1-1.4.5-2.9.8-4.3.8Zm7.1-12.2c-.3-.2-1.8-.9-2.4-1-.6-.1-1-.1-1.4.2-.4.3-.9 1-.9 1.1-.1.1-.4.5-.1 1.1.3.6 1.2 1.8 2.4 2.8 1.7 1.6 2.8 1.9 3.3 2.1.5.2 1 .1 1.4-.1.4-.2 1.3-.8 1.5-1.6.2-.8.2-1.3.1-1.5-.1-.1-.4-.2-.8-.4-.4-.2-1.9-1-2.3-1.1-.4-.1-.7-.1-1 .1Z"
        fill="white"
      />
    </svg>
  );
}

function KakaoTalkIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-7 w-7 drop-shadow-sm">
      <circle cx="32" cy="32" r="28" fill="#FEE500" />
      <path
        d="M32.2 15.5c-9.3 0-16.8 6.1-16.8 13.7 0 5.1 3.6 9.5 8.9 11.8l-2.1 8.4 8.4-5.6c1.2.1 2.4.2 3.5.2 9.3 0 16.8-6.1 16.8-13.7 0-7.6-7.5-13.8-16.7-13.8Zm-8.1 17.8c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7h9.7l3.8 5.1 3.1-5.1h5.2c.9 0 1.7.7 1.7 1.7s-.7 1.7-1.7 1.7h-10.8l-3.4 5.6-3.7-5.6h-3.9Zm-3.6-5.6c0-.9.7-1.7 1.7-1.7h18.8c.9 0 1.7.7 1.7 1.7s-.7 1.7-1.7 1.7H22.2c-.9 0-1.7-.7-1.7-1.7Zm5.3 8.8h10.7c.9 0 1.7.7 1.7 1.7s-.7 1.7-1.7 1.7H25.8c-.9 0-1.7-.7-1.7-1.7s.7-1.7 1.7-1.7Z"
        fill="#3C1E1E"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-7 w-7 drop-shadow-sm">
      <defs>
        <linearGradient id="emailGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#EAF2FF" />
          <stop offset="100%" stopColor="#DCE9FF" />
        </linearGradient>
      </defs>
      <rect x="8" y="12" width="48" height="40" rx="11" fill="url(#emailGradient)" />
      <path d="M14 20.5 32 35l18-14.5" fill="none" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 42V22l16 12 16-12v20H16Z" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function getChannelUrl(contact: Contact, channel: Channel, message: string) {
  if (channel === "whatsapp") {
    const rawNumber = contact.whatsappNumber?.replace(/\D/g, "") || "";
    if (!rawNumber) return "";

    const normalizedNumber = rawNumber.startsWith("0") ? `62${rawNumber.slice(1)}` : rawNumber;
    return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
  }

  if (channel === "kakaoTalk") {
    const kakaoValue = contact.kakaoTalkLink?.trim() || contact.kakaoTalkNumber?.trim() || "";
    if (!kakaoValue) return "";

    const baseUrl = kakaoValue.startsWith("http")
      ? kakaoValue
      : `https://open.kakao.com/o/${encodeURIComponent(kakaoValue)}`;

    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}text=${encodeURIComponent(message)}`;
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
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-2 py-3 text-center text-[11px] font-bold text-white shadow-md shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "kakaoTalk")}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#FDEB4B] to-[#F5D300] px-2 py-3 text-center text-[11px] font-bold text-[#3C1E1E] shadow-md shadow-yellow-300/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    aria-label="KakaoTalk"
                  >
                    <KakaoTalkIcon />
                    <span>KakaoTalk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "email")}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-2 py-3 text-center text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
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
