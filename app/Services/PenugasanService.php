<?php

namespace App\Services;

use App\DTOs\PenugasanData;
use App\Models\PenugasanPendamping;

class PenugasanService
{
    /**
     * Simpan penugasan pendamping baru.
     */
    public function createPenugasan(PenugasanData $data): PenugasanPendamping
    {
        if (! empty($data->inovasiIds)) {
            $this->assignInovasiBatch($data->pendampingId, $data->inovasiIds, $data->periodeLombaId);

            return PenugasanPendamping::where('pendamping_id', $data->pendampingId)
                ->where('periode_lomba_id', $data->periodeLombaId)
                ->latest()
                ->firstOrFail();
        }

        return PenugasanPendamping::create($data->toArray());
    }

    /**
     * Alokasikan banyak inovasi ke satu pendamping (eksklusif 1 inovasi = 1 pendamping).
     *
     * @param  array<int, int>  $inovasiIds
     */
    public function assignInovasiBatch(int $pendampingId, array $inovasiIds, int $periodeLombaId): void
    {
        foreach ($inovasiIds as $inovasiId) {
            // Hapus penugasan lama untuk inovasi ini di periode aktif (eksklusif)
            PenugasanPendamping::where('periode_lomba_id', $periodeLombaId)
                ->where('inovasi_id', $inovasiId)
                ->delete();

            PenugasanPendamping::create([
                'pendamping_id' => $pendampingId,
                'inovasi_id' => $inovasiId,
                'periode_lomba_id' => $periodeLombaId,
            ]);
        }
    }

    /**
     * Hapus penugasan pendamping.
     */
    public function deletePenugasan(PenugasanPendamping $penugasan): void
    {
        $penugasan->delete();
    }
}
