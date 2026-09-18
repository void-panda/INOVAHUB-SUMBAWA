<?php

namespace Tests\Feature;

use App\Enums\StatusInovasi;
use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\InovasiVersi;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
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

        // Create new period with date intervals
        $this->actingAs($penilai)
            ->post(route('penilai.periode.store'), [
                'tahun' => 2027,
                'nama' => 'IGA 2027 Sumbawa',
                'tanggal_mulai' => '2027-06-01',
                'tanggal_selesai' => '2027-10-31',
                'set_aktif' => true,
            ])
            ->assertRedirect();

        $newPeriod = PeriodeLomba::where('tahun', 2027)->first();
        $this->assertNotNull($newPeriod);
        $this->assertTrue((bool) $newPeriod->aktif);
        $this->assertSame('2027-06-01', $newPeriod->tanggal_mulai->format('Y-m-d'));
        $this->assertSame('2027-10-31', $newPeriod->tanggal_selesai->format('Y-m-d'));

        // Verify previous period is deactivated
        $oldPeriod = PeriodeLomba::where('tahun', 2026)->first();
        $this->assertFalse((bool) $oldPeriod->aktif);
    }

    public function test_penilai_can_update_periode_lomba_dates(): void
    {
        [$penilai, $inovator] = $this->setupRolesAndUsers();

        $periode = PeriodeLomba::where('tahun', 2026)->first();

        // Update period dates (perpanjang waktu lomba)
        $this->actingAs($penilai)
            ->put(route('penilai.periode.update', $periode), [
                'nama' => 'IGA 2026 Sumbawa (Diperpanjang)',
                'tanggal_mulai' => '2026-06-01',
                'tanggal_selesai' => '2026-11-30',
            ])
            ->assertRedirect();

        $periode->refresh();
        $this->assertSame('IGA 2026 Sumbawa (Diperpanjang)', $periode->nama);
        $this->assertSame('2026-11-30', $periode->tanggal_selesai->format('Y-m-d'));
    }

    public function test_store_periode_lomba_validates_date_interval(): void
    {
        [$penilai, $inovator] = $this->setupRolesAndUsers();

        // Tanggal selesai lebih awal dari tanggal mulai
        $response = $this->actingAs($penilai)
            ->post(route('penilai.periode.store'), [
                'tahun' => 2028,
                'nama' => 'IGA 2028',
                'tanggal_mulai' => '2028-10-01',
                'tanggal_selesai' => '2028-09-01', // Salah: sebelum tanggal mulai
                'set_aktif' => false,
            ]);

        $response->assertSessionHasErrors('tanggal_selesai');
    }

    public function test_ajukan_lomba_rejected_when_period_registration_closed(): void
    {
        [$penilai, $inovator] = $this->setupRolesAndUsers();

        // Set periode aktif dengan batas waktu yang sudah lewat
        $periode = PeriodeLomba::where('aktif', true)->first();
        $periode->update([
            'tanggal_mulai' => '2025-01-01',
            'tanggal_selesai' => '2025-02-01', // Closed
        ]);

        $inovasi = Inovasi::create([
            'user_id' => $inovator->id,
            'nama_inovasi' => 'Inovasi Coba',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Inisiator Test',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2025-01-01',
        ]);

        $service = app(\App\Services\PengajuanLombaService::class);

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('telah ditutup');

        $service->ajukanKeLomba($inovasi, $inovator);
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
