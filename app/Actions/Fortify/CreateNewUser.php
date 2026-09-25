<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
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
            ...$this->profileRules(),
            'nama_pemda' => ['required', 'string', 'max:255'],
            'password' => $this->passwordRules(),
        ];

        if (! app()->environment('testing') || isset($input['captcha_input'])) {
            $rules['captcha_input'] = ['required', 'numeric'];
        }

        Validator::make($input, $rules, [
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
            'nama_pemda' => $input['nama_pemda'],
            'email' => $input['email'],
            'password' => $input['password'],
        ]);

        $user->assignRole('inovator');

        return $user;
    }
}
