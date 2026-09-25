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

        $kominfoUser = User::where('email', 'inovator@sumbawakab.go.id')->first();
        $dinkesUser = User::where('email', 'inovator2@sumbawakab.go.id')->first();
        $disdukcapilUser = User::where('email', 'inovator3@sumbawakab.go.id')->first();
        $disdikbudUser = User::where('email', 'inovator4@sumbawakab.go.id')->first();
        $masyarakatUser = User::where('email', 'inovator5@sumbawakab.go.id')->first();
        $puprUser = User::where('email', 'inovator_pupr@sumbawakab.go.id')->first() ?? $kominfoUser;

        $kominfo = Opd::where('kode', 'DISKOMINFO')->first();
        $dinkes = Opd::where('kode', 'DINKES')->first();
        $disdukcapil = Opd::where('kode', 'DISDUKCAPIL')->first();
        $disdikbud = Opd::where('kode', 'DISDIKBUD')->first();
        $diskan = Opd::where('kode', 'DISKAN')->first();
        $pupr = Opd::where('kode', 'PUPR')->first();

        // Bersihkan data inovasi lama jika ada untuk fresh simulation
        InovasiDokumen::query()->delete();
        PengajuanLomba::query()->delete();
        Inovasi::query()->delete();

        // =========================================================================
        // 10 INOVASI BERSTATUS ARSIP (PERIODE 2025)
        // 7 Inovasi Daerah (OPD) & 3 Inovasi Masyarakat
        // =========================================================================

        // 1. SI-SABALONG (Disdukcapil - Inovasi Daerah)
        $sabalong = Inovasi::create([
            'nama_inovasi' => 'SI-SABALONG (Sistem Integrasi Administrasi Kependudukan Sumbawa)',
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
            'urusan_utama' => 'Administrasi Kependudukan dan Pencatatan Sipil',
            'urusan_wajib' => json_encode(['Administrasi Kependudukan', 'Sosial']),
            'waktu_uji_coba' => '2024-03-01',
            'waktu_penerapan' => '2024-08-15',
            'waktu_pengembangan' => '2025-01-15',
            'file_penghargaan' => 'dokumen/penghargaan_sabalong.pdf',
            'rancang_bangun' => 'Sistem integrasi layanan dokumen kependudukan online Kabupaten Sumbawa mencakup KTP-el, KIA, Akta Lahir, dan Pindah Datang secara terpusat.',
            'tujuan' => 'Mempermudah masyarakat mengurus dokumen kependudukan tanpa antrean manual di kantor dinas.',
            'manfaat' => 'Peningkatan efisiensi waktu pelayanan hingga 70% dan pengurangan penggunaan kertas.',
            'hasil_inovasi' => 'Lebih dari 45.000 dokumen kependudukan diproses online dengan indeks kepuasan masyarakat 92.5%.',
        ]);
        $pengajuanSabalong = PengajuanLomba::create([
            'inovasi_id' => $sabalong->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $disdukcapilUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Versi 1.0 integrasi layanan kependudukan daring se-Kabupaten Sumbawa dengan verifikasi biometrik.',
            'estimasi_skor_kematangan' => 54.50,
        ]);

        // 2. PELITA KEMANG (Dinkes - Inovasi Daerah)
        $pelita = Inovasi::create([
            'nama_inovasi' => 'PELITA KEMANG (Pemantauan Elektronik Terintegrasi Balita Stunting)',
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
            'urusan_wajib' => json_encode(['Kesehatan', 'Pemberdayaan Masyarakat']),
            'waktu_uji_coba' => '2024-05-10',
            'waktu_penerapan' => '2024-11-01',
            'waktu_pengembangan' => '2025-02-01',
            'file_penghargaan' => 'dokumen/piagam_pelita.pdf',
            'rancang_bangun' => 'Aplikasi pemantauan kurva pertumbuhan gizi dan intervensi balita berisiko stunting berbasis posyandu.',
            'tujuan' => 'Akselerasi penurunan prevalensi stunting di wilayah Kabupaten Sumbawa.',
            'manfaat' => 'Penyaluran PMT dan edukasi gizi tepat sasaran langsung ke sasaran keluarga prioritas.',
            'hasil_inovasi' => 'Prevalensi stunting di 5 puskesmas lokus percontohan turun sebesar 4.2% dalam 6 bulan.',
        ]);
        $pengajuanPelita = PengajuanLomba::create([
            'inovasi_id' => $pelita->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $dinkesUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Penerapan awal sistem monitoring stunting terhubung ke bidan desa dan kader Posyandu.',
            'estimasi_skor_kematangan' => 56.00,
        ]);

        // 3. E-SAMAWA SAMBAT (Kominfo - Inovasi Daerah)
        $sambat = Inovasi::create([
            'nama_inovasi' => 'E-SAMAWA SAMBAT (Layanan Pengaduan & Kedaruratan Warga Terpadu)',
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
            'urusan_wajib' => json_encode(['Komunikasi dan Informatika', 'Ketenteraman & Ketertiban Umum']),
            'waktu_uji_coba' => '2024-04-01',
            'waktu_penerapan' => '2024-09-01',
            'waktu_pengembangan' => '2025-03-01',
            'file_penghargaan' => 'dokumen/piagam_sambat.pdf',
            'rancang_bangun' => 'Kanal pengaduan masyarakat terintegrasi bot WhatsApp resmi dan aplikasi web untuk tracking disposisi tindak lanjut.',
            'tujuan' => 'Meningkatkan responsivitas jajaran OPD terhadap aduan layanan dan kedaruratan fasilitas umum.',
            'manfaat' => 'Waktu rata-rata tindak lanjut aduan berkurang dari 7 hari menjadi di bawah 24 jam.',
            'hasil_inovasi' => '94% dari 1.200 aduan masyarakat sepanjang tahun berhasil diselesaikan tuntas.',
        ]);
        $pengajuanSambat = PengajuanLomba::create([
            'inovasi_id' => $sambat->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $kominfoUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Integrasi bot WhatsApp dan portal aduan web Kabupaten Sumbawa dengan notifikasi SMS blast.',
            'estimasi_skor_kematangan' => 52.00,
        ]);

        // 4. SIPALU SAMAWA (PUPR - Inovasi Daerah)
        $sipalu = Inovasi::create([
            'nama_inovasi' => 'SIPALU SAMAWA (Sistem Informasi Pengawasan Tata Ruang & Kelayakan Bangunan)',
            'user_id' => $puprUser->id,
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
            'rancang_bangun' => 'Peta GIS interaktif untuk pengawasan izin persetujuan bangunan gedung (PBG) dan kepatuhan zonasi tata ruang wilayah.',
            'tujuan' => 'Mencegah alih fungsi lahan lindung dan mempercepat verifikasi teknis PBG bagi masyarakat.',
            'manfaat' => 'Pencegahan pelanggaran tata ruang secara dini berbasis data geospasial presisi.',
            'hasil_inovasi' => 'Pemetaan 3.400 persil bangunan di kawasan perkotaan Sumbawa dan Labuhan Badas.',
        ]);
        $pengajuanSipalu = PengajuanLomba::create([
            'inovasi_id' => $sipalu->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $puprUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Modul GIS zonasi tata ruang wilayah kecamatan Sumbawa dan Labuhan Badas terintegrasi OSS.',
            'estimasi_skor_kematangan' => 49.00,
        ]);

        // 5. SIM-RSUD SAMAWA CARE (Dinkes / RSUD - Inovasi Daerah)
        $simrsud = Inovasi::create([
            'nama_inovasi' => 'SIM-RSUD SAMAWA CARE (Sistem Manajemen Rujukan dan Antrean Rumah Sakit)',
            'user_id' => $dinkesUser->id,
            'opd_id' => $dinkes->id,
            'is_inovasi_daerah' => true,
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'dr. Siti Maryam',
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
            'rancang_bangun' => 'Aplikasi pemesanan antrean poliklinik online terintegrasi ketersediaan tempat tidur rawat inap RSUD Sumbawa.',
            'tujuan' => 'Mengurai penumpukan antrean loket pendaftaran rawat jalan dan transparansi kamar opname.',
            'manfaat' => 'Pasien dapat mengetahui estimasi waktu pelayanan dokter spesialis dari rumah.',
            'hasil_inovasi' => 'Waktu tunggu rawat jalan terpangkas dari 3 jam menjadi rata-rata 35 menit.',
        ]);
        $pengajuanSimrsud = PengajuanLomba::create([
            'inovasi_id' => $simrsud->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $dinkesUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Integrasi antrean poliklinik online dengan data BPJS Kesehatan (Mobile JKN).',
            'estimasi_skor_kematangan' => 53.00,
        ]);

        // 6. E-TANGKAP SAMAWA (Diskan - Inovasi Daerah)
        $etangkap = Inovasi::create([
            'nama_inovasi' => 'E-TANGKAP SAMAWA (Sistem Rekapitulasi Hasil Tangkap dan Log Nelayan Pesisir)',
            'user_id' => $kominfoUser->id,
            'opd_id' => $diskan?->id ?? $kominfo->id,
            'is_inovasi_daerah' => true,
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Drs. H. Syahruddin',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'non_tematik',
            'koordinat' => '-8.4500, 117.4000',
            'urusan_utama' => 'Kelautan dan Perikanan',
            'urusan_wajib' => json_encode(['Kelautan dan Perikanan']),
            'waktu_uji_coba' => '2024-03-15',
            'waktu_penerapan' => '2024-08-01',
            'waktu_pengembangan' => '2025-02-10',
            'rancang_bangun' => 'Pencatatan hasil tangkap nelayan kapal kecil berbasis aplikasi mobile offline-first di pangkalan pendaratan ikan.',
            'tujuan' => 'Menyediakan data produksi perikanan tangkap yang valid dan realtime.',
            'manfaat' => 'Nelayan memperoleh kemudahan rekomendasi BBM bersubsidi dan perlindungan harga tangkapan.',
            'hasil_inovasi' => 'Terdata 820 nelayan pesisir Teluk Saleh dan Labuhan Sumbawa dengan volume produksi terekam harian.',
        ]);
        $pengajuanEtangkap = PengajuanLomba::create([
            'inovasi_id' => $etangkap->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $kominfoUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::SiapKirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Penerapan mobile e-log book nelayan tradisional di 4 Tempat Pelelangan Ikan (TPI).',
            'estimasi_skor_kematangan' => 48.00,
        ]);

        // 7. SIPINTAR SAMAWA (Disdikbud - Inovasi Daerah)
        $sipintar = Inovasi::create([
            'nama_inovasi' => 'SIPINTAR SAMAWA (Sistem Informasi Pemantauan Anak Putus Sekolah)',
            'user_id' => $disdikbudUser->id,
            'opd_id' => $disdikbud->id,
            'is_inovasi_daerah' => true,
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Budi Santoso, S.Pd',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'tematik' => 'pendidikan',
            'koordinat' => '-8.5040, 117.4230',
            'urusan_utama' => 'Pendidikan',
            'urusan_wajib' => json_encode(['Pendidikan', 'Sosial']),
            'waktu_uji_coba' => '2024-04-15',
            'waktu_penerapan' => '2024-09-10',
            'waktu_pengembangan' => '2025-01-25',
            'rancang_bangun' => 'Aplikasi pelacakan dan pendampingan anak tidak sekolah (ATS) terintegrasi bantuan beasiswa daerah.',
            'tujuan' => 'Menuntaskan wajib belajar 12 tahun di daerah pelosok Kabupaten Sumbawa.',
            'manfaat' => 'Intervensi bantuan perlengkapan sekolah dan fasilitasi kejar paket A/B/C tepat sasaran.',
            'hasil_inovasi' => '650 anak putus sekolah berhasil dikembalikan ke bangku pendidikan formal dan non-formal.',
        ]);
        $pengajuanSipintar = PengajuanLomba::create([
            'inovasi_id' => $sipintar->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $disdikbudUser->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Pemetaan GIS sebaran anak tidak sekolah berbasis data desa presisi.',
            'estimasi_skor_kematangan' => 51.50,
        ]);

        // 8. E-RETRIBUSI PASAR SEKETENG (Inovator Masyarakat: Mandiri / Komunitas)
        $eretribusi = Inovasi::create([
            'nama_inovasi' => 'E-RETRIBUSI PASAR SEKETENG (Digitalisasi Retribusi Pedagang Pasar Tradisional)',
            'user_id' => $masyarakatUser->id,
            'opd_id' => null,
            'is_inovasi_daerah' => false,
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Fajar Saputra',
            'inisiator' => 'masyarakat',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'tematik' => 'digitalisasi_pelayanan',
            'koordinat' => '-8.4950, 117.4120',
            'urusan_utama' => 'Perdagangan',
            'urusan_wajib' => json_encode(['Perdagangan', 'Koperasi & UKM']),
            'waktu_uji_coba' => '2024-06-01',
            'waktu_penerapan' => '2024-10-01',
            'waktu_pengembangan' => '2025-02-15',
            'rancang_bangun' => 'Sistem penarikan retribusi harian pasar menggunakan kartu tap QRIS portabel oleh paguyuban pedagang bekerjasama dengan perbankan.',
            'tujuan' => 'Menghilangkan potensi pungli dan mempermudah catatan omset pedagang pasar.',
            'manfaat' => 'Peningkatan transparansi dan pencatatan transaksi yang akuntabel bagi pedagang kecil.',
            'hasil_inovasi' => 'Diadopsi oleh 450 pedagang lapak basah dan kering di Pasar Seketeng Sumbawa.',
        ]);
        $pengajuanEretribusi = PengajuanLomba::create([
            'inovasi_id' => $eretribusi->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $masyarakatUser->id,
            'is_inovasi_daerah' => false,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Implementasi mesin POS portabel bagi koordinator pedagang pasar Seketeng.',
            'estimasi_skor_kematangan' => 45.00,
        ]);

        // 9. SABALONG RECYCLE MANDIRI (Inovator Masyarakat: Bank Sampah Komunitas)
        $sabalongRecycle = Inovasi::create([
            'nama_inovasi' => 'SABALONG RECYCLE (Pengolahan Sampah Plastik Menjadi Paving Block Komunitas)',
            'user_id' => $masyarakatUser->id,
            'opd_id' => null,
            'is_inovasi_daerah' => false,
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Fajar Saputra',
            'inisiator' => 'masyarakat',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'non_digital',
            'klasifikasi' => 'tematik',
            'tematik' => 'lingkungan_hidup',
            'koordinat' => '-8.5120, 117.4350',
            'urusan_utama' => 'Lingkungan Hidup',
            'urusan_wajib' => json_encode(['Lingkungan Hidup', 'Pemberdayaan Masyarakat']),
            'waktu_uji_coba' => '2024-02-01',
            'waktu_penerapan' => '2024-07-20',
            'waktu_pengembangan' => '2025-01-30',
            'rancang_bangun' => 'Mesin peleleh sampah plastik kresek swadaya yang dicetak menjadi paving block ramah lingkungan untuk pekarangan desa.',
            'tujuan' => 'Mengurangi timbunan sampah plastik di saluran drainase perkotaan Sumbawa.',
            'manfaat' => 'Menciptakan nilai ekonomi sirkular dan bahan bangunan murah bagi fasilitas umum desa.',
            'hasil_inovasi' => 'Pengurangan 15 ton limbah plastik kresek menjadi 4.500 buah paving block bermutu K-175.',
        ]);
        $pengajuanSabalongRecycle = PengajuanLomba::create([
            'inovasi_id' => $sabalongRecycle->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $masyarakatUser->id,
            'is_inovasi_daerah' => false,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Pengembangan cetakan hidrolik manual untuk meningkatkan kepadatan paving block.',
            'estimasi_skor_kematangan' => 42.50,
        ]);

        // 10. TANI ORGANIK SAMAWAKAB (Inovator Masyarakat: Kelompok Tani Mandiri)
        $taniOrganik = Inovasi::create([
            'nama_inovasi' => 'TANI ORGANIK SAMAWAKAB (Formula Pupuk Hayati Berbahan Limbah Jagung Lokal)',
            'user_id' => $masyarakatUser->id,
            'opd_id' => null,
            'is_inovasi_daerah' => false,
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Fajar Saputra',
            'inisiator' => 'masyarakat',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'non_digital',
            'klasifikasi' => 'non_tematik',
            'koordinat' => '-8.5300, 117.4400',
            'urusan_utama' => 'Pertanian',
            'urusan_wajib' => json_encode(['Pertanian']),
            'waktu_uji_coba' => '2024-01-20',
            'waktu_penerapan' => '2024-06-10',
            'waktu_pengembangan' => '2025-01-15',
            'rancang_bangun' => 'Dekomposisi tongkol dan jerami jagung pascapanen menggunakan mikroorganisme lokal (MOL) Sumbawa.',
            'tujuan' => 'Mengatasi kelangkaan pupuk subsidi dan mencegah pembakaran sisa panen jagung.',
            'manfaat' => 'Menyuburkan tanah sawah tadah hujan tanpa ketergantungan pupuk kimia sintetis.',
            'hasil_inovasi' => 'Diaplikasikan pada 60 hektar lahan jagung dengan kenaikan rendemen panen 18%.',
        ]);
        $pengajuanTaniOrganik = PengajuanLomba::create([
            'inovasi_id' => $taniOrganik->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $masyarakatUser->id,
            'is_inovasi_daerah' => false,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
            'penjelasan_pengembangan' => 'Standarisasi formula fermentasi MOL cair dalam kemasan jeriken 5 liter bagi anggota kelompok tani.',
            'estimasi_skor_kematangan' => 39.00,
        ]);

        // =========================================================================
        // DOKUMEN DUKUNG UMUM SAMPLE (Proposal, SK, Piagam, Video)
        // =========================================================================
        $allPengajuan = [
            $pengajuanSabalong,
            $pengajuanPelita,
            $pengajuanSambat,
            $pengajuanSipalu,
            $pengajuanSimrsud,
            $pengajuanEtangkap,
            $pengajuanSipintar,
            $pengajuanEretribusi,
            $pengajuanSabalongRecycle,
            $pengajuanTaniOrganik,
        ];

        foreach ($allPengajuan as $p) {
            InovasiDokumen::create([
                'inovasi_id' => $p->inovasi_id,
                'pengajuan_lomba_id' => $p->id,
                'jenis' => 'proposal',
                'nama_asal' => 'Proposal_Rancang_Bangun_' . $p->inovasi_id . '.pdf',
                'path' => 'dokumen/sample_proposal.pdf',
                'mime' => 'application/pdf',
                'ukuran' => 1048576,
            ]);

            InovasiDokumen::create([
                'inovasi_id' => $p->inovasi_id,
                'pengajuan_lomba_id' => $p->id,
                'jenis' => 'sk',
                'nama_asal' => 'SK_Penetapan_Inovasi_' . $p->inovasi_id . '.pdf',
                'path' => 'dokumen/sample_sk.pdf',
                'mime' => 'application/pdf',
                'ukuran' => 524288,
            ]);

            InovasiDokumen::create([
                'inovasi_id' => $p->inovasi_id,
                'pengajuan_lomba_id' => $p->id,
                'jenis' => 'video',
                'nama_asal' => 'Video Dokumentasi Inovasi ' . $p->inovasi->nama_inovasi,
                'path' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'mime' => 'url',
                'ukuran' => 0,
            ]);
        }
    }
}
