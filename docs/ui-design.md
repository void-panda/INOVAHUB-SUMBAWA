# UI Design — INOVA-HUB Kabupaten Sumbawa

Referensi kolom/formulir mengikuti `docs/database.md` (entitas TOR §7) dan
TOR §9 (form 22 item Proposal Inovasi Daerah).

## Implementasi UI

Semua UI dibangun dengan **shadcn/ui** (Inertia + React) agar konsisten dan rapi —
jangan membuat komponen UI manual. Peta komponen:

| Elemen | Komponen shadcn/ui |
| --- | --- |
| Daftar Inovasi (tabel) | `Table` |
| Form input | `Input`, `Label`, `Textarea`, `Select`, `DatePicker` |
| Upload | input file + `Badge`/`Card` |
| Konfirmasi aksi | `AlertDialog`/`Dialog` |
| Flash sukses/gagal | `Sonner`/`Toaster` |
| Navigasi role | `Sidebar`, `DropdownMenu`, `Breadcrumb` |
| Detail/status | `Badge`, `Card`, `Separator` |
| Indikator kepatuhan | `Badge` (warna hijau/merah) |

## Ketentuan Desain Visual & Ikonografi
1. **Background Banner Seragam**: Seluruh hero banner di semua halaman menggunakan gradien warna teal signature INOVA-HUB (`from-teal-600 via-teal-700 to-emerald-800 border-teal-500/30 text-white`) dengan hiasan siluet **Motif Kemang Satange** khas Kabupaten Sumbawa.
2. **Tanpa Emoji / Emotikon**: Dilarang menggunakan karakter emoji/emotikon pada teks antarmuka, label dropdown, atau komponen UI. Seluruh elemen visual WAJIB menggunakan ikon **Lucide React** yang bersih dan profesional.

## Navigasi per role (4 role aplikasi)

| Role | Menu utama |
| --- | --- |
| **Inovator** (OPD & masyarakat) | Beranda (inovasi sendiri), Input Inovasi Baru, Detail/Edit, Arsip saya (+ Ajukan Kembali), Notifikasi |
| **Pendamping** (Pendamping + Verifikator OPD) | Beranda (antre validasi), Verifikasi & Pengesahan OPD, Daftar binaan, Notifikasi |
| **Tim Penilai** (Tim Penilai + Admin Bappeda) | Dashboard kabupaten, Penilaian SPD/SID, Master data (indikator/bobot/parameter/opd/users/penugasan/linimasa/periode), Laporan & Ekspor, Notifikasi |
| **Pimpinan** | Dashboard eksekutif (read-only) |

## Layar

### 1. Login
Email + password. Setelah login arahkan sesuai role (spatie). Reset password via Fortify.

### 2. Daftar Inovasi (tabel)
Kolom mengikuti `docs/database.md` (tabel `inovasi`):

| Nama Pemda | Nama Akun | Nama Inovasi* | Tahapan* | Nama Inisiator* | Koordinat* | Urusan Utama | Waktu Uji Coba | Waktu Penerapan* | Waktu Pengembangan | Estimasi Skor Kematangan | File Penghargaan | Aksi |

- **Nama Pemda / Nama Akun** — dari `users`(`nama_pemda`/`name`) pemilik
- **Estimasi Skor Kematangan** — hasil penilaian (non-editable)
- **File Penghargaan / Dokumen** — ikon download/link (dari `inovasi_dokumen` bila ada)
- **Aksi** — lihat / edit / verifikasi / setujui-opd (sesuai role)
- Status 8 langkah tampil sebagai `Badge` (warna per status)

### 3. Input Inovasi Baru (create form)
Field formulir (inti; diperluas ke 22 field saat Phase 3 sesuai TOR §9
Proposal Inovasi Daerah):

- Nama Inovasi* (text)
- Tahapan Inovasi* (dropdown: Inisiatif / Ujicoba / Penerapan)
- Nama Inisiator* (text)
- Koordinat* (text "lat,lng")
- Urusan Pemerintahan Utama (dropdown; termasuk urusan wajib yandas)
- Waktu Uji Coba (date, opsional)
- Waktu Penerapan* (date)
- Waktu Pengembangan (date, opsional)
- Dokumen dukung (upload multi: proposal, SK, piagam, video, anggaran, HAKI)
- Penjelasan Pengembangan (wajib hanya saat "Ajukan Kembali")

Simpan → status `draft`. Tombol "Ajukan Validasi" (→ `diajukan`).

### 4. Detail Inovasi
Seluruh field + daftar dokumen (download) + status + riwayat `validasi_log`/komentar.

### 5. Verifikasi & Pengesahan (Pendamping)
- Checklist kelengkapan mengacu indikator SPD/SID.
- Aksi: **Disetujui** atau **Revisi** (Revisi wajib isi komentar).
- Setelah `disetujui` → aksi **Disahkan OPD** (Verifikator OPD, role sama).

### 6. Penilaian (tim_penilai)
- Input tier/parameter per indikator SPD (`skor_spd`) & SID (`skor_inovasi`).
- Tampilkan: Skor SPD, SID, Jumlah Inovasi → IID → Kategori (TOR §8).
- **Simulasi what-if**: tambah/hapus inovasi → dampak skor kabupaten.
- Detail indikator/bobot/parameter di `docs/domain.md`.

### 7. Cek Kepatuhan Urusan Wajib
- Kartu 6 urusan yandas (hijau = terwakili, merah = kosong) untuk inovasi `siap_kirim`.

### 8. Dashboard & Monitoring
- **Inovator**: progres inovasi sendiri.
- **Pendamping**: daftar binaan & antrean validasi.
- **tim_penilai**: rekap kabupaten (SPD/SID/IID, status pendampingan per OPD).
- **Pimpinan**: ringkasan eksekutif (kartu angka & grafik), read-only.

### 9. Arsip (read-only) & "Ajukan Kembali"
- Daftar inovasi periode non-aktif (read-only: profil, skor, dokumen, catatan validasi).
- Aksi "Ajukan Kembali" → salinan draft baru + kolom wajib "Penjelasan Pengembangan".

### 10. Notifikasi
- Daftar notifikasi in-app (pengajuan baru, revisi, disetujui, tenggat) + badge belum dibaca.

### 11. Linimasa & Pengingat
- Kalender/list tahapan lomba IGA (`linimasa`) + pengingat tenggat.

### 12. Laporan & Ekspor (tim_penilai)
- Rekap skor kabupaten, status pendampingan, kepatuhan urusan, kinerja pendamping,
  per inovasi (PDF/DOCX), kesiapan pengiriman (Excel).

## Catatan UI

- Semua elemen dari **shadcn/ui** + Tailwind — konsisten antar layar, hindari UI manual/AI-slop.
- Layout responsif (pengguna non-teknis, termasuk sekolah/puskesmas).
- Flash message sukses/gagal untuk tiap aksi; konfirmasi untuk aksi status/destruktif.
- `ponytail: halaman sesedikit yang dibutuhkan alur inti; tambah layar saat modul benar-benar dibangun.`