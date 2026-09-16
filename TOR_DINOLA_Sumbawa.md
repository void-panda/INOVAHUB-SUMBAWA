**TERM OF REFERENCE (TOR)**

**RANCANGAN APLIKASI INOVA-HUB KABUPATEN SUMBAWA**

*Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa*

# **INOVA-HUB**

*Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa*

**Kabupaten Sumbawa | Bappeda**

**Disusun Oleh:**  
**Arya Ningsih, S.P., M.Agribus., Ph.D**  
*Kepala Bidang Riset dan Inovasi Daerah (Bappeda Kabupaten Sumbawa)*

Disusun untuk mendukung kesiapan Kabupaten Sumbawa dalam Penilaian Indeks Inovasi Daerah dan Innovative Government Award (IGA) 2026

# **1. Pendahuluan**

## **1.1 Latar Belakang**

Kementerian Dalam Negeri melalui Badan Strategi Kebijakan Dalam Negeri (BSKDN) menyelenggarakan Penilaian Indeks Inovasi Daerah dan pemberian penghargaan Innovative Government Award (IGA) setiap tahun, dengan periode pengisian data melalui laman indeks.inovasi.bskdn.kemendagri.go.id pada Juni–Agustus. Proses pengisian data yang selama ini berjalan di Kabupaten Sumbawa mengandalkan input langsung oleh masing-masing inovator (OPD/individu) tanpa mekanisme pemeriksaan mutu data secara berjenjang di tingkat kabupaten sebelum data tersebut disampaikan ke sistem resmi.

Kondisi ini berisiko menghasilkan data yang tidak lengkap, kurang sesuai dengan format pedoman, atau lemah dari sisi dokumen dukung, sehingga berpotensi menurunkan skor akhir Indeks Inovasi Daerah (IID) kabupaten. Diperlukan sebuah aplikasi internal milik Kabupaten Sumbawa yang dapat menjembatani proses input data oleh inovator dengan proses pembinaan mutu terintegrasi sebelum data tersebut dianggap siap untuk disalin/diinput ke sistem resmi Kemendagri. Aplikasi ini dinamakan sebagai **INOVA-HUB** — Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa.

## **1.2 Maksud dan Tujuan**

1. Menyediakan sistem pencatatan dan pengelolaan data inovasi daerah tingkat Kabupaten Sumbawa yang terintegrasi dan dapat diakses oleh seluruh OPD.
2. Menghadirkan mekanisme pendampingan dan validasi berjenjang melalui peran Pendamping Inovasi sebelum data dinyatakan siap kirim.
3. Menyediakan simulasi perhitungan skor SPD, SID, dan Indeks Inovasi Daerah (IID) secara otomatis dan real-time, mengacu pada bobot dan parameter resmi Pedoman Umum IGA.
4. Mendeteksi secara dini kekurangan data, seperti urusan wajib pelayanan dasar yang belum terwakili, sebelum periode pengisian resmi berakhir.
5. Menghasilkan laporan-laporan pendukung pengambilan keputusan bagi Bappeda dan pimpinan daerah.

## **1.3 Ruang Lingkup**

TOR ini mencakup rancangan fungsional dan teknis aplikasi, meliputi: metode pengembangan, aktor dan alur proses aplikasi, struktur data, metode perhitungan bobot/skor, modul pelaporan, kebutuhan non-fungsional, tahapan pengembangan, serta kebutuhan tim pelaksana. TOR ini tidak mencakup rincian anggaran dan kontrak pengadaan, yang akan disusun terpisah setelah rancangan ini disepakati.

## **1.4 Dasar Acuan**

* Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah.
* Peraturan Pemerintah Nomor 38 Tahun 2017 tentang Inovasi Daerah.
* Peraturan Menteri Dalam Negeri Nomor 104 Tahun 2018 tentang Penilaian dan Pemberian Penghargaan dan/atau Insentif Inovasi Daerah.
* Pedoman Umum Penilaian Inovasi Daerah dan Pemberian Penghargaan Innovative Government Award (IGA) Tahun 2026 (Surat Kepala BSKDN Nomor 400.10.11/1887/BSKDN tanggal 29 April 2026).

