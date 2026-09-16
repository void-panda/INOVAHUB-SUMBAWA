"""
Build Script for DINOLA Sumbawa Documentation (DOCX, PDF, and MD).
Generates:
  1. docs/panduan-penggunaan-dinola.md
  2. Panduan_Penggunaan_DINOLA_Sumbawa.docx
  3. Panduan_Penggunaan_DINOLA_Sumbawa.pdf
"""

import os
import sys
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
from PIL import Image

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESIGN_DIR = os.path.join(BASE_DIR, "design")
DOCS_DIR = os.path.join(BASE_DIR, "docs")
OUTPUT_DOCX = os.path.join(BASE_DIR, "Panduan_Penggunaan_DINOLA_Sumbawa.docx")
OUTPUT_PDF = os.path.join(BASE_DIR, "Panduan_Penggunaan_DINOLA_Sumbawa.pdf")
OUTPUT_MD = os.path.join(DOCS_DIR, "panduan-penggunaan-dinola.md")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# -------------------------------------------------------------
# 1. Structure and Data for the Guide
# -------------------------------------------------------------

SECTIONS = [
    {
        "part": "BAGIAN I: PENDAHULUAN & AKSES APLIKASI",
        "chapters": [
            {
                "num": "1",
                "title": "Mengenal Sistem DINOLA & Alur 8 Tahap Validasi",
                "content": [
                    ("p", "Aplikasi DINOLA (Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat) merupakan sistem penjaminan mutu (quality assurance layer) Pemerintah Kabupaten Sumbawa untuk menjaring, mendampingi, memverifikasi, dan memonitor seluruh inovasi daerah sebelum disinkronkan ke sistem resmi Indeks Inovasi Daerah (IID) Kemendagri."),
                    ("p", "Sistem ini menerapkan alur verifikasi dan pembinaan berjenjang untuk memastikan setiap inovasi memiliki bukti dukung yang valid, terukur, dan memenuhi regulasi Pedoman Umum Innovative Government Award (IGA) 2026."),
                    ("alert", "info", "Prinsip Utama: Data inovasi yang didaftarkan ke DINOLA tidak pernah dihapus dari basis data. Setiap perpindahan status dan revisi tercatat secara transparan dan akuntabel di dalam log validasi sistem."),
                    ("table", [
                        ["Tahap", "Status Sistem", "Aktor Pelaksana", "Deskripsi & Tindakan"],
                        ["1", "draft", "Inovator (OPD/Masyarakat)", "Inovator mengisi profil inisiasi & mengunggah dokumen dukung awal. Status ini masih bersifat privat bagi pemilik akun."],
                        ["2", "diajukan", "Inovator (OPD/Masyarakat)", "Inovasi diajukan secara resmi ke sistem untuk diperiksa oleh Pendamping Inovasi."],
                        ["3", "divalidasi", "Pendamping Inovasi", "Pendamping membuka dan menelaah kelengkapan dokumen 22 indikator kematangan."],
                        ["4a", "revisi", "Pendamping Inovasi", "Ditemukan kekurangan bukti dukung. Pendamping memberikan catatan spesifik per indikator untuk diperbaiki Inovator."],
                        ["4b", "disetujui", "Pendamping Inovasi", "Semua dokumen dan parameter dinilai valid dan memenuhi standar mutu teknis pendampingan."],
                        ["5", "disahkan_opd", "Verifikator / Kepala OPD", "Verifikator OPD membubuhkan pengesahan formal bahwa inovasi resmi diakui oleh pimpinan OPD."],
                        ["6", "review_internal", "Tim Penilai Internal", "Tim Penilai Bappeda melakukan audit skoring kematangan SPD dan SID."],
                        ["7", "siap_kirim", "Admin Bappeda", "Inovasi dinyatakan lolos uji kelayakan penuh dan siap diekspor ke sistem Kemendagri."],
                        ["8", "terkirim", "Admin Bappeda", "Data dan berkas dukung berhasil diunggah / disinkronkan ke portal IID Kemendagri."]
                    ]),
                    ("table_roles", [
                        ["Peran Pengguna (Role)", "Cakupan Akses Utama", "Tanggung Jawab"],
                        ["Inovator (OPD & Masyarakat)", "Dashboard Inovator, Kelola Inovasi, Formulir Profil, Unggah Dokumen, Ajukan Validasi, Cetak Profil", "Mendaftarkan profil inovasi baru, melengkapi 22 indikator dokumen bukti, merevisi data jika diminta pendamping."],
                        ["Pendamping & Verifikator OPD", "Dashboard Binaan, Antrean Verifikasi, Lembar Validasi Indikator, Pengesahan OPD", "Melakukan pendampingan pengisian, memeriksa keabsahan bukti dukung, menerbitkan catatan revisi, dan memberikan pengesahan resmi OPD."],
                        ["Tim Penilai & Admin Bappeda", "Dashboard IID Kabupaten, Manajemen Penugasan, Skoring SPD & SID, Simulasi What-If, Master Data, Ekspor Data", "Melakukan penilaian kematangan indikator inovasi, simulasi skor indeks kabupaten, mengelola periode lomba, dan mengekspor data ke pusat."],
                        ["Pimpinan Daerah", "Dashboard Eksekutif Pimpinan (Read-Only)", "Memantau performa inovasi daerah secara real-time, sebaran urusan wajib pelayanan dasar, dan proyeksi predikat kematangan Sumbawa."]
                    ])
                ]
            },
            {
                "num": "2",
                "title": "Masuk ke Akun (Login)",
                "img": "01-auth-login.png",
                "caption": "Tampilan Halaman Masuk Aplikasi DINOLA Kabupaten Sumbawa",
                "content": [
                    ("p", "Halaman Masuk adalah gerbang utama bagi seluruh pengguna sistem DINOLA. Sistem menggunakan otentikasi berbasis email dan kata sandi yang telah terdaftar."),
                    ("steps", [
                        "Buka peramban (browser) dan akses alamat web resmi DINOLA Kabupaten Sumbawa.",
                        "Pada formulir yang tersedia, masukkan Email Pengguna yang telah didaftarkan.",
                        "Ketikkan Kata Sandi akun Anda pada kolom yang sesuai.",
                        "Centang opsi 'Ingat Saya' (Remember Me) jika Anda menggunakan perangkat pribadi dan ingin sesi tetap aktif.",
                        "Klik tombol 'Masuk ke Sistem'. Sistem akan secara otomatis mengidentifikasi peran (role) Anda dan mengarahkan ke dashboard yang relevan."
                    ]),
                    ("alert", "tip", "Keamanan Sesi: Jangan mencentang opsi 'Ingat Saya' apabila Anda mengakses aplikasi dari komputer umum atau ruang rapat bersama.")
                ]
            },
            {
                "num": "3",
                "title": "Pendaftaran Akun Inovator Baru",
                "img": "02-auth-register.png",
                "caption": "Formulir Pendaftaran Akun Inovator Baru",
                "content": [
                    ("p", "Bagi Inovator Perangkat Daerah baru, instansi vertikal, maupun masyarakat umum/akademisi yang belum memiliki akun, pendaftaran dapat dilakukan secara mandiri melalui menu registrasi."),
                    ("steps", [
                        "Pada halaman login, klik tautan 'Daftar Akun Baru' di bagian bawah kotak masuk.",
                        "Isi 'Nama Lengkap' atau nama narahubung resmi inovator.",
                        "Masukkan 'Alamat Email Aktif' yang akan digunakan untuk menerima pemberitahuan dan verifikasi akun.",
                        "Pilih 'Kategori / Instansi': Tentukan apakah Anda perwakilan Perangkat Daerah (OPD) Kabupaten Sumbawa, Kecamatan, Desa, atau Inovator Masyarakat Mandiri.",
                        "Buat 'Kata Sandi' yang kuat (minimal 8 karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol).",
                        "Ketik ulang kata sandi pada kolom 'Konfirmasi Kata Sandi'.",
                        "Centang persetujuan syarat dan ketentuan penggunaan sistem DINOLA.",
                        "Klik tombol 'Daftar Sekarang'. Akun Anda akan dibuat dan Anda dapat langsung masuk ke dashboard."
                    ])
                ]
            },
            {
                "num": "4",
                "title": "Pemulihan & Pengaturan Kata Sandi",
                "imgs": [
                    ("03-auth-forgot-password.png", "Formulir Permintaan Pemulihan Kata Sandi"),
                    ("04-auth-reset-password.png", "Formulir Pembuatan Kata Sandi Baru")
                ],
                "content": [
                    ("p", "Jika Anda lupa kata sandi akun, sistem menyediakan fitur pemulihan mandiri melalui tautan reset yang dikirimkan ke alamat email terdaftar."),
                    ("steps", [
                        "Pada layar login, klik tautan 'Lupa kata sandi?'.",
                        "Ketikkan alamat email akun Anda pada formulir pemulihan yang muncul.",
                        "Klik tombol 'Kirim Tautan Reset'. Sistem akan mengirimkan surat elektronik berisi tautan aman satu kali pakai.",
                        "Buka email Anda dan klik tombol/tautan pemulihan yang dikirimkan oleh DINOLA.",
                        "Pada layar 'Reset Kata Sandi Baru', masukkan kata sandi baru Anda beserta konfirmasinya.",
                        "Klik tombol 'Simpan Kata Sandi Baru'. Anda kini dapat masuk kembali menggunakan sandi terbaru."
                    ])
                ]
            },
            {
                "num": "5",
                "title": "Pengaturan Akun, Keamanan & Tema Tampilan",
                "imgs": [
                    ("12-settings-profile.png", "Halaman Pengaturan Profil Akun"),
                    ("13-settings-security.png", "Halaman Pengaturan Keamanan Kata Sandi"),
                    ("14-settings-appearance.png", "Halaman Pengaturan Tema Tampilan")
                ],
                "content": [
                    ("p", "Pengguna dapat mengelola preferensi profil, keamanan kredensial, dan estetika antarmuka melalui menu Pengaturan (Settings) pada dropdown profil di pojok kanan atas."),
                    ("steps", [
                        "Pengaturan Profil: Perbarui nama lengkap, nomor WhatsApp/telepon narahubung resmi, dan nama unit kerja/OPD Anda. Klik 'Simpan Perubahan'.",
                        "Keamanan Akun: Lakukan pembaruan kata sandi secara berkala dengan memasukkan kata sandi saat ini dan menentukan kata sandi pengganti.",
                        "Tampilan (Appearance): Sesuaikan kenyamanan visual Anda dengan memilih mode 'Terang' (Light Mode), 'Gelap' (Dark Mode), atau mengikuti konfigurasi tema 'Sistem' perangkat Anda."
                    ])
                ]
            }
        ]
    },
    {
        "part": "BAGIAN II: PANDUAN PERAN INOVATOR (OPD & MASYARAKAT)",
        "chapters": [
            {
                "num": "6",
                "title": "Dashboard Inovator & Ringkasan Progres",
                "img": "05-inovator-dashboard.png",
                "caption": "Dashboard Inovator dengan Ringkasan Metrik dan Linimasa Lomba",
                "content": [
                    ("p", "Setelah login sebagai Inovator, Anda akan disambut oleh Dashboard Inovator yang menyajikan gambaran komprehensif atas status usulan inovasi Anda."),
                    ("p", "Komponen utama pada Dashboard Inovator meliputi:"),
                    ("list", [
                        "Kartu Metrik Kinerja: Menampilkan total inovasi terdaftar, jumlah draf yang belum diajukan, inovasi yang sedang dalam antrean verifikasi, inovasi yang memerlukan revisi, serta inovasi yang telah disahkan.",
                        "Banner Linimasa Periode Aktif: Menampilkan jadwal tahapan IGA yang sedang berjalan (contoh: 'Periode IGA 2026 - Batas Pengajuan Usulan Inovasi: 30 Juni 2026').",
                        "Tombol Aksi Cepat: Akses langsung menuju formulir 'Tambah Inovasi Baru' dan 'Unduh Panduan Teknis'.",
                        "Daftar Aktivitas Terbaru: Riwayat perubahan status atau komentar revisi terbaru yang diberikan oleh Pendamping Inovasi."
                    ])
                ]
            },
            {
                "num": "7",
                "title": "Menavigasi Tabel & Daftar Inovasi Daerah",
                "img": "06-inovasi-index.png",
                "caption": "Tabel Manajemen Inovasi Daerah Inovator",
                "content": [
                    ("p", "Menu 'Kelola Inovasi' menyajikan tabel inventaris seluruh inovasi yang dimiliki oleh OPD atau akun inovator Anda."),
                    ("p", "Fitur dan elemen penting pada tabel inovasi:"),
                    ("list", [
                        "Bilah Pencarian & Filter: Cari inovasi berdasarkan nama/kata kunci, saring berdasarkan Urusan Pemerintahan, Tahapan Inovasi, atau Status Validasi.",
                        "Badge Status 8 Langkah: Menunjukkan posisi tahapan inovasi secara visual dengan warna khas (Kuning untuk Draf, Biru untuk Diajukan, Oranye untuk Revisi, Hijau untuk Disetujui/Disahkan).",
                        "Estimasi Skor Kematangan: Indikator akumulasi skor kematangan yang dihitung berdasarkan kelengkapan parameter data dukung.",
                        "Menu Aksi (Tiga Titik): Berisi opsi untuk 'Lihat Detail', 'Edit Profil & Dokumen Dukung', 'Cetak Lembar Profil', dan 'Hapus Draf' (hanya berlaku untuk status draf)."
                    ])
                ]
            },
            {
                "num": "8",
                "title": "Mendaftarkan Inovasi Baru (Formulir Inisiasi)",
                "img": "07-inovasi-create.png",
                "caption": "Formulir Pendaftaran Inisiasi Inovasi Baru",
                "content": [
                    ("p", "Untuk mengusulkan inovasi daerah baru, klik tombol '+ Tambah Inovasi' pada sudut kanan atas tabel inovasi. Formulir pendaftaran inisiasi ini mencakup data-data fundamental:"),
                    ("steps", [
                        "Nama Inovasi: Tuliskan nama resmi inovasi secara jelas, menarik, dan representatif (contoh: 'SIMPEL - Sistem Pelayanan Terpadu Sumbawa').",
                        "Tahapan Inovasi: Pilih tahapan saat ini (Inisiatif / Uji Coba / Penerapan). Catatan: Hanya tahapan 'Penerapan' dengan masa implementasi minimal yang dapat diekspor ke IGA Kemendagri.",
                        "Inisiator Inovasi: Pilih pihak pencetus inovasi (Kepala Daerah / Anggota DPRD / OPD / ASN / Masyarakat).",
                        "Jenis Inovasi: Tentukan apakah termasuk Inovasi Pelayanan Publik, Inovasi Tata Kelola Pemerintahan, atau Inovasi Bentuk Lainnya.",
                        "Bentuk Inovasi: Pilih Digital atau Non-Digital.",
                        "Urusan Pemerintahan Utama: Pilih urusan yang paling relevan. Jika menyangkut 6 Urusan Wajib Pelayanan Dasar (Pendidikan, Kesehatan, PU, Perkim, Trantibumlinmas, Sosial), pastikan dipilih dengan tepat.",
                        "Urusan Pemerintahan Lain yang Beririsan: Pilih urusan pendukung jika ada.",
                        "Waktu Uji Coba & Waktu Penerapan: Tentukan tanggal pelaksanaan uji coba serta tanggal resmi inovasi mulai diterapkan kepada masyarakat/stakeholder.",
                        "Koordinat Lokasi Penerapan: Tentukan titik koordinat lintang (latitude) dan bujur (longitude) lokasi sentral inovasi.",
                        "Klik tombol 'Simpan Inisiasi Inovasi'. Sistem akan menyimpan data sebagai 'draft' dan membuka lembar kerja pengisian 22 indikator."
                    ])
                ]
            },
            {
                "num": "9",
                "title": "Melengkapi Profil, 22 Indikator & Dokumen Dukung",
                "img": "08-inovasi-edit.png",
                "caption": "Formulir Kelengkapan 22 Indikator Kematangan dan Dokumen Dukung",
                "content": [
                    ("p", "Setelah inisiasi tersimpan, Inovator wajib melengkapi narasi rancang bangun serta mengunggah bukti dukung untuk ke-22 indikator kematangan sesuai standar IGA 2026 Kemendagri."),
                    ("alert", "important", "Ketentuan Rancang Bangun: Kolom Rancang Bangun (Dasar Hukum, Permasalahan, Isu Strategis, Metode Kebaruan, Spesifikasi Teknis) WAJIB diisi minimal 300 kata. Narasi yang terlalu singkat akan ditolak oleh sistem dan pendamping."),
                    ("p", "Rincian pengisian indikator data pendukung:"),
                    ("list", [
                        "Regulasi Inovasi Daerah: Unggah SK Bupati / Perbup / SK Kepala Dinas tentang penetapan inovasi (format PDF).",
                        "Ketersediaan SDM Pengelola: Lampirkan SK Tim Pelaksana atau uraian tugas pengelola inovasi.",
                        "Dukungan Anggaran: Unggah DPA / RKA atau bukti alokasi anggaran operasional inovasi.",
                        "Profil Bisnis / Pedoman Teknis / SOP: Unggah dokumen SOP operasional atau buku manual layanan.",
                        "Kemanfaatan Inovasi: Lampirkan data dukung kuantitatif dan kualitatif peningkatan efisiensi, penghematan waktu/biaya, atau kepuasan penerima manfaat.",
                        "Tautan Video Inovasi: Masukkan tautan video YouTube resmi dengan durasi maksimal 3-5 menit yang memvisualisasikan latar belakang, proses, dan hasil nyata inovasi.",
                        "Dokumen Pendukung Lainnya: Sertakan foto dokumentasi penerapan, sertifikat HAKI, piagam penghargaan, atau testimoni masyarakat."
                    ]),
                    ("alert", "tip", "Ukuran Berkas: Pastikan setiap dokumen PDF berukuran maksimal 5 MB dan teks dapat terbaca jelas agar mempermudah proses validasi.")
                ]
            },
            {
                "num": "10",
                "title": "Mengajukan Inovasi ke Pendamping & Memantau Catatan",
                "content": [
                    ("p", "Setelah seluruh data profil dan bukti dukung terunggah secara lengkap, Inovator dapat mengajukan usulan ke tahap verifikasi:"),
                    ("steps", [
                        "Periksa kembali kelengkapan formulir pada tab Ringkasan Dokumen.",
                        "Pastikan indikator kepatuhan menunjukkan status lengkap (warna hijau).",
                        "Klik tombol 'Ajukan Validasi ke Pendamping'. Status inovasi akan berubah dari 'draft' menjadi 'diajukan'.",
                        "Inovasi kini masuk ke antrean tugas Pendamping Inovasi dan form terkunci sementara dari penyuntingan langsung.",
                        "Apabila Pendamping menerbitkan catatan perbaikan (status 'revisi'), Anda akan menerima notifikasi. Buka lembar edit untuk melihat kotak catatan merah/oranye pada masing-masing field, perbaiki dokumen sesuai arahan, lalu klik 'Kirim Ulang Revisi'."
                    ])
                ]
            },
            {
                "num": "11",
                "title": "Mencetak Lembar Profil Inovasi Daerah",
                "img": "09-inovasi-print.png",
                "caption": "Tampilan Pratinjau Lembar Profil Inovasi Daerah Siap Cetak",
                "content": [
                    ("p", "DINOLA menyediakan format cetak lembar profil inovasi resmi yang terstandarisasi. Dokumen ini dapat digunakan sebagai lampiran laporan kedinasan, berkas tanda tangan pimpinan, maupun arsip fisik OPD."),
                    ("steps", [
                        "Pada tabel Kelola Inovasi, klik tombol menu aksi pada inovasi yang dikehendaki, lalu pilih 'Cetak Lembar Profil'.",
                        "Layar pratinjau cetak akan menampilkan tata letak resmi yang mencantumkan Kop Surat Pemkab Sumbawa / DINOLA, identitas lengkap inovasi, ringkasan rancang bangun, matriks 22 indikator, dan kolom legalisasi tanda tangan.",
                        "Gunakan pintasan keyboard 'Ctrl + P' atau klik tombol 'Cetak ke PDF / Printer'.",
                        "Pilih opsi 'Save as PDF' untuk menyimpan dokumen digital atau kirim langsung ke perangkat pencetak fisik."
                    ])
                ]
            },
            {
                "num": "12",
                "title": "Pusat Panduan Regulasi & Notifikasi Aplikasi",
                "imgs": [
                    ("10-panduan-index.png", "Halaman Pusat Panduan dan Regulasi Resmi"),
                    ("11-notifikasi-index.png", "Pusat Notifikasi dan Pemberitahuan Terpadu")
                ],
                "content": [
                    ("p", "Sistem DINOLA dilengkapi pusat informasi terpadu untuk memastikan seluruh inovator memiliki pemahaman yang selaras dengan kebijakan nasional:"),
                    ("list", [
                        "Pusat Panduan (Knowledge Base): Berisi kumpulan dokumen regulasi resmi yang dapat diunduh langsung, meliputi Pedoman Umum IGA Kemendagri 2026, Petunjuk Teknis Pengisian Indikator SPD/SID, Format Baku Surat Pernyataan Kepala OPD, serta Tanya Jawab (FAQ).",
                        "Pusat Notifikasi: Mencatat seluruh peristiwa penting terkait akun Anda, seperti pengajuan berhasil diterima, catatan koreksi dari pendamping, inovasi resmi disahkan, serta peringatan mendekati tenggat waktu pengisian."
                    ])
                ]
            }
        ]
    },
    {
        "part": "BAGIAN III: PANDUAN PERAN PENDAMPING & VERIFIKATOR OPD",
        "chapters": [
            {
                "num": "13",
                "title": "Dashboard Pendampingan & Monitoring Antrean",
                "img": "15-pendamping-dashboard.png",
                "caption": "Dashboard Pendamping Inovasi dan Verifikator OPD",
                "content": [
                    ("p", "Peran Pendamping Inovasi menggabungkan fungsi pembinaan teknis dan fungsi Verifikator Perangkat Daerah. Dashboard Pendamping dirancang khusus untuk memonitor progres seluruh OPD binaan yang ditugaskan kepada Anda."),
                    ("p", "Fitur utama pada Dashboard Pendamping:"),
                    ("list", [
                        "Kartu Beban Kerja: Jumlah total inovasi binaan, inovasi yang menunggu verifikasi (antrean aktif), inovasi dalam status revisi, dan inovasi yang telah disahkan.",
                        "Daftar Antrean Verifikasi Cepat: Menampilkan inovasi yang baru diajukan oleh inovator lengkap dengan waktu pengajuan.",
                        "Progres Kepatuhan OPD Binaan: Tabel sebaran partisipasi inovasi pada masing-masing dinas/badan di bawah binaan pendamping terkait."
                    ])
                ]
            },
            {
                "num": "14",
                "title": "Meninjau Daftar Inovasi Binaan",
                "img": "16-pendamping-inovasi-index.png",
                "caption": "Daftar Inovasi Binaan Siap Verifikasi",
                "content": [
                    ("p", "Pada menu 'Inovasi Binaan', Pendamping dapat melihat seluruh usulan inovasi yang masuk dari OPD binaannya."),
                    ("steps", [
                        "Gunakan tab filter status 'Diajukan' untuk memprioritaskan inovasi yang siap ditinjau.",
                        "Periksa kolom 'OPD Pengusul', 'Tahapan', dan 'Estimasi Kematangan Awal'.",
                        "Klik tombol 'Mulai Verifikasi' pada baris inovasi yang dituju untuk membuka lembar kerja telaah."
                    ])
                ]
            },
            {
                "num": "15",
                "title": "Melakukan Verifikasi Indikator & Catatan Revisi Per-Field",
                "img": "17-pendamping-validasi-show.png",
                "caption": "Lembar Kerja Validasi Berkas dan Checklist Indikator",
                "content": [
                    ("p", "Lembar verifikasi menyajikan perbandingan antara data yang diisi inovator, berkas yang diunggah, dan kriteria pemenuhan parameter indikator kematangan."),
                    ("steps", [
                        "Periksa Rancang Bangun: Pastikan narasi komprehensif, logis, dan memenuhi batas minimal 300 kata.",
                        "Audit Berkas Indikator: Unduh atau buka pratinjau dokumen dukung (SK, SOP, Anggaran, Video) untuk memverifikasi keabsahan tanggal terbit, stempel/tanda tangan basah atau elektronik, dan kesesuaian konten.",
                        "Checklist Indikator: Berikan tanda centang validasi pada indikator yang telah memenuhi kriteria.",
                        "Tindakan REVISI: Jika ditemukan berkas yang buram, SK kedaluwarsa, atau narasi tidak sesuai, pilih opsi 'Perlu Revisi'. WAJIB menuliskan catatan detail pada kotak komentar indikator terkait agar inovator mengetahui secara spesifik apa yang harus diperbaiki.",
                        "Tindakan DISETUJUI: Jika seluruh 22 indikator dan narasi telah terverifikasi dengan baik, pilih opsi 'Setujui Inovasi'. Status inovasi akan berpindah menjadi 'disetujui'."
                    ]),
                    ("alert", "important", "Kewajiban Catatan: Sistem secara otomatis memvalidasi bahwa tindakan 'Revisi' tidak dapat disimpan apabila kolom catatan perbaikan kosong.")
                ]
            },
            {
                "num": "16",
                "title": "Memberikan Pengesahan Kepala OPD (Status Disahkan OPD)",
                "content": [
                    ("p", "Setelah inovasi berstatus 'disetujui' oleh pendamping, tahap berikutnya adalah legalisasi pimpinan instansi:"),
                    ("steps", [
                        "Verifikator OPD meninjau lembar inovasi yang telah disetujui.",
                        "Pastikan Surat Pernyataan Kepala OPD / Pakta Integritas telah diunggah dan ditandatangani oleh Kepala Dinas/Badan/Camat terkait.",
                        "Klik tombol 'Sahkan Inovasi (Disahkan OPD)'.",
                        "Status inovasi akan berubah menjadi 'disahkan_opd'. Inovasi kini resmi mewakili OPD dan diteruskan ke Tim Penilai Internal Bappeda."
                    ])
                ]
            }
        ]
    },
    {
        "part": "BAGIAN IV: PANDUAN PERAN TIM PENILAI & ADMIN Bappeda",
        "chapters": [
            {
                "num": "17",
                "title": "Dashboard Penilaian & Rekapitulasi Kabupaten",
                "img": "18-penilai-dashboard.png",
                "caption": "Dashboard Tim Penilai Internal dan Rekapitulasi IID Kabupaten",
                "content": [
                    ("p", "Dashboard Tim Penilai menyajikan data analitik makro tingkat kabupaten Sumbawa yang mencerminkan kesiapan daerah menghadapi penilaian IGA nasional:"),
                    ("list", [
                        "Indeks Inovasi Daerah (IID) Sementara: Skor akumulasi kabupaten yang dihitung secara dinamis dari formula IGA Kemendagri.",
                        "Komposisi SPD (Satuan Pemerintah Daerah) & SID (Satuan Inovasi Daerah): Visualisasi capaian skor tata kelola pemda dan rata-rata kematangan seluruh inovasi.",
                        "Monitoring Sebaran 6 Urusan Wajib Pelayanan Dasar: Peta keterisian inovasi pada sektor Pendidikan, Kesehatan, PU, Perkim, Trantibumlinmas, dan Sosial.",
                        "Status Pipeling Inovasi: Diagram batang alur inovasi dari draft hingga siap kirim."
                    ])
                ]
            },
            {
                "num": "18",
                "title": "Manajemen Penugasan Pendamping per OPD",
                "img": "21-penugasan-index.png",
                "caption": "Modul Manajemen Penugasan Pendampingan per OPD",
                "content": [
                    ("p", "Admin Bappeda memiliki wewenang untuk mendistribusikan beban pembinaan perangkat daerah kepada personil pendamping:"),
                    ("steps", [
                        "Akses menu 'Manajemen Penugasan' pada sidebar navigasi.",
                        "Tinjau tabel pemetaan: Kolom memuat Nama OPD, Jumlah Inovasi Aktif, Nama Pendamping Utama, dan Status Penugasan.",
                        "Untuk menugaskan atau mengubah pendamping, klik tombol 'Ubah Penugasan' pada OPD yang dipilih.",
                        "Pilih nama personil Pendamping Inovasi dari daftar dropdown.",
                        "Klik 'Simpan Penugasan'. Pendamping yang ditugaskan akan langsung menerima notifikasi dan hak akses verifikasi terhadap inovasi OPD tersebut."
                    ])
                ]
            },
            {
                "num": "19",
                "title": "Penilaian Skoring Internal (SPD & SID)",
                "imgs": [
                    ("22-penilai-skoring-index.png", "Daftar Inovasi Menunggu Skoring Internal"),
                    ("23-penilai-skoring-show.png", "Lembar Kerja Skoring Parameter Kematangan Inovasi")
                ],
                "content": [
                    ("p", "Tim Penilai Internal bertugas melakukan audit skoring objektif terhadap inovasi yang telah berstatus 'disahkan_opd'."),
                    ("steps", [
                        "Buka menu 'Skoring Inovasi', pilih inovasi yang berstatus 'Perlu Penilaian'.",
                        "Pada lembar skoring, sistem menampilkan ke-20+ indikator kematangan dengan opsi parameter berbobot (Parameter 1, Parameter 2, Parameter 3).",
                        "Bandingkan kesesuaian dokumen bukti dukung dengan definisi operasional masing-masing parameter.",
                        "Pilih tier parameter yang tepat. Nilai angka kematangan akan terkalkulasi secara otomatis secara langsung (real-time).",
                        "Tuliskan catatan pertimbangan penilai jika ada penyesuaian tier parameter.",
                        "Klik tombol 'Finalkan Skor Inovasi'. Inovasi berpindah ke status 'review_internal' atau 'siap_kirim'."
                    ])
                ]
            },
            {
                "num": "20",
                "title": "Simulasi What-If Indeks Inovasi Daerah (IID)",
                "img": "19-simulasi-index.png",
                "caption": "Kalkulator Simulasi What-If Skor IID Kabupaten Sumbawa",
                "content": [
                    ("p", "Fitur unggulan DINOLA adalah Simulator What-If. Modul ini memungkinkan Bappeda menguji berbagai skenario strategis guna memaksimalkan skor Indeks Inovasi Daerah sebelum data dikunci dan diserahkan ke Kemendagri."),
                    ("p", "Cara kerja dan langkah simulasi:"),
                    ("steps", [
                        "Buka menu 'Simulasi What-If'. Sistem akan memuat seluruh daftar inovasi berstatus disahkan.",
                        "Gunakan tombol sakelar (toggle switch 'Ikutkan dalam Penilaian') di samping setiap inovasi.",
                        "Sistem secara otomatis menghitung ulang formula IID secara instan: IID = Bobot SPD x Skor SPD + Bobot SID x Rata-rata Skor Kematangan Inovasi yang Diikutsertakan.",
                        "Perhatikan perubahan angka Proyeksi Skor IID dan Predikat Kabupaten (Sangat Inovatif / Inovatif / Kurang Inovatif).",
                        "Identifikasi apakah ada inovasi dengan skor rendah yang menurunkan rata-rata kematangan daerah, sehingga dapat diprioritaskan untuk asistensi perbaikan dokumen atau dievaluasi keikutsertaannya."
                    ])
                ]
            },
            {
                "num": "21",
                "title": "Pengelolaan Master Indikator, Parameter & Periode Lomba",
                "imgs": [
                    ("24-penilai-indikator-index.png", "Pengelolaan Master Data Indikator & Bobot Penilaian"),
                    ("25-penilai-periode-index.png", "Pengelolaan Periode Lomba & Linimasa IGA")
                ],
                "content": [
                    ("p", "Untuk memastikan sistem selalu adaptif terhadap perubahan regulasi pusat tanpa perlu mengubah kode sumber aplikasi, Admin Bappeda dapat mengelola master data secara mandiri:"),
                    ("list", [
                        "Master Indikator & Bobot (SPD/SID): Kelola nama indikator, definisi operasional, persentase bobot penilaian, dan opsi pilihan parameter nilai (P1, P2, P3). Konfigurasi ini dapat disesuaikan sewaktu-waktu sesuai edaran juknis terbaru Kemendagri.",
                        "Master Periode Lomba: Buka periode lomba tahunan baru (misalnya IGA 2026), atur tanggal pembukaan input, tenggat pengajuan inovator, batas akhir verifikasi pendamping, dan tanggal cut-off ekspor.",
                        "Arsip Otomatis: Inovasi pada periode lomba sebelumnya akan otomatis beralih menjadi arsip (read-only), namun inovator dapat menggunakan fitur 'Ajukan Kembali' pada periode aktif baru dengan menyertakan penjelasan progres pengembangan."
                    ])
                ]
            },
            {
                "num": "22",
                "title": "Ekspor & Sinkronisasi Data ke BSKDN Kemendagri",
                "img": "20-ekspor-index.png",
                "caption": "Modul Rekapitulasi & Ekspor Data ke Sistem Resmi Kemendagri",
                "content": [
                    ("p", "Setelah seluruh rangkaian verifikasi, skoring internal, dan seleksi simulasi selesai, data inovasi yang berstatus 'siap_kirim' dapat diekspor ke sistem pusat Kemendagri (indeks.inovasi.bskdn.kemendagri.go.id)."),
                    ("steps", [
                        "Akses menu 'Ekspor Data Pusat'.",
                        "Lakukan 'Pengecekan Pra-Ekspor': Sistem akan memverifikasi apakah ada field wajib yang belum terisi, apakah 6 Urusan Wajib Pelayanan Dasar telah terwakili, dan apakah seluruh berkas tautan aktif.",
                        "Pilih format ekspor yang dibutuhkan (Format Excel Rekapitulasi Resmi, Paket Berkas ZIP Terkompresi, atau Skema JSON/API Kemendagri).",
                        "Klik tombol 'Generate Berkas Ekspor'.",
                        "Unduh berkas hasil ekspor dan lakukan unggah ke portal resmi Kemendagri atau jalankan integrasi sinkronisasi data.",
                        "Setelah terkonfirmasi masuk ke sistem pusat, tandai status inovasi menjadi 'terkirim' (Sent to Ministry)."
                    ])
                ]
            }
        ]
    },
    {
        "part": "BAGIAN V: PANDUAN PERAN PIMPINAN DAERAH",
        "chapters": [
            {
                "num": "23",
                "title": "Dashboard Eksekutif & Pemantauan Kepatuhan Urusan Wajib",
                "img": "26-pimpinan-dashboard.png",
                "caption": "Dashboard Eksekutif Pimpinan Daerah (Monitoring Real-Time)",
                "content": [
                    ("p", "Dashboard Eksekutif Pimpinan dirancang khusus dengan antarmuka yang bersih, intuitif, dan informatif (read-only) untuk Bupati, Sekretaris Daerah, dan Kepala Bappeda."),
                    ("p", "Informasi strategis yang disajikan pada dashboard ini meliputi:"),
                    ("list", [
                        "Ringkasan Indeks Inovasi Daerah (IID) Terkini: Estimasi skor akhir kabupaten beserta status predikat (misal: 'Terinovatif').",
                        "Peta Pemenuhan 6 Urusan Wajib Pelayanan Dasar: Indikator visual hijau/merah yang menunjukkan apakah inovasi di bidang Pendidikan, Kesehatan, Pekerjaan Umum, Perumahan Rakyat, Trantibumlinmas, dan Sosial telah terpenuhi secara merata.",
                        "Tingkat Partisipasi Perangkat Daerah: Rasio keaktifan OPD di lingkungan Pemkab Sumbawa dalam mengajukan inovasi.",
                        "Distribusi Kategori Inovasi: Diagram proporsi Inovasi Pelayanan Publik, Tata Kelola Pemerintahan, dan Bentuk Inovasi Lainnya.",
                        "Daftar Inovasi Unggulan Daerah: Tabel 10 inovasi dengan skor kematangan tertinggi yang diproyeksikan menjadi andalan Kabupaten Sumbawa di ajang nasional."
                    ]),
                    ("alert", "tip", "Akses Pimpinan: Akun pimpinan memiliki hak akses monitoring menyeluruh tanpa risiko salah klik penyuntingan data karena mode antarmuka bersifat baca saja (read-only).")
                ]
            }
        ]
    }
]

