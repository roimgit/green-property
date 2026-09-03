"use client";

import { useEffect, useRef, useState } from "react";
import { normalizeWhatsAppNumber } from "@/lib/sanity/data";
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
  // Premium WhatsApp — official green with authentic glyph, subtle highlight ring
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-7 w-7 drop-shadow-sm">
      <defs>
        <linearGradient id="waGradient2" x1="12%" y1="12%" x2="88%" y2="88%">
          <stop offset="0%" stopColor="#34E17A" />
          <stop offset="100%" stopColor="#128C7E" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#waGradient2)" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
      {/* speech bubble + handset — simplified authentic WhatsApp glyph */}
      <path
        d="M32 18.2c-7.1 0-12.9 5.4-12.9 12 0 2.1.6 4.1 1.7 5.9l-1.1 4 4.2-1.1c1.7 1 3.6 1.5 5.6 1.5 7.1 0 12.9-5.4 12.9-12S39.1 18.2 32 18.2Zm7.1 17.2c-.4 1.2-2.2 2.2-3 2.3-.8.2-1.6.2-2.6-.1-.6-.2-1.4-.5-2.4-1-2.1-1-3.8-2.5-5.1-4.3-1-1.4-1.5-2.9-1.6-4.2 0-.8.2-1.6.6-2.1.3-.4.7-.5 1-.5h.7c.2 0 .5 0 .7.6.2.5.8 1.9.9 2 .1.1.1.3 0 .5-.1.2-.2.4-.4.6-.2.2-.3.3-.5.5-.1.2-.3.3-.1.7.2.4.9 1.5 1.9 2.4 1.3 1.2 2.4 1.6 2.9 1.8.4.2.6.1.8-.1.2-.2.9-1 1.1-1.3.2-.3.4-.3.7-.2.3.1 1.7.8 2 1 .3.1.5.2.6.3.1.1.2.5-.1 1Z"
        fill="white"
      />
      <circle cx="46.5" cy="16.5" r="3.2" fill="white" fillOpacity="0.95" />
      <path d="M44.8 16.5l1.1 1.1 2.2-2.2" fill="none" stroke="#128C7E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KakaoTalkIcon() {
  // Premium KakaoTalk — official yellow #FEE500 with brown #3C1E1E bubble, crisp TALK dots
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-7 w-7 drop-shadow-sm">
      <circle cx="32" cy="32" r="28" fill="#FEE500" />
      <circle cx="32" cy="32" r="28" fill="none" stroke="#3C1E1E" strokeOpacity="0.08" strokeWidth="1.5" />
      <path
        d="M32 16.2c-8.7 0-15.8 5.7-15.8 12.7 0 4.3 2.7 8.1 6.8 10.4l-1.5 5.9 6.2-4.1c1.1.2 2.2.3 3.4.3 8.7 0 15.8-5.7 15.8-12.7S40.7 16.2 32 16.2Z"
        fill="#3C1E1E"
      />
      <path
        d="M26.2 28.5c0-.7.6-1.3 1.3-1.3h9.1c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3h-9.1c-.7 0-1.3-.6-1.3-1.3Zm-4.4 4.6c0-.7.6-1.3 1.3-1.3h17c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3h-17c-.7 0-1.3-.6-1.3-1.3Zm3.6 4.6c0-.7.6-1.3 1.3-1.3h10.1c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3H26.7c-.7 0-1.3-.6-1.3-1.3Z"
        fill="#FEE500"
      />
    </svg>
  );
}