# **2. Perbedaan dengan Aplikasi IID Eksisting**

Perbedaan utama aplikasi yang diusulkan dengan aplikasi resmi milik Kemendagri terletak pada penambahan peran Pendamping Inovasi yang bertugas melakukan validasi terhadap data yang diinput oleh inovator sebelum data dianggap final. Ringkasan perbedaan disajikan pada tabel berikut.

| **Aspek** | **Aplikasi IID Eksisting (BSKDN)** | **INOVA-HUB — Pembinaan Inovasi Daerah Kab. Sumbawa (Usulan)** |
| --- | --- | --- |
| **Aktor utama** | Inovator, Verifikator Pusat, Tim Penilai | **Inovator, Pendamping Inovasi, Verifikator OPD, Tim Penilai Internal, Admin Bappeda** |
| **Tahap validasi data** | Langsung ke verifikasi pusat (Kemendagri) setelah input | **Ada tahap validasi berjenjang oleh Pendamping Inovasi sebelum data disetujui untuk dikirim** |
| **Status data** | Draft → Terkirim | **Draft → Menunggu Validasi Pendamping → Revisi/Disetujui → Siap Kirim → Terkirim** |
| **Kualitas data sebelum submit** | Bergantung sepenuhnya pada ketelitian inovator | **Terjaga lebih baik karena ada quality gate dari pendamping sebelum tahap akhir** |
| **Notifikasi & pendampingan** | Tidak ada | **Ada notifikasi otomatis ke pendamping saat ada input baru & ke inovator saat ada revisi** |
| **Dashboard monitoring** | Rekap skor per pemda | **Rekap skor + status pendampingan + progres validasi per OPD/kecamatan** |

Dengan mekanisme ini, aplikasi Kabupaten Sumbawa berfungsi sebagai lapisan mutu (quality assurance layer) sebelum data diinput ke sistem resmi Kemendagri, sehingga diharapkan dapat meningkatkan akurasi dan kelengkapan data yang akhirnya berdampak pada skor Indeks Inovasi Daerah yang lebih baik dan lebih siap saat tahap Validasi Lapangan.

# **3. Aktor dan Peran Pengguna**

| **Aktor** | **Deskripsi** | **Hak Akses & Tugas Utama** |
| --- | --- | --- |
| **Inovator** | OPD / individu pengusul inovasi | Membuat akun, mengisi profil inovasi, mengunggah dokumen dukung, merevisi data sesuai catatan Pendamping Inovasi |
| **Pendamping Inovasi** | Ditunjuk oleh Bappeda (bisa staf Bappeda, akademisi mitra, atau Fasilitator Inovasi) | Meninjau kelengkapan & kesesuaian data inovasi, memberi catatan revisi, menyetujui/menolak data sebelum diteruskan, memantau progres binaan |
| **Verifikator OPD** | Kepala Perangkat Daerah / yang ditunjuk | Melakukan pengesahan akhir tingkat OPD sebelum data diteruskan ke Bappeda |
| **Tim Penilai Internal** | Tim lintas OPD/akademisi yang ditunjuk Bupati | Melakukan penilaian skor SPD & SID secara internal sebagai simulasi sebelum pengiriman resmi ke Kemendagri |
| **Admin Bappeda** | Bappeda Kabupaten Sumbawa | Mengelola master data, indikator, bobot, pengguna, serta memantau progres keseluruhan daerah dan mengekspor data ke sistem pusat |
| **Pimpinan Daerah (Read-only)** | Bupati/Wakil Bupati/Sekda | Melihat dashboard ringkasan progres dan skor secara real-time tanpa hak edit |

# **4. Development Methodology**

## **4.1 Pendekatan Pengembangan**

Pengembangan aplikasi disarankan menggunakan pendekatan Agile — Scrum, dengan siklus sprint 2–3 minggu, mengingat kebutuhan fitur pendampingan yang relatif baru dan berpotensi membutuhkan penyesuaian berdasarkan masukan pengguna (Bappeda, Pendamping Inovasi, dan OPD) selama proses pengembangan berjalan.

## **4.2 Rekomendasi Tumpukan Teknologi (Tech Stack)**

