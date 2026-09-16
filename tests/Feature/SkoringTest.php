<?php

namespace Tests\Feature;

use App\Enums\StatusInovasi;
use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\IndikatorSeeder;
use Database\Seeders\OpdSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkoringTest extends TestCase
{
    use RefreshDatabase;

    public function test_tim_penilai_can_evaluate_and_score_inovasi(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(OpdSeeder::class);
        $this->seed(PeriodeSeeder::class);
        $this->seed(IndikatorSeeder::class);

        $opd = Opd::first();
        $periode = PeriodeLomba::where('aktif', true)->firstOrFail();

        $inovator = User::factory()->create(['opd_id' => $opd?->id]);
        $inovator->assignRole('inovator');

        $timPenilai = User::factory()->create();
        $timPenilai->assignRole('tim_penilai');

        $inovasi = Inovasi::create([
            'user_id' => $inovator->id,
            'opd_id' => $opd?->id,
            'nama_inovasi' => 'Inovasi Skoring Test',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim Evaluasi',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'is_inovasi_daerah' => true,
        ]);

        $pengajuan = \App\Models\PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
            'status' => \App\Enums\StatusPengajuan::DisahkanOpd,
        ]);

        $sid1 = IndikatorSid::where('kode', 'SID-01')->firstOrFail();
        $spd1 = IndikatorSpd::where('kode', 'SPD-01')->firstOrFail();

        // 1. Tim penilai akses antrean & lembar evaluasi
        $this->actingAs($timPenilai)->get(route('penilai.skoring.index'))->assertOk();
        $this->actingAs($timPenilai)->get(route('penilai.skoring.show', $pengajuan))->assertOk();

        // 2. Simpan draft penilaian
        $this->actingAs($timPenilai)->post(route('penilai.skoring.store', $pengajuan), [
            'items_sid' => [
                ['indikator_id' => $sid1->id, 'tier' => 3, 'catatan' => 'Sangat baik'],
            ],
            'items_spd' => [
                ['indikator_id' => $spd1->id, 'tier' => 2, 'catatan' => 'Memenuhi'],
            ],
            'is_final' => false,
        ])->assertRedirect(route('penilai.skoring.index'));

        $this->assertSame(\App\Enums\StatusPengajuan::ReviewInternal, $pengajuan->fresh()->status);
        $this->assertDatabaseHas('skor_pengajuan', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_id' => $sid1->id,
            'tier' => 3,
        ]);

        // 3. Finalisasi penilaian
        $this->actingAs($timPenilai)->post(route('penilai.skoring.store', $pengajuan), [
            'items_sid' => [
                ['indikator_id' => $sid1->id, 'tier' => 3, 'catatan' => 'Final 3'],
            ],
            'items_spd' => [
                ['indikator_id' => $spd1->id, 'tier' => 3, 'catatan' => 'Final 3'],
            ],
            'is_final' => true,
        ])->assertRedirect(route('penilai.skoring.index'));

        $this->assertSame(\App\Enums\StatusPengajuan::SiapKirim, $pengajuan->fresh()->status);
        $this->assertDatabaseHas('notifikasi', [
            'user_id' => $inovator->id,
            'tipe' => 'skoring_selesai',
        ]);
    }
}
