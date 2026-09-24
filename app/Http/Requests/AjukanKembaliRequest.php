<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AjukanKembaliRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'penjelasan_pengembangan' => ['required', 'string', 'min:10', 'max:2000'],
        ];
    }
}
