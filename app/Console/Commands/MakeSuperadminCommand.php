<?php

namespace App\Console\Commands;

use App\Mail\SuperadminOtpMail;
use App\Models\Opd;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Throwable;

class MakeSuperadminCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:superadmin
                            {--email= : Alamat email akun Superadmin}
                            {--name= : Nama lengkap calon Superadmin}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Buat akun Superadmin (BAPPERIDA) baru melalui CLI dengan verifikasi Kode OTP via Email';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->displayBanner();

        // 1. Dapatkan dan validasi Nama
        $name = $this->option('name') ?: $this->ask('Masukkan Nama Lengkap Superadmin');
        while (empty(trim($name))) {
            $this->error('Nama lengkap tidak boleh kosong.');
            $name = $this->ask('Masukkan Nama Lengkap Superadmin');
        }

        // 2. Dapatkan dan validasi Email
        $email = $this->option('email');
        $emailRule = app()->environment('production') ? 'email:rfc,dns' : 'email';

        while (true) {
            if (empty($email)) {
                $email = $this->ask('Masukkan Alamat Email Superadmin');
            }

            $validator = Validator::make(['email' => $email], [
                'email' => ['required', 'string', $emailRule, 'max:255', 'unique:users,email'],
            ], [
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email ini sudah terdaftar di sistem INOVA-HUB.',
            ]);

            if ($validator->fails()) {
                $this->error($validator->errors()->first('email'));
                $email = null;
                continue;
            }

            break;
        }

        // 3. Dapatkan dan konfirmasi Password
        while (true) {
            $password = $this->secret('Masukkan Password Superadmin (minimal 8 karakter)');
            if (strlen((string) $password) < 8) {
                $this->error('Password terlalu pendek! Minimal harus 8 karakter.');
                continue;
            }

            $passwordConfirmation = $this->secret('Ulangi Password untuk Konfirmasi');
            if ($password !== $passwordConfirmation) {
                $this->error('Konfirmasi password tidak cocok! Silakan coba lagi.');
                continue;
            }

            break;
        }

        // 4. Nomor WhatsApp (Opsional)
        $noWhatsapp = $this->ask('Masukkan No. WhatsApp (Opsional, tekan Enter untuk default)', '081234567890');

        // 5. Generate 6-Digit OTP Code
        $cacheKey = 'superadmin_otp_' . md5(strtolower(trim($email)));
        $otp = app()->environment('testing') && Cache::has('testing_superadmin_otp')
            ? (string) Cache::get('testing_superadmin_otp')
            : (string) random_int(100000, 999999);

        Cache::put($cacheKey, $otp, now()->addMinutes(10));

        // 6. Kirim Kode OTP via Email
        $this->info("Mengirimkan Kode OTP ke: {$email}...");
        try {
            Mail::to($email)->send(new SuperadminOtpMail($name, $otp));
            $this->components->info("Kode OTP 6-digit berhasil dikirimkan ke alamat email {$email}.");
        } catch (Throwable $e) {
            $this->warn("Gagal mengirim email secara langsung: {$e->getMessage()}");
            if (app()->environment('production')) {
                $this->error('Gagal mengirimkan email verifikasi di environment production. Pastikan konfigurasi SMTP .env sudah benar.');
                return self::FAILURE;
            }
        }

        // Tampilkan info debug jika mailer diatur ke log atau saat mode dev/local
        if (config('mail.default') === 'log' || app()->isLocal()) {
            $this->line('');
            $this->components->warn("[INFO DEV / MAILER LOG] Kode OTP Anda adalah: {$otp}");
            $this->line('');
        }

        // 7. Verifikasi Kode OTP (Maksimal 3 kali percobaan)
        $maxAttempts = 3;
        $attempt = 0;
        $verified = false;

        $this->line('Silakan periksa kotak masuk (inbox / spam) email Anda.');
        while ($attempt < $maxAttempts) {
            $attempt++;
            $inputOtp = $this->ask("Masukkan 6-digit Kode OTP (Percobaan {$attempt}/{$maxAttempts})");

            if (trim((string) $inputOtp) === $otp) {
                $verified = true;
                break;
            }

            $remaining = $maxAttempts - $attempt;
            if ($remaining > 0) {
                $this->error("Kode OTP salah! Sisa percobaan: {$remaining}.");
            }
        }

        if (! $verified) {
            $this->error('Verifikasi OTP gagal setelah 3 kali percobaan. Pembuatan akun Superadmin dibatalkan.');
            Cache::forget($cacheKey);
            return self::FAILURE;
        }

        // 8. Buat Akun Superadmin di Database
        $bapperida = Opd::where('kode', 'BAP')->first();

        $user = User::create([
            'name' => $name,
            'email' => strtolower(trim($email)),
            'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
            'tipe_inovator' => 'dinas',
            'opd_id' => $bapperida?->id,
            'no_whatsapp' => $noWhatsapp,
            'pekerjaan' => 'Administrator Sistem & Superadmin',
            'status_aktif' => true,
            'password' => Hash::make($password),
        ]);

        $user->forceFill(['email_verified_at' => now()])->save();
        \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'bapperida', 'guard_name' => 'web']);
        $user->syncRoles(['bapperida']);
        Cache::forget($cacheKey);

        // 9. Tampilkan Ringkasan Berhasil
        $this->line('');
        $this->components->info('AKUN SUPERADMIN BERHASIL DIBUAT!');
        $this->table(
            ['Atribut', 'Keterangan'],
            [
                ['Nama Lengkap', $user->name],
                ['Email Login', $user->email],
                ['Hak Akses / Role', 'bapperida (Superadmin Full Access)'],
                ['Instansi / OPD', $bapperida ? "{$bapperida->nama} [{$bapperida->kode}]" : 'BAPPERIDA Kab. Sumbawa'],
                ['Status Verifikasi', 'Terverifikasi (OTP Valid)'],
                ['Status Akun', 'Aktif'],
                ['Waktu Registrasi', $user->created_at->format('d/m/Y H:i:s')],
            ]
        );

        $this->info("User dapat langsung login ke INOVA-HUB Sumbawa menggunakan email dan password yang baru dibuat.");
        return self::SUCCESS;
    }

    /**
     * Tampilkan Banner Header INOVA-HUB.
     */
    protected function displayBanner(): void
    {
        $this->line('');
        $this->line('<fg=cyan;options=bold>===============================================================</>');
        $this->line('<fg=white;bg=cyan;options=bold>              INOVA-HUB KABUPATEN SUMBAWA                      </>');
        $this->line('<fg=white;bg=cyan;options=bold>         PEMBUATAN AKUN SUPERADMIN VIA CLI / OTP               </>');
        $this->line('<fg=cyan;options=bold>===============================================================</>');
        $this->line('<fg=gray>Aplikasi Pembinaan & Penjaminan Kualitas Inovasi Daerah (TOR §3)</>');
        $this->line('');
    }
}
