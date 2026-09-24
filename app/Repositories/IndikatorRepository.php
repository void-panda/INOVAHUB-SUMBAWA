<?php

namespace App\Repositories;

use App\DTOs\IndikatorData;
use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use Illuminate\Database\Eloquent\Collection;

class IndikatorRepository
{
    /**
     * @return Collection<int, IndikatorSpd>
     */
    public function getAllSpd(): Collection
    {
        return IndikatorSpd::orderBy('kode')->get();
    }

    /**
     * @return Collection<int, IndikatorSid>
     */
    public function getAllSid(): Collection
    {
        return IndikatorSid::orderBy('kode')->get();
    }

    public function findSpdById(int $id): ?IndikatorSpd
    {
        return IndikatorSpd::find($id);
    }

    public function findSidById(int $id): ?IndikatorSid
    {
        return IndikatorSid::find($id);
    }

    public function createSpd(IndikatorData $data): IndikatorSpd
    {
        return IndikatorSpd::create($data->toArray());
    }

    public function updateSpd(IndikatorSpd $indikator, IndikatorData $data): bool
    {
        return $indikator->update($data->toArray());
    }

    public function createSid(IndikatorData $data): IndikatorSid
    {
        return IndikatorSid::create($data->toArray());
    }

    public function updateSid(IndikatorSid $indikator, IndikatorData $data): bool
    {
        return $indikator->update($data->toArray());
    }

    /**
     * Ambil 20 indikator SID kompetisi (exclude SID-21 agregat).
     *
     * @return Collection<int, IndikatorSid>
     */
    public function getSidKompetisi(): Collection
    {
        return IndikatorSid::where('kode', '!=', 'SID-21')
            ->orderBy('kode')
            ->get();
    }

    /**
     * Dapatkan mapping kelengkapan indikator untuk pengajuan tertentu.
     *
     * @return \Illuminate\Support\Collection<int, \App\Models\KelengkapanIndikator>
     */
    public function getKelengkapanMap(\App\Models\PengajuanLomba $pengajuan): \Illuminate\Support\Collection
    {
        return $pengajuan->kelengkapanIndikator()
            ->get()
            ->keyBy('indikator_sid_id');
    }

    /**
     * Dapatkan mapping skor pengajuan indikator beserta relasi pendamping.
     *
     * @return \Illuminate\Support\Collection<int, \App\Models\SkorPengajuan>
     */
    public function getSkorMap(\App\Models\PengajuanLomba $pengajuan): \Illuminate\Support\Collection
    {
        return $pengajuan->skorPengajuan()
            ->with('pendamping')
            ->get()
            ->keyBy('indikator_id');
    }

    /**
     * Dapatkan daftar dokumen pendukung indikator untuk pengajuan atau inovasi.
     *
     * @return Collection<int, \App\Models\InovasiDokumen>
     */
    public function getDokumenIndikatorList(int $inovasiId, int $pengajuanId): Collection
    {
        return \App\Models\InovasiDokumen::where(function ($q) use ($inovasiId, $pengajuanId) {
            $q->where('pengajuan_lomba_id', $pengajuanId)
                ->orWhere('inovasi_id', $inovasiId);
        })
            ->whereNotNull('indikator_sid_id')
            ->get();
    }

    /**
     * Update or create parameter indikator pilihan inovator.
     */
    public function updateOrCreateKelengkapan(
        int $pengajuanId,
        int $indikatorId,
        ?string $parameter,
        ?string $catatan = null
    ): \App\Models\KelengkapanIndikator {
        return \App\Models\KelengkapanIndikator::updateOrCreate(
            [
                'pengajuan_lomba_id' => $pengajuanId,
                'indikator_sid_id' => $indikatorId,
            ],
            [
                'parameter' => $parameter,
                'catatan' => $catatan,
            ]
        );
    }

    /**
     * Simpan / update catatan review pendamping untuk satu indikator.
     */
    public function updateOrCreateKomentar(
        int $pengajuanId,
        int $indikatorId,
        int $pendampingId,
        ?string $komentar,
        ?string $statusValidasi = null
    ): \App\Models\SkorPengajuan {
        $skor = \App\Models\SkorPengajuan::firstOrNew([
            'pengajuan_lomba_id' => $pengajuanId,
            'indikator_id' => $indikatorId,
        ]);

        $skor->komentar_pendamping = $komentar;
        if (! empty($statusValidasi)) {
            $skor->status_validasi = $statusValidasi;
        }
        $skor->pendamping_id = $pendampingId;
        $skor->komentar_at = now();
        if (! $skor->exists) {
            $skor->tier = 1;
            $skor->skor = 0.0;
        }
        $skor->save();

        return $skor;
    }

    /**
     * Dapatkan dokumen bukti dukung untuk spesifik satu indikator.
     *
     * @return Collection<int, \App\Models\InovasiDokumen>
     */
    public function getDokumenForSpesifikIndikator(int $inovasiId, int $pengajuanId, int $indikatorId): Collection
    {
        return \App\Models\InovasiDokumen::where(function ($q) use ($inovasiId, $pengajuanId) {
            $q->where('pengajuan_lomba_id', $pengajuanId)
                ->orWhere('inovasi_id', $inovasiId);
        })
            ->where('indikator_sid_id', $indikatorId)
            ->latest()
            ->get();
    }
}
