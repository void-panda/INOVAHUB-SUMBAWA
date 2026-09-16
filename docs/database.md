# Database — INOVA-HUB Kabupaten Sumbawa

Skema mengikuti **entitas TOR §7** + tabel RBAC **spatie/laravel-permission**.
Nama tabel/kolom acuan = **`docs/database.md` ini** (turun dari entitas TOR §7).
Jangan menambah tabel/kolom yang belum dipakai modul — tambahkan saat benar-benar
dibutuhkan (YAGNI).

## Tabel

### `users`
Akun seluruh aktor.

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| name | string | Nama Akun |
| nama_pemda | string | Nama Pemda |
| opd_id | FK → opd (nullable) | Perangkat Daerah asal |
| email | string unique | |
| password | string | |
| status_aktif | boolean (default true) | penonaktifan akun |
| timestamps | | |

Role **tidak disimpan** di kolom ini — lewat spatie (`model_has_roles`).

### spatie RBAC
`roles`, `permissions`, `role_has_permissions`, `model_has_roles`,
`model_has_permissions` (paket `spatie/laravel-permission`). 4 role seed:
`inovator`, `pendamping`, `tim_penilai`, `pimpinan` (lihat `docs/PRD.md`).

### `opd`
Master Perangkat Daerah.

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| nama | string | |
| kode | string nullable | kode perangkat/urusan |
| kontak | string nullable | |
| timestamps | | |

### `inovasi`
Data inti profil inovasi (22 field sesuai Proposal Inovasi Daerah — rincian
final saat form dibangun, mengacu TOR §9 + `docs/ui-design.md`).

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| user_id | FK → users | pemilik (Nama Akun) |
| opd_id | FK → opd nullable | OPD pengusul |
| periode_lomba_id | FK → periode_lomba | periode/tahun |
| nama_inovasi | string | Nama Inovasi* |
| tahapan | enum `inisiatif`/`ujicoba`/`penerapan` | Tahapan Inovasi* |
| nama_inisiator | string | Nama Inisiator* |
| koordinat | string `"lat,lng"` | Koordinat* |
| urusan_utama | string | Urusan Pemerintahan Utama |
| urusan_wajib | string nullable | urusan wajib yandas terwakili (untuk cek kepatuhan) |
| waktu_uji_coba | date nullable | |
| waktu_penerapan | date | Waktu Penerapan* |
| waktu_pengembangan | date nullable | |
| file_penghargaan | string nullable | path file — File Penghargaan (kolom grid lama) |
| estimasi_skor_kematangan | float nullable | dihitung |
| status | enum 8 langkah (TOR §5) | draft/diajukan/divalidasi/revisi/disetujui/disahkan_opd/review_internal/siap_kirim/terkirim |
| is_arsip | bool default false | periode lama → true (read-only) |
| penjelasan_pengembangan | text nullable | wajib saat "Ajukan Kembali" |
| inovasi_asal_id | FK → inovasi nullable | rantai versi (alternatif/simpel `inovasi_versi`) |
| timestamps | | |

> Entitas TOR `inovasi_versi` tetap dibuat sbg tabel penaut eksplisit antar tahun
> (idiom TOR); `inovasi_asal_id` di atas adalah penyederhanaan opsional — pilih
> salah satu saat implementasi, jangan duplikasi (lihat gotcha `docs/database.md`).

### `inovasi_dokumen`
Berkas pendukung (anak dari inovasi).

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| inovasi_id | FK → inovasi | |
| jenis | string | anggaran / profil-bisnis / haki / penghargaan / video / proposal / sk / piagam / dokumen-dukung |
| path | string | lokasi file di disk lokal |
| nama_asal | string | nama file asli |
| mime | string | |
| ukuran | int | bytes |
| timestamps | | |

### `indikator_spd` / `indikator_sid`
Master indikator + bobot + parameter ambang (P1/P2/P3). **Data master, dapat
diperbarui `tim_penilai` tiap tahun — jangan hardcode.**