* Backend: Laravel (PHP) — selaras dengan keahlian tim PT. Mitra Laksana Nawasena (PT. MLN), memudahkan pengembangan RESTful API, autentikasi, dan manajemen basis data melalui Eloquent ORM.
* Frontend: Laravel Blade dengan Livewire, atau alternatif Vue.js/React bila dibutuhkan interaktivitas tingkat lanjut pada dashboard dan form multi-tahap.
* Basis Data: MySQL/MariaDB — kompatibel dengan hosting pemerintah daerah yang umum tersedia.
* Autentikasi & Otorisasi: Laravel Breeze/Sanctum untuk autentikasi, dikombinasikan dengan paket RBAC (mis. spatie/laravel-permission) untuk manajemen peran granular.
* Notifikasi: Laravel Notification (email), integrasi WhatsApp Gateway (opsional) untuk pengingat tenggat waktu.
* Penyimpanan Dokumen: Local storage atau object storage (mis. MinIO/S3-compatible) untuk berkas dokumen dukung (PDF/JPG).
* Ekspor Laporan: Library PDF (mis. DomPDF/Snappy) dan Excel (mis. Laravel Excel) untuk kebutuhan pelaporan cetak.

## **4.3 Prinsip Perancangan**

* Mobile-responsive — dapat diakses oleh inovator dari perangkat seluler mengingat sebagian inisiator berasal dari sekolah, puskesmas, dan desa dengan akses laptop terbatas.
* Modular — setiap modul (pendampingan, skoring, pelaporan) dibangun terpisah agar mudah dikembangkan atau disesuaikan saat pedoman IGA berubah setiap tahun.
* Konfigurasi bobot tidak di-hardcode — seluruh bobot dan parameter indikator disimpan sebagai data master yang dapat diperbarui Admin tanpa mengubah kode program, mengingat pedoman dan ambang batas parameter (misalnya rentang persentase P1/P2/P3) dapat berubah setiap tahun.

# **5. Alur Aplikasi (Business Process Flow)**

Alur inti aplikasi berpusat pada perjalanan status satu data inovasi, mulai dari draft hingga siap dikirim ke sistem resmi Kemendagri. Tabel berikut menjabarkan setiap tahapan status secara berurutan.

| **No** | **Status** | **Aktor Bertanggung Jawab** | **Deskripsi Aktivitas** |
| --- | --- | --- | --- |
| 1 | **Draft** | Inovator | Inovator mengisi form profil inovasi (nama, tahapan, urusan, rancang bangun, dsb.) dan menyimpan sebagai draft. Data belum terlihat oleh Pendamping. |
| 2 | **Diajukan untuk Validasi** | Inovator | Setelah data dianggap lengkap, inovator menekan tombol “Ajukan Validasi”. Sistem mengirim notifikasi otomatis ke Pendamping Inovasi yang ditugaskan. |
| 3 | **Sedang Divalidasi** | Pendamping Inovasi | Pendamping meninjau kelengkapan data & dokumen dukung menggunakan checklist digital yang mengacu pada indikator SPD/SID. |
| 4a | **Perlu Revisi** | Pendamping → Inovator | Jika ada kekurangan, Pendamping memberi catatan per-field. Status kembali ke Inovator beserta notifikasi rincian revisi yang diminta. |
| 4b | **Divalidasi / Disetujui Pendamping** | Pendamping Inovasi | Jika data sudah sesuai, Pendamping memberi persetujuan beserta estimasi skor awal (self-scoring) menggunakan bobot indikator yang sama dengan pedoman IGA. |
| 5 | **Disahkan OPD** | Verifikator OPD | Kepala OPD mengesahkan data yang telah divalidasi Pendamping sebagai representasi resmi OPD. |
| 6 | **Direview Tim Penilai Internal** | Tim Penilai Internal | Tim penilai internal melakukan simulasi skor SPD & SID keseluruhan daerah, termasuk cek pemenuhan syarat minimal 5 dari 6 urusan wajib yandas. |
| 7 | **Siap Kirim** | Admin Bappeda | Data yang lolos tahap internal ditandai “Siap Kirim” dan dapat diekspor/disalin ke aplikasi resmi indeks.inovasi.bskdn.kemendagri.go.id. |
| 8 | **Terkirim & Termonitor** | Admin Bappeda | Status akhir dicatat sebagai arsip; sistem tetap memantau linimasa lomba (Penjaringan, Validasi Lapangan, Presentasi, Sidang, Penghargaan). |

