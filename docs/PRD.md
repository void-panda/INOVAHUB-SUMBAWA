# PRD — INOVA-HUB (Pembinaan Terintegrasi Inovasi Pelayanan Publik Kabupaten Sumbawa)

## 1. Latar Belakang & Masalah

Penilaian Indeks Inovasi Daerah (IID) dan Innovative Government Award (IGA) diselenggarakan Kemendagri tiap tahun (BSKDN), dengan pengisian data pada periode Juni–Agustus. Pengisian di Kabupaten Sumbawa selama ini dilakukan langsung oleh inovator (OPD/individu) **tanpa pemeriksaan mutu berjenjang**, sehingga data berisiko tidak lengkap/tidak sesuai pedoman dan menurunkan skor akhir IID. 

**INOVA-HUB** menjembatani input data oleh inovator dengan pembinaan dan verifikasi mutu sebelum data disalin ke sistem resmi (*indeks.inovasi.bskdn.kemendagri.go.id*).

## 2. Tujuan (TOR §1.2)

1. Pencatatan & pengelolaan data inovasi daerah Kabupaten Sumbawa yang terintegrasi, diakses seluruh OPD dan masyarakat luas.
2. Pendampingan & validasi berjenjang oleh Pendamping Inovasi dan verifikator OPD sebelum data siap kirim.
3. Simulasi skor SPD, SID, dan IID otomatis & real-time sesuai Pedoman Umum IGA 2026.
4. Deteksi dini pemenuhan 20 Indikator SID serta minimal 5 dari 6 urusan wajib pelayanan dasar (yandas).
5. Penyediaan laporan analitis pendukung keputusan bagi BAPPERIDA dan Pimpinan Daerah.

## 3. Role & Izin (TOR §3 — 6 aktor → 5 role aplikasi)

| Role | Aktor TOR | Tanggung Jawab & Hak Akses |
| --- | --- | --- |
| **`bapperida`** | Administrator BAPPERIDA (Superadmin) | **Hak akses penuh (Superadmin)**: Kelola pengguna, master OPD, master indikator SPD/SID, periode lomba, penugasan pendamping, bypass verifikasi, ekspor IGA, dan eksekusi command CLI `make:superadmin`. |
| **`tim_penilai`** | Tim Penilai Internal | Skoring SPD & SID, review internal inovasi daerah, pemantauan indikator kematangan, penetapan inovasi daerah, serta ekspor laporan. |
| **`pendamping`** | Pendamping Inovasi **+** Verifikator OPD | Pemeriksaan berkas 20 Indikator SID, pemberian catatan per-indikator, verifikasi (`Disetujui`/`Revisi`), dan pengesahan resmi tingkat OPD. |
| **`inovator`** | Inovator OPD **&** Inovator Masyarakat | Input profil 22 item inovasi, unggah berkas profil (proposal, SK, piagam, video), kelola bukti dukung 20 SID, revisi data, dan ajukan kembali dari arsip. Terbagi atas tipe `dinas` (terikat OPD) dan `masyarakat` (mandiri/komunitas). |
| **`pimpinan`** | Pimpinan Daerah (Bupati/Sekda) | Dashboard monitoring eksekutif read-only, pemantauan capaian skor kematangan, dan rekapitulasi inovasi daerah. |

## 4. Alur Status Validasi (8 Langkah — TOR §5)

```
draft → diajukan → divalidasi → revisi | disetujui → disahkan_opd → review_internal → siap_kirim → terkirim
```

| No | Status | Aktor | Aktivitas |
| --- | --- | --- | --- |
| 1 | **Draft** | Inovator | Mengisi profil 22 item, mengunggah proposal & video. Inovasi masih privat. |
| 2 | **Diajukan** | Inovator | Klik "Ajukan Validasi" &rarr; Notifikasi otomatis ke Pendamping/Verifikator. |
| 3 | **Dalam Pendampingan** | Pendamping | Penelaahan kelengkapan bukti dukung mengacu 20 Indikator SID. |
| 4a | **Revisi (Wajib Catatan)** | Pendamping &rarr; Inovator | Catatan koreksi per-indikator. Data kembali ke Inovator untuk diperbaiki. |
| 4b | **Disetujui** | Pendamping | Penilaian awal bukti dukung memenuhi kriteria parameter minimal. |
| 5 | **Disahkan OPD** | Verifikator OPD | Pengesahan formal oleh Kepala Perangkat Daerah / Pimpinan Lembaga. |
| 6 | **Review Internal** | Tim Penilai | Uji petik lapangan, skoring SPD & SID terpadu, dan verifikasi urusan yandas. |
| 7 | **Siap Kirim** | BAPPERIDA / Penilai | Inovasi lolos Quality Assurance dan ditetapkan sebagai Inovasi Daerah. |
| 8 | **Terkirim** | BAPPERIDA | Data dan berkas disalin/disinkronkan ke sistem resmi IGA Kemendagri. |

