<?php

namespace Tests\Feature;

use App\Enums\StatusInovasi;
use App\Models\Inovasi;
use App\Models\InovasiVersi;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PeriodeDanVersiTest extends TestCase
{
    use RefreshDatabase;

    private function setupRolesAndUsers(): array
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $penilai = User::factory()->create();
        $penilai->assignRole('tim_penilai');

        $inovator = User::factory()->create();
        $inovator->assignRole('inovator');

        return [$penilai, $inovator];
    }

    public function test_penilai_can_manage_periode_lomba(): void
    {
        [$penilai, $inovator] = $this->setupRolesAndUsers();

        // Access index page
        $this->actingAs($penilai)
            ->get(route('penilai.periode.index'))
            ->assertOk();

        // Create new period
        $this->actingAs($penilai)
            ->post(route('penilai.periode.store'), [
                'tahun' => 2027,
                'nama' => 'IGA 2027 Sumbawa',
                'set_aktif' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('periode_lomba', [
            'tahun' => 2027,
            'aktif' => true,
        ]);

        // Verify previous period is deactivated
        $oldPeriod = PeriodeLomba::where('tahun', 2026)->first();
        $this->assertFalse((bool) $oldPeriod->aktif);
    }

    public function test_inovator_can_ajukan_kembali_archived_inovasi(): void
    {
        [$penilai, $inovator] = $this->setupRolesAndUsers();

        // Create old archived innovation attached to inactive 2025 period
        $periode2025 = PeriodeLomba::firstOrCreate(
            ['tahun' => 2025],
            ['aktif' => false]
        );

        $activePeriode = PeriodeLomba::where('aktif', true)->first();

        $originalInovasi = Inovasi::create([
            'user_id' => $inovator->id,
            'nama_inovasi' => 'SI-SEHAT Sumbawa v1',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Dinas Kesehatan',
            'koordinat' => '-8.4931,117.4193',
            'waktu_penerapan' => '2025-01-10',
            'is_inovasi_daerah' => true,
        ]);

        $originalPengajuan = \App\Models\PengajuanLomba::create([
            'inovasi_id' => $originalInovasi->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
            'status' => \App\Enums\StatusPengajuan::Terkirim,
            'is_arsip' => true,
        ]);

        $this->actingAs($inovator)
            ->post(route('pengajuan-lomba.ajukan-kembali', $originalPengajuan), [
                'penjelasan_pengembangan' => 'Penambahan fitur telemedicine dan antrean elektronik mandiri.',
            ])
            ->assertRedirect();

        // Check new cloned pengajuan
        $newPengajuan = \App\Models\PengajuanLomba::where('pengajuan_asal_id', $originalPengajuan->id)->first();
        $this->assertNotNull($newPengajuan);
        $this->assertSame($originalInovasi->id, $newPengajuan->inovasi_id);
        $this->assertSame($activePeriode->id, $newPengajuan->periode_lomba_id);
        $this->assertSame(\App\Enums\StatusPengajuan::DalamPendampingan, $newPengajuan->status);
        $this->assertFalse((bool) $newPengajuan->is_arsip);
        $this->assertSame('Penambahan fitur telemedicine dan antrean elektronik mandiri.', $newPengajuan->penjelasan_pengembangan);

        // Check validasi_log
        $this->assertDatabaseHas('validasi_log', [
            'pengajuan_lomba_id' => $newPengajuan->id,
            'status_sesudah' => \App\Enums\StatusPengajuan::DalamPendampingan->value,
        ]);
    }
}
