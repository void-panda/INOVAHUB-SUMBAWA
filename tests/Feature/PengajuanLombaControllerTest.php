<?php

namespace Tests\Feature;

use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use App\Services\PengajuanLombaService;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PengajuanLombaControllerTest extends TestCase
{
    use RefreshDatabase;

    private function setupUsers(): array
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $inovator = User::factory()->create();
        $inovator->assignRole('inovator');

        $pendamping = User::factory()->create();
        $pendamping->assignRole('pendamping');

        $timPenilai = User::factory()->create();
        $timPenilai->assignRole('tim_penilai');

        return [$inovator, $pendamping, $timPenilai];
    }

    public function test_inovator_can_submit_master_inovasi_to_active_lomba(): void
    {
        [$inovator] = $this->setupUsers();

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'SI-PINTAR Sumbawa',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Disdikbud',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2026-01-10',
            'user_id' => $inovator->id,
        ]);

        $response = $this->actingAs($inovator)->post(route('pengajuan-lomba.store'), [
            'inovasi_id' => $inovasi->id,
        ]);

        $response->assertRedirect();

        $pengajuan = PengajuanLomba::where('inovasi_id', $inovasi->id)->first();
        $this->assertNotNull($pengajuan);
        $this->assertSame(StatusPengajuan::DalamPendampingan, $pengajuan->status);
        $this->assertFalse($pengajuan->is_arsip);

        $this->assertDatabaseHas('validasi_log', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'status_sesudah' => 'dalam_pendampingan',
        ]);
    }

    public function test_tim_penilai_can_tetapkan_dan_cabut_inovasi_daerah(): void
    {
        [$inovator, , $timPenilai] = $this->setupUsers();
        $periode = PeriodeLomba::where('aktif', true)->first();

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Inovasi Tes Daerah',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Dinkes',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2026-01-10',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => false,
        ]);

        $pengajuan = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => false,
            'status' => StatusPengajuan::DalamPendampingan,
        ]);

        // Tetapkan sebagai Inovasi Daerah
        $this->actingAs($timPenilai)
            ->post(route('pengajuan-lomba.tetapkan', $pengajuan), ['status' => true])
            ->assertRedirect();

        $this->assertTrue($pengajuan->fresh()->is_inovasi_daerah);
        $this->assertTrue($inovasi->fresh()->is_inovasi_daerah);

        // Cabut status Inovasi Daerah
        $this->actingAs($timPenilai)
            ->post(route('pengajuan-lomba.tetapkan', $pengajuan), ['status' => false])
            ->assertRedirect();

        $this->assertFalse($pengajuan->fresh()->is_inovasi_daerah);
        $this->assertFalse($inovasi->fresh()->is_inovasi_daerah);
    }


    public function test_inovator_can_ajukan_kembali_from_arsip(): void
    {
        [$inovator] = $this->setupUsers();
        $periode2025 = PeriodeLomba::firstOrCreate(['tahun' => 2025], ['nama' => 'IGA 2025', 'aktif' => false]);

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'SI-ARSIP',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Kominfo',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2025-01-10',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);

        $pengajuan2025 = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode2025->id,
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::Terkirim,
            'is_arsip' => true,
        ]);

        $this->actingAs($inovator)->post(route('pengajuan-lomba.ajukan-kembali', $pengajuan2025), [
            'penjelasan_pengembangan' => 'Penambahan fitur mobile responsive dan integrasi TTE.',
        ])->assertRedirect();

        $this->assertDatabaseHas('pengajuan_lomba', [
            'inovasi_id' => $inovasi->id,
            'pengajuan_asal_id' => $pengajuan2025->id,
            'is_arsip' => false,
            'status' => 'dalam_pendampingan',
        ]);
    }

    public function test_auto_archive_scheduler_archives_inactive_periode(): void
    {
        [$inovator] = $this->setupUsers();
        $periodeLama = PeriodeLomba::create(['tahun' => 2024, 'nama' => 'IGA 2024', 'aktif' => false]);

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Inovasi Jadul',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Kominfo',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2024-01-10',
            'user_id' => $inovator->id,
        ]);

        $pengajuan = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periodeLama->id,
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => false,
            'status' => StatusPengajuan::DalamPendampingan,
            'is_arsip' => false,
        ]);

        $service = app(PengajuanLombaService::class);
        $affected = $service->arsipkanPeriodeLama();

        $this->assertSame(1, $affected);
        $this->assertTrue($pengajuan->fresh()->is_arsip);
    }
}
