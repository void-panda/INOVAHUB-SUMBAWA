<?php

namespace App\Repositories;

use App\Models\SkorPengajuan;
use App\Models\SkorSpd;
use Illuminate\Database\Eloquent\Collection;

class SkorRepository
{
    /**
     * @return Collection<int, SkorPengajuan>
     */
    public function getSkorSidForPengajuan(int $pengajuanLombaId): Collection
    {
        return SkorPengajuan::with('indikator')
            ->where('pengajuan_lomba_id', $pengajuanLombaId)
            ->get();
    }

    /**
     * @return Collection<int, SkorSpd>
     */
    public function getSkorSpdForPeriode(int $periodeLombaId): Collection
    {
        return SkorSpd::with('indikator')
            ->where('periode_lomba_id', $periodeLombaId)
            ->get();
    }

    public function saveSkorPengajuan(
        int $pengajuanLombaId,
        int $indikatorId,
        int $tier,
        float $skor,
        ?string $catatan = null,
        ?string $komentarPendamping = null,
        ?int $pendampingId = null
    ): SkorPengajuan {
        $data = [
            'tier' => $tier,
            'skor' => $skor,
            'catatan' => $catatan,
        ];

        if ($komentarPendamping !== null) {
            $data['komentar_pendamping'] = $komentarPendamping;
            $data['pendamping_id'] = $pendampingId;
            $data['komentar_at'] = now();
        }

        return SkorPengajuan::updateOrCreate(
            ['pengajuan_lomba_id' => $pengajuanLombaId, 'indikator_id' => $indikatorId],
            $data
        );
    }

    public function saveSkorSpd(int $periodeLombaId, int $indikatorId, int $tier, float $skor, ?string $catatan = null): SkorSpd
    {
        return SkorSpd::updateOrCreate(
            ['periode_lomba_id' => $periodeLombaId, 'indikator_id' => $indikatorId],
            ['tier' => $tier, 'skor' => $skor, 'catatan' => $catatan]
        );
    }
}