| kolom | tipe |
| --- | --- |
| id | bigint PK |
| kode | string (SPD-01.. / SID-01..) |
| nama | string |
| variabel | string nullable |
| bobot | decimal |
| p1 | string nullable | parameter ambang P1 (data master) |
| p2 | string nullable | parameter ambang P2 |
| p3 | string nullable | parameter ambang P3 |
| timestamps | |

### `skor_inovasi`
Hasil skoring per inovasi per indikator SID.

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| inovasi_id | FK → inovasi | |
| indikator_id | FK → indikator_sid | |
| tier | int (1–3) | parameter tercapai |
| skor | decimal | tier × bobot |
| catatan | text nullable | catatan validator |
| timestamps | | |

### `skor_spd`
Hasil skoring indikator SPD tingkat kabupaten (diisi/di-review `tim_penilai`
berdasar data OPD terkait).

| kolom | tipe |
| --- | --- |
| id | bigint PK |
| periode_lomba_id | FK → periode_lomba |
| indikator_id | FK → indikator_spd |
| tier | int (1–3) |
| skor | decimal |
| catatan | text nullable |
| timestamps | |

### `validasi_log`
Audit trail semua transisi status (TOR §11).

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| inovasi_id | FK → inovasi | |
| user_id | FK → users | siapa |
| status_sebelum | string | |
| status_sesudah | string | |
| catatan | text nullable | komentar revisi (wajib saat revisi) |
| created_at | timestamp | kapan |

### `penugasan_pendamping`
Relasi Pendamping ↔ OPD/Inovator binaan.

| kolom | tipe |
| --- | --- |
| id | bigint PK |
| pendamping_id | FK → users (role pendamping) |
| opd_id | FK → opd nullable |
| inovator_id | FK → users nullable |
| periode_lomba_id | FK → periode_lomba |
| timestamps | |

### `notifikasi`
Log notifikasi (in-app / email).

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| user_id | FK → users | penerima |
| tipe | string | pengajuan-baru / revisi / disetujui / tenggat / pengumuman |
| pesan | text | |
| dibaca_at | timestamp nullable | |
| timestamps | | |

### `linimasa`
Master tahapan & tenggat lomba IGA tahun berjalan.

| kolom | tipe |
| --- | --- |
| id | bigint PK |
| periode_lomba_id | FK → periode_lomba |
| nama | string (Penjaringan, Validasi Lapangan, Presentasi, Sidang, Penghargaan, …) |
| mulai | date |
| selesai | date |

### `periode_lomba`
Master periode/tahun penilaian.

| kolom | tipe | keterangan |
| --- | --- | --- |
| id | bigint PK | |
| tahun | int unique | 2025, 2026, … |
| aktif | boolean | penanda periode berjalan (arsip = periode non-aktif) |
| timestamps | | |

### `inovasi_versi`
Rantai riwayat versi satu inovasi antar tahun ("Ajukan Kembali").

| kolom | tipe |
| --- | --- |
| id | bigint PK |
| inovasi_baru_id | FK → inovasi |
| inovasi_asal_id | FK → inovasi |
| tahun | int |
| catatan_pengembangan | text (Penjelasan Pengembangan dari Versi Sebelumnya) |
| timestamps | |

## Tidak ada (dengan sengaja)

- Tabel arsip terpisah — arsip = `is_arsip`/periode non-aktif (data tak pernah dihapus).
- Soft-delete menyeluruh — cukup `validasi_log` + arsip.
- UUID/audit berlebihan.

## Catatan pelaksanaan

- Pilih **satu** mekanisme rantai versi: tabel `inovasi_versi` (idiom TOR) **atau**
  kolom `inovasi_asal_id` di `inovasi` — jangan keduanya.
- `penilaian` (fase awal) → digantikan `skor_inovasi` + `skor_spd`; migrasi lama
  dimigrasikan menyesuaikan TOR.
- Kolom profil lanjutan (rancang bangun, tujuan, manfaat, hasil, Asta Cita, PKPN,
  jenis/bentuk, dll) ditambah saat form 22 field dibangun (Phase 3) — daftar
  field mengacu TOR §9 (22 item Proposal Inovasi Daerah).