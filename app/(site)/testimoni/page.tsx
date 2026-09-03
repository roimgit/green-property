import { getEffectiveTestimonials, isYouTubeUrl } from "@/lib/sanity/data";
import TestimoniVideoCard from "@/components/TestimoniVideoCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Testimoni - Green Property",
};

export default async function TestimoniPage() {
  const testimonials = await getEffectiveTestimonials();

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-lg py-xl flex flex-col gap-lg">
      {/* Header */}
      <section className="flex flex-col gap-base text-center">
        <h1 className="font-display text-display text-on-surface">Testimoni Klien</h1>
        <p className="text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Lihat pengalaman langsung dari klien dan mitra kami. Klik tombol video/sosmed untuk
          menonton testimoni lebih lanjut.
        </p>
      </section>

      {testimonials.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter mt-md">
          {testimonials.map((t) => {
            const hasVideo = Boolean(t.videoUrl && t.videoUrl.trim());
            // videoLabel bisa berisi label platform ATAU (jika admin salah isi) URL.
            // Jangan tampilkan URL mentah sebagai label tombol.
            const labelText =
              t.videoLabel?.trim() && !isYouTubeUrl(t.videoLabel) && !/=|\?/.test(t.videoLabel)
                ? t.videoLabel.trim()
                : "";
            return (
              <div
                key={t._id}
                className="relative bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-md shadow-soft flex flex-col gap-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <span className="absolute top-4 right-5 font-display text-6xl text-secondary/20 leading-none select-none">
                  &rdquo;
                </span>

                {hasVideo && t.videoUrl ? (
                  <TestimoniVideoCard
                    url={t.videoUrl.trim()}
                    label={labelText || undefined}
                    nama={t.nama ?? "testimoni"}
                  />
                ) : (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-outline-variant/50 bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">
                      videocam_off
                    </span>
                    <span className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-semibold">
                      Video tidak tersedia
                    </span>
                  </div>
                )}

                <div className="flex gap-1 text-secondary">
                  {Array.from({ length: t.rating ?? 0 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">
                      star
                    </span>
                  ))}
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed line-clamp-3" title={t.kutipan}>
                  &ldquo;{t.kutipan}&rdquo;
                </p>

                <div className="flex items-center gap-sm pt-sm border-t border-outline-variant/40">
                  <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-lg shrink-0">
                    {(t.nama ?? "?").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-body-md text-body-md font-semibold text-on-surface">
                      {t.nama}
                    </div>
                    {t.jabatan && (
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        {t.jabatan}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-md bg-surface-container-lowest rounded-xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-primary/40">
            rate_review
          </span>
          <p className="max-w-md font-body-lg text-on-surface-variant">
            Belum ada testimoni. Tambahkan lewat Sanity Studio di bagian Testimoni.
          </p>
        </div>
      )}
    </main>
  );
}
