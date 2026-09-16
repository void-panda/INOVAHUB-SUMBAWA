# BUKU PANDUAN PENGGUNAAN SISTEM INOVA-HUB KABUPATEN SUMBAWA
**Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat — IGA 2026**

*Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bappeda) Kabupaten Sumbawa*

---


## BAGIAN I: PENDAHULUAN & AKSES APLIKASI

### Bab 1: Mengenal Sistem INOVA-HUB & Alur 8 Tahap Validasi

Aplikasi INOVA-HUB (Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat) merupakan sistem penjaminan mutu (quality assurance layer) Pemerintah Kabupaten Sumbawa untuk menjaring, mendampingi, memverifikasi, dan memonitor seluruh inovasi daerah sebelum disinkronkan ke sistem resmi Indeks Inovasi Daerah (IID) Kemendagri.

Sistem ini menerapkan alur verifikasi dan pembinaan berjenjang untuk memastikan setiap inovasi memiliki bukti dukung yang valid, terukur, dan memenuhi regulasi Pedoman Umum Innovative Government Award (IGA) 2026.

> [!INFO]
> Prinsip Utama: Data inovasi yang didaftarkan ke INOVA-HUB tidak pernah dihapus dari basis data. Setiap perpindahan status dan revisi tercatat secara transparan dan akuntabel di dalam log validasi sistem.

| Tahap | Status Sistem | Aktor Pelaksana | Deskripsi & Tindakan |
| --- | --- | --- | --- |
| 1 | draft | Inovator (OPD/Masyarakat) | Inovator mengisi profil inisiasi & mengunggah dokumen dukung awal. Status ini masih bersifat privat bagi pemilik akun. |
| 2 | diajukan | Inovator (OPD/Masyarakat) | Inovasi diajukan secara resmi ke sistem untuk diperiksa oleh Pendamping Inovasi. |
| 3 | divalidasi | Pendamping Inovasi | Pendamping membuka dan menelaah kelengkapan dokumen 22 indikator kematangan. |
| 4a | revisi | Pendamping Inovasi | Ditemukan kekurangan bukti dukung. Pendamping memberikan catatan spesifik per indikator untuk diperbaiki Inovator. |
| 4b | disetujui | Pendamping Inovasi | Semua dokumen dan parameter dinilai valid dan memenuhi standar mutu teknis pendampingan. |
| 5 | disahkan_opd | Verifikator / Kepala OPD | Verifikator OPD membubuhkan pengesahan formal bahwa inovasi resmi diakui oleh pimpinan OPD. |
| 6 | review_internal | Tim Penilai Internal | Tim Penilai Bappeda melakukan audit skoring kematangan SPD dan SID. |
| 7 | siap_kirim | Admin Bappeda | Inovasi dinyatakan lolos uji kelayakan penuh dan siap diekspor ke sistem Kemendagri. |
| 8 | terkirim | Admin Bappeda | Data dan berkas dukung berhasil diunggah / disinkronkan ke portal IID Kemendagri. |

| Peran Pengguna (Role) | Cakupan Akses Utama | Tanggung Jawab |
| --- | --- | --- |
| Inovator (OPD & Masyarakat) | Dashboard Inovator, Kelola Inovasi, Formulir Profil, Unggah Dokumen, Ajukan Validasi, Cetak Profil | Mendaftarkan profil inovasi baru, melengkapi 22 indikator dokumen bukti, merevisi data jika diminta pendamping. |
| Pendamping & Verifikator OPD | Dashboard Binaan, Antrean Verifikasi, Lembar Validasi Indikator, Pengesahan OPD | Melakukan pendampingan pengisian, memeriksa keabsahan bukti dukung, menerbitkan catatan revisi, dan memberikan pengesahan resmi OPD. |
| Tim Penilai & Admin Bappeda | Dashboard IID Kabupaten, Manajemen Penugasan, Skoring SPD & SID, Simulasi What-If, Master Data, Ekspor Data | Melakukan penilaian kematangan indikator inovasi, simulasi skor indeks kabupaten, mengelola periode lomba, dan mengekspor data ke pusat. |
| Pimpinan Daerah | Dashboard Eksekutif Pimpinan (Read-Only) | Memantau performa inovasi daerah secara real-time, sebaran urusan wajib pelayanan dasar, dan proyeksi predikat kematangan Sumbawa. |

### Bab 2: Masuk ke Akun (Login)

