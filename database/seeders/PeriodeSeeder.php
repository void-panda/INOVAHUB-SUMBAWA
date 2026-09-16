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
            ['aktif' => false]
        );

        // Periode 2026 (Aktif)
        $periode2026 = PeriodeLomba::updateOrCreate(
            ['tahun' => 2026],
            ['aktif' => true]
        );

        $tahapan = [
            ['Sosialisasi & Workshop Inovasi Sumbawa', '01-01', '02-15'],
            ['Pengumpulan & Input Profil Inovasi', '02-16', '04-30'],
            ['Pendampingan & Validasi Berjenjang OPD', '05-01', '07-31'],
            ['Penilaian Internal & Skoring SPD/SID', '08-01', '10-15'],
            ['Penggalangan Kesiapan & Ekspor Kemendagri', '10-16', '11-30'],
        ];

        foreach ([$periode2025, $periode2026] as $periode) {
            $tahun = $periode->tahun;
            foreach ($tahapan as [$nama, $mulai, $selesai]) {
                Linimasa::updateOrCreate(
                    [
                        'periode_lomba_id' => $periode->id,
                        'nama' => $nama,
                    ],
                    [
                        'mulai' => "{$tahun}-{$mulai}",
                        'selesai' => "{$tahun}-{$selesai}",
                    ]
                );
            }
        }
    }
}
