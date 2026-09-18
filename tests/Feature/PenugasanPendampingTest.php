<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\OpdSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PenugasanPendampingTest extends TestCase
{
    use RefreshDatabase;

    private function setupData(): array
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(OpdSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $admin = User::factory()->create();
        $admin->assignRole('bapperida');

        $pendampingA = User::factory()->create();
        $pendampingA->assignRole('pendamping');

        $pendampingB = User::factory()->create();
        $pendampingB->assignRole('pendamping');

        $opd = Opd::first();
        $inovator = User::factory()->create(['opd_id' => $opd?->id]);
        $inovator->assignRole('inovator');

        $inovasi1 = Inovasi::create([
            'nama_inovasi' => 'Inovasi 1',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim 1',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);

        $inovasi2 = Inovasi::create([
            'nama_inovasi' => 'Inovasi 2',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim 2',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);

        $inovasi3 = Inovasi::create([
            'nama_inovasi' => 'Inovasi 3',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim 3',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);

        return compact('admin', 'pendampingA', 'pendampingB', 'inovasi1', 'inovasi2', 'inovasi3');
    }

    public function test_admin_can_view_penugasan_page(): void
    {
        $data = $this->setupData();

        $response = $this->actingAs($data['admin'])->get(route('penugasan.index'));
        $response->assertOk();
    }

    public function test_admin_can_assign_multiple_innovations_to_pendamping(): void
    {
        $data = $this->setupData();
        $periode = PeriodeLomba::where('aktif', true)->first();

        $response = $this->actingAs($data['admin'])->post(route('penugasan.store'), [
            'pendamping_id' => $data['pendampingA']->id,
            'inovasi_ids' => [$data['inovasi1']->id, $data['inovasi2']->id],
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('penugasan_pendamping', [
            'pendamping_id' => $data['pendampingA']->id,
            'inovasi_id' => $data['inovasi1']->id,
            'periode_lomba_id' => $periode->id,
        ]);

        $this->assertDatabaseHas('penugasan_pendamping', [
            'pendamping_id' => $data['pendampingA']->id,
            'inovasi_id' => $data['inovasi2']->id,
            'periode_lomba_id' => $periode->id,
        ]);
    }

    public function test_reassigning_innovation_to_another_pendamping_replaces_old_assignment(): void
    {
        $data = $this->setupData();
        $periode = PeriodeLomba::where('aktif', true)->first();

        // Assign inovasi1 to Pendamping A
        $this->actingAs($data['admin'])->post(route('penugasan.store'), [
            'pendamping_id' => $data['pendampingA']->id,
            'inovasi_ids' => [$data['inovasi1']->id],
        ]);

        // Reassign inovasi1 to Pendamping B
        $this->actingAs($data['admin'])->post(route('penugasan.store'), [
            'pendamping_id' => $data['pendampingB']->id,
            'inovasi_ids' => [$data['inovasi1']->id, $data['inovasi3']->id],
        ]);

        // Inovasi 1 should now belong to Pendamping B, not A
        $this->assertDatabaseMissing('penugasan_pendamping', [
            'pendamping_id' => $data['pendampingA']->id,
            'inovasi_id' => $data['inovasi1']->id,
            'periode_lomba_id' => $periode->id,
        ]);

        $this->assertDatabaseHas('penugasan_pendamping', [
            'pendamping_id' => $data['pendampingB']->id,
            'inovasi_id' => $data['inovasi1']->id,
            'periode_lomba_id' => $periode->id,
        ]);
    }

    public function test_admin_can_unassign_innovation(): void
    {
        $data = $this->setupData();
        $periode = PeriodeLomba::where('aktif', true)->first();

        $penugasan = PenugasanPendamping::create([
            'pendamping_id' => $data['pendampingA']->id,
            'inovasi_id' => $data['inovasi1']->id,
            'periode_lomba_id' => $periode->id,
        ]);

        $response = $this->actingAs($data['admin'])->delete(route('penugasan.destroy', $penugasan));
        $response->assertRedirect();

        $this->assertDatabaseMissing('penugasan_pendamping', [
            'id' => $penugasan->id,
        ]);
    }
}
