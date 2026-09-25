<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Opd;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        $rules = [
            'name' => $this->nameRules(),
            'email' => $this->emailRules(),
            'password' => $this->passwordRules(),
        ];

        if (! app()->environment('testing') || isset($input['captcha_input'])) {
            $rules['captcha_input'] = ['required', 'numeric'];
        }

        Validator::make($input, $rules, [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format alamat email tidak valid.',
            'email.unique' => 'Alamat email ini sudah terdaftar.',
            'captcha_input.required' => 'Jawaban CAPTCHA keamanan wajib diisi.',
            'captcha_input.numeric' => 'Jawaban CAPTCHA keamanan harus berupa angka.',
        ])->validate();

        if (! app()->environment('testing') || isset($input['captcha_input'])) {
            $expectedAnswer = session('captcha_answer');
            $userAnswer = $input['captcha_input'] ?? null;

            if ($expectedAnswer === null || (int) $userAnswer !== (int) $expectedAnswer) {
                throw ValidationException::withMessages([
                    'captcha_input' => ['Jawaban CAPTCHA tidak sesuai, silakan coba lagi.'],
                ]);
            }

            session()->forget('captcha_answer');
        }

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'nama_pemda' => $input['nama_pemda'] ?? 'Inovator Sumbawa',
            'tipe_inovator' => $input['tipe_inovator'] ?? 'masyarakat',
            'opd_id' => ! empty($input['opd_id']) ? (int) $input['opd_id'] : null,
            'pekerjaan' => $input['pekerjaan'] ?? null,
            'no_whatsapp' => $input['no_whatsapp'] ?? null,
        ]);

        $user->assignRole('inovator');

        return $user;
    }
}
