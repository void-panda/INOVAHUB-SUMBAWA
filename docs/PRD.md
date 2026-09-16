# PRD — INOVA-HUB (Pembinaan Terintegrasi Inovasi Pelayanan Publik Kabupaten Sumbawa)

## 1. Latar Belakang & Masalah

Penilaian Indeks Inovasi Daerah (IID) dan Innovative Government Award (IGA)
diselenggarakan Kemendagri tiap tahun (BSKDN), dengan pengisian data pada
periode Juni–Agustus. Pengisian di Kabupaten Sumbawa selama ini dilakukan
langsung oleh inovator (OPD/individu) **tanpa pemeriksaan mutu berjenjang**,
sehingga data berisiko tidak lengkap/tidak sesuai pedoman dan menurunkan skor
akhir IID. **INOVA-HUB** menjembatani input data oleh inovator dengan pembinaan dan verifikasi mutu
sebelum data disalin ke sistem resmi.

## 2. Tujuan (TOR §1.2)

1. Pencatatan & pengelolaan data inovasi daerah Kabupaten Sumbawa yang terintegrasi, diakses seluruh OPD.
2. Pendampingan & validasi berjenjang oleh Pendamping Inovasi sebelum data siap kirim.
3. Simulasi skor SPD, SID, dan IID otomatis & real-time sesuai Pedoman Umum IGA.
4. Deteksi dini kekurangan data (misal urusan wajib yandas belum terwakili).
5. Laporan pendukung keputusan bagi Bappeda dan pimpinan daerah.

## 3. Role & Izin (TOR §3 — 6 aktor → 4 role aplikasi)

| Role | Mencakup Aktor TOR | Tanggung jawab |
| --- | --- | --- |
| **inovator** | Inovator (OPD **dan** masyarakat) | Input profil inovasi, unggah dokumen, ajukan validasi, revisi sesuai catatan |
| **pendamping** | Pendamping Inovasi **+** Verifikator OPD | Verifikasi (`Disetujui`/`Revisi` + catatan), pengesahan akhir OPD |
| **tim_penilai** | Tim Penilai Internal **+** Admin Bappeda | Skoring SPD/SID (simulasi), kelola master data, penugasan, ekspor ke sistem pusat |
| **pimpinan** | Pimpinan Daerah (Bupati/Wabup/Sekda) | Dashboard ringkasan read-only |

## 4. Alur Status (8 langkah — TOR §5)

```
draft → diajukan → divalidasi → revisi|disetujui → disahkan_opd → review_internal → siap_kirim → terkirim
```

| No | Status | Aktor | Aktivitas |
| --- | --- | --- | --- |
| 1 | Draft | Inovator | Isi profil, simpan draft (tak terlihat Pendamping) |
| 2 | Diajukan Validasi | Inovator | "Ajukan Validasi" → notifikasi otomatis ke Pendamping |
| 3 | Sedang Divalidasi | Pendamping | Checklist kelengkapan mengacu indikator SPD/SID |
| 4a | Revisi (wajib komentar) | Pendamping → Inovator | Catatan per-field; notifikasi ke inovator |
| 4b | Disetujui Pendamping | Pendamping | Persetujuan + estimasi skor awal (self-scoring) |
| 5 | Disahkan OPD | Pendamping (Verifikator OPD) | Pengesahan representasi resmi OPD |
| 6 | Review Internal | tim_penilai | Simulasi skor SPD & SID seluruh daerah + cek 5/6 urusan yandas |
| 7 | Siap Kirim | tim_penilai | Ditandai siap ekspor/disalin ke sistem resmi |
| 8 | Terkirim & Termonitor | tim_penilai | Arsip; pantau linimasa lomba |

> Data tidak pernah dihapus. **Semua transisi tercatat di `validasi_log`** (siapa, kapan, status sebelum/sesudah, catatan).

## 5. Periode & Arsip (TOR §6)

- Inovasi terikat `periode_lomba` (tahun). Tahun berganti → inovasi periode lama
  otomatis masuk **Arsip** (read-only: skor, dokumen, catatan validasi tetap utuh, tak hilang).
- Aksi **"Ajukan Kembali"**: salinan seluruh profil sebagai draft baru tahun
  berjalan + kolom wajib **"Penjelasan Pengembangan dari Versi Sebelumnya"** +
  tautan riwayat via `inovasi_versi` (rantai X 2025 → X 2026 → dst).

## 6. Kebutuhan Fungsional (modul TOR §9)

