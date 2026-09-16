<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class PrintInovasiTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private PeriodeLomba $periode;
    private Inovasi $inovasi;

    protected function setUp(): void
    {
        parent::setUp();

        $this->periode = PeriodeLomba::create(['tahun' => 2026, 'nama' => 'IGA 2026', 'aktif' => true]);
        $opd = Opd::create(['kode' => 'OPD-01', 'nama' => 'Dinas Kesehatan Sumbawa']);

        $this->user = User::factory()->create(['nama_pemda' => 'Dinas Kesehatan Sumbawa']);
        $permission = Permission::firstOrCreate(['name' => 'view-dashboard']);
        $this->user->givePermissionTo($permission);

        $this->inovasi = Inovasi::create([
            'user_id' => $this->user->id,
            'opd_id' => $opd->id,
            'nama_inovasi' => 'Inovasi Tes Cetak Profil',
            'nama_inisiator' => 'Tim Inovator',
            'jenis_inovasi' => 'digital',
            'bentuk_inovasi' => 'tata_kelola',
            'tematik' => 'pelayanan_publik',
            'tahapan' => 'penerapan',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2026-01-01',
            'rancang_bangun' => 'Rancang bangun tes cetak profil',
            'tujuan' => 'Tujuan tes cetak',
            'manfaat' => 'Manfaat tes cetak',
            'hasil_inovasi' => 'Hasil tes cetak',
        ]);

        \App\Models\PengajuanLomba::create([
            'inovasi_id' => $this->inovasi->id,
            'periode_lomba_id' => $this->periode->id,
            'user_id' => $this->user->id,
            'is_inovasi_daerah' => true,
            'status' => 'siap_kirim',
            'estimasi_skor_kematangan' => 85.5,
        ]);
    }

    public function test_user_can_access_printable_inovasi_profil(): void
    {
        $response = $this->actingAs($this->user)->get("/inovasi/{$this->inovasi->id}/print");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('inovasi/print'));
    }

    public function test_export_routes_are_not_available(): void
    {
        $response = $this->actingAs($this->user)->get('/ekspor');
        $response->assertStatus(404);

        $responseExcel = $this->actingAs($this->user)->get('/ekspor/kemendagri');
        $responseExcel->assertStatus(404);

        $responseJson = $this->actingAs($this->user)->get('/ekspor/kemendagri/json');
        $responseJson->assertStatus(404);
    }
}
