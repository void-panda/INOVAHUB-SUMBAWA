# Database — INOVA-HUB Kabupaten Sumbawa

Skema basis data mengikuti **entitas TOR §7**, regulasi IGA 2026 Kemendagri, serta tabel RBAC **spatie/laravel-permission** dan autentikasi **Laravel Fortify**.

---

## 1. Entitas & Tabel Utama

### `users`
Akun seluruh aktor pengguna sistem.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Auto-increment primary key |
| `name` | string(255) | Nama lengkap pengguna |
| `email` | string(255) unique | Alamat email resmi (digunakan untuk login & OTP) |
| `email_verified_at` | timestamp nullable | Waktu verifikasi email pendaftaran / OTP |
| `password` | string(255) | Hash password pengguna |
| `nama_pemda` | string(255) | Nama instansi / OPD / asal komunitas |
| `tipe_inovator` | string(20) default `'dinas'` | Kategori inovator: `'dinas'` (OPD/Instansi) atau `'masyarakat'` (Mandiri/Komunitas) |
| `opd_id` | FK &rarr; `opd.id` nullable | Relasi ke Perangkat Daerah asal (wajib jika `tipe_inovator = 'dinas'`) |
| `no_whatsapp` | string(50) nullable | Nomor WhatsApp aktif untuk konfirmasi & notifikasi |
| `pekerjaan` | string(255) nullable | Profesi / jabatan pengguna |
| `status_aktif` | boolean default `true` | Status aktivasi akun (dapat dinonaktifkan BAPPERIDA) |
| `two_factor_secret` | text nullable | Secret key 2FA Fortify |
| `two_factor_recovery_codes` | text nullable | Kode pemulihan 2FA |
| `two_factor_confirmed_at` | timestamp nullable | Waktu konfirmasi 2FA |
| `remember_token` | string(100) nullable | Sesi remember me |
| `created_at` / `updated_at` | timestamp | Waktu pembuatan & modifikasi |

> **Catatan RBAC**: Role pengguna tidak disimpan dalam kolom tabel ini, melainkan melalui tabel pivot Spatie (`model_has_roles`). Terdapat 5 role standar: `bapperida` (Superadmin), `tim_penilai`, `pendamping`, `inovator`, dan `pimpinan`.

---

### `opd`
Master data Perangkat Daerah di lingkungan Pemerintah Kabupaten Sumbawa.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Primary key |
| `nama` | string(255) | Nama resmi Perangkat Daerah / Unit Kerja |
| `kode` | string(50) nullable | Kode singkatan resmi (misal: `BAP`, `DISKOMINFO`, `DINKES`) |
| `kontak` | string(255) nullable | Nomor telepon / narahubung dinas |
| `created_at` / `updated_at` | timestamp | Audit timestamps |

---

### `periode_lomba`
Master linimasa dan tahun lomba IGA Kabupaten Sumbawa.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Primary key |
| `tahun` | integer unique | Tahun pelaksanaan lomba (contoh: 2025, 2026) |
| `aktif` | boolean default `false` | Menandai periode lomba berjalan (hanya 1 yang aktif) |
| `tanggal_mulai` | date | Tanggal pembukaan pengajuan |
| `tanggal_selesai` | date | Batas akhir pengajuan / penutupan |
| `created_at` / `updated_at` | timestamp | Audit timestamps |

---

### `inovasi`
Profil induk entitas inovasi (berlaku lintas periode).

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Primary key |
| `user_id` | FK &rarr; `users.id` | Akun inisiator/pemilik inovasi |
| `opd_id` | FK &rarr; `opd.id` nullable | Perangkat Daerah pengusul (null jika inovasi masyarakat) |
| `is_inovasi_daerah` | boolean default `false` | Penanda inovasi resmi terpilih Kabupaten Sumbawa |
| `nama_inovasi` | string(255) | Nama judul inovasi |
| `tahapan` | enum | `'inisiatif'`, `'ujicoba'`, atau `'penerapan'` |
| `nama_inisiator` | string(255) | Nama perseorangan atau tim penggagas |
| `inisiator` | enum | `'opd'`, `'masyarakat'`, `'pemerintah_desa'`, dll |
| `bentuk_inovasi` | enum | `'pelayanan_publik'`, `'tata_kelola_pemerintahan'`, dll |
| `jenis_inovasi` | enum | `'digital'` atau `'non_digital'` |
| `klasifikasi` | enum | `'tematik'` atau `'non_tematik'` |
| `tematik` | string(100) nullable | Isu strategis (stunting, kemiskinan, digitalisasi, dll) |
| `koordinat` | string(100) | Titik lokasi koordinat latitude & longitude |
| `urusan_utama` | string(255) | Urusan pemerintahan utama yang didukung |
| `urusan_wajib` | json nullable | Daftar urusan wajib pelayanan dasar (yandas) yang dicakup |
| `waktu_uji_coba` | date nullable | Tanggal dimulainya masa uji coba |
| `waktu_penerapan` | date | Tanggal resmi diimplementasikan |
| `waktu_pengembangan` | date nullable | Tanggal siklus pengembangan lanjutan |
| `rancang_bangun` | text | Deskripsi dasar rancang bangun dan metodologi (min. 300 kata) |
| `tujuan` | text | Tujuan spesifik diciptakannya inovasi |
| `manfaat` | text | Manfaat terukur bagi masyarakat dan pemerintah daerah |
| `hasil_inovasi` | text nullable | Capaian kuantitatif dan kualitatif implementasi |
| `file_penghargaan` | string(255) nullable | Path piagam/sertifikat penghargaan yang pernah diraih |
| `created_at` / `updated_at` | timestamp | Audit timestamps |