## **5.1 Flowchart Alur Validasi Data**

Diagram berikut menggambarkan alur inti proses validasi satu data inovasi, mulai dari input oleh Inovator hingga data siap dikirim ke sistem resmi Kemendagri dan dipantau pada linimasa lomba.

![](data:image/png;base64...)

*Gambar 1. Flowchart Alur Validasi Data Inovasi*

# **6. Periode Inovasi dan Pengelolaan Arsip**

Salah satu kebutuhan khas aplikasi Kabupaten Sumbawa adalah pengelolaan data inovasi berbasis periode/tahun penilaian, mengingat siklus IGA berjalan tahunan sementara satu inovasi dapat terus dikembangkan dan diajukan kembali pada tahun-tahun berikutnya.

## **6.1 Konsep Periode dan Pengarsipan Otomatis**

1. Setiap inovasi yang diajukan tercatat terikat pada satu periode/tahun tertentu (mis. Tahun 2025).
2. Ketika sistem memasuki tahun penilaian berikutnya (mis. Tahun 2026), seluruh inovasi yang berstatus aktif pada periode sebelumnya secara otomatis dipindahkan ke menu Arsip. Data tidak dihapus, hanya berubah status kepemilikan periode menjadi “Arsip”.
3. Inovator tetap dapat login dan melihat seluruh riwayat inovasinya pada menu Arsip secara read-only (tidak dapat diedit langsung), termasuk skor, dokumen dukung, dan catatan validasi dari Pendamping Inovasi pada periode tersebut.

## **6.2 Aksi “Ajukan Kembali”**

Dari menu Arsip, Inovator dapat memilih untuk mengajukan kembali suatu inovasi sebagai inovasi pada periode/tahun berjalan yang baru, melalui aksi khusus “Ajukan Kembali”. Mekanismenya sebagai berikut:

1. Sistem menyalin (duplicate) seluruh data profil inovasi dari versi tahun sebelumnya sebagai draf baru pada tahun berjalan, sehingga Inovator tidak perlu mengisi ulang dari awal.
2. Pada form profil inovasi versi baru, ditambahkan satu kolom wajib khusus: “Penjelasan Pengembangan dari Versi Sebelumnya” — Inovator wajib menjelaskan pembaharuan, perluasan, atau perbaikan apa yang dilakukan dibanding versi tahun lalu. Kolom ini sejalan dengan ketentuan Pedoman Umum IGA bahwa inovasi yang telah berumur lebih dari 2 tahun harus menunjukkan bukti pembaharuan/pengembangan agar tetap dapat dinilai.
3. Sistem menautkan (link) inovasi versi baru dengan inovasi versi sebelumnya melalui tabel penaut riwayat versi, sehingga terbentuk rantai riwayat (mis. Inovasi X Tahun 2025 → Inovasi X Tahun 2026 → dst.) yang dapat ditelusuri kapan saja.
4. Draf baru hasil pengajuan kembali ini masuk ke alur validasi standar (Diagram 1) sebagaimana inovasi baru pada umumnya — tetap melalui tahap peninjauan Pendamping Inovasi, pengesahan OPD, dan review Tim Penilai Internal.

## **6.3 Ketentuan Penting: Data Historis Tidak Hilang**

Data dan skor indikator pada periode sebelumnya (mis. Tahun 2025) tetap tersimpan utuh di Arsip dan tidak tertimpa (overwrite) oleh data pengajuan baru. Dengan demikian, sistem selalu dapat menampilkan riwayat lengkap perkembangan satu inovasi dari tahun ke tahun, termasuk skor yang pernah diperoleh, dokumen yang pernah diunggah, dan catatan pendampingan pada tiap periode — sangat berguna sebagai bahan pembanding saat proses Validasi Lapangan maupun evaluasi internal Bappeda.

