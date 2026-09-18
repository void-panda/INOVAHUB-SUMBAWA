<?php

namespace Tests\Feature;

use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use App\Models\User;
use Database\Seeders\IndikatorSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterIndikatorTest extends TestCase
{
    use RefreshDatabase;

    public function test_tim_penilai_can_manage_master_indikator(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(IndikatorSeeder::class);

        $timPenilai = User::factory()->create();
        $timPenilai->assignRole('tim_penilai');

        // Access index page
        $this->actingAs($timPenilai)->get(route('penilai.indikator.index'))->assertOk();

        // Create new SPD Indikator with dynamic options
        $this->actingAs($timPenilai)->post(route('penilai.indikator.spd.store'), [
            'kode' => 'SPD-99',
            'nama' => 'Indikator SPD Baru',
            'variabel' => 'Dua Parameter Test',
            'bobot' => 2.50,
            'p1' => 'Ambang P1',
            'p2' => 'Ambang P2',
            'p3' => 'Ambang P3',
            'opsi' => [
                ['id' => 'p1', 'label' => 'Ambang P1', 'bobot' => 1],
                ['id' => 'p2', 'label' => 'Ambang P2', 'bobot' => 2],
                ['id' => 'p3', 'label' => 'Ambang P3', 'bobot' => 3],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('indikator_spd', [
            'kode' => 'SPD-99',
            'nama' => 'Indikator SPD Baru',
        ]);

        $spd = IndikatorSpd::where('kode', 'SPD-99')->firstOrFail();
        $this->assertCount(3, $spd->opsi_list);

        // Update SPD Indikator
        $this->actingAs($timPenilai)->put(route('penilai.indikator.spd.update', $spd->id), [
            'kode' => 'SPD-99',
            'nama' => 'Indikator SPD Updated',
            'variabel' => 'Dua Parameter Test',
            'bobot' => 3.00,
            'opsi' => [
                ['id' => 'p1', 'label' => 'Opsi 1 Custom', 'bobot' => 1.5],
                ['id' => 'p2', 'label' => 'Opsi 2 Custom', 'bobot' => 3.0],
            ],
        ])->assertRedirect();

        $this->assertEquals('Indikator SPD Updated', $spd->fresh()->nama);
        $this->assertCount(2, $spd->fresh()->opsi_list);

        // Create new SID Indikator with dynamic options (e.g. Video indicator)
        $this->actingAs($timPenilai)->post(route('penilai.indikator.sid.store'), [
            'kode' => 'SID-99',
            'nama' => 'Video Penerapan Inovasi',
            'bobot' => 3.00,
            'informasi' => 'Video inovasi daerah dapat dibuktikan dengan video penerapan',
            'opsi' => [
                ['id' => 'opt_sub_1', 'label' => 'Memenuhi 1 atau 2 unsur substansi', 'bobot' => 1],
                ['id' => 'opt_sub_2', 'label' => 'Memenuhi 3 atau 4 unsur substansi', 'bobot' => 2],
                ['id' => 'opt_sub_3', 'label' => 'Memenuhi 5 unsur substansi', 'bobot' => 3],
            ],
        ])->assertRedirect();

        $this->assertDatabaseHas('indikator_sid', [
            'kode' => 'SID-99',
            'nama' => 'Video Penerapan Inovasi',
        ]);

        $sid = IndikatorSid::where('kode', 'SID-99')->firstOrFail();
        $this->assertCount(3, $sid->opsi_list);
        $this->assertSame('Memenuhi 5 unsur substansi', $sid->opsi_list[2]['label']);
    }
}
