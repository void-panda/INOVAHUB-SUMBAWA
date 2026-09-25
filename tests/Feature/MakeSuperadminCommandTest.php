<?php

namespace Tests\Feature;

use App\Mail\SuperadminOtpMail;
use App\Models\Opd;
use App\Models\User;
use Database\Seeders\OpdSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MakeSuperadminCommandTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed([OpdSeeder::class, RolePermissionSeeder::class]);
    }

    public function test_it_creates_superadmin_user_after_otp_verification(): void
    {
        Mail::fake();
        Cache::put('testing_superadmin_otp', '123456');

        $name = 'Admin Baru Bapperida';
        $email = 'adminbaru@sumbawakab.go.id';
        $password = 'password123';
        $wa = '081299998888';

        // Jalankan artisan make:superadmin
        $this->artisan('make:superadmin', [
            '--name' => $name,
            '--email' => $email,
        ])
            ->expectsQuestion('Masukkan Password Superadmin (minimal 8 karakter)', $password)
            ->expectsQuestion('Ulangi Password untuk Konfirmasi', $password)
            ->expectsQuestion('Masukkan No. WhatsApp (Opsional, tekan Enter untuk default)', $wa)
            ->expectsQuestion('Masukkan 6-digit Kode OTP (Percobaan 1/3)', '123456')
            ->assertExitCode(0);

        // Pastikan email OTP dikirimkan
        Mail::assertSent(SuperadminOtpMail::class, function ($mail) use ($email, $name) {
            return $mail->hasTo($email) && $mail->nama === $name && strlen($mail->otp) === 6;
        });

        // Pastikan user tersimpan di DB
        $user = User::where('email', $email)->first();
        $this->assertNotNull($user);
        $this->assertSame($name, $user->name);
        $this->assertTrue($user->hasRole('bapperida'));
        $this->assertTrue($user->status_aktif);
        $this->assertNotNull($user->email_verified_at);
        $this->assertSame('dinas', $user->tipe_inovator);
        $this->assertSame($wa, $user->no_whatsapp);
    }

    public function test_it_rejects_and_fails_when_otp_is_invalid(): void
    {
        Mail::fake();

        $name = 'Admin Gagal OTP';
        $email = 'admingagal@sumbawakab.go.id';
        $password = 'password123';

        $this->artisan('make:superadmin', [
            '--name' => $name,
            '--email' => $email,
        ])
            ->expectsQuestion('Masukkan Password Superadmin (minimal 8 karakter)', $password)
            ->expectsQuestion('Ulangi Password untuk Konfirmasi', $password)
            ->expectsQuestion('Masukkan No. WhatsApp (Opsional, tekan Enter untuk default)', '081234567890')
            ->expectsQuestion('Masukkan 6-digit Kode OTP (Percobaan 1/3)', '000000')
            ->expectsQuestion('Masukkan 6-digit Kode OTP (Percobaan 2/3)', '111111')
            ->expectsQuestion('Masukkan 6-digit Kode OTP (Percobaan 3/3)', '222222')
            ->assertExitCode(1);

        $this->assertNull(User::where('email', $email)->first());
    }
}