# -------------------------------------------------------------
# 2. Markdown Generator
# -------------------------------------------------------------

def generate_markdown():
    md = []
    md.append("# BUKU PANDUAN PENGGUNAAN SISTEM DINOLA KABUPATEN SUMBAWA")
    md.append("**Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat — IGA 2026**\n")
    md.append("*Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah (Bappeda) Kabupaten Sumbawa*\n")
    md.append("---\n")
    
    for section in SECTIONS:
        md.append(f"\n## {section['part']}\n")
        for ch in section["chapters"]:
            md.append(f"### Bab {ch['num']}: {ch['title']}\n")
            
            # Handle images if any
            if "img" in ch:
                md.append(f"![{ch['caption']}](file:///{os.path.join(DESIGN_DIR, ch['img']).replace(os.sep, '/')})\n")
                md.append(f"*{ch['caption']}*\n")
            elif "imgs" in ch:
                for img_file, caption in ch["imgs"]:
                    md.append(f"![{caption}](file:///{os.path.join(DESIGN_DIR, img_file).replace(os.sep, '/')})\n")
                    md.append(f"*{caption}*\n")
            
            for item in ch["content"]:
                kind = item[0]
                if kind == "p":
                    md.append(f"{item[1]}\n")
                elif kind == "alert":
                    atype = item[1].upper()
                    md.append(f"> [!{atype}]\n> {item[2]}\n")
                elif kind == "steps":
                    for idx, step in enumerate(item[1], 1):
                        md.append(f"{idx}. {step}")
                    md.append("")
                elif kind == "list":
                    for li in item[1]:
                        md.append(f"- {li}")
                    md.append("")
                elif kind == "table":
                    headers = item[1][0]
                    md.append("| " + " | ".join(headers) + " |")
                    md.append("| " + " | ".join(["---"] * len(headers)) + " |")
                    for row in item[1][1:]:
                        md.append("| " + " | ".join(row) + " |")
                    md.append("")
                elif kind == "table_roles":
                    headers = item[1][0]
                    md.append("| " + " | ".join(headers) + " |")
                    md.append("| " + " | ".join(["---"] * len(headers)) + " |")
                    for row in item[1][1:]:
                        md.append("| " + " | ".join(row) + " |")
                    md.append("")
                    
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write("\n".join(md))
    print(f"[OK] Markdown written to {OUTPUT_MD}")

