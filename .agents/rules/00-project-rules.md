# Aturan Agent — Proyek Portalin

Aturan ini WAJIB dipatuhi di setiap task, tanpa terkecuali, meskipun tidak disebutkan ulang di prompt.

## 1. Disiplin Scope — Jangan Sembarangan Menyentuh Kode Lain

- Hanya ubah file yang **relevan langsung** dengan instruksi yang diberikan pada prompt saat ini. Jangan merapikan, refactor, atau "memperbaiki" kode di file/fungsi lain yang tidak diminta, meskipun terlihat kurang optimal.
- Jangan menghapus, mengganti nama, atau mengubah signature function/endpoint/komponen yang sudah ada kecuali diminta eksplisit.
- Kalau untuk menyelesaikan task ini ternyata **harus** mengubah file/fungsi lain yang sudah ada (bukan file baru), **berhenti dulu dan laporkan**: file apa saja yang akan terdampak, dan kenapa perlu diubah — tunggu konfirmasi sebelum lanjut.
- Sebelum mengedit file yang sudah ada, **baca dulu isi filenya secara utuh**. Lakukan perubahan seminimal mungkin (targeted edit), jangan menulis ulang seluruh file kalau hanya sebagian kecil yang perlu berubah.
- Kalau ada file/fungsi shared yang dipakai banyak modul (misal `src/config/*`, `src/utils/*`), cek dulu semua tempat yang memakainya sebelum mengubah signature atau perilakunya, dan sebutkan modul apa saja yang berpotensi kena dampak.

## 2. Komunikasi & Konfirmasi

- Kalau instruksi ambigu atau bisa diinterpretasikan lebih dari satu cara, **tanya dulu** sebelum eksekusi — jangan menebak dengan asumsi luas.
- Setelah task selesai, berikan ringkasan singkat: file apa saja yang dibuat/diubah, dan apakah ada langkah manual yang masih perlu dilakukan user (misal isi `.env`, jalankan migration, dll).
- Tindakan yang **merusak/tidak bisa dibatalkan dengan mudah** (hapus file, drop table, force push, overwrite migration lama, hapus branch) HARUS minta konfirmasi eksplisit dulu, tidak boleh langsung dieksekusi.

## 3. Konsistensi Tech Stack

- Stack proyek ini sudah final: **TypeScript**, React 19 + Vite 6 + Tailwind CSS 3 (frontend), Node.js 24 + Express 4 (backend), Prisma + MariaDB/MySQL, Redis (cache/queue via BullMQ), MinIO (S3-compatible object storage), Cloudflare (proteksi/edge saja, bukan storage).
- Jangan mengganti/menambah library inti (misal ganti Express ke Fastify, ganti Prisma ke TypeORM/Sequelize, ganti Redis client, ganti MinIO ke provider lain) tanpa diminta eksplisit oleh user.
- Semua kode baru di backend & frontend harus TypeScript (`.ts`/`.tsx`), bukan `.js`/`.jsx`. Hindari `any` kecuali benar-benar tidak bisa dihindari, dan beri komentar kalau terpaksa memakainya.
- Ikuti struktur folder yang sudah ada (`src/config`, `src/routes`, `src/controllers`, `src/services`, `src/middlewares`, `src/utils` di backend; `src/pages`, `src/components`, `src/layouts`, `src/hooks`, `src/lib`, `src/store` di frontend). Jangan membuat struktur folder baru yang menyimpang tanpa alasan jelas.

## 4. Keamanan & Rahasia

- Jangan pernah menulis nilai secret/API key/password/connection string langsung di kode. Semua rahasia lewat environment variable (`.env`), dan `.env` tidak boleh pernah di-commit.
- Jangan pernah menampilkan/mencetak (console.log) isi JWT token, password, presigned URL yang sudah jadi, atau kredensial S3/MinIO ke log/terminal.
- Jangan menonaktifkan middleware auth, validasi zod, atau rate limiting "sementara" demi mempercepat testing — kalau perlu testing tanpa auth, buat mekanisme test/mock terpisah, bukan mematikan proteksi di kode produksi.
- Refresh token tetap disimpan sebagai httpOnly cookie, access token tidak boleh disimpan di localStorage di frontend.

## 5. Database & Migrasi

- Setiap perubahan schema Prisma harus lewat migration baru (`prisma migrate dev`), jangan pernah mengedit file migration lama yang sudah pernah dijalankan.
- Perubahan yang bersifat destruktif ke schema (drop column/table, ubah tipe data yang berpotensi hilang data) harus disebutkan eksplisit ke user sebelum migration dijalankan.
- Jangan menjalankan perintah yang mereset seluruh database (`migrate reset`, `db push --force-reset`, dsb) tanpa konfirmasi eksplisit dari user.

## 6. Git & Version Control

- Jangan melakukan force push, jangan menghapus branch, jangan mengubah history commit (`rebase -i`, `commit --amend` di commit yang sudah lama) tanpa diminta.
- Satu task = idealnya satu commit dengan pesan yang jelas menjelaskan apa yang berubah, bukan pesan generik seperti "update" atau "fix".
- Jangan commit file yang seharusnya di-ignore (`node_modules`, `dist`, `.env`, file build lainnya) — cek `.gitignore` dulu sebelum commit.

## 7. Kualitas & Verifikasi

- Setelah membuat/mengubah kode, pastikan project tetap bisa build/jalan tanpa error (`npm run dev` / `tsc` / lint) sebelum melaporkan task selesai.
- Kalau ada test yang sudah ada dan jadi gagal akibat perubahan ini, laporkan dengan jelas — jangan menghapus atau mengubah test hanya supaya lolos tanpa memberi tahu user.
- Kalau task ini butuh dependency baru, sebutkan dependency apa yang ditambahkan dan alasannya singkat di ringkasan akhir.
