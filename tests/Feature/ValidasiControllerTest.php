<?php

namespace Tests\Feature;

use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\OpdSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ValidasiControllerTest extends TestCase
{
    use RefreshDatabase;

    private function setupBase(): array
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(OpdSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $opd = Opd::first();
        $pendamping = User::factory()->create();
        $pendamping->assignRole('pendamping');

        $timPenilai = User::factory()->create();
        $timPenilai->assignRole('tim_penilai');

        $inovator = User::factory()->create(['opd_id' => $opd?->id]);
        $inovator->assignRole('inovator');

        return compact('pendamping', 'timPenilai', 'inovator', 'opd');
    }

    public function test_pendamping_and_opd_workflow(): void
    {
        $data = $this->setupBase();
        $inovator = $data['inovator'];
        $pendamping = $data['pendamping'];
        $timPenilai = $data['timPenilai'];
        $periode = PeriodeLomba::where('aktif', true)->first();

        // 1. Inovasi master & pengajuan lomba
        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Inovasi Pendampingan',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim Pengusul',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);

        $pengajuan = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::DalamPendampingan,
        ]);

        // 2. Pendamping akses antrean & detail
        $this->actingAs($pendamping)->get(route('pendamping.index'))->assertOk();
        $this->actingAs($pendamping)->get(route('pendamping.show', $pengajuan))->assertOk();

        // 3. Pendamping rekomendasikan ke OPD
        $this->actingAs($pendamping)->post(route('pengajuan-lomba.rekomendasikan', $pengajuan), [
            'catatan' => 'Berkas 20 Indikator telah lengkap dan diverifikasi.',
        ])->assertRedirect();

        $this->assertSame(StatusPengajuan::DisahkanOpd, $pengajuan->fresh()->status);

        // 4. Lanjutkan ke Review Internal
        $this->actingAs($timPenilai)->post(route('pengajuan-lomba.review-internal', $pengajuan), [
            'catatan' => 'Disahkan oleh Kepala OPD dan masuk review internal.',
        ])->assertRedirect();

        $this->assertSame(StatusPengajuan::ReviewInternal, $pengajuan->fresh()->status);

        // 5. Siap Kirim
        $this->actingAs($timPenilai)->post(route('pengajuan-lomba.siap-kirim', $pengajuan), [
            'catatan' => 'Skor SPD dan SID telah difinalisasi.',
        ])->assertRedirect();

        $this->assertSame(StatusPengajuan::SiapKirim, $pengajuan->fresh()->status);

        // 6. Terkirim
        $this->actingAs($timPenilai)->post(route('pengajuan-lomba.kirim', $pengajuan), [
            'catatan' => 'Berhasil diekspor ke portal BSKDN Kemendagri.',
        ])->assertRedirect();

        $this->assertSame(StatusPengajuan::Terkirim, $pengajuan->fresh()->status);

        $this->assertDatabaseHas('validasi_log', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'status_sesudah' => 'terkirim',
        ]);
    }
}