# -------------------------------------------------------------
# 3. DOCX Generator with python-docx
# -------------------------------------------------------------

def set_cell_background(cell, hex_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def generate_docx():
    doc = Document()
    
    # Page Margins (A4 standard)
    for section in doc.sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)
        section.page_width = Inches(8.27)
        section.page_height = Inches(11.69)
        
    # Styles
    styles = doc.styles
    normal_style = styles['Normal']
    normal_style.font.name = 'Segoe UI'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(0x33, 0x41, 0x55) # Slate 700
    
    # --- COVER PAGE ---
    cover_table = doc.add_table(rows=1, cols=1)
    cover_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_cell = cover_table.rows[0].cells[0]
    set_cell_background(c_cell, "0F766E") # Teal 700
    set_cell_margins(c_cell, top=1200, bottom=1200, left=800, right=800)
    
    cp = c_cell.paragraphs[0]
    cp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_badge = cp.add_run("PEMERINTAH KABUPATEN SUMBAWA\nBappeda SUMBAWA")
    run_badge.font.name = 'Segoe UI'
    run_badge.font.size = Pt(13)
    run_badge.font.bold = True
    run_badge.font.color.rgb = RGBColor(0xCC, 0xFB, 0xF1) # Teal 100
    
    cp_title = c_cell.add_paragraph()
    cp_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp_title.paragraph_format.space_before = Pt(36)
    cp_title.paragraph_format.space_after = Pt(18)
    run_title = cp_title.add_run("PANDUAN PENGGUNAAN\nAPLIKASI DINOLA")
    run_title.font.name = 'Segoe UI'
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    cp_sub = c_cell.add_paragraph()
    cp_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp_sub.paragraph_format.space_after = Pt(36)
    run_sub = cp_sub.add_run("Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat\nPanduan Komprehensif Berdasarkan Alur IGA 2026")
    run_sub.font.name = 'Segoe UI'
    run_sub.font.size = Pt(13)
    run_sub.font.color.rgb = RGBColor(0xE6, 0xFF, 0xFA)
    
    cp_meta = c_cell.add_paragraph()
    cp_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cp_meta.paragraph_format.space_before = Pt(40)
    run_meta = cp_meta.add_run("Edisi Resmi: 2026 | Versi 1.0\nKabupaten Sumbawa, Nusa Tenggara Barat")
    run_meta.font.name = 'Segoe UI'
    run_meta.font.size = Pt(10)
    run_meta.font.color.rgb = RGBColor(0x99, 0xF6, 0xE4)
    
    doc.add_page_break()
    
    # --- TABLE OF CONTENTS / SUMMARY ---
    toc_p = doc.add_paragraph()
    r_toc = toc_p.add_run("DAFTAR ISI & STRUKTUR PANDUAN")
    r_toc.font.name = 'Segoe UI'
    r_toc.font.size = Pt(16)
    r_toc.font.bold = True
    r_toc.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E)
    toc_p.paragraph_format.space_after = Pt(14)
    
    for sec in SECTIONS:
        p_sec = doc.add_paragraph()
        p_sec.paragraph_format.space_before = Pt(8)
        p_sec.paragraph_format.space_after = Pt(2)
        r = p_sec.add_run(sec["part"])
        r.font.bold = True
        r.font.size = Pt(11)
        r.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E)
        
        for ch in sec["chapters"]:
            p_ch = doc.add_paragraph()
            p_ch.paragraph_format.left_indent = Inches(0.25)
            p_ch.paragraph_format.space_after = Pt(2)
            r_ch = p_ch.add_run(f"Bab {ch['num']}: {ch['title']}")
            r_ch.font.size = Pt(10)
            r_ch.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
            
    doc.add_page_break()
    
    # --- CHAPTER CONTENT ---
    for sec in SECTIONS:
        # Part Header
        p_part = doc.add_paragraph()
        p_part.paragraph_format.space_before = Pt(18)
        p_part.paragraph_format.space_after = Pt(12)
        r_part = p_part.add_run(sec["part"])
        r_part.font.name = 'Segoe UI'
        r_part.font.size = Pt(15)
        r_part.font.bold = True
        r_part.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E)
        
        for ch in sec["chapters"]:
            # Chapter Heading
            p_ch = doc.add_paragraph()
            p_ch.paragraph_format.space_before = Pt(14)
            p_ch.paragraph_format.space_after = Pt(8)
            r_ch = p_ch.add_run(f"Bab {ch['num']}: {ch['title']}")
            r_ch.font.name = 'Segoe UI'
            r_ch.font.size = Pt(13)
            r_ch.font.bold = True
            r_ch.font.color.rgb = RGBColor(0x13, 0x4E, 0x4A)
            
            # Embed Image(s)
            imgs_to_embed = []
            if "img" in ch:
                imgs_to_embed.append((ch["img"], ch["caption"]))
            elif "imgs" in ch:
                imgs_to_embed.extend(ch["imgs"])
                
            for img_name, caption_text in imgs_to_embed:
                img_path = os.path.join(DESIGN_DIR, img_name)
                if os.path.exists(img_path):
                    with Image.open(img_path) as im:
                        w, h = im.size
                    
                    # Target max width 6.0 inches
                    target_w = 6.0
                    target_h = (h / w) * target_w
                    if target_h > 5.8:
                        target_h = 5.8
                        target_w = (w / h) * target_h
                        
                    p_img = doc.add_paragraph()
                    p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_img.paragraph_format.space_before = Pt(8)
                    p_img.paragraph_format.space_after = Pt(4)
                    run_img = p_img.add_run()
                    run_img.add_picture(img_path, width=Inches(target_w), height=Inches(target_h))
                    
                    p_cap = doc.add_paragraph()
                    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
                    p_cap.paragraph_format.space_after = Pt(12)
                    r_cap = p_cap.add_run(f"Gambar {ch['num']}: {caption_text}")
                    r_cap.font.size = Pt(9)
                    r_cap.font.italic = True
                    r_cap.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)
            
            # Text & Blocks
            for item in ch["content"]:
                kind = item[0]
                if kind == "p":
                    p = doc.add_paragraph()
                    p.paragraph_format.space_after = Pt(6)
                    p.paragraph_format.line_spacing = 1.15
                    r = p.add_run(item[1])
                    r.font.size = Pt(10)
                elif kind == "steps":
                    for idx, step_text in enumerate(item[1], 1):
                        p = doc.add_paragraph()
                        p.paragraph_format.left_indent = Inches(0.25)
                        p.paragraph_format.space_after = Pt(4)
                        p.paragraph_format.line_spacing = 1.15
                        r_num = p.add_run(f"{idx}. ")
                        r_num.font.bold = True
                        r_num.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E)
                        r_txt = p.add_run(step_text)
                        r_txt.font.size = Pt(10)
                elif kind == "list":
                    for li_text in item[1]:
                        p = doc.add_paragraph()
                        p.paragraph_format.left_indent = Inches(0.25)
                        p.paragraph_format.space_after = Pt(4)
                        p.paragraph_format.line_spacing = 1.15
                        r_bullet = p.add_run("• ")
                        r_bullet.font.bold = True
                        r_bullet.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E)
                        r_txt = p.add_run(li_text)
                        r_txt.font.size = Pt(10)
                elif kind == "alert":
                    # Styled Box Table
                    tbl = doc.add_table(rows=1, cols=1)
                    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                    cell = tbl.rows[0].cells[0]
                    set_cell_background(cell, "F0FDFA") # Teal 50
                    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
                    
                    p_box = cell.paragraphs[0]
                    p_box.paragraph_format.space_after = Pt(0)
                    r_box_tag = p_box.add_run(f"[{item[1].upper()}] ")
                    r_box_tag.font.bold = True
                    r_box_tag.font.size = Pt(9.5)
                    r_box_tag.font.color.rgb = RGBColor(0x0F, 0x76, 0x6E)
                    
                    r_box_txt = p_box.add_run(item[2])
                    r_box_txt.font.size = Pt(9.5)
                    r_box_txt.font.color.rgb = RGBColor(0x13, 0x4E, 0x4A)
                    
                    p_spacer = doc.add_paragraph()
                    p_spacer.paragraph_format.space_after = Pt(6)
                elif kind in ("table", "table_roles"):
                    data = item[1]
                    tbl = doc.add_table(rows=len(data), cols=len(data[0]))
                    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                    for r_idx, row_data in enumerate(data):
                        for c_idx, val in enumerate(row_data):
                            c = tbl.rows[r_idx].cells[c_idx]
                            set_cell_margins(c, top=80, bottom=80, left=100, right=100)
                            p = c.paragraphs[0]
                            p.paragraph_format.space_after = Pt(0)
                            if r_idx == 0:
                                set_cell_background(c, "0F766E") # Teal Header
                                r = p.add_run(val)
                                r.font.bold = True
                                r.font.size = Pt(9)
                                r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
                            else:
                                if r_idx % 2 == 1:
                                    set_cell_background(c, "F8FAFC")
                                r = p.add_run(val)
                                r.font.size = Pt(8.5)
                                r.font.color.rgb = RGBColor(0x33, 0x41, 0x55)
                    p_spacer = doc.add_paragraph()
                    p_spacer.paragraph_format.space_after = Pt(6)
                    
    doc.save(OUTPUT_DOCX)
    print(f"[OK] DOCX written to {OUTPUT_DOCX}")