## **6.4 Flowchart Alur Periode Inovasi dan Arsip**

Diagram berikut menggambarkan alur pengarsipan otomatis tahunan serta mekanisme pengajuan kembali (“Ajukan Kembali”) dari menu Arsip.

![](data:image/png;base64...)

*Gambar 2. Flowchart Alur Periode Inovasi dan Pengelolaan Arsip*

# **7. Struktur Basis Data (Garis Besar Entitas)**

Berikut rancangan entitas utama pada basis data, termasuk entitas tambahan untuk mendukung fitur periode dan riwayat versi inovasi (lihat baris periode\_lomba dan inovasi\_versi). Rancangan ini bersifat garis besar dan akan dijabarkan lebih rinci (ERD lengkap dengan tipe data dan relasi) pada tahap Perancangan (Fase 1).

| **Entitas (Tabel)** | **Keterangan** |
| --- | --- |
| **users** | Menyimpan akun seluruh aktor (id, nama, email, role, opd\_id, status\_aktif). |
| **roles & permissions** | Definisi peran dan hak akses granular per modul (mengacu pola RBAC). |
| **opd** | Master data Perangkat Daerah (nama, kode urusan, kontak). |
| **inovasi** | Data inti profil inovasi (22 field sesuai Proposal Inovasi Daerah, foreign key ke opd, inisiator, status). |
| **inovasi\_dokumen** | Berkas pendukung yang diunggah (anggaran, profil bisnis, HAKI, penghargaan, video, dsb.), terhubung ke inovasi. |
| **indikator\_spd / indikator\_sid** | Master 15 indikator SPD dan 20+1 indikator SID beserta bobot dan parameter ambang (P1/P2/P3) mengikuti Pedoman Umum IGA — dapat diperbarui admin setiap tahun mengikuti perubahan pedoman. |
| **skor\_inovasi** | Hasil skoring per inovasi per indikator SID (nilai parameter tercapai, skor, catatan validator). |
| **skor\_spd** | Hasil skoring indikator SPD tingkat kabupaten (diisi/divalidasi Admin Bappeda berdasar data OPD terkait). |
| **validasi\_log** | Riwayat proses validasi: siapa memvalidasi, waktu, status sebelum/sesudah, catatan revisi (audit trail). |
| **penugasan\_pendamping** | Relasi Pendamping Inovasi ↔ OPD/Inovator yang dibina, termasuk periode penugasan. |
| **notifikasi** | Log notifikasi terkirim (tipe, penerima, status baca). |
| **linimasa** | Master tahapan & tenggat waktu lomba IGA tahun berjalan. |
| **periode\_lomba** | Master periode/tahun penilaian (mis. 2025, 2026), menandai periode mana yang berstatus “Aktif” dan mana yang berstatus “Arsip”. |
| **inovasi\_versi** | Tabel penaut yang mencatat rantai riwayat versi satu inovasi antar tahun (id\_inovasi\_baru, id\_inovasi\_asal, tahun, catatan pengembangan) — memungkinkan penelusuran riwayat pengajuan ulang dari tahun ke tahun. |

# **8. Perhitungan Bobot dan Skoring**

Mesin skoring (self-scoring engine) pada aplikasi mereplikasi metode resmi pada Pedoman Umum IGA agar hasil simulasi internal mendekati hasil penilaian resmi. Formula yang digunakan sebagai berikut:

***a. Skor Indikator Satuan Pemerintahan Daerah (SPD)***

SPD = Σ (Skor Indikator ke-i), untuk i = 1 s.d. 15, dengan skor tiap indikator = Tingkat Parameter Tercapai (1, 2, atau 3) × Bobot Indikator. Skor Maksimal SPD = 63 poin (25,20% dari total).

***b. Skor Indikator Satuan Inovasi Daerah (SID)***

SID = [ Σ (Skor Indikator ke-16 s.d. 35 per inovasi) / MAX(12, n) ] + Skor Jumlah Inovasi, dengan n = jumlah inovasi yang dilaporkan. Skor Maksimal SID = 187 poin (74,80% dari total).

***c. Skor Jumlah Inovasi***

