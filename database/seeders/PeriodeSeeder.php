<?php

namespace Database\Seeders;

use App\Models\Linimasa;
use App\Models\PeriodeLomba;
use Illuminate\Database\Seeder;

class PeriodeSeeder extends Seeder
{
    public function run(): void
    {
        // Periode 2025 (Non-Aktif / Arsip)
        $periode2025 = PeriodeLomba::updateOrCreate(
            ['tahun' => 2025],
            [
                'nama' => 'IGA 2025',
                'aktif' => false,
                'tanggal_mulai' => '2025-02-16',
                'tanggal_selesai' => '2025-10-31',
            ]
        );

        // Periode 2026 (Aktif)
        $periode2026 = PeriodeLomba::updateOrCreate(
            ['tahun' => 2026],
            [
                'nama' => 'IGA 2026',
                'aktif' => true,
                'tanggal_mulai' => '2026-06-01',
                'tanggal_selesai' => '2026-10-31',
            ]
        );

        $tahapan2025 = [
            ['Sosialisasi & Workshop Inovasi Sumbawa', '2025-01-01', '2025-02-15'],
            ['Pengumpulan & Input Profil Inovasi', '2025-02-16', '2025-04-30'],
            ['Pendampingan & Validasi Berjenjang OPD', '2025-05-01', '2025-07-31'],
            ['Penilaian Internal & Skoring SPD/SID', '2025-08-01', '2025-10-15'],
            ['Penggalangan Kesiapan & Ekspor Kemendagri', '2025-10-16', '2025-11-30'],
        ];

        $tahapan2026 = [
            ['Sosialisasi & Workshop Inovasi Sumbawa', '2026-01-01', '2026-05-31'],
            ['Pengumpulan & Input Profil Inovasi', '2026-06-01', '2026-10-31'],
            ['Pendampingan & Validasi Berjenjang OPD', '2026-11-01', '2026-11-20'],
            ['Penilaian Internal & Skoring SPD/SID', '2026-11-21', '2026-12-10'],
            ['Penggalangan Kesiapan & Ekspor Kemendagri', '2026-12-11', '2026-12-31'],
        ];

        foreach ($tahapan2025 as [$nama, $mulai, $selesai]) {
            Linimasa::updateOrCreate(
                [
                    'periode_lomba_id' => $periode2025->id,
                    'nama' => $nama,
                ],
                [
                    'mulai' => $mulai,
                    'selesai' => $selesai,
                ]
            );
        }

        foreach ($tahapan2026 as [$nama, $mulai, $selesai]) {
            Linimasa::updateOrCreate(
                [
                    'periode_lomba_id' => $periode2026->id,
                    'nama' => $nama,
                ],
                [
                    'mulai' => $mulai,
                    'selesai' => $selesai,
                ]
            );
        }
    }
}