function EmailIcon() {
  // Premium Email — indigo gradient envelope with soft highlight
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-7 w-7 drop-shadow-sm">
      <defs>
        <linearGradient id="emailGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFF6FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <rect x="7" y="13" width="50" height="38" rx="12" fill="url(#emailGrad2)" stroke="#1E40AF" strokeOpacity="0.12" />
      <path d="M10 18.5 32 34l22-15.5" fill="none" stroke="url(#envGrad)" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" />
      <path d="M9 42.5V20.5L32 36l23-15.5v22a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4Z" fill="white" fillOpacity="0.9" stroke="url(#envGrad)" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M14 27.5l8 6.5M50 27.5l-8 6.5" stroke="#1E40AF" strokeOpacity="0.18" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function getChannelUrl(contact: Contact, channel: Channel, message: string) {
  if (channel === "whatsapp") {
    const normalizedNumber = normalizeWhatsAppNumber(contact.whatsappNumber);
    if (normalizedNumber) {
      return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(message)}`;
    }

    const link = contact.whatsappLink?.trim();
    if (link) {
      const separator = link.includes("?") ? "&" : "?";
      return `${link}${separator}text=${encodeURIComponent(message)}`;
    }

    return "";
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
    if (!contact.email?.trim()) return "";
    return `mailto:${contact.email.trim()}?subject=${encodeURIComponent("Informasi Properti")}&body=${encodeURIComponent(message)}`;
  }

  return "";
}

function hasWhatsApp(contact: Contact): boolean {
  return (
    Boolean(normalizeWhatsAppNumber(contact.whatsappNumber)) ||
    Boolean(contact.whatsappLink?.trim())
  );
}

function hasKakaoTalk(contact: Contact): boolean {
  return Boolean(contact.kakaoTalkLink?.trim() || contact.kakaoTalkNumber?.trim());
}

function hasEmail(contact: Contact): boolean {
  return Boolean(contact.email?.trim());
}

export function ContactActionCards({ contacts }: { contacts: Contact[] }) {
  const [selected, setSelected] = useState<{ contact: Contact; channel: Channel } | null>(null);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const composerRef = useRef<HTMLElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!selected) return;

    const frame = window.requestAnimationFrame(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(textareaRef.current.value.length, textareaRef.current.value.length);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selected]);

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
            {contacts.map((contact) => {
              const showEmail = hasEmail(contact);
              const showPhone = Boolean(contact.phoneNumber?.trim());
              const showWhatsApp = hasWhatsApp(contact);
              const showKakao = hasKakaoTalk(contact);
              const whatsappDisplay =
                normalizeWhatsAppNumber(contact.whatsappNumber) ||
                contact.whatsappLink?.trim() ||
                "";
              const kakaoDisplay =
                contact.kakaoTalkNumber?.trim() || contact.kakaoTalkLink?.trim() || "";
              const availableChannels: Channel[] = [
                ...(showWhatsApp ? ["whatsapp" as Channel] : []),
                ...(showKakao ? ["kakaoTalk" as Channel] : []),
                ...(showEmail ? ["email" as Channel] : []),
              ];
              return (
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
                    <div className="min-w-0 flex-1">
                      <h2 className="line-clamp-1 font-headline-sm text-headline-sm text-on-surface">
                        {contact.name || "Tim Sales"}
                      </h2>
                      {contact.jabatan ? (
                        <p className="mt-0.5 line-clamp-1 text-xs font-semibold uppercase tracking-wider text-primary/80">
                          {contact.jabatan}
                        </p>
                      ) : (
                        <p className="mt-0.5 text-xs font-medium text-on-surface-variant">Tim Green Property</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 h-0.5 w-8 rounded-full bg-gradient-to-r from-primary to-primary/30" />
                </div>

                <div className="mb-6 flex flex-1 flex-col gap-3">
                  {showEmail && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">mail</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Email</p>
                        <a href={`mailto:${contact.email?.trim()}`} className="break-all font-body-sm font-semibold text-primary transition-colors hover:underline">
                          {contact.email?.trim()}
                        </a>
                      </div>
                    </div>
                  )}

                  {showPhone && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">phone</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Telepon</p>
                        <a href={`tel:${contact.phoneNumber?.trim()}`} className="font-body-sm font-semibold text-primary transition-colors hover:underline">
                          {contact.phoneNumber?.trim()}
                        </a>
                      </div>
                    </div>
                  )}

                  {showWhatsApp && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">chat</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">WhatsApp</p>
                        <p className="font-body-sm font-medium text-on-surface">{whatsappDisplay}</p>
                      </div>
                    </div>
                  )}

                  {showKakao && (
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-lg text-primary">forum</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">KakaoTalk</p>
                        <p className="font-body-sm font-medium text-on-surface">{kakaoDisplay}</p>
                      </div>
                    </div>
                  )}
                </div>

                {availableChannels.length > 0 && (
                <div
                  className={`mt-auto grid gap-2 border-t border-primary/10 pt-4 ${
                    availableChannels.length === 1
                      ? "grid-cols-1"
                      : availableChannels.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                  }`}
                >
                  {showWhatsApp && (
                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "whatsapp")}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 px-2 py-3 text-center text-[11px] font-bold text-white shadow-md shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    aria-label="WhatsApp"
                  >
                    <WhatsAppIcon />
                    <span>WhatsApp</span>
                  </button>
                  )}

                  {showKakao && (
                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "kakaoTalk")}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#FDEB4B] to-[#F5D300] px-2 py-3 text-center text-[11px] font-bold text-[#3C1E1E] shadow-md shadow-yellow-300/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    aria-label="KakaoTalk"
                  >
                    <KakaoTalkIcon />
                    <span>KakaoTalk</span>
                  </button>
                  )}

                  {showEmail && (
                  <button
                    type="button"
                    onClick={() => handleOpenComposer(contact, "email")}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 px-2 py-3 text-center text-[11px] font-bold text-blue-700 shadow-sm shadow-blue-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                    aria-label="Email"
                  >
                    <EmailIcon />
                    <span>Email</span>
                  </button>
                  )}
                </div>
                )}
              </div>
              );
            })}
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
        <section
          ref={composerRef}
          className="mt-xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-lg shadow-sm"
        >
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
            ref={textareaRef}
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