![Tampilan Halaman Masuk Aplikasi INOVA-HUB Kabupaten Sumbawa](file:///D:/CODE/repo-inovasi-daerah/design/01-auth-login.png)

*Tampilan Halaman Masuk Aplikasi INOVA-HUB Kabupaten Sumbawa*

Halaman Masuk adalah gerbang utama bagi seluruh pengguna sistem INOVA-HUB. Sistem menggunakan otentikasi berbasis email dan kata sandi yang telah terdaftar.

1. Buka peramban (browser) dan akses alamat web resmi INOVA-HUB Kabupaten Sumbawa.
2. Pada formulir yang tersedia, masukkan Email Pengguna yang telah didaftarkan.
3. Ketikkan Kata Sandi akun Anda pada kolom yang sesuai.
4. Centang opsi 'Ingat Saya' (Remember Me) jika Anda menggunakan perangkat pribadi dan ingin sesi tetap aktif.
5. Klik tombol 'Masuk ke Sistem'. Sistem akan secara otomatis mengidentifikasi peran (role) Anda dan mengarahkan ke dashboard yang relevan.

> [!TIP]
> Keamanan Sesi: Jangan mencentang opsi 'Ingat Saya' apabila Anda mengakses aplikasi dari komputer umum atau ruang rapat bersama.

### Bab 3: Pendaftaran Akun Inovator Baru

![Formulir Pendaftaran Akun Inovator Baru](file:///D:/CODE/repo-inovasi-daerah/design/02-auth-register.png)

*Formulir Pendaftaran Akun Inovator Baru*

Bagi Inovator Perangkat Daerah baru, instansi vertikal, maupun masyarakat umum/akademisi yang belum memiliki akun, pendaftaran dapat dilakukan secara mandiri melalui menu registrasi.

1. Pada halaman login, klik tautan 'Daftar Akun Baru' di bagian bawah kotak masuk.
2. Isi 'Nama Lengkap' atau nama narahubung resmi inovator.
3. Masukkan 'Alamat Email Aktif' yang akan digunakan untuk menerima pemberitahuan dan verifikasi akun.
4. Pilih 'Kategori / Instansi': Tentukan apakah Anda perwakilan Perangkat Daerah (OPD) Kabupaten Sumbawa, Kecamatan, Desa, atau Inovator Masyarakat Mandiri.
5. Buat 'Kata Sandi' yang kuat (minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol).
6. Ketik ulang kata sandi pada kolom 'Konfirmasi Kata Sandi'.
7. Centang persetujuan syarat dan ketentuan penggunaan sistem INOVA-HUB.
8. Klik tombol 'Daftar Sekarang'. Akun Anda akan dibuat dan Anda dapat langsung masuk ke dashboard.

### Bab 4: Pemulihan & Pengaturan Kata Sandi

![Formulir Permintaan Pemulihan Kata Sandi](file:///D:/CODE/repo-inovasi-daerah/design/03-auth-forgot-password.png)

*Formulir Permintaan Pemulihan Kata Sandi*

![Formulir Pembuatan Kata Sandi Baru](file:///D:/CODE/repo-inovasi-daerah/design/04-auth-reset-password.png)

*Formulir Pembuatan Kata Sandi Baru*

Jika Anda lupa kata sandi akun, sistem menyediakan fitur pemulihan mandiri melalui tautan reset yang dikirimkan ke alamat email terdaftar.

1. Pada layar login, klik tautan 'Lupa kata sandi?'.
2. Ketikkan alamat email akun Anda pada formulir pemulihan yang muncul.
3. Klik tombol 'Kirim Tautan Reset'. Sistem akan mengirimkan surat elektronik berisi tautan aman satu kali pakai.
4. Buka email Anda dan klik tombol/tautan pemulihan yang dikirimkan oleh INOVA-HUB.
5. Pada layar 'Reset Kata Sandi Baru', masukkan kata sandi baru Anda beserta konfirmasinya.
6. Klik tombol 'Simpan Kata Sandi Baru'. Anda kini dapat masuk kembali menggunakan sandi terbaru.

### Bab 5: Pengaturan Akun, Keamanan & Tema Tampilan

![Halaman Pengaturan Profil Akun](file:///D:/CODE/repo-inovasi-daerah/design/12-settings-profile.png)

*Halaman Pengaturan Profil Akun*

![Halaman Pengaturan Keamanan Kata Sandi](file:///D:/CODE/repo-inovasi-daerah/design/13-settings-security.png)

*Halaman Pengaturan Keamanan Kata Sandi*

![Halaman Pengaturan Tema Tampilan](file:///D:/CODE/repo-inovasi-daerah/design/14-settings-appearance.png)

*Halaman Pengaturan Tema Tampilan*

Pengguna dapat mengelola preferensi profil, keamanan kredensial, dan estetika antarmuka melalui menu Pengaturan (Settings) pada dropdown profil di pojok kanan atas.

1. Pengaturan Profil: Perbarui nama lengkap, nomor WhatsApp/telepon narahubung resmi, dan nama unit kerja/OPD Anda. Klik 'Simpan Perubahan'.
2. Keamanan Akun: Lakukan pembaruan kata sandi secara berkala dengan memasukkan kata sandi saat ini dan menentukan kata sandi pengganti.
3. Tampilan (Appearance): Sesuaikan kenyamanan visual Anda dengan memilih mode 'Terang' (Light Mode), 'Gelap' (Dark Mode), atau mengikuti konfigurasi tema 'Sistem' perangkat Anda.


## BAGIAN II: PANDUAN PERAN INOVATOR (OPD & MASYARAKAT)

### Bab 6: Dashboard Inovator & Ringkasan Progres

![Dashboard Inovator dengan Ringkasan Metrik dan Linimasa Lomba](file:///D:/CODE/repo-inovasi-daerah/design/05-inovator-dashboard.png)

*Dashboard Inovator dengan Ringkasan Metrik dan Linimasa Lomba*

Setelah login sebagai Inovator, Anda akan disambut oleh Dashboard Inovator yang menyajikan gambaran komprehensif atas status usulan inovasi Anda.

Komponen utama pada Dashboard Inovator meliputi:

- Kartu Metrik Kinerja: Menampilkan total inovasi terdaftar, jumlah draf yang belum diajukan, inovasi yang sedang dalam antrean verifikasi, inovasi yang memerlukan revisi, serta inovasi yang telah disahkan.
- Banner Linimasa Periode Aktif: Menampilkan jadwal tahapan IGA yang sedang berjalan (contoh: 'Periode IGA 2026 - Batas Pengajuan Usulan Inovasi: 30 Juni 2026').
- Tombol Aksi Cepat: Akses langsung menuju formulir 'Tambah Inovasi Baru' dan 'Unduh Panduan Teknis'.
- Daftar Aktivitas Terbaru: Riwayat perubahan status atau komentar revisi terbaru yang diberikan oleh Pendamping Inovasi.

### Bab 7: Menavigasi Tabel & Daftar Inovasi Daerah

![Tabel Manajemen Inovasi Daerah Inovator](file:///D:/CODE/repo-inovasi-daerah/design/06-inovasi-index.png)

*Tabel Manajemen Inovasi Daerah Inovator*

Menu 'Kelola Inovasi' menyajikan tabel inventaris seluruh inovasi yang dimiliki oleh OPD atau akun inovator Anda.

Fitur dan elemen penting pada tabel inovasi:

- Bilah Pencarian & Filter: Cari inovasi berdasarkan nama/kata kunci, saring berdasarkan Urusan Pemerintahan, Tahapan Inovasi, atau Status Validasi.
- Badge Status 8 Langkah: Menunjukkan posisi tahapan inovasi secara visual dengan warna khas (Kuning untuk Draf, Biru untuk Diajukan, Oranye untuk Revisi, Hijau untuk Disetujui/Disahkan).
- Estimasi Skor Kematangan: Indikator akumulasi skor kematangan yang dihitung berdasarkan kelengkapan parameter data dukung.
- Menu Aksi (Tiga Titik): Berisi opsi untuk 'Lihat Detail', 'Edit Profil & Dokumen Dukung', 'Cetak Lembar Profil', dan 'Hapus Draf' (hanya berlaku untuk status draf).

### Bab 8: Mendaftarkan Inovasi Baru (Formulir Inisiasi)

![Formulir Pendaftaran Inisiasi Inovasi Baru](file:///D:/CODE/repo-inovasi-daerah/design/07-inovasi-create.png)

*Formulir Pendaftaran Inisiasi Inovasi Baru*

Untuk mengusulkan inovasi daerah baru, klik tombol '+ Tambah Inovasi' pada sudut kanan atas tabel inovasi. Formulir pendaftaran inisiasi ini mencakup data-data fundamental:

1. Nama Inovasi: Tuliskan nama resmi inovasi secara jelas, menarik, dan representatif (contoh: 'SIMPEL - Sistem Pelayanan Terpadu Sumbawa').
2. Tahapan Inovasi: Pilih tahapan saat ini (Inisiatif / Uji Coba / Penerapan). Catatan: Hanya tahapan 'Penerapan' dengan masa implementasi minimal yang dapat diekspor ke IGA Kemendagri.
3. Inisiator Inovasi: Pilih pihak pencetus inovasi (Kepala Daerah / Anggota DPRD / OPD / ASN / Masyarakat).
4. Jenis Inovasi: Tentukan apakah termasuk Inovasi Pelayanan Publik, Inovasi Tata Kelola Pemerintahan, atau Inovasi Bentuk Lainnya.
5. Bentuk Inovasi: Pilih Digital atau Non-Digital.
6. Urusan Pemerintahan Utama: Pilih urusan yang paling relevan. Jika menyangkut 6 Urusan Wajib Pelayanan Dasar (Pendidikan, Kesehatan, PU, Perkim, Trantibumlinmas, Sosial), pastikan dipilih dengan tepat.
7. Urusan Pemerintahan Lain yang Beririsan: Pilih urusan pendukung jika ada.
8. Waktu Uji Coba & Waktu Penerapan: Tentukan tanggal pelaksanaan uji coba serta tanggal resmi inovasi mulai diterapkan kepada masyarakat/stakeholder.
9. Koordinat Lokasi Penerapan: Tentukan titik koordinat lintang (latitude) dan bujur (longitude) lokasi sentral inovasi.
10. Klik tombol 'Simpan Inisiasi Inovasi'. Sistem akan menyimpan data sebagai 'draft' dan membuka lembar kerja pengisian 22 indikator.

### Bab 9: Melengkapi Profil, 22 Indikator & Dokumen Dukung

![Formulir Kelengkapan 22 Indikator Kematangan dan Dokumen Dukung](file:///D:/CODE/repo-inovasi-daerah/design/08-inovasi-edit.png)

*Formulir Kelengkapan 22 Indikator Kematangan dan Dokumen Dukung*

Setelah inisiasi tersimpan, Inovator wajib melengkapi narasi rancang bangun serta mengunggah bukti dukung untuk ke-22 indikator kematangan sesuai standar IGA 2026 Kemendagri.

> [!IMPORTANT]
> Ketentuan Rancang Bangun: Kolom Rancang Bangun (Dasar Hukum, Permasalahan, Isu Strategis, Metode Kebaruan, Spesifikasi Teknis) WAJIB diisi minimal 300 kata. Narasi yang terlalu singkat akan ditolak oleh sistem dan pendamping.

Rincian pengisian indikator data pendukung:

- Regulasi Inovasi Daerah: Unggah SK Bupati / Perbup / SK Kepala Dinas tentang penetapan inovasi (format PDF).
- Ketersediaan SDM Pengelola: Lampirkan SK Tim Pelaksana atau uraian tugas pengelola inovasi.
- Dukungan Anggaran: Unggah DPA / RKA atau bukti alokasi anggaran operasional inovasi.
- Profil Bisnis / Pedoman Teknis / SOP: Unggah dokumen SOP operasional atau buku manual layanan.
- Kemanfaatan Inovasi: Lampirkan data dukung kuantitatif dan kualitatif peningkatan efisiensi, penghematan waktu/biaya, atau kepuasan penerima manfaat.
- Tautan Video Inovasi: Masukkan tautan video YouTube resmi dengan durasi maksimal 3-5 menit yang memvisualisasikan latar belakang, proses, dan hasil nyata inovasi.
- Dokumen Pendukung Lainnya: Sertakan foto dokumentasi penerapan, sertifikat HAKI, piagam penghargaan, atau testimoni masyarakat.

> [!TIP]
> Ukuran Berkas: Pastikan setiap dokumen PDF berukuran maksimal 5 MB dan teks dapat terbaca jelas agar mempermudah proses validasi.

### Bab 10: Mengajukan Inovasi ke Pendamping & Memantau Catatan

Setelah seluruh data profil dan bukti dukung terunggah secara lengkap, Inovator dapat mengajukan usulan ke tahap verifikasi:

1. Periksa kembali kelengkapan formulir pada tab Ringkasan Dokumen.
2. Pastikan indikator kepatuhan menunjukkan status lengkap (warna hijau).
3. Klik tombol 'Ajukan Validasi ke Pendamping'. Status inovasi akan berubah dari 'draft' menjadi 'diajukan'.
4. Inovasi kini masuk ke antrean tugas Pendamping Inovasi dan form terkunci sementara dari penyuntingan langsung.
5. Apabila Pendamping menerbitkan catatan perbaikan (status 'revisi'), Anda akan menerima notifikasi. Buka lembar edit untuk melihat kotak catatan merah/oranye pada masing-masing field, perbaiki dokumen sesuai arahan, lalu klik 'Kirim Ulang Revisi'.

### Bab 11: Mencetak Lembar Profil Inovasi Daerah

![Tampilan Pratinjau Lembar Profil Inovasi Daerah Siap Cetak](file:///D:/CODE/repo-inovasi-daerah/design/09-inovasi-print.png)

*Tampilan Pratinjau Lembar Profil Inovasi Daerah Siap Cetak*

INOVA-HUB menyediakan format cetak lembar profil inovasi resmi yang terstandarisasi. Dokumen ini dapat digunakan sebagai lampiran laporan kedinasan, berkas tanda tangan pimpinan, maupun arsip fisik OPD.

1. Pada tabel Kelola Inovasi, klik tombol menu aksi pada inovasi yang dikehendaki, lalu pilih 'Cetak Lembar Profil'.
2. Layar pratinjau cetak akan menampilkan tata letak resmi yang mencantumkan Kop Surat Pemkab Sumbawa / INOVA-HUB, identitas lengkap inovasi, ringkasan rancang bangun, matriks 22 indikator, dan kolom legalisasi tanda tangan.
3. Gunakan pintasan keyboard 'Ctrl + P' atau klik tombol 'Cetak ke PDF / Printer'.
4. Pilih opsi 'Save as PDF' untuk menyimpan dokumen digital atau kirim langsung ke perangkat pencetak fisik.

### Bab 12: Pusat Panduan Regulasi & Notifikasi Aplikasi

![Halaman Pusat Panduan dan Regulasi Resmi](file:///D:/CODE/repo-inovasi-daerah/design/10-panduan-index.png)

*Halaman Pusat Panduan dan Regulasi Resmi*

![Pusat Notifikasi dan Pemberitahuan Terpadu](file:///D:/CODE/repo-inovasi-daerah/design/11-notifikasi-index.png)

*Pusat Notifikasi dan Pemberitahuan Terpadu*

Sistem INOVA-HUB dilengkapi pusat informasi terpadu untuk memastikan seluruh inovator memiliki pemahaman yang selaras dengan kebijakan nasional:

- Pusat Panduan (Knowledge Base): Berisi kumpulan dokumen regulasi resmi yang dapat diunduh langsung, meliputi Pedoman Umum IGA Kemendagri 2026, Petunjuk Teknis Pengisian Indikator SPD/SID, Format Baku Surat Pernyataan Kepala OPD, serta Tanya Jawab (FAQ).
- Pusat Notifikasi: Mencatat seluruh peristiwa penting terkait akun Anda, seperti pengajuan berhasil diterima, catatan koreksi dari pendamping, inovasi resmi disahkan, serta peringatan mendekati tenggat waktu pengisian.


## BAGIAN III: PANDUAN PERAN PENDAMPING & VERIFIKATOR OPD

### Bab 13: Dashboard Pendampingan & Monitoring Antrean

![Dashboard Pendamping Inovasi dan Verifikator OPD](file:///D:/CODE/repo-inovasi-daerah/design/15-pendamping-dashboard.png)

*Dashboard Pendamping Inovasi dan Verifikator OPD*

Peran Pendamping Inovasi menggabungkan fungsi pembinaan teknis dan fungsi Verifikator Perangkat Daerah. Dashboard Pendamping dirancang khusus untuk memonitor progres seluruh OPD binaan yang ditugaskan kepada Anda.

Fitur utama pada Dashboard Pendamping:

- Kartu Beban Kerja: Jumlah total inovasi binaan, inovasi yang menunggu verifikasi (antrean aktif), inovasi dalam status revisi, dan inovasi yang telah disahkan.
- Daftar Antrean Verifikasi Cepat: Menampilkan inovasi yang baru diajukan oleh inovator lengkap dengan waktu pengajuan.
- Progres Kepatuhan OPD Binaan: Tabel sebaran partisipasi inovasi pada masing-masing dinas/badan di bawah binaan pendamping terkait.

### Bab 14: Meninjau Daftar Inovasi Binaan

![Daftar Inovasi Binaan Siap Verifikasi](file:///D:/CODE/repo-inovasi-daerah/design/16-pendamping-inovasi-index.png)

*Daftar Inovasi Binaan Siap Verifikasi*

Pada menu 'Inovasi Binaan', Pendamping dapat melihat seluruh usulan inovasi yang masuk dari OPD binaannya.

1. Gunakan tab filter status 'Diajukan' untuk memprioritaskan inovasi yang siap ditinjau.
2. Periksa kolom 'OPD Pengusul', 'Tahapan', dan 'Estimasi Kematangan Awal'.
3. Klik tombol 'Mulai Verifikasi' pada baris inovasi yang dituju untuk membuka lembar kerja telaah.

### Bab 15: Melakukan Verifikasi Indikator & Catatan Revisi Per-Field

![Lembar Kerja Validasi Berkas dan Checklist Indikator](file:///D:/CODE/repo-inovasi-daerah/design/17-pendamping-validasi-show.png)

*Lembar Kerja Validasi Berkas dan Checklist Indikator*

Lembar verifikasi menyajikan perbandingan antara data yang diisi inovator, berkas yang diunggah, dan kriteria pemenuhan parameter indikator kematangan.

1. Periksa Rancang Bangun: Pastikan narasi komprehensif, logis, dan memenuhi batas minimal 300 kata.
2. Audit Berkas Indikator: Unduh atau buka pratinjau dokumen dukung (SK, SOP, Anggaran, Video) untuk memverifikasi keabsahan tanggal terbit, stempel/tanda tangan basah atau elektronik, dan kesesuaian konten.
3. Checklist Indikator: Berikan tanda centang validasi pada indikator yang telah memenuhi kriteria.
4. Tindakan REVISI: Jika ditemukan berkas yang buram, SK kedaluwarsa, atau narasi tidak sesuai, pilih opsi 'Perlu Revisi'. WAJIB menuliskan catatan detail pada kotak komentar indikator terkait agar inovator mengetahui secara spesifik apa yang harus diperbaiki.
5. Tindakan DISETUJUI: Jika seluruh 22 indikator dan narasi telah terverifikasi dengan baik, pilih opsi 'Setujui Inovasi'. Status inovasi akan berpindah menjadi 'disetujui'.

> [!IMPORTANT]
> Kewajiban Catatan: Sistem secara otomatis memvalidasi bahwa tindakan 'Revisi' tidak dapat disimpan apabila kolom catatan perbaikan kosong.

### Bab 16: Memberikan Pengesahan Kepala OPD (Status Disahkan OPD)

Setelah inovasi berstatus 'disetujui' oleh pendamping, tahap berikutnya adalah legalisasi pimpinan instansi:

1. Verifikator OPD meninjau lembar inovasi yang telah disetujui.
2. Pastikan Surat Pernyataan Kepala OPD / Pakta Integritas telah diunggah dan ditandatangani oleh Kepala Dinas/Badan/Camat terkait.
3. Klik tombol 'Sahkan Inovasi (Disahkan OPD)'.
4. Status inovasi akan berubah menjadi 'disahkan_opd'. Inovasi kini resmi mewakili OPD dan diteruskan ke Tim Penilai Internal Bappeda.


## BAGIAN IV: PANDUAN PERAN TIM PENILAI & ADMIN Bappeda

### Bab 17: Dashboard Penilaian & Rekapitulasi Kabupaten

![Dashboard Tim Penilai Internal dan Rekapitulasi IID Kabupaten](file:///D:/CODE/repo-inovasi-daerah/design/18-penilai-dashboard.png)

*Dashboard Tim Penilai Internal dan Rekapitulasi IID Kabupaten*

Dashboard Tim Penilai menyajikan data analitik makro tingkat kabupaten Sumbawa yang mencerminkan kesiapan daerah menghadapi penilaian IGA nasional:

- Indeks Inovasi Daerah (IID) Sementara: Skor akumulasi kabupaten yang dihitung secara dinamis dari formula IGA Kemendagri.
- Komposisi SPD (Satuan Pemerintah Daerah) & SID (Satuan Inovasi Daerah): Visualisasi capaian skor tata kelola pemda dan rata-rata kematangan seluruh inovasi.
- Monitoring Sebaran 6 Urusan Wajib Pelayanan Dasar: Peta keterisian inovasi pada sektor Pendidikan, Kesehatan, PU, Perkim, Trantibumlinmas, dan Sosial.
- Status Pipeling Inovasi: Diagram batang alur inovasi dari draft hingga siap kirim.

### Bab 18: Manajemen Penugasan Pendamping per OPD

![Modul Manajemen Penugasan Pendampingan per OPD](file:///D:/CODE/repo-inovasi-daerah/design/21-penugasan-index.png)

*Modul Manajemen Penugasan Pendampingan per OPD*

Admin Bappeda memiliki wewenang untuk mendistribusikan beban pembinaan perangkat daerah kepada personil pendamping:

1. Akses menu 'Manajemen Penugasan' pada sidebar navigasi.
2. Tinjau tabel pemetaan: Kolom memuat Nama OPD, Jumlah Inovasi Aktif, Nama Pendamping Utama, dan Status Penugasan.
3. Untuk menugaskan atau mengubah pendamping, klik tombol 'Ubah Penugasan' pada OPD yang dipilih.
4. Pilih nama personil Pendamping Inovasi dari daftar dropdown.
5. Klik 'Simpan Penugasan'. Pendamping yang ditugaskan akan langsung menerima notifikasi dan hak akses verifikasi terhadap inovasi OPD tersebut.

### Bab 19: Penilaian Skoring Internal (SPD & SID)

![Daftar Inovasi Menunggu Skoring Internal](file:///D:/CODE/repo-inovasi-daerah/design/22-penilai-skoring-index.png)

*Daftar Inovasi Menunggu Skoring Internal*

![Lembar Kerja Skoring Parameter Kematangan Inovasi](file:///D:/CODE/repo-inovasi-daerah/design/23-penilai-skoring-show.png)

*Lembar Kerja Skoring Parameter Kematangan Inovasi*

Tim Penilai Internal bertugas melakukan audit skoring objektif terhadap inovasi yang telah berstatus 'disahkan_opd'.

1. Buka menu 'Skoring Inovasi', pilih inovasi yang berstatus 'Perlu Penilaian'.
2. Pada lembar skoring, sistem menampilkan ke-20+ indikator kematangan dengan opsi parameter berbobot (Parameter 1, Parameter 2, Parameter 3).
3. Bandingkan kesesuaian dokumen bukti dukung dengan definisi operasional masing-masing parameter.
4. Pilih tier parameter yang tepat. Nilai angka kematangan akan terkalkulasi secara otomatis secara langsung (real-time).
5. Tuliskan catatan pertimbangan penilai jika ada penyesuaian tier parameter.
6. Klik tombol 'Finalkan Skor Inovasi'. Inovasi berpindah ke status 'review_internal' atau 'siap_kirim'.

### Bab 20: Simulasi What-If Indeks Inovasi Daerah (IID)

![Kalkulator Simulasi What-If Skor IID Kabupaten Sumbawa](file:///D:/CODE/repo-inovasi-daerah/design/19-simulasi-index.png)

*Kalkulator Simulasi What-If Skor IID Kabupaten Sumbawa*

Fitur unggulan INOVA-HUB adalah Simulator What-If. Modul ini memungkinkan Bappeda menguji berbagai skenario strategis guna memaksimalkan skor Indeks Inovasi Daerah sebelum data dikunci dan diserahkan ke Kemendagri.

Cara kerja dan langkah simulasi:

1. Buka menu 'Simulasi What-If'. Sistem akan memuat seluruh daftar inovasi berstatus disahkan.
2. Gunakan tombol sakelar (toggle switch 'Ikutkan dalam Penilaian') di samping setiap inovasi.
3. Sistem secara otomatis menghitung ulang formula IID secara instan: IID = Bobot SPD x Skor SPD + Bobot SID x Rata-rata Skor Kematangan Inovasi yang Diikutsertakan.
4. Perhatikan perubahan angka Proyeksi Skor IID dan Predikat Kabupaten (Sangat Inovatif / Inovatif / Kurang Inovatif).
5. Identifikasi apakah ada inovasi dengan skor rendah yang menurunkan rata-rata kematangan daerah, sehingga dapat diprioritaskan untuk asistensi perbaikan dokumen atau dievaluasi keikutsertaannya.

### Bab 21: Pengelolaan Master Indikator, Parameter & Periode Lomba

![Pengelolaan Master Data Indikator & Bobot Penilaian](file:///D:/CODE/repo-inovasi-daerah/design/24-penilai-indikator-index.png)

*Pengelolaan Master Data Indikator & Bobot Penilaian*

![Pengelolaan Periode Lomba & Linimasa IGA](file:///D:/CODE/repo-inovasi-daerah/design/25-penilai-periode-index.png)

*Pengelolaan Periode Lomba & Linimasa IGA*

Untuk memastikan sistem selalu adaptif terhadap perubahan regulasi pusat tanpa perlu mengubah kode sumber aplikasi, Admin Bappeda dapat mengelola master data secara mandiri:

- Master Indikator & Bobot (SPD/SID): Kelola nama indikator, definisi operasional, persentase bobot penilaian, dan opsi pilihan parameter nilai (P1, P2, P3). Konfigurasi ini dapat disesuaikan sewaktu-waktu sesuai edaran juknis terbaru Kemendagri.
- Master Periode Lomba: Buka periode lomba tahunan baru (misalnya IGA 2026), atur tanggal pembukaan input, tenggat pengajuan inovator, batas akhir verifikasi pendamping, dan tanggal cut-off ekspor.
- Arsip Otomatis: Inovasi pada periode lomba sebelumnya akan otomatis beralih menjadi arsip (read-only), namun inovator dapat menggunakan fitur 'Ajukan Kembali' pada periode aktif baru dengan menyertakan penjelasan progres pengembangan.

### Bab 22: Ekspor & Sinkronisasi Data ke BSKDN Kemendagri

![Modul Rekapitulasi & Ekspor Data ke Sistem Resmi Kemendagri](file:///D:/CODE/repo-inovasi-daerah/design/20-ekspor-index.png)

*Modul Rekapitulasi & Ekspor Data ke Sistem Resmi Kemendagri*

Setelah seluruh rangkaian verifikasi, skoring internal, dan seleksi simulasi selesai, data inovasi yang berstatus 'siap_kirim' dapat diekspor ke sistem pusat Kemendagri (indeks.inovasi.bskdn.kemendagri.go.id).

1. Akses menu 'Ekspor Data Pusat'.
2. Lakukan 'Pengecekan Pra-Ekspor': Sistem akan memverifikasi apakah ada field wajib yang belum terisi, apakah 6 Urusan Wajib Pelayanan Dasar telah terwakili, dan apakah seluruh berkas tautan aktif.
3. Pilih format ekspor yang dibutuhkan (Format Excel Rekapitulasi Resmi, Paket Berkas ZIP Terkompresi, atau Skema JSON/API Kemendagri).
4. Klik tombol 'Generate Berkas Ekspor'.
5. Unduh berkas hasil ekspor dan lakukan unggah ke portal resmi Kemendagri atau jalankan integrasi sinkronisasi data.
6. Setelah terkonfirmasi masuk ke sistem pusat, tandai status inovasi menjadi 'terkirim' (Sent to Ministry).


## BAGIAN V: PANDUAN PERAN PIMPINAN DAERAH

### Bab 23: Dashboard Eksekutif & Pemantauan Kepatuhan Urusan Wajib

![Dashboard Eksekutif Pimpinan Daerah (Monitoring Real-Time)](file:///D:/CODE/repo-inovasi-daerah/design/26-pimpinan-dashboard.png)

*Dashboard Eksekutif Pimpinan Daerah (Monitoring Real-Time)*

Dashboard Eksekutif Pimpinan dirancang khusus dengan antarmuka yang bersih, intuitif, dan informatif (read-only) untuk Bupati, Sekretaris Daerah, dan Kepala Bappeda.

Informasi strategis yang disajikan pada dashboard ini meliputi:

- Ringkasan Indeks Inovasi Daerah (IID) Terkini: Estimasi skor akhir kabupaten beserta status predikat (misal: 'Terinovatif').
- Peta Pemenuhan 6 Urusan Wajib Pelayanan Dasar: Indikator visual hijau/merah yang menunjukkan apakah inovasi di bidang Pendidikan, Kesehatan, Pekerjaan Umum, Perumahan Rakyat, Trantibumlinmas, dan Sosial telah terpenuhi secara merata.
- Tingkat Partisipasi Perangkat Daerah: Rasio keaktifan OPD di lingkungan Pemkab Sumbawa dalam mengajukan inovasi.
- Distribusi Kategori Inovasi: Diagram proporsi Inovasi Pelayanan Publik, Tata Kelola Pemerintahan, dan Bentuk Inovasi Lainnya.
- Daftar Inovasi Unggulan Daerah: Tabel 10 inovasi dengan skor kematangan tertinggi yang diproyeksikan menjadi andalan Kabupaten Sumbawa di ajang nasional.

> [!TIP]
> Akses Pimpinan: Akun pimpinan memiliki hak akses monitoring menyeluruh tanpa risiko salah klik penyuntingan data karena mode antarmuka bersifat baca saja (read-only).
