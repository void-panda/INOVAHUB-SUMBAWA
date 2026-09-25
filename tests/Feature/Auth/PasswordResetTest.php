<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->skipUnlessFortifyHas(Features::resetPasswords());
    }

    public function test_reset_password_link_screen_can_be_rendered()
    {
        $response = $this->get(route('password.request'));

        $response->assertOk();
    }

    public function test_reset_password_link_can_be_requested()
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_reset_password_screen_can_be_rendered()
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
            $response = $this->get(route('password.reset', $notification->token));

            $response->assertOk();

            return true;
        });
    }

    public function test_password_can_be_reset_with_valid_token()
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post(route('password.email'), ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
            $response = $this->post(route('password.update'), [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertRedirect(route('login'));

            return true;
        });
    }

    public function test_password_cannot_be_reset_with_invalid_token(): void
    {
        $user = User::factory()->create();

        $response = $this->post(route('password.update'), [
            'token' => 'invalid-token',
            'email' => $user->email,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_password_can_be_reset_for_all_user_roles(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $roles = ['inovator', 'pendamping', 'tim_penilai', 'pimpinan', 'bapperida'];

        foreach ($roles as $role) {
            Notification::fake();

            $user = User::factory()->create([
                'email' => "{$role}@sumbawakab.go.id",
                'password' => 'oldpassword123',
            ]);
            $user->assignRole($role);

            // Request reset link
            $response = $this->post(route('password.email'), ['email' => $user->email]);
            $response->assertSessionHas('status');

            Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
                // Reset password with token
                $resetResponse = $this->post(route('password.update'), [
                    'token' => $notification->token,
                    'email' => $user->email,
                    'password' => 'newpassword456',
                    'password_confirmation' => 'newpassword456',
                ]);

                $resetResponse->assertSessionHasNoErrors();
                $resetResponse->assertRedirect(route('login'));

                return true;
            });

            // Verify password was updated in database
            $user->refresh();
            $this->assertTrue(Hash::check('newpassword456', $user->password));
        }
    }
}
