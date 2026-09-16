<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PeriodeLomba;
use App\Models\User;
use App\Services\SimulasiIidService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SimulasiIidTest extends TestCase
{
    use RefreshDatabase;

    public function test_simulasi_iid_service_calculates_correct_scores(): void
    {
        $periode = PeriodeLomba::create(['tahun' => '2026', 'nama' => 'IGA 2026', 'aktif' => true]);
        $opd = Opd::create(['kode' => 'OPD01', 'nama' => 'Dinas Pendidikan Sumbawa']);
        $user = User::factory()->create(['nama_pemda' => 'OPD01']);

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Aplikasi Pembelajaran Digital',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim Pendidikan',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2026-01-01',
            'urusan_wajib' => json_encode(['Pendidikan', 'Kesehatan', 'Sosial', 'Pekerjaan Umum & Penataan Ruang', 'Ketenteraman, Ketertiban Umum & Pelindungan Masyarakat']),
            'user_id' => $user->id,
            'opd_id' => $opd->id,
            'is_inovasi_daerah' => true,
        ]);

        \App\Models\PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $user->id,
            'is_inovasi_daerah' => true,
            'status' => \App\Enums\StatusPengajuan::SiapKirim,
            'estimasi_skor_kematangan' => 85.0,
        ]);

        $service = app(SimulasiIidService::class);
        $result = $service->getSimulasiData($periode->id);

        $this->assertArrayHasKey('iid_score', $result);
        $this->assertArrayHasKey('kategori_iga', $result);
        $this->assertTrue($result['yandas']['is_compliant']);
        $this->assertEquals(5, $result['yandas']['fulfilled_count']);
    }

    public function test_user_can_access_simulasi_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('simulasi.index'));

        $response->assertOk();
    }
}
