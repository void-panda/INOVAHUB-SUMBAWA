<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PanduanTest extends TestCase
{
    use RefreshDatabase;

    public function test_halaman_panduan_dapat_diakses_oleh_user_terautentikasi(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/panduan');

        $response->assertStatus(200);
    }

    public function test_tamu_diarahkan_ke_halaman_login_saat_akses_panduan(): void
    {
        $response = $this->get('/panduan');

        $response->assertRedirect('/login');
    }

    public function test_command_backup_database_berjalan_sukses(): void
    {
        $this->artisan('inovahub:backup-db')
            ->assertExitCode(0);
    }
}
