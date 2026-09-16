<?php

namespace Tests\Feature;

use App\Enums\StatusPengajuan;
use App\Models\IndikatorSid;
use App\Models\Inovasi;
use App\Models\KelengkapanIndikator;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\SkorPengajuan;
use App\Models\User;
use App\Services\PengajuanLombaService;
use Database\Seeders\IndikatorSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class PengajuanLombaServiceTest extends TestCase
{
    use RefreshDatabase;

    private PengajuanLombaService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(PengajuanLombaService::class);
    }

    private function setupUserAndInovasi(): array
    {
        $this->seed(RolePermissionSeeder::class);

        $inovator = User::factory()->create();
        $inovator->assignRole('inovator');

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Aplikasi Layanan Cerdas',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Diskominfotik',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2025-05-01',
            'user_id' => $inovator->id,
        ]);

        return [$inovator, $inovasi];
    }

    public function test_arsipkan_periode_lama_marks_inactive_period_submissions_as_arsip(): void
    {
        [$inovator, $inovasi] = $this->setupUserAndInovasi();

        $periodeLama = PeriodeLomba::create([
            'tahun' => 2025,
            'nama' => 'IGA 2025',
            'aktif' => false,
        ]);

        $periodeBaru = PeriodeLomba::create([
            'tahun' => 2026,
            'nama' => 'IGA 2026',
            'aktif' => true,
        ]);

        $pengajuanLama = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periodeLama->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::DalamPendampingan,
            'is_arsip' => false,
        ]);

        $pengajuanBaru = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periodeBaru->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::DalamPendampingan,
            'is_arsip' => false,
        ]);

        $updatedCount = $this->service->arsipkanPeriodeLama();

        $this->assertSame(1, $updatedCount);
        $this->assertTrue($pengajuanLama->fresh()->is_arsip);
        $this->assertFalse($pengajuanBaru->fresh()->is_arsip);
    }

    public function test_ajukan_ke_lomba_throws_validation_exception_when_no_active_periode(): void
    {
        [$inovator, $inovasi] = $this->setupUserAndInovasi();

        PeriodeLomba::create([
            'tahun' => 2025,
            'nama' => 'IGA 2025',
            'aktif' => false,
        ]);

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Tidak ada periode lomba yang sedang aktif saat ini.');

        $this->service->ajukanKeLomba($inovasi, $inovator);
    }

    public function test_ajukan_ke_lomba_succeeds_when_active_periode_exists(): void
    {
        [$inovator, $inovasi] = $this->setupUserAndInovasi();

        $periodeAktif = PeriodeLomba::create([
            'tahun' => 2026,
            'nama' => 'IGA 2026',
            'aktif' => true,
        ]);

        $pengajuan = $this->service->ajukanKeLomba($inovasi, $inovator);

        $this->assertNotNull($pengajuan);
        $this->assertSame($periodeAktif->id, $pengajuan->periode_lomba_id);
        $this->assertSame(StatusPengajuan::DalamPendampingan, $pengajuan->status);
        $this->assertFalse($pengajuan->is_arsip);
    }

    public function test_ajukan_kembali_throws_validation_exception_when_no_active_periode(): void
    {
        [$inovator, $inovasi] = $this->setupUserAndInovasi();

        $periodeLama = PeriodeLomba::create([
            'tahun' => 2025,
            'nama' => 'IGA 2025',
            'aktif' => false,
        ]);

        $pengajuanLama = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periodeLama->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::DalamPendampingan,
            'is_arsip' => true,
        ]);

        $this->expectException(ValidationException::class);
        $this->expectExceptionMessage('Tidak ada periode lomba yang sedang aktif.');

        $this->service->ajukanKembali($pengajuanLama, $inovator, 'Pengembangan versi 2.0');
    }

    public function test_ajukan_kembali_prefills_scores_and_kelengkapan_from_archived_pengajuan(): void
    {
        [$inovator, $inovasi] = $this->setupUserAndInovasi();
        $this->seed(IndikatorSeeder::class);

        $periodeLama = PeriodeLomba::create([
            'tahun' => 2025,
            'nama' => 'IGA 2025',
            'aktif' => false,
        ]);

        $periodeBaru = PeriodeLomba::create([
            'tahun' => 2026,
            'nama' => 'IGA 2026',
            'aktif' => true,
        ]);

        $pengajuanLama = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periodeLama->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::DisahkanOpd,
            'is_arsip' => true,
            'estimasi_skor_kematangan' => 88.5,
        ]);

        $indikator = IndikatorSid::first();
        if ($indikator) {
            KelengkapanIndikator::create([
                'pengajuan_lomba_id' => $pengajuanLama->id,
                'indikator_sid_id' => $indikator->id,
                'parameter' => 'P3',
                'catatan' => 'Regulasi lengkap',
            ]);
        }

        $newPengajuan = $this->service->ajukanKembali(
            $pengajuanLama,
            $inovator,
            'Penambahan fitur analytics mobile'
        );

        $this->assertNotNull($newPengajuan);
        $this->assertSame($periodeBaru->id, $newPengajuan->periode_lomba_id);
        $this->assertSame($pengajuanLama->id, $newPengajuan->pengajuan_asal_id);
        $this->assertSame('Penambahan fitur analytics mobile', $newPengajuan->penjelasan_pengembangan);
        $this->assertEquals(88.5, $newPengajuan->estimasi_skor_kematangan);
        $this->assertFalse($newPengajuan->is_arsip);

        if ($indikator) {
            $kelengkapanBaru = KelengkapanIndikator::where('pengajuan_lomba_id', $newPengajuan->id)
                ->where('indikator_sid_id', $indikator->id)
                ->first();
            $this->assertNotNull($kelengkapanBaru);
            $this->assertSame('P3', $kelengkapanBaru->parameter);
            $this->assertSame('Regulasi lengkap', $kelengkapanBaru->catatan);
        }
    }

    public function test_yearly_schedule_registers_auto_archive_command(): void
    {
        $schedule = app()->make(Schedule::class);
        $events = collect($schedule->events());

        $hasArchiveEvent = $events->contains(function ($event) {
            return $event->expression === '0 0 1 1 *';
        });

        $this->assertTrue($hasArchiveEvent, 'Scheduler untuk arsip tahunan 1 Januari harus terdaftar dengan ekspresi "0 0 1 1 *".');
    }

    public function test_schedule_execution_with_travel_to_january_first(): void
    {
        [$inovator, $inovasi] = $this->setupUserAndInovasi();

        $periodeLama = PeriodeLomba::create([
            'tahun' => 2025,
            'nama' => 'IGA 2025',
            'aktif' => false,
        ]);

        $pengajuan = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periodeLama->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::DalamPendampingan,
            'is_arsip' => false,
        ]);

        // Simulasikan waktu melompat ke tepat 1 Januari 2027 00:00:00
        $this->travelTo('2027-01-01 00:00:00');

        $this->artisan('schedule:run');

        $this->assertTrue($pengajuan->fresh()->is_arsip);
    }
}
