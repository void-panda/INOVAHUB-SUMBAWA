<?php

namespace Tests\Feature;

use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PendampingAntreanValidasiTest extends TestCase
{
    use RefreshDatabase;

    private PeriodeLomba $periode;
    private User $pendamping;
    private Opd $opdKominfo;
    private Opd $opdDinkes;
    private User $inovatorKominfo;
    private User $inovatorDinkes;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $this->periode = PeriodeLomba::where('aktif', true)->first();

        $this->opdKominfo = Opd::create(['nama' => 'Dinas Komunikasi dan Informatika', 'kode' => 'KOMINFO']);
        $this->opdDinkes = Opd::create(['nama' => 'Dinas Kesehatan', 'kode' => 'DINKES']);

        $this->pendamping = User::factory()->create(['name' => 'Pendamping Kominfo']);
        $this->pendamping->assignRole('pendamping');

        $this->inovatorKominfo = User::factory()->create(['name' => 'Inovator Kominfo', 'opd_id' => $this->opdKominfo->id]);
        $this->inovatorKominfo->assignRole('inovator');

        $this->inovatorDinkes = User::factory()->create(['name' => 'Inovator Dinkes', 'opd_id' => $this->opdDinkes->id]);
        $this->inovatorDinkes->assignRole('inovator');

        // Berikan penugasan khusus ke OPD Kominfo
        PenugasanPendamping::create([
            'pendamping_id' => $this->pendamping->id,
            'opd_id' => $this->opdKominfo->id,
            'periode_lomba_id' => $this->periode->id,
        ]);
    }

    private function createInovasiWithPengajuan(User $user, Opd $opd, string $nama, StatusPengajuan $status): PengajuanLomba
    {
        $inovasi = Inovasi::create([
            'user_id' => $user->id,
            'opd_id' => $opd->id,
            'nama_inovasi' => $nama,
            'tahapan' => 'penerapan',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'nama_inisiator' => 'Inisiator Test',
            'koordinat' => '-8.5000, 117.4000',
            'waktu_penerapan' => '2024-01-01',
            'rancang_bangun' => 'Rancang bangun pengujian sistem antrean.',
            'tujuan' => 'Tujuan pengujian.',
            'manfaat' => 'Manfaat pengujian.',
            'is_inovasi_daerah' => true,
        ]);

        return PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'user_id' => $user->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => $status,
            'estimasi_skor_kematangan' => 75.0,
        ]);
    }

    public function test_pendamping_only_sees_assigned_opd_inovasi(): void
    {
        $pengajuanKominfo = $this->createInovasiWithPengajuan(
            $this->inovatorKominfo,
            $this->opdKominfo,
            'Inovasi Kominfo Aktif',
            StatusPengajuan::DalamPendampingan
        );

        $pengajuanDinkes = $this->createInovasiWithPengajuan(
            $this->inovatorDinkes,
            $this->opdDinkes,
            'Inovasi Dinkes Lain',
            StatusPengajuan::DalamPendampingan
        );

        $response = $this->actingAs($this->pendamping)->get(route('pendamping.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('pendamping/index')
            ->where('counts.all', 1)
            ->where('counts.dalam_pendampingan', 1)
            ->has('inovasiList.data', 1)
            ->where('inovasiList.data.0.id', $pengajuanKominfo->id)
            ->where('inovasiList.data.0.nama_inovasi', 'Inovasi Kominfo Aktif')
        );
    }

    public function test_pendamping_queue_only_shows_active_inovasi_and_excludes_disahkan(): void
    {
        $pengajuan1 = $this->createInovasiWithPengajuan(
            $this->inovatorKominfo,
            $this->opdKominfo,
            'Inovasi Dalam Pendampingan',
            StatusPengajuan::DalamPendampingan
        );

        $pengajuan2 = $this->createInovasiWithPengajuan(
            $this->inovatorKominfo,
            $this->opdKominfo,
            'Inovasi Telah Disahkan',
            StatusPengajuan::DisahkanOpd
        );

        // Antrean hanya menampilkan pengajuan aktif (pengajuan1), bukan pengajuan yang sudah disahkan
        $this->actingAs($this->pendamping)
            ->get(route('pendamping.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('pendamping/index')
                ->where('counts.all', 1)
                ->where('counts.dalam_pendampingan', 1)
                ->where('counts.disahkan_opd', 1)
                ->has('inovasiList.data', 1)
                ->where('inovasiList.data.0.id', $pengajuan1->id)
                ->where('inovasiList.data.0.nama_inovasi', 'Inovasi Dalam Pendampingan')
            );
    }

    public function test_pendamping_can_sahkan_opd(): void
    {
        $pengajuan = $this->createInovasiWithPengajuan(
            $this->inovatorKominfo,
            $this->opdKominfo,
            'Inovasi Siap Disahkan',
            StatusPengajuan::DalamPendampingan
        );

        $response = $this->actingAs($this->pendamping)
            ->post("/pendamping/inovasi/{$pengajuan->id}/sahkan-opd", [
                'catatan' => 'Berkas 20 indikator telah lengkap dan diverifikasi.',
            ]);

        $response->assertRedirect();

        $pengajuan->refresh();
        $this->assertEquals(StatusPengajuan::DisahkanOpd, $pengajuan->status);
        $this->assertDatabaseHas('validasi_log', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'status_sesudah' => 'disahkan_opd',
        ]);
    }
}
