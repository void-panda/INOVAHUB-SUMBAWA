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
        return PenugasanPendamping::create($data->toArray());
    }

    /**
     * Hapus penugasan pendamping.
     */
    public function deletePenugasan(PenugasanPendamping $penugasan): void
    {
        $penugasan->delete();
    }
}
