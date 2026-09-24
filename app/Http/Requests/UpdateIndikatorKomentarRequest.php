<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateIndikatorKomentarRequest extends FormRequest
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
            'status_validasi' => ['nullable', 'string', 'in:belum_divalidasi,valid,perlu_revisi'],
            'komentar_pendamping' => [
                Rule::requiredIf(fn () => $this->input('status_validasi') === 'perlu_revisi'),
                'nullable',
                'string',
                'max:1000',
            ],
        ];
    }
}