# -------------------------------------------------------------
# 4. HTML & PDF Generator via Chrome Headless
# -------------------------------------------------------------

def generate_pdf():
    html_file = os.path.join(BASE_DIR, "Panduan_Penggunaan_DINOLA_Sumbawa.html")
    
    html = []
    html.append("""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>Panduan Penggunaan DINOLA Kabupaten Sumbawa</title>
<style>
  @page {
    size: A4 portrait;
    margin: 18mm 16mm 20mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background: #ffffff;
    font-size: 13px;
  }
  
  /* COVER PAGE */
  .cover {
    background: linear-gradient(135deg, #0d9488 0%, #0f766e 50%, #064e3b 100%);
    color: #ffffff;
    padding: 80px 40px;
    border-radius: 12px;
    text-align: center;
    page-break-after: always;
    margin-bottom: 40px;
  }
  .cover-badge {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 13px;
    font-weight: 700;
    color: #99f6e4;
    margin-bottom: 24px;
  }
  .cover h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 16px 0;
    line-height: 1.25;
    color: #ffffff;
  }
  .cover .sub {
    font-size: 16px;
    color: #ccfbf1;
    margin-bottom: 40px;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  .cover .meta {
    border-top: 1px solid rgba(204, 251, 241, 0.3);
    padding-top: 24px;
    font-size: 12px;
    color: #99f6e4;
  }
  
  /* PART & CHAPTER HEADINGS */
  .part-header {
    background: #0f766e;
    color: #ffffff;
    padding: 10px 18px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 700;
    margin-top: 36px;
    margin-bottom: 20px;
    page-break-before: always;
  }
  .chapter {
    margin-bottom: 30px;
    page-break-inside: avoid;
  }
  .chapter-title {
    color: #0f766e;
    font-size: 15px;
    font-weight: 700;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 6px;
    margin-top: 20px;
    margin-bottom: 12px;
  }
  
  /* TEXT & LISTS */
  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }
  ol, ul {
    margin: 0 0 12px 0;
    padding-left: 24px;
  }
  li {
    margin-bottom: 6px;
  }
  
  /* ALERTS */
  .alert {
    padding: 10px 14px;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 12px;
    line-height: 1.5;
  }
  .alert-info {
    background: #f0fdfa;
    border-left: 4px solid #0f766e;
    color: #115e59;
  }
  .alert-tip {
    background: #ecfdf5;
    border-left: 4px solid #059669;
    color: #065f46;
  }
  .alert-important {
    background: #fffbeb;
    border-left: 4px solid #d97706;
    color: #92400e;
  }
  
  /* TABLES */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 11px;
  }
  th {
    background: #0f766e;
    color: #ffffff;
    font-weight: 600;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #0f766e;
  }
  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: #f8fafc;
  }
  
  /* FIGURES */
  figure {
    margin: 14px 0;
    text-align: center;
    page-break-inside: avoid;
  }
  figure img {
    max-width: 95%;
    max-height: 480px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    object-fit: contain;
  }
  figcaption {
    font-size: 11px;
    color: #64748b;
    font-style: italic;
    margin-top: 6px;
  }
  
  /* TOC */
  .toc-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;
    page-break-after: always;
  }
  .toc-box h2 {
    color: #0f766e;
    font-size: 18px;
    margin-top: 0;
    margin-bottom: 14px;
  }
  .toc-part {
    font-weight: 700;
    color: #0f766e;
    margin-top: 10px;
    margin-bottom: 4px;
    font-size: 13px;
  }
  .toc-ch {
    padding-left: 16px;
    font-size: 12px;
    color: #334155;
    margin-bottom: 2px;
  }
</style>
</head>
<body>
""")
    
    # Cover
    html.append("""
<div class="cover">
  <div class="cover-badge">Pemerintah Kabupaten Sumbawa — Bappeda</div>
  <h1>PANDUAN PENGGUNAAN<br>APLIKASI DINOLA</h1>
  <div class="sub">Database Inovasi Daerah Sumbawa yang Lengkap dan Akurat<br>Buku Petunjuk Operasional Sesuai Standar IGA 2026 Kemendagri</div>
  <div class="meta">
    Edisi Resmi 2026 | Versi 1.0<br>
    Disusun oleh Bappeda Kabupaten Sumbawa — Nusa Tenggara Barat
  </div>
</div>
""")
    
    # TOC
    html.append("""<div class="toc-box">
  <h2>Daftar Isi & Struktur Panduan</h2>
""")
    for sec in SECTIONS:
        html.append(f'  <div class="toc-part">{sec["part"]}</div>\n')
        for ch in sec["chapters"]:
            html.append(f'  <div class="toc-ch">Bab {ch["num"]}: {ch["title"]}</div>\n')
    html.append("</div>\n")
    
    # Body
    for sec in SECTIONS:
        html.append(f'<div class="part-header">{sec["part"]}</div>\n')
        for ch in sec["chapters"]:
            html.append('<div class="chapter">\n')
            html.append(f'  <div class="chapter-title">Bab {ch["num"]}: {ch["title"]}</div>\n')
            
            # Embed Image(s)
            imgs_to_embed = []
            if "img" in ch:
                imgs_to_embed.append((ch["img"], ch["caption"]))
            elif "imgs" in ch:
                imgs_to_embed.extend(ch["imgs"])
                
            for img_name, caption_text in imgs_to_embed:
                img_path = os.path.join(DESIGN_DIR, img_name)
                img_url = f"file:///{img_path.replace(os.sep, '/')}"
                html.append(f"""  <figure>
    <img src="{img_url}" alt="{caption_text}">
    <figcaption>Gambar {ch["num"]}: {caption_text}</figcaption>
  </figure>\n""")
  
            # Content
            for item in ch["content"]:
                kind = item[0]
                if kind == "p":
                    html.append(f"  <p>{item[1]}</p>\n")
                elif kind == "steps":
                    html.append("  <ol>\n")
                    for step_text in item[1]:
                        html.append(f"    <li>{step_text}</li>\n")
                    html.append("  </ol>\n")
                elif kind == "list":
                    html.append("  <ul>\n")
                    for li_text in item[1]:
                        html.append(f"    <li>{li_text}</li>\n")
                    html.append("  </ul>\n")
                elif kind == "alert":
                    atype = item[1]
                    tag = "CATATAN PENTING" if atype == "important" else ("TIPS" if atype == "tip" else "INFORMASI")
                    html.append(f"""  <div class="alert alert-{atype}">
    <strong>[{tag}]</strong> {item[2]}
  </div>\n""")
                elif kind in ("table", "table_roles"):
                    data = item[1]
                    html.append("  <table>\n    <thead><tr>\n")
                    for th_text in data[0]:
                        html.append(f"      <th>{th_text}</th>\n")
                    html.append("    </tr></thead>\n    <tbody>\n")
                    for row in data[1:]:
                        html.append("    <tr>\n")
                        for td_text in row:
                            html.append(f"      <td>{td_text}</td>\n")
                        html.append("    </tr>\n")
                    html.append("    </tbody>\n  </table>\n")
                    
            html.append("</div>\n")
            
    html.append("</body></html>")
    
    with open(html_file, "w", encoding="utf-8") as f:
        f.write("".join(html))
    print(f"[OK] HTML written to {html_file}")
    
    # Run Chrome Headless to generate PDF
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        "--run-all-compositor-stages-before-draw",
        "--no-pdf-header-footer",
        f"--print-to-pdf={OUTPUT_PDF}",
        html_file
    ]
    res = subprocess.run(cmd, capture_output=True)
    if res.returncode == 0 and os.path.exists(OUTPUT_PDF):
        size_mb = os.path.getsize(OUTPUT_PDF) / (1024 * 1024)
        print(f"[OK] PDF written to {OUTPUT_PDF} ({size_mb:.2f} MB)")
    else:
        print(f"[ERROR] PDF generation failed with code {res.returncode}")
        print("Stderr:", res.stderr.decode('utf-8', errors='ignore'))

if __name__ == "__main__":
    print("=== Generating DINOLA Sumbawa Documentation ===")
    generate_markdown()
    generate_docx()
    generate_pdf()
    print("=== Done ===")