1. **Autentikasi & Manajemen Peran** — login multi-role, reset password, RBAC (spatie/laravel-permission).
2. **Profil Inovasi** — form 22 item Proposal Inovasi Daerah, validasi kata & format unggah dokumen.
3. **Pendampingan & Validasi** — checklist per indikator, catatan revisi, riwayat komentar, status tracking, penugasan otomatis.
4. **Self-Scoring Engine** — kalkulasi SPD, SID, Jumlah Inovasi, IID (lihat §7).
5. **Cek Kepatuhan Urusan Wajib** — deteksi pemenuhan minimal 5 dari 6 urusan wajib yandas + warning.
6. **Dashboard & Monitoring** — per level (Inovator, Pendamping, OPD, tim_penilai/Bappeda, Pimpinan).
7. **Notifikasi** — in-app + email (opsional WhatsApp Gateway): pengajuan baru, revisi, disetujui, tenggat.
8. **Pelaporan** — rekap skor, status pendampingan, kepatuhan urusan, kinerja pendamping, per inovasi, kesiapan pengiriman, dashboard eksekutif.
9. **Arsip & Riwayat (Audit Trail)** — rekam jejak perubahan data/status.
10. **Linimasa & Pengingat** — kalender tahapan lomba IGA + pengingat mendekati tenggat.

## 7. Skema Penilaian (TOR §8 — rincian di `docs/domain.md`)

- **SPD** = Σ (skor indikator ke-i, i=1..15); skor indikator = Tier(1/2/3) × bobot. **Maks 63 poin (25,20%).**
- **SID** = [Σ (skor indikator SID per inovasi) / MAX(12, n)] + Skor Jumlah Inovasi. **Maks 187 poin (74,80%).**
- **Skor Jumlah Inovasi** = MIN(n, 200) × 0,38 jika urusan wajib yandas ≥ 5; nol jika < 5. **Maks 76.**
- **IID** = (Skor Total / 250) × 100; Skala 0–100.
- Kategori: Sangat Inovatif 65,01–100 · Inovatif 40,01–65,00 · Kurang Inovatif 0,01–40,00 · Tidak Dapat Dinilai 0.
- Keunikan: skor dihitung ulang otomatis saat Pendamping menyetujui; **simulasi what-if** (tambah/hapus/ubah status); indikator visual kepatuhan (hijau/merah); **bobot & parameter P1/P2/P3 sebagai data master** yang diperbarui admin tiap tahun tanpa deploy.

> Detail indikator, bobot, dan parameter ambang ada di `docs/domain.md` (data master, diisi saat Phase 5).

## 8. Scope Management (DOs and DON'Ts)

### DOs (wajib)

- Fokus alur inti: **input → validasi berjenjang (pendamping + OPD) → review internal → siap kirim → terkirim**.
- Taat RBAC 4 role; Inovator hanya data miliknya; Pendamping binaannya; tim_penilai semua; pimpinan read-only.
- Arsip otomatis per tahun + "Ajukan Kembali" (riwayat tidak pernah hilang/tertimpa).
- Dokumen di disk lokal + metadata path DB (`inovasi_dokumen`), validasi tipe/ukuran.
- Bobot/penilaian berdasar tabel indikator PDF + parameter master P1/P2/P3, bukan skor rekaan/hardcode.
- Log semua transisi status di `validasi_log`.
- Notifikasi in-app/email untuk pengajuan, revisi, persetujuan, tenggat.

### DON'Ts

- **Jangan** bangun auth kompleks (JWT/OAuth) — Laravel session + spatie RBAC cukup.
- **Jangan** pakai microservices/Saga/payment — monolith CRUD & monitoring.
- **Jangan** buat model penilaian sendiri — turun dari TOR §8 + `docs/domain.md` (SPD, SID, threshold).
- **Jangan** hardcode bobot/parameter — semua dari data master.
- **Jangan** simpan file sebagai blob/object storage tanpa alasan — disk lokal + metadata.
- **Jangan** buat dashboard berlebihan — cukup untuk monitoring & evaluasi per level.

## 9. Kebutuhan Non-Fungsional (TOR §11)

- **Keamanan**: enkripsi password, proteksi CSRF/XSS, log akses, backup harian.
- **Skalabilitas**: ±50+ perangkat daerah, ratusan pengguna simultan.
- **Ketersediaan**: uptime 99% selama periode kritis (Juni–Agustus).
- **Kompatibilitas**: responsive (desktop & seluler).
- **Auditabilitas**: audit trail tak bisa dihapus pengguna biasa.
- **Kemudahan pemeliharaan**: bobot, indikator, parameter via panel admin tanpa deploy.