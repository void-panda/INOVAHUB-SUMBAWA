<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_access_dynamic_dashboard(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('inovator');

        $periode = PeriodeLomba::create(['tahun' => 2026, 'nama' => 'IGA 2026', 'aktif' => true]);

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Tes Inovasi Dashboard',
            'tahapan' => 'inisiatif',
            'nama_inisiator' => 'Inovator Tes',
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2026-01-01',
            'user_id' => $user->id,
            'is_inovasi_daerah' => true,
        ]);

        PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $user->id,
            'is_inovasi_daerah' => true,
            'status' => 'dalam_pendampingan',
        ]);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response->assertOk();
    }
}
