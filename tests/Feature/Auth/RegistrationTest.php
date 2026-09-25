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

    public function test_new_users_can_register_and_receive_verification_notification()
    {
        Notification::fake();
        $this->seed(RolePermissionSeeder::class);

        $response = $this->post(route('register.store'), [
            'name' => 'Test User',
            'nama_pemda' => 'Dinas Contoh',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $user = User::where('email', 'test@example.com')->first();
        $this->assertNotNull($user);
        $this->assertTrue($user->hasRole('inovator'));
        $this->assertFalse($user->hasVerifiedEmail());
        $this->assertNull($user->email_verified_at);

        // Verification email sent
        Notification::assertSentTo($user, VerifyEmail::class);

        // Unverified user attempting to access dashboard is redirected to verification notice
        $dashboardResponse = $this->actingAs($user)->get(route('dashboard'));
        $dashboardResponse->assertRedirect(route('verification.notice'));
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
        $this->assertFalse($user->hasVerifiedEmail());
        Notification::assertSentTo($user, VerifyEmail::class);
    }
}
