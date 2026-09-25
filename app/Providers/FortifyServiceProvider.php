<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Models\User;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
        $this->configureAuthentication();
        $this->configureEmailVerification();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify custom authentication with CAPTCHA check.
     */
    private function configureAuthentication(): void
    {
        Fortify::authenticateUsing(function (Request $request) {
            // Check CAPTCHA (unless running automated test without captcha_input)
            if (! app()->environment('testing') || $request->has('captcha_input')) {
                $expectedAnswer = $request->session()->get('captcha_answer');
                $userAnswer = $request->input('captcha_input');

                if ($expectedAnswer === null || (int) $userAnswer !== (int) $expectedAnswer) {
                    throw ValidationException::withMessages([
                        'captcha_input' => ['Jawaban CAPTCHA tidak sesuai, silakan coba lagi.'],
                    ]);
                }
            }

            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                return $user;
            }

            return null;
        });
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(function (Request $request) {
            $num1 = rand(1, 9);
            $num2 = rand(1, 9);
            $question = "Berapa {$num1} + {$num2}?";
            $answer = $num1 + $num2;

            $request->session()->put('captcha_answer', $answer);

            return Inertia::render('auth/login', [
                'canResetPassword' => Features::enabled(Features::resetPasswords()),
                'status' => $request->session()->get('status'),
                'captchaQuestion' => $question,
            ]);
        });

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(function (Request $request) {
            $num1 = rand(1, 9);
            $num2 = rand(1, 9);
            $question = "Berapa {$num1} + {$num2}?";
            $answer = $num1 + $num2;

            $request->session()->put('captcha_answer', $answer);

            return Inertia::render('auth/register', [
                'passwordRules' => Password::defaults()->toPasswordRulesString(),
                'captchaQuestion' => $question,
            ]);
        });

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure email verification notification with official INOVA-HUB Sumbawa copy.
     */
    private function configureEmailVerification(): void
    {
        VerifyEmail::toMailUsing(function ($notifiable, string $url) {
            $name = $notifiable->name ?? 'Inovator';

            return (new MailMessage)
                ->subject('[INOVA-HUB Sumbawa] Verifikasi Alamat Email Pendaftaran')
                ->greeting("Yth. Bapak/Ibu {$name},")
                ->line('Terima kasih telah mendaftar sebagai Inovator di Sistem INOVA-HUB Kabupaten Sumbawa.')
                ->line('Untuk mengaktifkan akun dan mulai mengelola inovasi daerah, silakan lakukan verifikasi alamat email Anda dengan menekan tombol di bawah ini:')
                ->action('Verifikasi Alamat Email', $url)
                ->line('Tautan verifikasi ini berlaku selama 60 menit.')
                ->line('Jika Anda tidak pernah merasa melakukan pendaftaran di INOVA-HUB Sumbawa, mohon abaikan email ini.')
                ->salutation("Salam hormat,\nTim Pengelola Inovasi Daerah (BAPPERIDA) Kab. Sumbawa");
        });
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
