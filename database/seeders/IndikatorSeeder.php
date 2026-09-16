<?php

namespace Database\Seeders;

use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use Illuminate\Database\Seeder;

class IndikatorSeeder extends Seeder
{
    public function run(): void
    {
        // Bobot dasar (SPD 21, SID 37). Skor = bobot × tier (1-3).
        // SPD 21×3 = 63, SID 37×3 = 111 (+76 Jumlah Inovasi) → total 250.
        $spd = [
            ['SPD-01', 'Visi dan Misi', null, 1.00],
            ['SPD-02', 'APBD tepat waktu & mandatory spending', 'Tepat waktu + mandatory spending', 2.00],
            ['SPD-03', 'Kualitas peningkatan perizinan', null, 1.00],
            ['SPD-04', 'Jumlah pendapatan perkapita', null, 1.00],
            ['SPD-05', 'Penurunan tingkat pengangguran terbuka', 'Dua parameter', 1.50],
            ['SPD-06', 'Jumlah peningkatan investasi', null, 1.50],
            ['SPD-07', 'Jumlah peningkatan PAD', null, 1.50],
            ['SPD-08', 'Opini BPK', null, 1.50],
            ['SPD-09', 'Nilai capaian Lakip', null, 1.00],
            ['SPD-10', 'Penurunan Angka Kemiskinan', 'Dua parameter', 1.50],
            ['SPD-11', 'Nilai IPM', 'Dua parameter', 1.50],
            ['SPD-12', 'Penghargaan bagi inovator', null, 2.00],
            ['SPD-13', 'Jumlah Rekomendasi Kebijakan', 'Dua parameter', 2.00],
            ['SPD-14', 'RIPJ PID', null, 1.00],
            ['SPD-15', 'Fasilitasi atas HAKI', null, 1.00],
        ];

        $sid = [
            [
                'SID-01',
                'Regulasi Inovasi Daerah',
                'Dasar hukum penetapan inovasi daerah',
                3.00,
                'SK Kepala Perangkat Daerah / OPD',
                'SK Bupati / Peraturan Bupati (Perbup)',
                'Peraturan Daerah (Perda)',
                'Unggah lembaran SK Kepala OPD, SK Bupati/Perbup, atau Peraturan Daerah yang memuat penetapan inovasi bertanda tangan basah atau elektronik.',
            ],
            [
                'SID-02',
                'Ketersediaan & peran SDM',
                'Ketersediaan tim pengelola pelaksana inovasi',
                2.00,
                'Tersedia SDM tanpa penetapan SK tim pengelola',
                'Ditetapkan dengan SK Kepala Perangkat Daerah',
                'Ditetapkan dengan SK Bupati / Kepala Daerah',
                'Unggah dokumen SK Tim Pengelola / SK Penugasan staf pelaksana inovasi yang masih aktif dan sah.',
            ],
            [
                'SID-03',
                'Dukungan anggaran',
                'Alokasi anggaran operasional/keberlanjutan dalam DPA',
                2.00,
                'Didanai secara mandiri/swadaya masyarakat',
                'Dialokasikan dalam DPA OPD tahun berjalan',
                'Dialokasikan dalam DPA OPD minimal 2 tahun anggaran berturut-turut',
                'Unggah lembaran RKA / DPA tahun berjalan yang secara spesifik memuat nomenklatur alokasi anggaran kegiatan inovasi.',
            ],
            [
                'SID-04',
                'Alat Kerja',
                'Ketersediaan sarana prasarana fisik/digital pendukung inovasi',
                2.00,
                'Menggunakan peralatan/sarana manual yang ada',
                'Memanfaatkan perangkat teknologi informasi standar (PC/Smartphone)',
                'Tersedia perangkat/sistem aplikasi khusus terintegrasi',
                'Unggah foto alat kerja khusus, tangkapan layar perangkat lunak/aplikasi, atau daftar inventaris sarana prasarana pendukung operasional.',
            ],
            [
                'SID-05',
                'Bimtek inovasi',
                'Pelaksanaan bimbingan teknis / sosialisasi operasional',
                1.00,
                'Bimtek internal mandiri tanpa sertifikat',
                'Bimtek bersertifikat tingkat kabupaten/OPD',
                'Bimtek terakreditasi tingkat provinsi/nasional',
                'Unggah sertifikat bimtek/pelatihan, daftar hadir, foto dokumentasi, dan notula pelatihan yang pernah diselenggarakan/diikuti.',
            ],
            [
                'SID-06',
                'Inovasi Perangkat Daerah dalam RKPD',
                'Pencantuman inovasi dalam dokumen perencanaan daerah',
                2.00,
                'Tercantum dalam Renja Perangkat Daerah',
                'Tercantum dalam RKPD Kabupaten Sumbawa',
                'Tercantum dalam RPJMD Kabupaten Sumbawa',
                'Unggah lembaran dokumen Renja / RKPD / RPJMD Kabupaten Sumbawa yang memuat program atau kegiatan inovasi terkait.',
            ],
            [
                'SID-07',
                'Keterlibatan aktor inovasi',
                'Kolaborasi unsur Pentahelix dalam pengembangan inovasi',
                1.00,
                'Melibatkan 1 unsur mitra (mis. Akademisi / Komunitas)',
                'Melibatkan 2 unsur mitra kerja sama',
                'Melibatkan ≥ 3 unsur Pentahelix (Akademisi, Bisnis, Komunitas, Media)',
                'Unggah MoU / PKS / dokumentasi kegiatan kerja sama nyata dengan akademisi, dunia usaha, komunitas masyarakat, atau media.',
            ],
            [
                'SID-08',
                'Pelaksana inovasi daerah',
                'Kualifikasi dan jumlah staf pelaksana teknis inovasi',
                1.00,
                'Dikelola 1 orang staf pelaksana',
                'Dikelola tim kecil 2–4 orang staf terlatih',
                'Dikelola tim khusus lintas bidang ≥ 5 orang dengan sertifikasi kompetensi',
                'Unggah daftar riwayat tim teknis operasional inovasi beserta sertifikasi kompetensi atau bukti keahlian yang relevan.',
            ],
            [
                'SID-09',
                'Jejaring inovasi',
                'Perjanjian kerja sama / MoU replikasi atau transfer inovasi',
                1.00,
                'Komunikasi awal penjajakan kemitraan',
                'Tersedia Nota Kesepahaman (MoU) tingkat unit/instansi',
                'Tersedia Perjanjian Kerja Sama (PKS) aktif tingkat kabupaten/antar-daerah',
                'Unggah naskah perjanjian kerja sama (PKS) atau MoU replikasi/transfer pengetahuan inovasi dengan instansi pemerintah/lembaga lain.',
            ],
            [
                'SID-10',
                'Sosialisasi Inovasi Daerah',
                'Penyebarluasan informasi inovasi kepada masyarakat luas',
                1.00,
                'Sosialisasi terbatas tatap muka internal',
                'Publikasi melalui media sosial resmi OPD & website',
                'Publikasi masif multi-kanal (media massa, cetak, elektronik & baliho)',
                'Unggah tangkapan layar publikasi media sosial, tautan pemberitaan media massa, kliping koran, atau foto spanduk/leaflet sosialisasi.',
            ],
            [
                'SID-11',
                'Pedoman teknis',
                'Buku panduan / SOP pelaksanaan operasional inovasi',
                1.00,
                'Petunjuk teknis sederhana / flyer alur',
                'SOP resmi yang disahkan Kepala OPD',
                'Buku Manual & SOP Terakreditasi / Standar ISO',
                'Unggah buku panduan (user manual) lengkap, SOP alur pelayanan resmi yang bertanda tangan Kepala OPD, atau sertifikat ISO terkait.',
            ],
            [
                'SID-12',
                'Kemudahan informasi layanan',
                'Kanal akses publik untuk mengetahui prosedur inovasi',
                1.00,
                'Informasi tersedia di papan pengumuman kantor',
                'Informasi tersedia di website resmi dan media digital',
                'Tersedia portal informasi interaktif 24/7 dan helpdesk responsif',
                'Unggah foto papan informasi kantor, tangkapan layar website resmi, atau tautan portal interaktif dan kontak layanan bantuan.',
            ],
            [
                'SID-13',
                'Kemudahan proses inovasi',
                'Tingkat pemangkasan alur birokrasi dan kecepatan layanan',
                2.00,
                'Pemangkasan waktu pelayanan 10%–30%',
                'Pemangkasan waktu pelayanan 31%–60%',
                'Pemangkasan waktu pelayanan > 60% atau layanan instan (real-time)',
                'Unggah matriks komparasi alur/waktu layanan sebelum dan sesudah inovasi diterapkan serta testimoni durasi layanan.',
            ],
            [
                'SID-14',
                'Penyelesaian layanan pengaduan',
                'Mekanisme dan tindak lanjut aduan masyarakat terkait inovasi',
                1.00,
                'Kotak saran / kanal aduan manual',
                'Pengaduan online via WhatsApp / email dengan SLA < 3 hari',
                'Terintegrasi sistem SP4N-LAPOR! dengan SLA penanganan < 24 jam',
                'Unggah tangkapan layar kanal pengaduan (WhatsApp/Email/SP4N-LAPOR!), buku register aduan, dan bukti penyelesaian aduan.',
            ],
            [
                'SID-15',
                'Layanan Terintegrasi',
                'Keterhubungan sistem inovasi dengan layanan pemerintah lainnya',
                2.00,
                'Sistem berdiri sendiri (stand-alone)',
                'Terhubung dengan sistem internal OPD',
                'Terintegrasi penuh dengan Portal Satu Data / Sistem Kabupaten / Nasional',
                'Unggah diagram integrasi sistem, tangkapan layar integrasi web service/API, atau SK keterhubungan dengan portal Satu Data Sumbawa.',
            ],
            [
                'SID-16',
                'Replikasi',
                'Tingkat adopsi inovasi oleh instansi / daerah lain',
                3.00,
                'Belum direplikasi oleh pihak lain',
                'Telah direplikasi oleh OPD/Kecamatan/Desa lain di Kabupaten Sumbawa',
                'Telah direplikasi oleh Pemerintah Daerah di luar Kabupaten Sumbawa',
                'Unggah surat minat replikasi, SK adopsi inovasi dari daerah/OPD lain, atau foto dan berita kunjungan kaji tiru replikasi.',
            ],
            [
                'SID-17',
                'Kecepatan penciptaan inovasi',
                'Rentang waktu dari inisiasi gagasan hingga penetapan penerapan',
                2.00,
                'Waktu penciptaan > 12 bulan',
                'Waktu penciptaan 6–12 bulan',
                'Waktu penciptaan sangat cepat < 6 bulan',
                'Unggah dokumen linimasa penciptaan (notula rapat inisiasi awal s.d. tanggal dokumen pengesahan uji coba/penerapan).',
            ],
            [
                'SID-18',
                'Kemanfaatan inovasi',
                'Bukti dampak positif nyata dan peningkatan kepuasan masyarakat',
                3.00,
                'Laporan internal kemanfaatan tanpa survei kepuasan',
                'Hasil survei kepuasan pengguna (IKM) dengan nilai Baik',
                'Hasil survei IKM Sangat Baik (>85) disertai data efisiensi biaya & waktu terukur',
                'Unggah laporan hasil survei Indeks Kepuasan Masyarakat (IKM), data kuantitatif efisiensi anggaran/waktu, dan testimoni penerima manfaat.',
            ],
            [
                'SID-19',
                'Monitoring dan Evaluasi Inovasi Daerah',
                'Pelaksanaan monev berkala terhadap kinerja inovasi',
                2.00,
                'Monev insidental tanpa laporan berkala',
                'Laporan monev semesteran internal OPD',
                'Laporan monev triwulanan yang diaudit Tim Bappeda/Inspektorat',
                'Unggah laporan dokumen evaluasi semesteran/triwulanan, notula rapat evaluasi kinerja, atau lembar hasil audit Inspektorat.',
            ],
            [
                'SID-20',
                'Video inovasi daerah',
                'Ketersediaan video visualisasi alur dan testimoni penerapan',
                4.00,
                'Video durasi < 3 menit tanpa testimoni penerima manfaat',
                'Video standar (3–5 menit) memuat latar belakang dan alur inovasi',
                'Video komprehensif berstandar IGA Kemendagri (subtitel, alur, testimoni & grafis)',
                'Unggah tautan video YouTube/Drive berdurasi 3–5 menit yang mencakup latar belakang masalah, alur inovasi, dan testimoni kepuasan penerima manfaat.',
            ],
            [
                'SID-21',
                'Jumlah Inovasi Daerah',
                'Deret hitung, maks skor 76',
                0.38,
                null,
                null,
                null,
                'Kalkulasi otomatis jumlah inovasi daerah Kabupaten Sumbawa yang memenuhi syarat minimal 5 dari 6 urusan wajib pelayanan dasar.',
            ],
        ];

        foreach ($spd as [$kode, $nama, $variabel, $bobot]) {
            IndikatorSpd::updateOrCreate(['kode' => $kode], compact('kode', 'nama', 'variabel', 'bobot'));
        }

        foreach ($sid as $item) {
            $kode = $item[0];
            $nama = $item[1];
            $variabel = $item[2];
            $bobot = $item[3];
            $p1 = $item[4] ?? null;
            $p2 = $item[5] ?? null;
            $p3 = $item[6] ?? null;
            $informasi = $item[7] ?? null;

            IndikatorSid::updateOrCreate(
                ['kode' => $kode],
                compact('kode', 'nama', 'variabel', 'bobot', 'p1', 'p2', 'p3', 'informasi')
            );
        }
    }
}
