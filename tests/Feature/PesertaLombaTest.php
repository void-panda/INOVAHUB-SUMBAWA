<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PesertaLombaTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $inovator;
    private PeriodeLomba $periode;
    private Inovasi $inovasi;

    protected function setUp(): void
    {
        parent::setUp();

        // Create Permissions & Roles
        $manageMasterData = Permission::firstOrCreate(['name' => 'manage-master-data']);
        $scoringSpd = Permission::firstOrCreate(['name' => 'scoring-spd']);
        $scoringSid = Permission::firstOrCreate(['name' => 'scoring-sid']);
        $inputInovasi = Permission::firstOrCreate(['name' => 'input-inovasi']);

        $roleBapperida = Role::firstOrCreate(['name' => 'bapperida']);
        $roleBapperida->givePermissionTo([$manageMasterData, $scoringSpd, $scoringSid]);

        $rolePenilai = Role::firstOrCreate(['name' => 'tim_penilai']);
        $rolePenilai->givePermissionTo([$scoringSpd, $scoringSid]);

        $roleInovator = Role::firstOrCreate(['name' => 'inovator']);
        $roleInovator->givePermissionTo($inputInovasi);

        $this->periode = PeriodeLomba::create(['tahun' => 2026, 'nama' => 'IGA 2026', 'aktif' => true]);
        $opd = Opd::create(['kode' => 'OPD-01', 'nama' => 'Dinas Pendidikan Sumbawa']);

        // Admin BAPPERIDA
        $this->admin = User::factory()->create(['name' => 'Admin BAPPERIDA']);
        $this->admin->assignRole($roleBapperida);

        // Tim Penilai
        $this->penilai = User::factory()->create(['name' => 'Tim Penilai Juri']);
        $this->penilai->assignRole($rolePenilai);

        // Inovator
        $this->inovator = User::factory()->create([
            'name' => 'Inovator Dinas',
            'opd_id' => $opd->id,
            'tipe_inovator' => 'dinas',
        ]);
        $this->inovator->assignRole($roleInovator);

        // Inovasi
        $this->inovasi = Inovasi::create([
            'user_id' => $this->inovator->id,
            'opd_id' => $opd->id,
            'nama_inovasi' => 'Sistem Edukasi Sumbawa Hebat',
            'nama_inisiator' => 'Inisiator Pendidikan',
            'jenis_inovasi' => 'digital',
            'bentuk_inovasi' => 'tata_kelola',
            'tematik' => 'pelayanan_publik',
            'tahapan' => 'penerapan',
            'is_inovasi_daerah' => true,
            'koordinat' => '-8.49,117.41',
            'waktu_penerapan' => '2026-01-01',
            'rancang_bangun' => 'Rancang bangun sistem edukasi',
            'tujuan' => 'Tujuan sistem edukasi',
            'manfaat' => 'Manfaat sistem edukasi',
            'hasil_inovasi' => 'Hasil sistem edukasi',
        ]);

        PengajuanLomba::create([
            'inovasi_id' => $this->inovasi->id,
            'periode_lomba_id' => $this->periode->id,
            'user_id' => $this->inovator->id,
            'is_inovasi_daerah' => true,
            'status' => 'siap_kirim',
            'estimasi_skor_kematangan' => 92.4,
        ]);
    }

    public function test_bapperida_can_access_peserta_lomba_page(): void
    {
        $response = $this->actingAs($this->admin)->get('/penilai/peserta-lomba');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('penilai/peserta/index')
            ->has('peserta')
            ->has('summary')
            ->where('summary.total_peserta', 1)
            ->where('summary.total_opd', 1)
        );
    }

    public function test_tim_penilai_cannot_access_peserta_lomba_page(): void
    {
        $response = $this->actingAs($this->penilai)->get('/penilai/peserta-lomba');

        $response->assertStatus(403);
    }

    public function test_inovator_cannot_access_peserta_lomba_page(): void
    {
        $response = $this->actingAs($this->inovator)->get('/penilai/peserta-lomba');

        $response->assertStatus(403);
    }

    public function test_user_can_access_print_rekap_inovasi_daerah(): void
    {
        $response = $this->actingAs($this->admin)->get('/inovasi-daerah/print-rekap');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('inovasi/print-rekap')
            ->has('inovasiList')
            ->has('summary')
            ->where('summary.total_inovasi', 1)
            ->where('summary.total_siap_iga', 1)
        );
    }
}
