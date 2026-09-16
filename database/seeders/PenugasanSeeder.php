<?php

namespace Database\Seeders;

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

        $kominfo = Opd::where('kode', 'DISKOMINFO')->first();
        $dinkes = Opd::where('kode', 'DINKES')->first();
        $disdukcapil = Opd::where('kode', 'DISDUKCAPIL')->first();
        $disdikbud = Opd::where('kode', 'DISDIKBUD')->first();

        $inovatorMasyarakat = User::where('email', 'inovator5@sumbawakab.go.id')->first();

        $assignments = [
            [
                'pendamping_id' => $pendamping1?->id,
                'opd_id' => $kominfo?->id,
                'inovator_id' => null,
                'periode_lomba_id' => $periode2026->id,
            ],
            [
                'pendamping_id' => $pendamping1?->id,
                'opd_id' => $dinkes?->id,
                'inovator_id' => null,
                'periode_lomba_id' => $periode2026->id,
            ],
            [
                'pendamping_id' => $pendamping2?->id,
                'opd_id' => $disdukcapil?->id,
                'inovator_id' => null,
                'periode_lomba_id' => $periode2026->id,
            ],
            [
                'pendamping_id' => $pendamping2?->id,
                'opd_id' => $disdikbud?->id,
                'inovator_id' => null,
                'periode_lomba_id' => $periode2026->id,
            ],
            [
                'pendamping_id' => $pendamping1?->id,
                'opd_id' => null,
                'inovator_id' => $inovatorMasyarakat?->id,
                'periode_lomba_id' => $periode2026->id,
            ],
        ];

        foreach ($assignments as $assignment) {
            if ($assignment['pendamping_id']) {
                PenugasanPendamping::updateOrCreate(
                    [
                        'pendamping_id' => $assignment['pendamping_id'],
                        'periode_lomba_id' => $assignment['periode_lomba_id'],
                        'opd_id' => $assignment['opd_id'],
                        'inovator_id' => $assignment['inovator_id'],
                    ],
                    $assignment
                );
            }
        }
    }
}
