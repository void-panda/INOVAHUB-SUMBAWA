<?php

namespace Database\Seeders;

use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use App\Models\KelengkapanIndikator;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\SkorPengajuan;
use App\Models\SkorSpd;
use App\Models\User;
use Illuminate\Database\Seeder;

class SkorSeeder extends Seeder
{
    public function run(): void
    {
        $periode2025 = PeriodeLomba::where('tahun', 2025)->first();
        $periode2026 = PeriodeLomba::where('tahun', 2026)->first();
        if (! $periode2026) {
            return;
        }

        $pendamping = User::where('email', 'pendamping@sumbawakab.go.id')->first();

        // 1. Seed SkorSpd untuk 2025 dan 2026
        $indikatorSpds = IndikatorSpd::take(6)->get();
        foreach ([$periode2025, $periode2026] as $periode) {
            if (! $periode) {
                continue;
            }
            foreach ($indikatorSpds as $index => $indikator) {
                $tier = ($index % 2 === 0) ? 3 : 2;
                $skor = $indikator->bobot * $tier;

                SkorSpd::updateOrCreate(
                    [
                        'periode_lomba_id' => $periode->id,
                        'indikator_id' => $indikator->id,
                    ],
                    [
                        'tier' => $tier,
                        'skor' => $skor,
                        'catatan' => "Penilaian skor SPD indikator {$indikator->kode} ({$indikator->nama}) Kabupaten Sumbawa.",
                    ]
                );
            }
        }

        // 2. Seed SkorPengajuan & KelengkapanIndikator untuk seluruh pengajuan (arsip 2025 & aktif 2026)
        $allPengajuan = PengajuanLomba::all();
        $indikatorSids = IndikatorSid::where('kode', '!=', 'SID-21')->get();

        foreach ($allPengajuan as $pengajuan) {
            // Isi 6 indikator pertama dengan data lengkap
            foreach ($indikatorSids->take(6) as $index => $indikator) {
                $tier = ($pengajuan->is_inovasi_daerah) ? 3 : (($index % 2 === 0) ? 2 : 1);
                $skor = $indikator->bobot * $tier;

                SkorPengajuan::updateOrCreate(
                    [
                        'pengajuan_lomba_id' => $pengajuan->id,
                        'indikator_id' => $indikator->id,
                    ],
                    [
                        'tier' => $tier,
                        'skor' => $skor,
                        'catatan' => "Penilaian indikator {$indikator->kode} ({$indikator->nama}).",
                        'komentar_pendamping' => ($index === 0 && $pendamping) ? 'Bukti regulasi dan SK sudah sangat jelas dan relevan.' : null,
                        'pendamping_id' => ($index === 0 && $pendamping) ? $pendamping->id : null,
                        'komentar_at' => ($index === 0) ? now() : null,
                    ]
                );

                KelengkapanIndikator::updateOrCreate(
                    [
                        'pengajuan_lomba_id' => $pengajuan->id,
                        'indikator_sid_id' => $indikator->id,
                    ],
                    [
                        'parameter' => 'p3',
                        'catatan' => 'Berkas dan SK pendukung telah diunggah lengkap.',
                    ]
                );
            }
        }
    }
}
