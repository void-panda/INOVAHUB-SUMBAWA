<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIndikatorDokumenRequest extends FormRequest
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
            'nomor_surat' => ['nullable', 'string', 'max:255'],
            'tanggal_surat' => ['nullable', 'date'],
            'tentang' => ['nullable', 'string', 'max:500'],
            'dokumen' => ['required'],
            'dokumen.*' => ['file', 'max:20480'],
            'jenis' => ['nullable', 'string'],
        ];
    }
}
