# Architecture — INOVA-HUB Kabupaten Sumbawa

## Ringkasan

Arsitektur **monolith** sederhana: satu aplikasi Laravel menangani web + API,
terhubung ke satu database PostgreSQL. Cukup untuk aplikasi CRUD/monitoring ini;
**tidak** memakai microservices/Saga (lihat DOs/DON'Ts di `docs/PRD.md`).

```
[ Browser (Inertia + React + shadcn/ui) ]
        │
        ▼
   Laravel (web + API)          [ storage/app Uploads (disk lokal) ]
        │                                     ▲
        ▼                                     │ metadata path
   PostgreSQL (satu DB)          ──────────────┘
```

## Aliran data

1. **Inovator (OPD/masyarakat)** mengisi profil inovasi + unggah dokumen via form →
   disimpan ke Postgres; file ke disk lokal, metadata path di DB (`inovasi_dokumen`).
2. **Pendamping Inovasi** memvalidasi → `Disetujui`/`Revisi` (+ catatan wajib saat revisi);
   transisi tercatat di `validasi_log`.
3. **Disetujui → Disahkan OPD (role pendamping/verifikator)** → **review tim_penilai**
   (skoring SPD & SID internal) → **Siap Kirim** → **Terkirim** (arsip + pantau linimasa).
4. **tim_penilai** kelola master (indikator, bobot, parameter P1/P2/P3, opd, users,
   penugasan, linimasa, periode) & ekspor ke sistem pusat.
5. **Pimpinan** melihat dashboard ringkasan read-only.
6. Tahun berganti → inovasi periode lama jadi **arsip**; Inovator dapat "Ajukan Kembali"
   (salinan baru + rantai `inovasi_versi`).

## Modul / pembagian domain (TOR §9)

| Modul | Tanggung jawab |
| --- | --- |
| **Auth & RBAC** | Login multi-role, reset password; `spatie/laravel-permission` (roles/permissions granular) |
| **Profil Inovasi** | Form 22 field Proposal Inovasi Daerah, upload dokumen (`inovasi_dokumen`) |
| **Pendampingan & Validasi** | Checklist indikator, catatan revisi, riwayat komentar, penugasan pendamping, status 8 langkah |
| **Self-Scoring Engine** | Kalkulasi SPD, SID, Jumlah Inovasi, IID (TOR §8) — bobot & parameter dari data master |
| **Cek Kepatuhan Urusan Wajib** | Deteksi minimal 5/6 urusan wajib yandas + peringatan |
| **Dashboard & Monitoring** | Per level: Inovator, Pendamping, OPD, Bappeda, Pimpinan |
| **Notifikasi** | In-app + email (opsional WhatsApp): pengajuan baru, revisi, disetujui, tenggat |
| **Pelaporan** | Rekap skor, status pendampingan, kepatuhan, kinerja pendamping, per inovasi, kesiapan kirim (PDF/Excel) |
| **Arsip & Riwayat** | Periode non-aktif read-only + "Ajukan Kembali" (`inovasi_versi`, `periode_lomba`) |
| **Linimasa & Pengingat** | Tahapan lomba IGA + tenggat (`linimasa`) |

## Storage file (pendekatan)

- Dokumen dukung (profil, proposal, SK, piagam, video, anggaran, HAKI, dll) →
  **disk lokal** (`storage/app/inovasi/{inovasi_id}/`) + metadata di `inovasi_dokumen`.
- Bukan blob Postgres, bukan object storage — kecuali kebutuhan skala besar kemudian.
- Download diproteksi: hanya pemilik, `pendamping`, `tim_penilai`.

## RBAC (spatie/laravel-permission)

- Role seed: `inovator`, `pendamping`, `tim_penilai`, `pimpinan`.
- Permission granular per modul (mis. `inovasi.create`, `validasi.approve`,
  `penilaian.manage`, `master.manage`, `report.export`).
- Gate di blade/Inertia + middleware `role:`/`permission:`.

## Catatan implementasi

- Endpoint mengikuti kebutuhan frontend Inertia React.
- Frontend dibangun dengan **Inertia + React + shadcn/ui** (lihat `docs/tech-stack.md`).
- Skema database lengkap & nama tabel/kolom acuan di `docs/database.md`
  (turun dari entitas TOR §7).