Skor Jumlah Inovasi = MIN(n, 200) × 0,38 jika urusan wajib pelayanan dasar yang dikirimkan ≥ 5 urusan; atau 0 jika kurang dari 5 urusan. Skor maksimal indikator ini = 76 poin.

***d. Indeks Inovasi Daerah (IID)***

IID = (Skor Total / Skor Total Maksimum) × 100, dengan Skor Total = SPD + SID dan Skor Total Maksimum = 250. Skala IID = 0 s.d. 100, dengan kategori: Sangat Inovatif (65,01–100,00), Inovatif (40,01–65,00), Kurang Inovatif (0,01–40,00), dan Tidak Dapat Dinilai (0).

## **7.1 Fitur Khusus Perhitungan pada Aplikasi Kabupaten Sumbawa**

* Skor dihitung otomatis dan diperbarui setiap kali Pendamping Inovasi menyetujui perubahan data — bukan hanya sekali di akhir.
* Tersedia simulasi skenario (what-if): Admin/Tim Penilai dapat mensimulasikan dampak jika suatu inovasi ditambah, dihapus, atau statusnya berubah terhadap skor total kabupaten.
* Validasi otomatis pemenuhan minimal 5 dari 6 urusan wajib pelayanan dasar, dengan indikator visual (hijau/merah) langsung pada dashboard.
* Parameter ambang batas (P1/P2/P3) untuk setiap indikator disimpan sebagai data master yang dapat diperbarui Admin Bappeda setiap tahun mengikuti perubahan Pedoman Umum IGA, tanpa memerlukan perubahan kode program.

# **9. Modul dan Fitur Aplikasi**

| **Modul** | **Deskripsi Fungsi** |
| --- | --- |
| **1. Modul Autentikasi & Manajemen Peran** | Login multi-role (Inovator, Pendamping, Verifikator OPD, Tim Penilai, Admin, Pimpinan), reset password, manajemen hak akses berbasis role (RBAC). |
| **2. Modul Profil Inovasi** | Form input mengikuti 22 item Proposal Inovasi Daerah pada pedoman IGA (nama inovasi, tahapan, inisiator, klasifikasi, koordinat, jenis, bentuk, Asta Cita, PKPN, urusan, rancang bangun, dsb.), dengan validasi minimal kata dan format unggah dokumen. |
| **3. Modul Pendampingan & Validasi** | Checklist validasi per indikator, kolom catatan revisi, riwayat percakapan/komentar antara Pendamping dan Inovator, status tracking, dan penugasan otomatis Pendamping berdasarkan OPD/wilayah. |
| **4. Modul Perhitungan Skor (Self-Scoring Engine)** | Kalkulasi otomatis Skor SPD, Skor SID, dan Skor Jumlah Inovasi menggunakan bobot & parameter yang identik dengan Pedoman Umum IGA, agar hasil simulasi mendekati skor resmi. |
| **5. Modul Cek Kepatuhan Urusan Wajib** | Deteksi otomatis pemenuhan minimal 5 dari 6 urusan wajib pelayanan dasar, dengan peringatan dini (warning) jika kurang dari 5 urusan terwakili di antara inovasi yang berstatus “Siap Kirim”. |
| **6. Modul Dashboard & Monitoring** | Dashboard ringkas per level: Inovator (progres inovasi sendiri), Pendamping (daftar binaan & antrean validasi), OPD (rekap seluruh inovasi OPD), Bappeda (rekap kabupaten), Pimpinan (ringkasan eksekutif). |
| **7. Modul Notifikasi** | Notifikasi in-app, email, dan opsional WhatsApp Gateway untuk: pengajuan validasi baru, revisi diminta, validasi disetujui, tenggat waktu mendekat, dan pengumuman linimasa lomba. |
| **8. Modul Pelaporan (Reporting)** | Lihat rincian pada Bab Pelaporan. |
| **9. Modul Arsip & Riwayat (Audit Trail)** | Rekam jejak setiap perubahan data dan status (siapa, kapan, apa yang diubah) untuk kebutuhan akuntabilitas dan penelusuran saat verifikasi lapangan. |
| **10. Modul Linimasa & Pengingat** | Kalender tahapan lomba (Penyempurnaan Indikator, Penjaringan Data, Pengukuran Indeks, Presentasi Kepala Daerah, Validasi Lapangan, Sidang Tim Penilai, Penghargaan IGA) dengan pengingat otomatis mendekati tenggat. |

