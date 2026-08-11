# VOCAL-UTS — Ujian Speaking CBT

**VOCAL** = *Voice Of Cultural And Local Wisdom*
Inovasi Pembelajaran Digital Speaking Berbasis Kearifan Lokal untuk Mewujudkan Kampus Berdampak.

Sistem ujian speaking Computer-Based Test (CBT) untuk mata kuliah **Bahasa Inggris Bisnis (UTW2002)** — kolaborasi **S1 Administrasi Publik UNITA** & **S1 PGSD UBHI**, Tahun Akademik **2026/2027 Semester Ganjil**.

Dosen Pengampu: **Prof. Dr. Dra. Hj. Dwi Ima Herminingsih, M.Hum**

---

## 🌐 Live Demo

- **Aplikasi**: https://uts-vocal.pages.dev/
- **Panel Dosen**: https://uts-vocal.pages.dev/#admin (password: `admin123`)
- **Repository**: https://github.com/lutfananas/VOCAL-UTS

---

## 🎯 Fitur Utama

### Untuk Mahasiswa
- Login dengan NIM terdaftar di database (30 NIM: 15 UNITA + 15 UBHI)
- 6 section soal speaking komprehensif (Read Aloud, Situation Description, Role Play, Spoken Response, Formal Register, Public Forum)
- Audio recorder dengan MediaRecorder API (preparation timer, recording timer, re-record max 3x)
- Session resume jika browser tertutup
- Submit flow dengan konfirmasi

### Untuk Dosen
- Panel admin dengan password
- Daftar mahasiswa + status pengerjaan
- Detail jawaban per section dengan audio player
- **Input nilai + catatan per section** (tersimpan di database)
- **Export Excel** (.xlsx) — semua mahasiswa atau per mahasiswa
- Download audio individual

---

## 🎨 Tema Budaya Tulungagung

- Palet warna: **Biru Dongker** + **Merah** + putih clean
- Ornamen batik (kawung, parang, megamendung) sebagai dekorasi halus
- Splash screen dengan animasi **wayang gunungan terbelah**
- Foto Prof. Dwi Ima (close-up, tanpa background)
- Logo 2 kampus (UNITA & UBHI) transparan
- Sambutan "Sugeng Rawuh" + filosofi Jawa

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Database**: Prisma ORM (SQLite local, Cloudflare D1 production)
- **Hosting**: Cloudflare Pages (edge runtime)
- **Audio**: MediaRecorder API (browser native)
- **Export**: xlsx (SheetJS)

---

## 📦 Setup Lokal

```bash
# Install dependencies
bun install

# Setup database lokal (SQLite)
bun run db:push
bun run db:seed

# Jalankan dev server
bun run dev
```

Buka http://localhost:3000

---

## ☁️ Deploy ke Cloudflare Pages

### Prerequisite
- Cloudflare account
- Wrangler CLI (`npm install -g wrangler`)

### Setup D1 Database
```bash
# Buat D1 database
npx wrangler d1 create vocal-cbt-db

# Apply migration
npx wrangler d1 execute vocal-cbt-db --remote --file=migrations/0001_init.sql

# Seed data mahasiswa
npx wrangler d1 execute vocal-cbt-db --remote --file=migrations/0002_seed_students.sql
```

### Build & Deploy
```bash
# Build untuk Cloudflare Pages
bun run build:cloudflare

# Deploy
bun run deploy
```

Atau manual:
```bash
npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static --project-name uts-vocal
```

---

## 🔑 Default Credentials

- **Admin Password**: `admin123` (ubah via `ADMIN_PASSWORD` env var di Cloudflare dashboard)
- **NIM Mahasiswa** (untuk testing):
  - UNITA: `220100101` s/d `220100115`
  - UBHI: `220200101` s/d `220200115`

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── api/                    # API routes (edge runtime)
│   │   ├── auth/login/         # Login dengan NIM
│   │   ├── questions/          # Get soal speaking
│   │   ├── answers/            # Submit jawaban audio
│   │   ├── session/            # Status & submit ujian
│   │   └── admin/              # Panel dosen
│   │       ├── students/       # List mahasiswa
│   │       ├── score/          # Simpan nilai
│   │       ├── export-excel/   # Export .xlsx
│   │       └── answers/audio/  # Stream audio
│   ├── page.tsx                # State machine utama
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Tema budaya + batik
├── components/
│   ├── cbt-speaking/
│   │   ├── splash-screen.tsx   # Opening VOCAL + gunungan
│   │   ├── login-view.tsx      # Login NIM
│   │   ├── instructions-view.tsx
│   │   ├── exam-view.tsx       # Recorder + soal
│   │   ├── submit-success-view.tsx
│   │   ├── admin-view.tsx      # Panel dosen + penilaian
│   │   └── cultural-elements.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── questions.ts            # Bank soal (6 section)
│   ├── db.ts                   # Prisma client (D1 adapter)
│   └── session.ts              # Cookie session
└── hooks/
    └── use-audio-recorder.ts   # MediaRecorder hook

migrations/                     # D1 SQL migrations
prisma/schema.prisma            # Database schema
wrangler.toml                   # Cloudflare config
```

---

## 📝 License

© 2026 S1 Adpub UNITA × S1 PGSD UBHI — Program Kolaborasi
