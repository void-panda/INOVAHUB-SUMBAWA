# Tech Stack — INOVA-HUB Kabupaten Sumbawa

## Stack

- **Backend**: Laravel (PHP 8.3), monolith
- **Frontend**: Inertia.js + **React** + TypeScript + Vite + Tailwind CSS + **shadcn/ui**
- **Database**: **PostgreSQL** (via Eloquent ORM + migrasi) — putusan proyek; TOR
  menyebut MySQL hanya utk kompatibilitas hosting
- **Auth & RBAC**: session-based (Laravel) + **spatie/laravel-permission**
  (roles & permissions granular per modul) — bukan JWT/OAuth
- **Pasword**: `bcrypt` via Laravel; Fortify starter kit (2FA/passkey tersedia)
- **Storage file**: disk lokal `storage/app/inovasi/{inovasi_id}/` + metadata di DB
  (`inovasi_dokumen`)
- **Notifikasi**: Laravel Notification (in-app DB + email); WhatsApp Gateway = opsional nanti
- **Ekspor laporan**: DomPDF (PDF) + Maatwebsite/Excel (XLSX) — ditambahkan saat modul
  Pelaporan (Phase 7)

## Setup frontend (Inertia + React + shadcn/ui)

1. Scaffold **Laravel React starter kit** (`laravel new --react`): Inertia + React + TS +
   Vite + Tailwind + Fortify auth + **komponen shadcn/ui sudah dibundel** di
   `resources/js/components/ui/`.
2. Tambah komponen sesuai kebutuhan: `npx shadcn@latest add …` (contoh:
   `table textarea alert-dialog` — sudah ditambahkan).
3. Semua UI **wajib dibangun dari komponen shadcn/ui** (dan Tailwind) — jangan bikin
   UI manual/putus-putus agar konsisten dan "tidak AI slop". Referensi: https://ui.shadcn.com/

## Perintah umum

```bash
composer require spatie/laravel-permission   # fasilitas migrasi + config
npm install
php artisan migrate --seed
npm run dev            # asset dev
php artisan serve      # server dev
php artisan migrate:fresh --seed   # reset dev DB
```

## Struktur folder (relevan)

```
app/Models/            # User, Opd, Inovasi, InovasiDokumen, IndikatorSpd, IndikatorSid,
                       # SkorSpd, SkorInovasi, ValidasiLog, PenugasanPendamping,
                       # Notifikasi, Linimasa, PeriodeLomba, InovasiVersi
app/Enums/             # Tahapan, StatusInovasi (8 langkah), JenisDokumen, …
app/Http/Controllers/  # Auth, Inovasi, Verifikasi, Penilaian, Kepatuhan, Monitoring, Arsip, Master
app/Http/Middleware/   # EnsureRole (opsional; utama pakai spatie middleware role/permission)
database/migrations/   # spatie (roles, permissions, …), opd, inovasi, inovasi_dokumen,
                       # indikator_spd/sid, skor_spd, skor_inovasi, validasi_log,
                       # penugasan_pendamping, notifikasi, linimasa, periode_lomba, inovasi_versi
database/seeders/      # RolePermissionSeeder, UserSeeder, OpdSeeder, IndikatorSeeder (bobot + P1/P2/P3)
resources/js/Pages/    # halaman Inertia React per role
resources/js/components/ui/  # komponen shadcn/ui
resources/js/layouts/  # layout (sidebar/nav per role)
storage/app/inovasi/   # file upload
```

## Upload file

- Validasi tipe/ukuran per jenis dokumen (`inovasi_dokumen.jenis`).
- Simpan di disk lokal; simpan path/name/mime/ukuran di DB.
- Download di-protec: pemilik, `pendamping`, `tim_penilai`.

## Catatan

- Jangan tambah dependency yang tak perlu; manfaatkan bawaan Laravel.
- Skema database mengikuti `docs/database.md` (entitas TOR §7).
- Start PostgreSQL lokal: jalankan `D:\laragon\data\postgresql-18\start-pg.bat`
  (server Laragon; lihat `.env` untuk kredensial).