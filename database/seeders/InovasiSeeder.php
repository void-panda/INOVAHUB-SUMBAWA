<?php

namespace Database\Seeders;

use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\InovasiDokumen;
use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Seeder;

class InovasiSeeder extends Seeder
{
    public function run(): void
    {
        $periode2025 = PeriodeLomba::where('tahun', 2025)->first();
        $periode2026 = PeriodeLomba::where('tahun', 2026)->first();

        $kominfoUser = User::where('email', 'inovator@sumbawakab.go.id')->first();
        $dinkesUser = User::where('email', 'inovator2@sumbawakab.go.id')->first();
        $disdukcapilUser = User::where('email', 'inovator3@sumbawakab.go.id')->first();
        $disdikbudUser = User::where('email', 'inovator4@sumbawakab.go.id')->first();
        $masyarakatUser = User::where('email', 'inovator5@sumbawakab.go.id')->first();

        $kominfo = Opd::where('kode', 'DISKOMINFO')->first();
        $dinkes = Opd::where('kode', 'DINKES')->first();
        $disdukcapil = Opd::where('kode', 'DISDUKCAPIL')->first();
        $disdikbud = Opd::where('kode', 'DISDIKBUD')->first();
        $pupr = Opd::where('kode', 'PUPR')->first();

        // =========================================================================
        // 10 INOVASI BERSTATUS ARSIP (PERIODE 2025) - SIAP TEST "AJUKAN KEMBALI"
        // =========================================================================

        // 1. SI-SABALONG (Disdukcapil - Inovasi Daerah Arsip)
        $sabalong = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SI-SABALONG (Sistem Integrasi Administrasi Kependudukan Sumbawa)'],
            [
                'user_id' => $disdukcapilUser->id,
                'opd_id' => $disdukcapil->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'H. Suryadi, S.H.',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'tematik',
                'tematik' => 'digitalisasi_pelayanan',
                'koordinat' => '-8.4981, 117.4203',
                'urusan_utama' => 'Pelayanan Administrasi Kependudukan dan Pencatatan Sipil',
                'urusan_wajib' => json_encode(['Pendidikan', 'Sosial']),
                'waktu_uji_coba' => '2024-03-01',
                'waktu_penerapan' => '2024-08-15',
                'waktu_pengembangan' => '2025-01-15',
                'file_penghargaan' => 'dokumen/penghargaan_sabalong.pdf',
                'rancang_bangun' => 'Sistem integrasi layanan dokumen kependudukan online Kabupaten Sumbawa.',
                'tujuan' => 'Mempermudah masyarakat mengurus dokumen kependudukan tanpa antrean manual.',
                'manfaat' => 'Peningkatan efisiensi waktu pelayanan hingga 70%.',
                'hasil_inovasi' => 'Lebih dari 45.000 dokumen kependudukan diproses online.',
            ]
        );
        $pengajuanSabalong2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $sabalong->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $disdukcapilUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Versi 1.0 integrasi layanan kependudukan daring se-Kabupaten Sumbawa.',
                'estimasi_skor_kematangan' => 104.50,
            ]
        );

        // 2. PELITA KEMANG (Dinkes - Inovasi Daerah Arsip)
        $pelita = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'PELITA KEMANG (Pemantauan Elektronik Terintegrasi Balita Stunting)'],
            [
                'user_id' => $dinkesUser->id,
                'opd_id' => $dinkes->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'dr. Siti Maryam',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'tematik',
                'tematik' => 'penurunan_stunting',
                'koordinat' => '-8.5102, 117.4180',
                'urusan_utama' => 'Kesehatan',
                'urusan_wajib' => json_encode(['Kesehatan']),
                'waktu_uji_coba' => '2024-05-10',
                'waktu_penerapan' => '2024-11-01',
                'waktu_pengembangan' => '2025-02-01',
                'file_penghargaan' => 'dokumen/piagam_pelita.pdf',
                'rancang_bangun' => 'Aplikasi pemantauan gizi dan intervensi balita stunting secara terpadu.',
                'tujuan' => 'Akselerasi penurunan prevalensi stunting di wilayah Sumbawa.',
                'manfaat' => 'Penyaluran PMT dan edukasi gizi tepat sasaran ke tingkat desa.',
                'hasil_inovasi' => 'Prevalensi stunting di 5 puskesmas pilot turun 4.2%.',
            ]
        );
        $pengajuanPelita2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $pelita->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $dinkesUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Penerapan awal sistem monitoring stunting di 5 puskesmas pilot.',
                'estimasi_skor_kematangan' => 112.00,
            ]
        );

        // 3. E-SAMAWA SAMBAT (Kominfo - Inovasi Daerah Arsip)
        $sambat = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'E-SAMAWA SAMBAT (Layanan Pengaduan & Kedaruratan Warga Terpadu)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Ahmad Fauzi, S.Kom',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'tematik',
                'tematik' => 'digitalisasi_pelayanan',
                'koordinat' => '-8.5020, 117.4220',
                'urusan_utama' => 'Komunikasi dan Informatika',
                'urusan_wajib' => json_encode(['Ketenteraman & Ketertiban Umum']),
                'waktu_uji_coba' => '2024-04-01',
                'waktu_penerapan' => '2024-09-01',
                'waktu_pengembangan' => '2025-03-01',
                'file_penghargaan' => 'dokumen/piagam_sambat.pdf',
                'rancang_bangun' => 'Kanal pengaduan masyarakat multikanal dengan tracking disposisi realtime ke seluruh OPD.',
                'tujuan' => 'Meningkatkan responsivitas OPD terhadap aduan masyarakat.',
                'manfaat' => 'Waktu rata-rata tindak lanjut aduan berkurang dari 7 hari menjadi 24 jam.',
                'hasil_inovasi' => '94% dari 1.200 aduan terselesaikan tuntas.',
            ]
        );
        $pengajuanSambat2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $sambat->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Integrasi bot WhatsApp dan portal aduan web Kabupaten Sumbawa.',
                'estimasi_skor_kematangan' => 108.00,
            ]
        );

        // 4. SIPALU SAMAWA (PUPR / Kominfo - Inovasi Daerah Arsip)
        $sipalu = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SIPALU SAMAWA (Sistem Informasi Pengawasan Tata Ruang & Kelayakan Bangunan)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $pupr->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Ir. Hendra Kusuma, M.T.',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'tata_kelola_pemerintahan',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5080, 117.4290',
                'urusan_utama' => 'Pekerjaan Umum dan Penataan Ruang',
                'urusan_wajib' => json_encode(['Pekerjaan Umum & Penataan Ruang']),
                'waktu_uji_coba' => '2024-02-15',
                'waktu_penerapan' => '2024-07-01',
                'waktu_pengembangan' => '2025-01-20',
                'rancang_bangun' => 'Peta GIS interaktif untuk pengawasan izin mendirikan bangunan dan kesesuaian tata ruang daerah.',
                'tujuan' => 'Mencegah alih fungsi lahan lindung dan mempercepat verifikasi PBG.',
                'manfaat' => 'Pencegahan pelanggaran tata ruang secara dini berbasis data geospasial.',
                'hasil_inovasi' => 'Pemetaan 3.400 persil bangunan di kawasan perkotaan Sumbawa.',
            ]
        );
        $pengajuanSipalu2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $sipalu->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Rilis modul GIS zonasi tata ruang wilayah kecamatan Sumbawa dan Labuhan Badas.',
                'estimasi_skor_kematangan' => 96.00,
            ]
        );

        // 5. E-RETRIBUSI PASAR SEKETENG (Kominfo - Inovasi Daerah Arsip)
        $eretribusi = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'E-RETRIBUSI PASAR SEKETENG (Digitalisasi Retribusi Pedagang Pasar Tradisional)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Lalu Muhammad Ridwan, S.E.',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'tematik',
                'tematik' => 'digitalisasi_pelayanan',
                'koordinat' => '-8.4950, 117.4120',
                'urusan_utama' => 'Perdagangan',
                'urusan_wajib' => json_encode(['Pendapatan Daerah']),
                'waktu_uji_coba' => '2024-06-01',
                'waktu_penerapan' => '2024-10-01',
                'waktu_pengembangan' => '2025-02-15',
                'rancang_bangun' => 'Sistem penarikan retribusi harian pasar menggunakan kartu tap QRIS terhubung ke Bappenda.',
                'tujuan' => 'Menghilangkan potensi kebocoran retribusi pasar tradisional.',
                'manfaat' => 'Peningkatan transparansi dan kemudahan pembayaran bagi pedagang.',
                'hasil_inovasi' => 'Kenaikan PAD sektor retribusi pasar sebesar 38%.',
            ]
        );
        $pengajuanEretribusi2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $eretribusi->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Implementasi mesin POS Android portable untuk juru pungut pasar Seketeng.',
                'estimasi_skor_kematangan' => 102.00,
            ]
        );

        // 6. SIM-RSUD SAMAWA CARE (Dinkes / Kominfo - Inovasi Daerah Arsip)
        $simrsud = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SIM-RSUD SAMAWA CARE (Sistem Manajemen Rujukan dan Antrean Rumah Sakit)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $dinkes->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'dr. H. Wahyudi, Sp.PK',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5140, 117.4260',
                'urusan_utama' => 'Kesehatan',
                'urusan_wajib' => json_encode(['Kesehatan']),
                'waktu_uji_coba' => '2024-01-10',
                'waktu_penerapan' => '2024-06-15',
                'waktu_pengembangan' => '2025-01-10',
                'rancang_bangun' => 'Aplikasi booking poliklinik online terintegrasi ketersediaan bed rawat inap RSUD Sumbawa.',
                'tujuan' => 'Mengurai penumpukan antrean loket pendaftaran rawat jalan RSUD.',
                'manfaat' => 'Pasien dapat mengetahui estimasi jam periksa dokter secara pasti.',
                'hasil_inovasi' => 'Penurunan waktu tunggu poli dari 180 menit menjadi 35 menit.',
            ]
        );
        $pengajuanSimrsud2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $simrsud->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Integrasi bridging antrean dengan Mobile JKN BPJS Kesehatan.',
                'estimasi_skor_kematangan' => 110.00,
            ]
        );

        // 7. KELAS DIGITAL SAMAWA CERDAS (Disdikbud - Inovasi Saya Arsip)
        $kelasDigital = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'KELAS DIGITAL SAMAWA CERDAS (Portal Modul Ajar Muatan Lokal Sumbawa)'],
            [
                'user_id' => $disdikbudUser->id,
                'opd_id' => $disdikbud->id,
                'is_inovasi_daerah' => false,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Budi Santoso, S.Pd',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5060, 117.4170',
                'urusan_utama' => 'Pendidikan',
                'urusan_wajib' => json_encode(['Pendidikan']),
                'waktu_uji_coba' => '2024-07-15',
                'waktu_penerapan' => '2024-11-20',
                'waktu_pengembangan' => '2025-02-10',
                'rancang_bangun' => 'Repository materi pembelajaran budaya, aksara Satera Jontal, dan sejarah Sumbawa untuk SD/SMP.',
                'tujuan' => 'Melestarikan bahasa dan sastra daerah Sumbawa bagi generasi muda melalui media digital.',
                'manfaat' => 'Akses gratis ratusan modul ajar interaktif dan video pembelajaran.',
                'hasil_inovasi' => 'Digunakan di 68 sekolah dasar se-Kabupaten Sumbawa.',
            ]
        );
        $pengajuanKelasDigital2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $kelasDigital->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $disdikbudUser->id,
                'is_inovasi_daerah' => false,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Rilis modul interaktif pengenalan aksara Satera Jontal tingkat sekolah dasar.',
                'estimasi_skor_kematangan' => 78.00,
            ]
        );

        // 8. BANK SAMPAH SAMAWA BERSERI (Masyarakat - Inovasi Saya Arsip)
        $bankSampah = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'BANK SAMPAH SAMAWA BERSERI (Pengelolaan Sampah Berbasis Komunitas)'],
            [
                'user_id' => $masyarakatUser->id,
                'opd_id' => null,
                'is_inovasi_daerah' => false,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Fajar Saputra & Relawan Lingkungan Samawa',
                'inisiator' => 'masyarakat',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'non_digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5050, 117.4150',
                'urusan_utama' => 'Lingkungan Hidup',
                'urusan_wajib' => json_encode(['Lingkungan Hidup']),
                'waktu_uji_coba' => '2024-03-10',
                'waktu_penerapan' => '2024-08-01',
                'waktu_pengembangan' => '2025-01-15',
                'rancang_bangun' => 'Program tabungan sampah rumah tangga yang dapat ditukar dengan sembako dan token listrik.',
                'tujuan' => 'Mengurangi timbunan sampah plastik di kelurahan Brang Biji dan sekitarnya.',
                'manfaat' => 'Menambah pendapatan warga sekaligus menjaga kebersihan saluran air pemukiman.',
                'hasil_inovasi' => 'Mereduksi 12 ton sampah anorganik per bulan dari 300 kepala keluarga.',
            ]
        );
        $pengajuanBankSampah2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $bankSampah->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $masyarakatUser->id,
                'is_inovasi_daerah' => false,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Pemberdayaan kader posyandu sebagai agen pengumpul sampah pilah.',
                'estimasi_skor_kematangan' => 72.00,
            ]
        );

        // 9. PORTAL MAGANG MAHASISWA SAMAWAKAB (Kominfo - Inovasi Saya Arsip)
        $portalMagang = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'PORTAL MAGANG MAHASISWA SAMAWAKAB (Sistem Perekrutan & Magang Terintegrasi OPD)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => false,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Ahmad Fauzi, S.Kom',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'tata_kelola_pemerintahan',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5010, 117.4240',
                'urusan_utama' => 'Tenaga Kerja',
                'urusan_wajib' => json_encode(['Pendidikan', 'Komunikasi & Informatika']),
                'waktu_uji_coba' => '2024-05-01',
                'waktu_penerapan' => '2024-09-15',
                'waktu_pengembangan' => '2025-02-01',
                'rancang_bangun' => 'Platform seleksi, penempatan, dan penilaian magang mahasiswa perguruan tinggi di lingkup Pemkab Sumbawa.',
                'tujuan' => 'Menyelaraskan kebutuhan talenta muda dengan proyek digitalisasi OPD.',
                'manfaat' => 'Memudahkan kampus di Sumbawa menempatkan mahasiswa magang MBKM.',
                'hasil_inovasi' => 'Menyalurkan 210 mahasiswa magang di 18 instansi perangkat daerah.',
            ]
        );
        $pengajuanPortalMagang2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $portalMagang->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => false,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Penerbitan e-sertifikat magang berbasis QR verifikasi digital.',
                'estimasi_skor_kematangan' => 80.00,
            ]
        );

        // 10. SISTEM INVENTARISASI ASET DESA SAMAWAN (Kominfo - Inovasi Saya Arsip)
        $asetDesa = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SISTEM INVENTARISASI ASET DESA SAMAWAN (Pendataan Aset Desa Terpadu)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => false,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Lalu Muhammad Ridwan, S.E.',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'tata_kelola_pemerintahan',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5035, 117.4215',
                'urusan_utama' => 'Pemberdayaan Masyarakat dan Desa',
                'urusan_wajib' => json_encode(['Pemberdayaan Masyarakat dan Desa']),
                'waktu_uji_coba' => '2024-06-20',
                'waktu_penerapan' => '2024-11-10',
                'waktu_pengembangan' => '2025-02-15',
                'rancang_bangun' => 'Aplikasi pencatatan tanah kas desa, gedung kantor desa, dan kendaraan dinas desa berbasis barcode.',
                'tujuan' => 'Mencegah sengketa dan hilangnya aset inventaris pemerintah desa.',
                'manfaat' => 'Pemerintah daerah memiliki data valid neraca aset seluruh desa.',
                'hasil_inovasi' => 'Pendataan 1.500 unit barang inventaris di 24 desa percontohan.',
            ]
        );
        $pengajuanAsetDesa2025 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $asetDesa->id, 'periode_lomba_id' => $periode2025->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => false,
                'status' => StatusPengajuan::Terkirim,
                'is_arsip' => true,
                'penjelasan_pengembangan' => 'Modul labelisasi barcode fisik aset bergerak desa.',
                'estimasi_skor_kematangan' => 75.00,
            ]
        );

        // =========================================================================
        // 6 INOVASI AKTIF (PERIODE 2026) - MENCAKUP SEMUA TAHAP SIKLUS HIDUP
        // =========================================================================

        // 11. E-TANGKAP SAMAWA (Inovasi Saya - Status: Dalam Pendampingan / Diajukan)
        $etangkap = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'E-TANGKAP SAMAWA (Pemasaran & Monitoring Hasil Nelayan Pesisir)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => false,
                'tahapan' => 'ujicoba',
                'nama_inisiator' => 'Ahmad Fauzi, S.Kom',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.4500, 117.3800',
                'urusan_utama' => 'Kelautan dan Perikanan',
                'urusan_wajib' => json_encode(['Kelautan dan Perikanan']),
                'waktu_uji_coba' => '2025-10-01',
                'waktu_penerapan' => '2026-03-01',
                'rancang_bangun' => 'Aplikasi informasi titik tangkap ikan, harga lelang TPI realtime, dan transaksi langsung nelayan-konsumen.',
                'tujuan' => 'Memotong rantai tengkulak dan meningkatkan margin pendapatan nelayan tradisional.',
                'manfaat' => 'Nelayan mendapat kepastian harga sebelum merapat ke dermaga.',
            ]
        );
        $pengajuanEtangkap2026 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $etangkap->id, 'periode_lomba_id' => $periode2026->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => false,
                'status' => StatusPengajuan::DalamPendampingan,
                'is_arsip' => false,
                'penjelasan_pengembangan' => 'Implementasi modul perkiraan cuaca BMKG dan harga lelang TPI Tanjung Pengamas.',
                'estimasi_skor_kematangan' => 68.00,
            ]
        );

        // 12. SI-POTEK SAMAWA (Inovasi Daerah - Status: Disahkan OPD)
        $sipotek = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SI-POTEK SAMAWA (Sistem Pelayanan Obat & Kesehatan Terpadu)'],
            [
                'user_id' => $dinkesUser->id,
                'opd_id' => $dinkes->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Apt. Rahmatullah, S.Farm',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'tematik',
                'tematik' => 'digitalisasi_pelayanan',
                'koordinat' => '-8.5012, 117.4255',
                'urusan_utama' => 'Kesehatan',
                'urusan_wajib' => json_encode(['Kesehatan']),
                'waktu_uji_coba' => '2025-04-12',
                'waktu_penerapan' => '2025-09-01',
                'waktu_pengembangan' => '2026-02-10',
                'file_penghargaan' => 'dokumen/piagam_sipotek.pdf',
                'rancang_bangun' => 'Sistem monitoring stok obat puskesmas realtime dan pengantaran obat pasien kronis ke rumah.',
                'tujuan' => 'Mencegah kekosongan obat esensial di puskesmas pelosok dan memudahkan lansia.',
                'manfaat' => 'Peningkatan kepatuhan minum obat pasien hipertensi dan diabetes.',
            ]
        );
        $pengajuanSipotek2026 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $sipotek->id, 'periode_lomba_id' => $periode2026->id],
            [
                'user_id' => $dinkesUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::DisahkanOpd,
                'is_arsip' => false,
                'penjelasan_pengembangan' => 'Integrasi sistem logistik farmasi dengan 26 puskesmas dan kurir antar obat daerah.',
                'estimasi_skor_kematangan' => 106.00,
            ]
        );

        // 13. SI-RABANG SAMAWA (Inovasi Daerah - Status: Review Internal Tim Penilai)
        $sirabang = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SI-RABANG SAMAWA (Sistem Informasi Rekayasa & Pemeliharaan Jembatan)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $pupr->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Ir. Hendra Kusuma, M.T.',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'tata_kelola_pemerintahan',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5150, 117.4350',
                'urusan_utama' => 'Pekerjaan Umum dan Penataan Ruang',
                'urusan_wajib' => json_encode(['Pekerjaan Umum & Penataan Ruang']),
                'waktu_uji_coba' => '2025-01-10',
                'waktu_penerapan' => '2025-06-20',
                'waktu_pengembangan' => '2026-01-05',
                'rancang_bangun' => 'Sensor getaran dan kamera IoT untuk monitoring beban jembatan strategis daerah secara kontinu.',
                'tujuan' => 'Mendeteksi penurunan struktur jembatan sebelum terjadi kerusakan parah.',
                'manfaat' => 'Efisiensi anggaran pemeliharaan jembatan dan keselamatan pengguna jalan.',
            ]
        );
        $pengajuanSirabang2026 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $sirabang->id, 'periode_lomba_id' => $periode2026->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::ReviewInternal,
                'is_arsip' => false,
                'penjelasan_pengembangan' => 'Pemasangan sensor telemetri regangan pada jembatan Brang Biji dan Samapuin.',
                'estimasi_skor_kematangan' => 98.00,
            ]
        );

        // 14. GERAKAN KAMPUNG IKLIM SAMAWA (Inovasi Saya - Status: Revisi dengan Catatan)
        $kampungIklim = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'GERAKAN KAMPUNG IKLIM SAMAWA (Adaptasi & Mitigasi Perubahan Iklim Desa)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => false,
                'tahapan' => 'ujicoba',
                'nama_inisiator' => 'Ahmad Fauzi, S.Kom',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'non_digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.5200, 117.4100',
                'urusan_utama' => 'Lingkungan Hidup',
                'urusan_wajib' => json_encode(['Lingkungan Hidup']),
                'waktu_uji_coba' => '2025-11-01',
                'waktu_penerapan' => '2026-02-15',
                'rancang_bangun' => 'Gerakan penghijauan mata air dan lubang biopori resapan di wilayah rawan kekeringan.',
                'tujuan' => 'Meningkatkan ketahanan cadangan air tanah saat musim kemarau panjang.',
                'manfaat' => 'Konservasi 15 sumber mata air desa.',
            ]
        );
        $pengajuanKampungIklim2026 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $kampungIklim->id, 'periode_lomba_id' => $periode2026->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => false,
                'status' => StatusPengajuan::DalamPendampingan,
                'is_arsip' => false,
                'penjelasan_pengembangan' => 'Penambahan target konservasi mata air di 3 kecamatan dataran tinggi.',
                'estimasi_skor_kematangan' => 55.00,
            ]
        );

        // 15. SMART WATER METER PDAM BATULANTEH (Inovasi Daerah - Status: Siap Kirim)
        $smartWater = Inovasi::updateOrCreate(
            ['nama_inovasi' => 'SMART WATER METER PDAM BATULANTEH (Telemetri Distribusi Air Bersih Realtime)'],
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $pupr->id,
                'is_inovasi_daerah' => true,
                'tahapan' => 'penerapan',
                'nama_inisiator' => 'Ir. Hendra Kusuma, M.T.',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'tematik',
                'tematik' => 'digitalisasi_pelayanan',
                'koordinat' => '-8.5120, 117.4320',
                'urusan_utama' => 'Pekerjaan Umum dan Penataan Ruang',
                'urusan_wajib' => json_encode(['Pekerjaan Umum & Penataan Ruang']),
                'waktu_uji_coba' => '2024-08-01',
                'waktu_penerapan' => '2025-01-10',
                'waktu_pengembangan' => '2026-01-15',
                'file_penghargaan' => 'dokumen/piagam_smartwater.pdf',
                'rancang_bangun' => 'Meteran air digital nirkabel berbasis LoRaWAN untuk deteksi kebocoran pipa utama dan tagihan otomatis.',
                'tujuan' => 'Menurunkan persentase Non-Revenue Water (NRW) PDAM Batulanteh Sumbawa.',
                'manfaat' => 'Distribusi air ke pelanggan merata dengan tekanan stabil.',
                'hasil_inovasi' => 'Tingkat kehilangan air berkurang dari 34% menjadi 16%.',
            ]
        );
        $pengajuanSmartWater2026 = PengajuanLomba::updateOrCreate(
            ['inovasi_id' => $smartWater->id, 'periode_lomba_id' => $periode2026->id],
            [
                'user_id' => $kominfoUser->id,
                'is_inovasi_daerah' => true,
                'status' => StatusPengajuan::SiapKirim,
                'is_arsip' => false,
                'penjelasan_pengembangan' => 'Pemasangan 1.200 unit smart meter di zona pelayanan Sumbawa Kota.',
                'estimasi_skor_kematangan' => 132.00,
            ]
        );

        // 16. E-PERIZINAN TANGKAP NELAYAN LABUHAN (Inovasi Saya - Status: Draft Murni)
        Inovasi::updateOrCreate(
            ['nama_inovasi' => 'E-PERIZINAN TANGKAP NELAYAN LABUHAN (Pelayanan Izin Melaut Mandiri)'] ,
            [
                'user_id' => $kominfoUser->id,
                'opd_id' => $kominfo->id,
                'is_inovasi_daerah' => false,
                'tahapan' => 'inisiatif',
                'nama_inisiator' => 'Ahmad Fauzi, S.Kom',
                'inisiator' => 'opd',
                'bentuk_inovasi' => 'pelayanan_publik',
                'jenis_inovasi' => 'digital',
                'klasifikasi' => 'non_tematik',
                'koordinat' => '-8.4600, 117.3900',
                'urusan_utama' => 'Kelautan dan Perikanan',
                'urusan_wajib' => json_encode(['Kelautan dan Perikanan']),
                'waktu_uji_coba' => '2026-03-01',
                'waktu_penerapan' => '2026-07-01',
                'rancang_bangun' => 'Layanan permohonan pas kecil dan surat izin penangkapan ikan online di dermaga.',
                'tujuan' => 'Mempermudah nelayan mengurus legalitas kapal di bawah 10 GT.',
                'manfaat' => 'Nelayan dapat melaut dengan perlindungan asuransi resmi.',
            ]
        );

        // =========================================================================
        // DOKUMEN DUKUNG UMUM SAMPLE
        // =========================================================================
        InovasiDokumen::updateOrCreate(
            ['nama_asal' => 'Proposal_Rancang_Bangun_SmartWater.pdf'],
            [
                'inovasi_id' => $smartWater->id,
                'pengajuan_lomba_id' => $pengajuanSmartWater2026->id,
                'jenis' => 'proposal',
                'path' => 'dokumen/sample_proposal.pdf',
                'mime' => 'application/pdf',
                'ukuran' => 1048576,
            ]
        );

        InovasiDokumen::updateOrCreate(
            ['nama_asal' => 'Video Demonstrasi Smart Water LoRaWAN'],
            [
                'inovasi_id' => $smartWater->id,
                'pengajuan_lomba_id' => $pengajuanSmartWater2026->id,
                'jenis' => 'video',
                'path' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'mime' => 'url',
                'ukuran' => 0,
            ]
        );
    }
}
