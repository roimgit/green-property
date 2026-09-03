"use client";

import { useMemo, useState } from "react";

export default function PropertyInquiryForm({
  propertyTitle,
  waNumber,
}: {
  propertyTitle: string;
  waNumber: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const message = useMemo(() => {
    const safeName = name.trim() || "[Nama Saya]";
    const safePhone = phone.trim() || "[Nomor Telepon]";

    return `Halo, saya tertarik dengan properti ${propertyTitle}. Nama saya ${safeName}. Nomor telepon saya ${safePhone}. Mohon informasi lebih lanjut.`;
  }, [name, phone, propertyTitle]);

  const whatsappUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
    : "#";

  const handleSend = () => {
    if (!waNumber) return;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <form
      id="property-inquiry-form"
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        handleSend();
      }}
    >
      <h4 className="font-headline-sm text-headline-sm text-on-surface text-[16px]">
        Kirim Pesan Langsung
      </h4>

      <input
        id="property-inquiry-name"
        className="w-full rounded-lg border-outline-variant bg-surface text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary placeholder:text-on-surface-variant/50 px-3 py-2"
        placeholder="Nama Lengkap"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <input
        className="w-full rounded-lg border-outline-variant bg-surface text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary placeholder:text-on-surface-variant/50 px-3 py-2"
        placeholder="Nomor Telepon"
        type="tel"
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />

      <textarea
        className="w-full rounded-lg border-outline-variant bg-surface text-on-surface font-body-sm text-body-sm focus:border-primary focus:ring-primary placeholder:text-on-surface-variant/50 px-3 py-2"
        rows={4}
        value={message}
        onChange={(event) => {
          const next = event.target.value;
          const nameMatch = next.match(/Nama saya (.+?)\./i);
          const phoneMatch = next.match(/Nomor telepon saya (.+?)\./i);

          if (nameMatch?.[1]) setName(nameMatch[1].trim());
          if (phoneMatch?.[1]) setPhone(phoneMatch[1].trim());
        }}
      />

      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-[#25D366] text-white font-body-sm text-body-sm font-semibold rounded-full hover:bg-[#20b75a] transition-all shadow-sm hover:shadow-md mt-2"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          chat
        </span>
        Chat Whatsapp
      </button>
    </form>
  );
}