# **10. Modul Pelaporan**

Modul pelaporan dirancang untuk melayani kebutuhan informasi setiap level pengguna, dari Inovator hingga Pimpinan Daerah, dengan format ekspor PDF, Excel, dan tampilan dashboard interaktif.

| **Jenis Laporan** | **Pengguna Sasaran** | **Isi & Kegunaan** |
| --- | --- | --- |
| **Laporan Rekap Skor Kabupaten** | Bappeda, Pimpinan Daerah | Total estimasi Skor SPD, SID, dan IID kabupaten secara keseluruhan, dengan grafik tren antar periode pengisian. |
| **Laporan Status Pendampingan** | Bappeda, Pendamping Inovasi | Jumlah inovasi per status (Draft, Diajukan, Direvisi, Disetujui, Siap Kirim) per OPD/Pendamping, termasuk rata-rata waktu proses validasi (turnaround time). |
| **Laporan Kepatuhan Urusan Wajib** | Bappeda, Tim Penilai | Status pemenuhan 6 urusan wajib pelayanan dasar beserta daftar inovasi yang mewakili masing-masing urusan, dan peringatan bila ada urusan kosong. |
| **Laporan Kinerja Pendamping** | Bappeda | Jumlah inovasi yang ditangani, rata-rata waktu validasi, dan tingkat revisi per Pendamping — untuk evaluasi kinerja pendampingan. |
| **Laporan Per Inovasi (Detail)** | Semua aktor terkait | Cetak/ekspor profil lengkap satu inovasi beserta riwayat validasi dan skor akhir — dapat digunakan sebagai lampiran dokumen resmi (mendukung ekspor PDF/DOCX). |
| **Laporan Kesiapan Pengiriman** | Admin Bappeda | Checklist akhir sebelum data disalin ke sistem resmi Kemendagri: kelengkapan dokumen wajib, minimal 12 inovasi untuk skor optimal, dan status “Siap Kirim” seluruh data. |
| **Dashboard Eksekutif (Real-time)** | Bupati/Wakil Bupati/Sekda | Ringkasan visual (kartu angka & grafik) tanpa perlu login teknis — progres keseluruhan dalam satu layar. |

## **9.1 Format Ekspor**

* PDF — untuk laporan resmi yang akan dilampirkan pada dokumen usulan atau bahan presentasi Kepala Daerah.
* Excel (XLSX) — untuk kebutuhan olah data lanjutan oleh Bappeda atau Tim Penilai Internal.
* Dashboard Web (real-time) — untuk pemantauan harian tanpa perlu mengunduh berkas.

# **11. Kebutuhan Non-Fungsional**

* Keamanan: enkripsi password, proteksi CSRF/XSS, log akses, dan backup basis data harian otomatis.
* Skalabilitas: mampu menangani seluruh OPD Kabupaten Sumbawa (±50+ perangkat daerah/unit) dengan pengguna simultan hingga ratusan akun tanpa penurunan performa berarti.
* Ketersediaan: target uptime 99% selama periode kritis (Juni–Agustus, masa Penjaringan Data).
* Kompatibilitas: dapat diakses melalui browser desktop maupun perangkat seluler (responsive design).
* Auditabilitas: seluruh perubahan data dan status tercatat dalam audit trail yang tidak dapat dihapus oleh pengguna biasa.
* Kemudahan pemeliharaan: bobot, indikator, dan parameter tahun berjalan dapat diperbarui melalui panel admin tanpa memerlukan deployment ulang aplikasi.

# **12. Tahapan dan Perkiraan Waktu Pengembangan**

