<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::registration());
    }

    public function test_registration_screen_can_be_rendered()
    {
        $response = $this->get(route('register'));

        $response->assertOk();
    }

    public function test_new_users_can_register_and_access_dashboard()
    {
        Notification::fake();
        $this->seed(RolePermissionSeeder::class);

        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('inovator'));

        // Direct dashboard access without verification wall
        $dashboardResponse = $this->actingAs($user)->get(route('dashboard'));
        $dashboardResponse->assertOk();
    }

    public function test_registration_fails_with_invalid_captcha()
    {
        $this->seed(RolePermissionSeeder::class);

        $response = $this->withSession(['captcha_answer' => 15])->post(route('register.store'), [
            'name' => 'Test User',
            'nama_pemda' => 'Dinas Contoh',
            'email' => 'wrong-captcha@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'captcha_input' => 99,
        ]);

        $response->assertSessionHasErrors('captcha_input');
        $this->assertGuest();
        $this->assertNull(User::where('email', 'wrong-captcha@example.com')->first());
    }

    public function test_registration_succeeds_with_valid_captcha()
    {
        Notification::fake();
        $this->seed(RolePermissionSeeder::class);

        $response = $this->withSession(['captcha_answer' => 12])->post(route('register.store'), [
            'name' => 'Valid User',
            'nama_pemda' => 'Dinas Contoh',
            'email' => 'valid-captcha@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'captcha_input' => 12,
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'valid-captcha@example.com')->first();
        $this->assertNotNull($user);
    }

    public function test_registration_as_masyarakat_inovator()
    {
        Notification::fake();
        $this->seed(RolePermissionSeeder::class);

        $response = $this->post(route('register.store'), [
            'name' => 'Ahmad Rinjani',
            'tipe_inovator' => 'masyarakat',
            'nama_pemda' => 'Universitas Samawa',
            'pekerjaan' => 'Mahasiswa / Peneliti',
            'email' => 'ahmad.masyarakat@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'ahmad.masyarakat@example.com')->first();
        $this->assertNotNull($user);
        $this->assertEquals('masyarakat', $user->tipe_inovator);
        $this->assertNull($user->opd_id);
        $this->assertEquals('Universitas Samawa', $user->nama_pemda);
        $this->assertEquals('Mahasiswa / Peneliti', $user->pekerjaan);
        $this->assertTrue($user->hasRole('inovator'));
    }

    public function test_registration_as_dinas_inovator_with_opd()
    {
        Notification::fake();
        $this->seed(RolePermissionSeeder::class);

        $opd = \App\Models\Opd::firstOrCreate(
            ['kode' => 'DINKES'],
            ['nama' => 'Dinas Kesehatan Kabupaten Sumbawa']
        );

        $response = $this->post(route('register.store'), [
            'name' => 'Budi Pratama',
            'tipe_inovator' => 'dinas',
            'opd_id' => $opd->id,
            'nama_pemda' => $opd->nama,
            'pekerjaan' => 'Kasubag Perencanaan',
            'email' => 'budi.dinas@sumbawakab.go.id',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'budi.dinas@sumbawakab.go.id')->first();
        $this->assertNotNull($user);
        $this->assertEquals('dinas', $user->tipe_inovator);
        $this->assertEquals($opd->id, $user->opd_id);
        $this->assertEquals('Dinas Kesehatan Kabupaten Sumbawa', $user->nama_pemda);
        $this->assertEquals('Kasubag Perencanaan', $user->pekerjaan);
        $this->assertTrue($user->hasRole('inovator'));
    }
}
