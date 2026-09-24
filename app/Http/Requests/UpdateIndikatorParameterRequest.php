<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateIndikatorParameterRequest extends FormRequest
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
            'parameter' => ['nullable', 'string', 'max:50'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
