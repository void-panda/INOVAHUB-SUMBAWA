# UI Design — INOVA-HUB Kabupaten Sumbawa

Desain antarmuka pengguna INOVA-HUB dibangun di atas stack **Inertia.js + React 19 + TypeScript + Tailwind CSS v4** dengan seluruh komponen standar dari **shadcn/ui**.

---

## 1. Prinsip Desain & Standar Visual

1. **Background Banner Seragam**: Seluruh hero banner di semua halaman wajib menggunakan gradien warna teal signature INOVA-HUB (`from-teal-600 via-teal-700 to-emerald-800 border-teal-500/30 text-white`) dengan siluet hiasan **Motif Kemang Satange** khas Kabupaten Sumbawa.
2. **Ikonografi Bersih & Tanpa Emoji**: Dilarang menggunakan karakter emoji/emotikon pada teks antarmuka, label dropdown, atau komponen UI. Seluruh elemen visual WAJIB menggunakan ikon **Lucide React**.
3. **Komponen Konsisten**: Seluruh elemen form, tabel, modal, dan notifikasi wajib memanfaatkan pustaka komponen shadcn/ui (`Button`, `Input`, `Select`, `Dialog`, `Badge`, `Progress`, `Table`, `Tabs`, `Card`, `Sonner`).

---

## 2. Navigasi & Struktur Menu per Role

| Role | Menu Navigasi Utama |
| --- | --- |
| **Inovator** (OPD & Masyarakat) | Dashboard Inovator, Inovasi Saya, Tambah Inovasi Baru, Lembar 20 Indikator SID, Dokumen Pendukung, Arsip Inovasi (+ Ajukan Kembali) |
| **Pendamping** (Verifikator OPD) | Dashboard Pendamping, Antrean Validasi, Inovasi Binaan, Review Indikator SID, Pengesahan OPD, Rekapitulasi |
| **Tim Penilai** | Dashboard Penilaian, Review Inovasi Daerah, Skoring SPD & SID, Rekapitulasi Nilai IID, Cetak Rekapitulasi PDF |
| **BAPPERIDA** (Superadmin) | Akses seluruh modul di atas + Master Perangkat Daerah (`/penilai/opd`), Manajemen Pengguna (`/penilai/users`), Master Indikator, dan Periode Lomba |
| **Pimpinan Daerah** | Dashboard Eksekutif (read-only monitoring, statistik urusan yandas, ranking skor kematangan) |

---

## 3. Spesifikasi Layar Utama

### A. Layar Registrasi Dwijalur (`/register`)
- **Navigasi Tab Jalur Pendaftaran**:
  1. **Tab Inovator Perangkat Daerah**: Menampilkan dropdown pilihan Perangkat Daerah resmi Kabupaten Sumbawa (otomatis mengisi field nama pemda).
  2. **Tab Inovator Masyarakat**: Menampilkan field input nama lembaga/komunitas/kampus/desa secara bebas tanpa terikat OPD.
- **Field Identitas**: Nama Lengkap, Alamat Email, Nomor WhatsApp, Pekerjaan/Profesi, Password & Konfirmasi Password.
- **Keamanan**: Soal CAPTCHA matematika sederhana untuk mencegah bot registrasi otomatis.
- **Verifikasi**: Notifikasi verifikasi email dikirimkan segera setelah pendaftaran berhasil.

### B. Layar Login & Pemulihan Akun (`/login`, `/forgot-password`)
- Desain split-screen elegan: Panel kiri memuat brand identity INOVA-HUB dengan motif Kemang Satange dan kutipan visi Sumbawa Inovatif; Panel kanan form login.
- Tombol *"Lupa Password?"* yang memfasilitasi reset password mandiri via email untuk seluruh user role.

### C. Layar Master Perangkat Daerah (`/penilai/opd`)
- Khusus diakses oleh role `bapperida` (Superadmin).
- Tabel daftar seluruh OPD memuat: Nama OPD, Kode Singkatan (badge font-mono), Jumlah Inovasi Terdaftar, dan Aksi (Edit / Hapus).
- **Interaksi Drill-down**: Badge jumlah inovasi dapat diklik langsung untuk membuka daftar inovasi milik OPD tersebut pada halaman Inovasi Daerah (`/inovasi-daerah?opd_id={id}`).
- Dialog modal tambah & ubah OPD.

### D. Layar Inovasi Daerah & Toolbar Filter (`/inovasi-daerah`)
- **Hero Banner & 4 Metric Cards**: Total Inovasi Daerah, Inovasi Sedang Dilombakan, Rata-rata Skor Kematangan, dan Jumlah Siap/Terkirim Kemendagri.
- **Search & Filter Toolbar Terpadu**:
  - Kolom Input Pencarian (*real-time search*).
  - **Dropdown Filter OPD**: Memilih Perangkat Daerah spesifik atau *"Semua Perangkat Daerah"*.
  - **Dropdown Filter Tahapan**: Pilihan *Semua Tahapan*, *Inisiatif*, *Uji Coba*, atau *Penerapan*.
  - **Dropdown Filter Status Validasi**: Pilihan *Semua Status*, *Dalam Pendampingan*, *Disahkan OPD*, *Review Internal*, *Siap Kirim*, atau *Terkirim*.
  - **Tombol Reset Filter**: Muncul otomatis saat filter aktif untuk mengembalikan tabel ke kondisi awal.
- **Tabel Inovasi Daerah**: Menampilkan nama inovasi, inisiator, tanggal penerapan, bar progres 20 Indikator SID, badge skor kematangan (warna dinamis hijau/teal/kuning), status kelengkapan berkas profil, badge status 8-langkah, dan menu aksi.

### E. Lembar Kerja 20 Indikator SID (`/inovasi/{id}/indikator`)
- **Header Ringkasan**: Progres pengisian (misal: 20 / 20 SID - 100%) dan estimasi skor kematangan real-time.
- **Tabel 7 Kolom Standar TOR**:
  1. *Indikator* (kode & judul resmi).
  2. *Keterangan* (definisi operasional).
  3. *Informasi* (petunjuk teknis kriteria dokumen bukti dukung).
  4. *Bobot* (nilai bobot indikator).
  5. *Parameter* (tombol modal untuk memilih opsi P1, P2, P3, atau 0).
  6. *Data Pendukung* (tautan folder berkas indikator).
  7. *Jenis* (badge format file yang dipersyaratkan).
- **Halaman Manajemen Berkas Indikator**: Tombol *"Upload Dokumen Baru"* (modal form), pratinjau file (*preview*), dan tombol hapus berkas.