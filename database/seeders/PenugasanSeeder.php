<?php

namespace Database\Seeders;

use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Seeder;

class PenugasanSeeder extends Seeder
{
    public function run(): void
    {
        $periode2026 = PeriodeLomba::where('tahun', 2026)->first();
        if (! $periode2026) {
            return;
        }

        $pendamping1 = User::where('email', 'pendamping@sumbawakab.go.id')->first();
        $pendamping2 = User::where('email', 'pendamping2@sumbawakab.go.id')->first();

        if (! $pendamping1 || ! $pendamping2) {
            return;
        }

        $inovasiList = Inovasi::all();
        foreach ($inovasiList as $idx => $inovasi) {
            $assignedPendamping = ($idx % 2 === 0) ? $pendamping1 : $pendamping2;

            PenugasanPendamping::updateOrCreate(
                [
                    'inovasi_id' => $inovasi->id,
                    'periode_lomba_id' => $periode2026->id,
                ],
                [
                    'pendamping_id' => $assignedPendamping->id,
                    'opd_id' => $inovasi->opd_id,
                    'inovator_id' => $inovasi->user_id,
                    'inovasi_id' => $inovasi->id,
                    'periode_lomba_id' => $periode2026->id,
                ]
            );
        }
    }
}
