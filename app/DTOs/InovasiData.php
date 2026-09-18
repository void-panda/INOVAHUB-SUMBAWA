<?php

namespace App\DTOs;

use App\Http\Requests\InovasiStoreRequest;

readonly class InovasiData
{
    /**
     * @param  array<string, mixed>  $extra
     */
    public function __construct(
        public string $namaInovasi,
        public string $tahapan,
        public string $inisiator,
        public ?string $kategoriInovasi,
        public string $bentukInovasi,
        public string $jenisInovasi,
        public string $klasifikasi,
        public ?string $tematik,
        public ?string $kriteriaInovasi,
        public string $namaInisiator,
        public string $koordinat,
        public ?string $lokasi,
        public ?string $urusanUtama,
        public ?string $urusanWajib,
        public ?string $waktuUjiCoba,
        public string $waktuPenerapan,
        public ?string $waktuPengembangan,
        public ?float $anggaranSebelum,
        public ?float $anggaranSesudah,
        public bool $isPenghargaan,
        public ?string $namaPenghargaan,
        public ?string $rancangBangun,
        public ?string $tujuan,
        public ?string $manfaat,
        public ?string $hasilInovasi,
        public ?int $opdId,
        public ?int $periodeLombaId = null,
        public array $extra = []
    ) {}

    public static function fromRequest(InovasiStoreRequest $request, ?int $periodeLombaId = null): self
    {
        $validated = $request->validated();

        $urusanWajib = is_array($validated['urusan_wajib'] ?? null)
            ? implode(',', $validated['urusan_wajib'])
            : ($validated['urusan_wajib'] ?? null);

        $user = $request->user();
        $opdId = $user->opd_id ?: null;

        return new self(
            namaInovasi: $validated['nama_inovasi'],
            tahapan: $validated['tahapan'],
            inisiator: $validated['inisiator'] ?? 'opd',
            kategoriInovasi: $validated['kategori_inovasi'] ?? null,
            bentukInovasi: $validated['bentuk_inovasi'] ?? 'pelayanan_publik',
            jenisInovasi: $validated['jenis_inovasi'] ?? 'non_digital',
            klasifikasi: $validated['klasifikasi'] ?? 'non_tematik',
            tematik: $validated['tematik'] ?? null,
            kriteriaInovasi: $validated['kriteria_inovasi'] ?? null,
            namaInisiator: $validated['nama_inisiator'],
            koordinat: $validated['koordinat'],
            lokasi: $validated['lokasi'] ?? null,
            urusanUtama: $validated['urusan_utama'] ?? null,
            urusanWajib: $urusanWajib,
            waktuUjiCoba: $validated['waktu_uji_coba'] ?? null,
            waktuPenerapan: $validated['waktu_penerapan'],
            waktuPengembangan: $validated['waktu_pengembangan'] ?? null,
            anggaranSebelum: isset($validated['anggaran_sebelum']) ? (float) $validated['anggaran_sebelum'] : null,
            anggaranSesudah: isset($validated['anggaran_sesudah']) ? (float) $validated['anggaran_sesudah'] : null,
            isPenghargaan: (bool) ($validated['is_penghargaan'] ?? false),
            namaPenghargaan: $validated['nama_penghargaan'] ?? null,
            rancangBangun: $validated['rancang_bangun'] ?? null,
            tujuan: $validated['tujuan'] ?? null,
            manfaat: $validated['manfaat'] ?? null,
            hasilInovasi: $validated['hasil_inovasi'] ?? null,
            opdId: $opdId,
            periodeLombaId: $periodeLombaId
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $data = [
            'nama_inovasi' => $this->namaInovasi,
            'tahapan' => $this->tahapan,
            'inisiator' => $this->inisiator,
            'kategori_inovasi' => $this->kategoriInovasi,
            'bentuk_inovasi' => $this->bentukInovasi,
            'jenis_inovasi' => $this->jenisInovasi,
            'klasifikasi' => $this->klasifikasi,
            'tematik' => $this->tematik,
            'kriteria_inovasi' => $this->kriteriaInovasi,
            'nama_inisiator' => $this->namaInisiator,
            'koordinat' => $this->koordinat,
            'lokasi' => $this->lokasi,
            'urusan_utama' => $this->urusanUtama,
            'urusan_wajib' => $this->urusanWajib,
            'waktu_uji_coba' => $this->waktuUjiCoba,
            'waktu_penerapan' => $this->waktuPenerapan,
            'waktu_pengembangan' => $this->waktuPengembangan,
            'anggaran_sebelum' => $this->anggaranSebelum,
            'anggaran_sesudah' => $this->anggaranSesudah,
            'is_penghargaan' => $this->isPenghargaan,
            'nama_penghargaan' => $this->namaPenghargaan,
            'rancang_bangun' => $this->rancangBangun,
            'tujuan' => $this->tujuan,
            'manfaat' => $this->manfaat,
            'hasil_inovasi' => $this->hasilInovasi,
            'opd_id' => $this->opdId,
        ];

        return array_merge($data, $this->extra);
    }
}
