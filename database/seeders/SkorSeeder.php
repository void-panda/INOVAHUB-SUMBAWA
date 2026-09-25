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

        $pendamping = User::where('email', 'pendamping@sumbawakab.go.id')->first();
        $pendamping2 = User::where('email', 'pendamping2@sumbawakab.go.id')->first();

        // 1. Seed SkorSpd untuk 2025 dan 2026
        $indikatorSpds = IndikatorSpd::all();
        foreach ([$periode2025, $periode2026] as $periode) {
            if (! $periode) {
                continue;
            }
            foreach ($indikatorSpds as $index => $indikator) {
                $tier = ($index % 3 === 0) ? 3 : (($index % 3 === 1) ? 2 : 3);
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

        // 2. Seed SkorPengajuan & KelengkapanIndikator (20 SID) untuk seluruh pengajuan lomba
        $allPengajuan = PengajuanLomba::all();
        // 20 Indikator SID resmi (SID-01 s/d SID-20)
        $indikatorSids = IndikatorSid::where('kode', '!=', 'SID-21')->orderBy('id')->get();

        foreach ($allPengajuan as $pIndex => $pengajuan) {
            $assignedPendamping = ($pIndex % 2 === 0) ? $pendamping : $pendamping2;

            foreach ($indikatorSids as $sIndex => $indikator) {
                // Inovasi Daerah memiliki bobot/tier lebih tinggi (p3/p2), Masyarakat p2/p3/p1
                if ($pengajuan->is_inovasi_daerah) {
                    $tier = ($sIndex % 4 === 0) ? 2 : 3;
                    $param = ($tier === 3) ? 'p3' : 'p2';
                } else {
                    $tier = ($sIndex % 3 === 0) ? 2 : (($sIndex % 3 === 1) ? 3 : 2);
                    $param = ($tier === 3) ? 'p3' : 'p2';
                }

                $skor = $indikator->bobot * $tier;

                // Skor Pengajuan dari Tim Penilai & Catatan Pendamping
                SkorPengajuan::updateOrCreate(
                    [
                        'pengajuan_lomba_id' => $pengajuan->id,
                        'indikator_id' => $indikator->id,
                    ],
                    [
                        'tier' => $tier,
                        'skor' => $skor,
                        'catatan' => "Penilaian indikator {$indikator->kode} ({$indikator->nama}) telah memenuhi kriteria verifikasi.",
                        'komentar_pendamping' => ($sIndex <= 2 && $assignedPendamping)
                            ? "Bukti dukung indikator {$indikator->kode} telah divalidasi sesuai pedoman IGA."
                            : null,
                        'pendamping_id' => ($sIndex <= 2 && $assignedPendamping) ? $assignedPendamping->id : null,
                        'komentar_at' => ($sIndex <= 2) ? now()->subMonths(6) : null,
                    ]
                );

                // Kelengkapan 20 Indikator SID (Progres 100%)
                KelengkapanIndikator::updateOrCreate(
                    [
                        'pengajuan_lomba_id' => $pengajuan->id,
                        'indikator_sid_id' => $indikator->id,
                    ],
                    [
                        'parameter' => $param,
                        'catatan' => "Bukti dukung indikator {$indikator->kode} telah diunggah dan terverifikasi sah.",
                    ]
                );
            }
        }
    }
}