| **Fase** | **Nama Tahapan** | **Aktivitas Utama** | **Estimasi Waktu** |
| --- | --- | --- | --- |
| **Fase 0** | **Perencanaan & Analisis Kebutuhan** | Finalisasi TOR, wawancara pengguna (Bappeda, calon Pendamping, sampel Inovator), penyusunan dokumen SRS/user story | 2 minggu |
| **Fase 1** | **Perancangan (Design)** | Desain arsitektur sistem, ERD basis data, wireframe/UI mockup, penetapan bobot & parameter indikator di sistem | 2–3 minggu |
| **Fase 2** | **Pengembangan Sprint 1** | Modul Autentikasi, Manajemen Peran, Profil Inovasi (CRUD dasar) | 3 minggu |
| **Fase 3** | **Pengembangan Sprint 2** | Modul Pendampingan & Validasi, Notifikasi, Alur status berjenjang | 3 minggu |
| **Fase 4** | **Pengembangan Sprint 3** | Modul Self-Scoring Engine (SPD & SID), Cek Kepatuhan Urusan Wajib | 3 minggu |
| **Fase 5** | **Pengembangan Sprint 4** | Modul Dashboard, Pelaporan, Ekspor PDF/DOCX/Excel, Linimasa | 2–3 minggu |
| **Fase 6** | **Pengujian (Testing)** | Unit testing, User Acceptance Test (UAT) bersama Bappeda & sampel OPD, perbaikan bug | 2 minggu |
| **Fase 7** | **Pelatihan & Sosialisasi** | Bimtek untuk Admin, Pendamping Inovasi, dan Inovator/OPD; penyusunan buku panduan pengguna | 1–2 minggu |
| **Fase 8** | **Peluncuran & Pendampingan Awal (Go-Live)** | Rilis produksi, pendampingan intensif selama periode Penjaringan Data (Juni–Agustus) | Berkelanjutan |

Total estimasi waktu pengembangan hingga siap Go-Live: ±18–22 minggu (±4,5–5,5 bulan), tidak termasuk masa pendampingan berkelanjutan. Direkomendasikan pengembangan dimulai paling lambat Januari agar aplikasi siap digunakan sebelum periode Penjaringan Data (Juni) pada siklus IGA tahun berjalan.

# **13. Kebutuhan Tim Pelaksana**

| **Peran** | **Jumlah** | **Tanggung Jawab** |
| --- | --- | --- |
| **Project Manager** | 1 orang | Mengoordinasikan tim, jadwal, komunikasi dengan Bappeda sebagai pemilik produk (product owner). |
| **Business Analyst / Peneliti Kebijakan** | 1 orang | Memetakan proses bisnis pendampingan, memastikan bobot & indikator sesuai Pedoman Umum IGA terbaru setiap tahun. |
| **UI/UX Designer** | 1 orang | Merancang alur antarmuka yang sederhana untuk pengguna non-teknis (inovator dari berbagai OPD, termasuk sekolah/puskesmas). |
| **Backend Developer (Laravel)** | 1–2 orang | Mengembangkan API, logika skoring, RBAC, dan integrasi basis data — sesuai keahlian tim PT. MLN pada Laravel. |
| **Frontend Developer** | 1–2 orang | Mengembangkan antarmuka pengguna (disarankan Laravel Blade/Livewire atau Vue.js agar konsisten dengan ekosistem Laravel). |
| **QA / Tester** | 1 orang | Pengujian fungsional, regresi, dan UAT bersama pengguna akhir. |
| **Admin Sistem / DevOps (paruh waktu)** | 1 orang | Pengelolaan server, backup berkala, keamanan, dan deployment berkelanjutan (CI/CD sederhana). |

# **14. Penutup**

TOR ini disusun sebagai acuan awal rancangan INOVA-HUB (Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa) — Aplikasi Indeks Inovasi Daerah Kabupaten Sumbawa. Rincian teknis lebih lanjut — seperti Entity Relationship Diagram (ERD) lengkap, wireframe antarmuka, dan spesifikasi kebutuhan perangkat lunak (SRS) — akan disusun pada tahap Perancangan (Fase 1) setelah TOR ini disepakati oleh pemangku kepentingan, khususnya Bappeda Kabupaten Sumbawa selaku pemilik proses bisnis (business process owner).

Dokumen ini bersifat living document dan dapat disesuaikan mengikuti perubahan Pedoman Umum Penilaian Inovasi Daerah yang diterbitkan oleh Kementerian Dalam Negeri setiap tahunnya.