---

### `pengajuan_lomba`
Relasi partisipasi inovasi pada suatu tahun lomba (mewadahi siklus hidup & arsip).

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Primary key |
| `inovasi_id` | FK &rarr; `inovasi.id` | Relasi ke profil induk inovasi |
| `periode_lomba_id` | FK &rarr; `periode_lomba.id` | Periode lomba yang diikuti |
| `user_id` | FK &rarr; `users.id` | Pendaftar / penanggung jawab |
| `is_inovasi_daerah` | boolean default `false` | Status lolos penetapan Inovasi Daerah periode bersangkutan |
| `status` | enum (8 status) | `'draft'`, `'dalam_pendampingan'`, `'disahkan_opd'`, `'review_internal'`, `'siap_kirim'`, `'terkirim'`, dll |
| `is_arsip` | boolean default `false` | Menandai arsip lomba periode masa lalu (read-only) |
| `penjelasan_pengembangan` | text nullable | Wajib diisi bila hasil "Ajukan Kembali" dari arsip |
| `estimasi_skor_kematangan` | decimal(5,2) nullable | Simulasi skor kematangan 20 Indikator SID (maks 60 poin) |
| `created_at` / `updated_at` | timestamp | Audit timestamps |

---

### `inovasi_dokumen`
Berkas pendukung umum profil inovasi (proposal, SK, piagam penghargaan, tautan video).

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Primary key |
| `inovasi_id` | FK &rarr; `inovasi.id` | Relasi ke inovasi |
| `pengajuan_lomba_id` | FK &rarr; `pengajuan_lomba.id` | Terikat ke pengajuan lomba |
| `jenis` | enum | `'proposal'`, `'sk'`, `'piagam'`, `'video'`, dll |
| `nama_asal` | string(255) | Nama asli berkas saat diunggah |
| `path` | string(500) | Lokasi berkas di storage lokal (`storage/app/...`) atau URL video |
| `mime` | string(100) nullable | Tipe konten MIME |
| `ukuran` | bigint default 0 | Ukuran berkas dalam bytes |
| `created_at` / `updated_at` | timestamp | Audit timestamps |

---

### `indikator_sid` & `kelengkapan_indikator`
Master 20 Indikator Satuan Inovasi Daerah (SID) dan isian lembar kerja per pengajuan.

- **`indikator_sid`**: Kode (`SID-01` s/d `SID-20`), nama indikator, bobot, deskripsi parameter P1/P2/P3, dan petunjuk teknis bukti dukung.
- **`kelengkapan_indikator`**: Relasi `pengajuan_lomba_id` dan `indikator_sid_id`, nilai parameter yang dipilih (`'p1'`, `'p2'`, `'p3'`), catatan dukung, serta berkas bukti dukung indikator.

---

### `validasi_log`
Audit trail seluruh pergerakan status inovasi dalam alur 8-langkah.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | bigint PK | Primary key |
| `inovasi_id` | FK &rarr; `inovasi.id` | Inovasi yang diproses |
| `pengajuan_lomba_id` | FK &rarr; `pengajuan_lomba.id` | Pengajuan lomba bersangkutan |
| `user_id` | FK &rarr; `users.id` | Aktor yang melakukan aksi |
| `status_sebelum` | string(50) | Status awal sebelum transisi |
| `status_sesudah` | string(50) | Status baru setelah transisi |
| `catatan` | text nullable | Komentar / catatan penelaahan / alasan revisi |
| `created_at` | timestamp | Waktu pencatatan log (immutable) |