<?php

namespace Tests\Feature;

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

        // Create new SPD Indikator
        $this->actingAs($timPenilai)->post(route('penilai.indikator.spd.store'), [
            'kode' => 'SPD-99',
            'nama' => 'Indikator SPD Baru',
            'variabel' => 'Dua Parameter Test',
            'bobot' => 2.50,
            'p1' => 'Ambang P1',
            'p2' => 'Ambang P2',
            'p3' => 'Ambang P3',
        ])->assertRedirect();

        $this->assertDatabaseHas('indikator_spd', [
            'kode' => 'SPD-99',
            'nama' => 'Indikator SPD Baru',
        ]);

        $spd = IndikatorSpd::where('kode', 'SPD-99')->firstOrFail();

        // Update SPD Indikator
        $this->actingAs($timPenilai)->put(route('penilai.indikator.spd.update', $spd->id), [
            'kode' => 'SPD-99',
            'nama' => 'Indikator SPD Updated',
            'variabel' => 'Dua Parameter Test',
            'bobot' => 3.00,
        ])->assertRedirect();

        $this->assertEquals('Indikator SPD Updated', $spd->fresh()->nama);

        // Create new SID Indikator
        $this->actingAs($timPenilai)->post(route('penilai.indikator.sid.store'), [
            'kode' => 'SID-99',
            'nama' => 'Indikator SID Baru',
            'bobot' => 1.50,
        ])->assertRedirect();

        $this->assertDatabaseHas('indikator_sid', [
            'kode' => 'SID-99',
        ]);
    }
}
