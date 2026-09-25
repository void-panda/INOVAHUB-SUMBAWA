<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterOpdTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $inovator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->assignRole('bapperida');

        $this->inovator = User::factory()->create();
        $this->inovator->assignRole('inovator');
    }

    public function test_admin_bapperida_can_view_opd_index(): void
    {
        Opd::create(['nama' => 'Dinas Perhubungan', 'kode' => 'DISHUB']);

        $response = $this->actingAs($this->admin)->get(route('penilai.opd.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('penilai/opd/index')
            ->has('opdList.data')
            ->has('metrics')
        );
    }

    public function test_unauthorized_user_cannot_access_opd_index(): void
    {
        $response = $this->actingAs($this->inovator)->get(route('penilai.opd.index'));

        $response->assertForbidden();
    }

    public function test_admin_can_create_new_opd(): void
    {
        $response = $this->actingAs($this->admin)->post(route('penilai.opd.store'), [
            'nama' => 'Dinas Pariwisata dan Kebudayaan',
            'kode' => 'disparbud',
            'kontak' => '(0371) 22334',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('opd', [
            'nama' => 'Dinas Pariwisata dan Kebudayaan',
            'kode' => 'DISPARBUD',
            'kontak' => '(0371) 22334',
        ]);
    }

    public function test_admin_can_update_existing_opd(): void
    {
        $opd = Opd::create(['nama' => 'Dinas Lama', 'kode' => 'LAMA']);

        $response = $this->actingAs($this->admin)->put(route('penilai.opd.update', $opd), [
            'nama' => 'Dinas Baru Diperbarui',
            'kode' => 'BARU',
            'kontak' => '08123456789',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('opd', [
            'id' => $opd->id,
            'nama' => 'Dinas Baru Diperbarui',
            'kode' => 'BARU',
        ]);
    }

    public function test_admin_can_delete_unused_opd(): void
    {
        $opd = Opd::create(['nama' => 'OPD Sementara', 'kode' => 'TEMP']);

        $response = $this->actingAs($this->admin)->delete(route('penilai.opd.destroy', $opd));

        $response->assertRedirect();
        $this->assertDatabaseMissing('opd', ['id' => $opd->id]);
    }

    public function test_admin_cannot_delete_opd_with_associated_users_or_inovasi(): void
    {
        $opd = Opd::create(['nama' => 'Dinas Kesehatan', 'kode' => 'DINKES']);
        User::factory()->create(['opd_id' => $opd->id]);

        $response = $this->actingAs($this->admin)->delete(route('penilai.opd.destroy', $opd));

        $response->assertRedirect();
        $this->assertDatabaseHas('opd', ['id' => $opd->id]);
    }
}
