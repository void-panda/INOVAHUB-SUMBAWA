<?php

namespace Tests\Feature;

use App\Models\Opd;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminUserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_bapperida_can_view_user_management_page(): void
    {
        $bapperida = User::factory()->create();
        $bapperida->assignRole('bapperida');

        $this->actingAs($bapperida)
            ->get(route('penilai.users.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('penilai/users/index')
                ->has('users')
                ->has('metrics')
            );
    }

    public function test_tim_penilai_and_inovator_cannot_view_user_management_page(): void
    {
        $penilai = User::factory()->create();
        $penilai->assignRole('tim_penilai');

        $this->actingAs($penilai)
            ->get(route('penilai.users.index'))
            ->assertForbidden();

        $inovator = User::factory()->create();
        $inovator->assignRole('inovator');

        $this->actingAs($inovator)
            ->get(route('penilai.users.index'))
            ->assertForbidden();
    }

    public function test_bapperida_can_create_new_pendamping(): void
    {
        $bapperida = User::factory()->create();
        $bapperida->assignRole('bapperida');

        $opd = Opd::create(['nama' => 'BAPPERIDA Sumbawa', 'kode' => 'BAP']);

        $response = $this->actingAs($bapperida)->post(route('penilai.users.store'), [
            'name' => 'Pendamping Baru BAPPERIDA',
            'email' => 'pendampingbaru@sumbawakab.go.id',
            'password' => 'Password123!',
            'role' => 'pendamping',
            'opd_id' => $opd->id,
            'status_aktif' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'pendampingbaru@sumbawakab.go.id',
            'name' => 'Pendamping Baru BAPPERIDA',
        ]);

        $newUser = User::where('email', 'pendampingbaru@sumbawakab.go.id')->first();
        $this->assertTrue($newUser->hasRole('pendamping'));
    }

    public function test_bapperida_can_update_user_role(): void
    {
        $bapperida = User::factory()->create();
        $bapperida->assignRole('bapperida');

        $targetUser = User::factory()->create();
        $targetUser->assignRole('inovator');

        $response = $this->actingAs($bapperida)->put(route('penilai.users.update', $targetUser), [
            'name' => 'Updated User Name',
            'email' => $targetUser->email,
            'role' => 'pendamping',
            'status_aktif' => true,
        ]);

        $response->assertRedirect();
        $targetUser->refresh();
        $this->assertEquals('Updated User Name', $targetUser->name);
        $this->assertTrue($targetUser->hasRole('pendamping'));
    }

    public function test_bapperida_can_delete_user(): void
    {
        $bapperida = User::factory()->create();
        $bapperida->assignRole('bapperida');

        $targetUser = User::factory()->create();
        $targetUser->assignRole('inovator');

        $response = $this->actingAs($bapperida)->delete(route('penilai.users.destroy', $targetUser));

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $targetUser->id]);
    }

    public function test_user_cannot_delete_themselves(): void
    {
        $bapperida = User::factory()->create();
        $bapperida->assignRole('bapperida');

        $response = $this->actingAs($bapperida)->delete(route('penilai.users.destroy', $bapperida));

        $response->assertStatus(400);
        $this->assertDatabaseHas('users', ['id' => $bapperida->id]);
    }
}