> **Catatan Audit Trail**: Data tidak pernah dihapus. Seluruh transisi status tercatat secara permanen pada tabel `validasi_log` (user, tanggal, status asal, status baru, catatan).

## 5. Periode & Arsip (TOR §6)

- Inovasi terikat `periode_lomba` (tahun). Saat tahun berganti, inovasi periode lama otomatis masuk ke **Arsip** (*read-only*).
- Aksi **"Ajukan Kembali"**: Inovator dapat menyalin inovasi arsip menjadi draft baru pada tahun berjalan, dengan kewajiban mengisi kolom **"Penjelasan Pengembangan dari Versi Sebelumnya"** serta rantai riwayat versi tercatat di `inovasi_versi`.

## 6. Kebutuhan Fungsional Utama

1. **Autentikasi & Registrasi Dwijalur**:
   - Pendaftaran akun mandiri untuk Inovator dengan pemisahan jalur: **Inovator OPD/Instansi** (wajib memilih OPD) dan **Inovator Masyarakat/Komunitas** (nama lembaga mandiri).
   - Dilengkapi proteksi CAPTCHA matematika, verifikasi email, dan fitur Reset Password mandiri untuk seluruh role.
   - Command Artisan `php artisan make:superadmin` untuk inisialisasi akun Superadmin melalui verifikasi kode OTP 6-digit via email.
2. **Master Perangkat Daerah (OPD)**:
   - CRUD data OPD di `/penilai/opd` (nama, kode singkatan, status aktif).
   - Integrasi penghitungan jumlah inovasi per OPD yang dapat diklik langsung untuk memfilter daftar di halaman Inovasi Daerah.
3. **Modul Filter Tabel Inovasi Daerah**:
   - Toolbar filter sejajar search bar: Filter Perangkat Daerah (OPD), Filter Tahapan (Inisiatif, Uji Coba, Penerapan), Filter Status Validasi, dan Tombol Reset Filter instan.
4. **Profil Inovasi & Lembar Kerja 20 Indikator SID**:
   - Form input 22 field item inovasi standar IGA Kemendagri.
   - Lembar kerja tabel 7 kolom 20 Indikator SID (`/inovasi/{id}/indikator`) dengan progres bar, estimasi skor kematangan, modal pemilihan parameter P1/P2/P3, petunjuk teknis bukti dukung, dan manajemen dokumen indikator.
5. **Self-Scoring Engine & Rekapitulasi IID**:
   - Perhitungan otomatis SPD (maks 63 poin), SID (maks 111 poin), dan Jumlah Inovasi (maks 76 poin) &rarr; Total Indeks 250 poin (dikonversi ke skala 0–100).
6. **Ekspor & Cetak Rekapitulasi PDF**:
   - Cetak PDF rekapitulasi data inovasi daerah dan bukti dukung siap cetak resmi.

## 7. Scope Management (DOs and DON'Ts)

### DOs (Wajib Dilakukan)
- Taat hierarki RBAC: Inovator hanya mengelola inovasinya; Pendamping memeriksa binaannya; Tim Penilai menilai & review; BAPPERIDA mengelola sistem penuh; Pimpinan eksekutif read-only.
- Gunakan komponen shadcn/ui dan ikon Lucide React secara konsisten.
- Gunakan identitas hero banner teal INOVA-HUB (`from-teal-600 via-teal-700 to-emerald-800 text-white`) dengan motif Kemang Satange.
- Catat seluruh transisi status di `validasi_log`.

### DON'Ts (Dilarang)
- Dilarang menggunakan emoji/emotikon pada komponen antarmuka pengguna.
- Dilarang hardcode bobot atau parameter skoring (seluruhnya dinamis dari tabel master).
- Dilarang menghapus data inovasi yang telah diajukan (gunakan mekanisme status atau arsip).