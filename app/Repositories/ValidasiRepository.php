<?php

namespace App\Repositories;

use App\DTOs\ValidasiFilterData;
use App\Enums\StatusPengajuan;
use App\Models\PengajuanLomba;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ValidasiRepository
{
    /**
     * Ambil penugasan pendamping untuk user pada periode lomba tertentu.
     *
     * @return Collection<int, PenugasanPendamping>
     */
    public function getPenugasanPendamping(User $user, ?int $periodeId): Collection
    {
        $query = PenugasanPendamping::where('pendamping_id', $user->id);

        if ($periodeId) {
            $query->where('periode_lomba_id', $periodeId);
        }

        return $query->with(['opd', 'inovasi'])->get();
    }

    /**
     * Dapatkan data antrean pengajuan lomba berpaginasi beserta ringkasan jumlah status.
     *
     * @param  Collection<int, PenugasanPendamping>  $penugasan
     * @return array{inovasiList: LengthAwarePaginator<int, PengajuanLomba>, counts: array<string, int>}
     */
    public function getAntreanValidasi(
        Collection $penugasan,
        ?PeriodeLomba $periode,
        ValidasiFilterData $filters
    ): array {
        $periodeId = $periode?->id;

        $assignedInovasiIds = $penugasan->pluck('inovasi_id')->filter()->all();
        $assignedOpdIds = $penugasan->pluck('opd_id')->filter()->all();
        $assignedInovatorIds = $penugasan->pluck('inovator_id')->filter()->all();

        $baseQuery = PengajuanLomba::query()
            ->where('is_arsip', false);

        if ($periodeId) {
            $baseQuery->where('periode_lomba_id', $periodeId);
        }

        if (! empty($assignedInovasiIds) || ! empty($assignedOpdIds) || ! empty($assignedInovatorIds)) {
            $allAssignedInovasiIds = PenugasanPendamping::when($periodeId, fn ($q) => $q->where('periode_lomba_id', $periodeId))
                ->whereNotNull('inovasi_id')
                ->pluck('inovasi_id')
                ->all();

            $baseQuery->where(function (Builder $query) use ($assignedInovasiIds, $assignedOpdIds, $assignedInovatorIds, $allAssignedInovasiIds) {
                if (! empty($assignedInovasiIds)) {
                    $query->whereIn('inovasi_id', $assignedInovasiIds);
                }
                if (! empty($assignedOpdIds)) {
                    $query->orWhereHas('inovasi', fn ($i) => $i->whereIn('opd_id', $assignedOpdIds));
                }
                if (! empty($assignedInovatorIds)) {
                    $query->orWhereIn('user_id', $assignedInovatorIds);
                }
                if (! empty($allAssignedInovasiIds)) {
                    $query->orWhereNotIn('inovasi_id', $allAssignedInovasiIds);
                }
            });
        }

        $counts = [
            'all' => (clone $baseQuery)->count(),
            'dalam_pendampingan' => (clone $baseQuery)->where('status', StatusPengajuan::DalamPendampingan)->count(),
            'disahkan_opd' => (clone $baseQuery)->where('status', StatusPengajuan::DisahkanOpd)->count(),
            'review_internal' => (clone $baseQuery)->where('status', StatusPengajuan::ReviewInternal)->count(),
            'siap_kirim' => (clone $baseQuery)->where('status', StatusPengajuan::SiapKirim)->count(),
            'terkirim' => (clone $baseQuery)->where('status', StatusPengajuan::Terkirim)->count(),
        ];

        if ($filters->status && $filters->status !== 'all') {
            $baseQuery->where('status', $filters->status);
        }

        if ($filters->search) {
            $search = $filters->search;
            $baseQuery->whereHas('inovasi', function (Builder $query) use ($search) {
                $query->where('nama_inovasi', 'ilike', "%{$search}%")
                    ->orWhere('nama_inisiator', 'ilike', "%{$search}%")
                    ->orWhereHas('user', fn (Builder $q) => $q->where('name', 'ilike', "%{$search}%")->orWhere('nama_pemda', 'ilike', "%{$search}%"));
            });
        }

        $inovasiList = $baseQuery
            ->with(['inovasi.user', 'inovasi.opd', 'inovasi.dokumen', 'periodeLomba', 'skorPengajuan', 'kelengkapanIndikator'])
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        return [
            'inovasiList' => $inovasiList,
            'counts' => $counts,
        ];
    }
}
