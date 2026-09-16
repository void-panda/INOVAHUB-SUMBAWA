<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InovasiStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('input-inovasi');
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $isMasyarakat = $this->user()?->isMasyarakat() ?? false;

        return [
            'nama_inovasi' => ['required', 'string', 'min:3', 'max:255'],
            'tahapan' => ['required', 'in:inisiatif,ujicoba,penerapan'],
            'inisiator' => ['nullable', 'string', 'in:kepala_daerah,anggota_dprd,opd,asn,masyarakat'],
            'bentuk_inovasi' => ['nullable', 'string', 'in:pelayanan_publik,tata_kelola,lainnya'],
            'jenis_inovasi' => ['nullable', 'string', 'in:digital,non_digital'],
            'klasifikasi' => ['nullable', 'string', 'in:tematik,non_tematik'],
            'tematik' => ['nullable', 'string', 'max:255'],
            'kriteria_inovasi' => ['nullable', 'string', 'max:255'],
            'nama_inisiator' => ['required', 'string', 'min:3', 'max:255'],
            'koordinat' => ['required', 'string', 'max:50'],
            'lokasi' => [$isMasyarakat ? 'required' : 'nullable', 'string', 'max:255'],
            'urusan_utama' => ['nullable', 'string', 'max:255'],
            'urusan_wajib' => ['nullable', 'array'],
            'urusan_wajib.*' => ['string'],
            'waktu_uji_coba' => ['nullable', 'date'],
            'waktu_penerapan' => ['required', 'date'],
            'waktu_pengembangan' => ['nullable', 'date'],
            'anggaran_sebelum' => ['nullable', 'numeric', 'min:0'],
            'anggaran_sesudah' => ['nullable', 'numeric', 'min:0'],
            'is_penghargaan' => ['nullable', 'boolean'],
            'nama_penghargaan' => ['nullable', 'string', 'max:255'],
            'rancang_bangun' => ['nullable', 'string'],
            'tujuan' => ['nullable', 'string'],
            'manfaat' => ['nullable', 'string'],
            'hasil_inovasi' => ['nullable', 'string'],
            'dokumen' => ['nullable', 'array', 'max:10'],
            'dokumen.*' => ['file', 'max:20480'],
            'proposal' => ['nullable', 'file', 'max:20480'],
            'sertifikat' => ['nullable', 'file', 'max:20480'],
            'link_video' => ['nullable', 'url', 'max:500'],
            'nama_video' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'waktu_penerapan.required' => 'Waktu penerapan wajib diisi.',
            'nama_inovasi.min' => 'Nama inovasi minimal 3 karakter.',
            'nama_inisiator.min' => 'Nama inisiator minimal 3 karakter.',
            'lokasi.required' => 'Lokasi / wilayah penerapan wajib diisi.',
        ];
    }
}
