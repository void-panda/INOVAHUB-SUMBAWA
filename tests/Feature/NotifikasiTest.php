<?php

namespace Tests\Feature;

use App\Models\Notifikasi;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotifikasiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_view_notifications_and_mark_them_as_read(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('inovator');

        $notif1 = Notifikasi::create([
            'user_id' => $user->id,
            'tipe' => 'revisi',
            'pesan' => 'Mohon revisi SK.',
        ]);

        $notif2 = Notifikasi::create([
            'user_id' => $user->id,
            'tipe' => 'disetujui',
            'pesan' => 'Inovasi disetujui.',
        ]);

        // Access index page
        $response = $this->actingAs($user)->get(route('notifikasi.index'));
        $response->assertOk();

        // Check shared auth props in Inertia
        $response->assertInertia(fn ($page) => $page
            ->component('notifikasi/index')
            ->where('unreadCount', 2)
            ->where('auth.unreadNotificationsCount', 2)
            ->has('auth.recentNotifications', 2)
        );

        // Mark single read
        $this->actingAs($user)->post(route('notifikasi.baca', $notif1->id))->assertRedirect();
        $this->assertNotNull($notif1->fresh()->dibaca_at);
        $this->assertNull($notif2->fresh()->dibaca_at);

        // Mark all read
        $this->actingAs($user)->post(route('notifikasi.baca-semua'))->assertRedirect();
        $this->assertNotNull($notif2->fresh()->dibaca_at);
    }
}
