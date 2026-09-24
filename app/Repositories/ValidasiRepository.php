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

        $lockedStatuses = [
            StatusPengajuan::DisahkanOpd,
            StatusPengajuan::ReviewInternal,
            StatusPengajuan::SiapKirim,
            StatusPengajuan::Terkirim,
        ];

        $baseQuery = PengajuanLomba::query()
            ->where('is_arsip', false)
            ->whereNotIn('status', $lockedStatuses);

        if ($periodeId) {
            $baseQuery->where('periode_lomba_id', $periodeId);
        }

        if (! empty($assignedInovasiIds) || ! empty($assignedOpdIds) || ! empty($assignedInovatorIds)) {
            $baseQuery->where(function (Builder $query) use ($assignedInovasiIds, $assignedOpdIds, $assignedInovatorIds) {
                $hasScope = false;
                if (! empty($assignedInovasiIds)) {
                    $query->whereIn('inovasi_id', $assignedInovasiIds);
                    $hasScope = true;
                }
                if (! empty($assignedOpdIds)) {
                    if ($hasScope) {
                        $query->orWhereHas('inovasi', fn ($i) => $i->whereIn('opd_id', $assignedOpdIds));
                    } else {
                        $query->whereHas('inovasi', fn ($i) => $i->whereIn('opd_id', $assignedOpdIds));
                        $hasScope = true;
                    }
                }
                if (! empty($assignedInovatorIds)) {
                    if ($hasScope) {
                        $query->orWhereIn('user_id', $assignedInovatorIds);
                    } else {
                        $query->whereIn('user_id', $assignedInovatorIds);
                        $hasScope = true;
                    }
                }
            });
        } else {
            $baseQuery->whereRaw('1 = 0');
        }

        // Hitung inovasi yang telah disahkan untuk informasi di kartu metrik
        $disahkanQuery = PengajuanLomba::query()
            ->where('is_arsip', false)
            ->whereIn('status', $lockedStatuses);

        if ($periodeId) {
            $disahkanQuery->where('periode_lomba_id', $periodeId);
        }

        if (! empty($assignedInovasiIds) || ! empty($assignedOpdIds) || ! empty($assignedInovatorIds)) {
            $disahkanQuery->where(function (Builder $query) use ($assignedInovasiIds, $assignedOpdIds, $assignedInovatorIds) {
                $hasScope = false;
                if (! empty($assignedInovasiIds)) {
                    $query->whereIn('inovasi_id', $assignedInovasiIds);
                    $hasScope = true;
                }
                if (! empty($assignedOpdIds)) {
                    if ($hasScope) {
                        $query->orWhereHas('inovasi', fn ($i) => $i->whereIn('opd_id', $assignedOpdIds));
                    } else {
                        $query->whereHas('inovasi', fn ($i) => $i->whereIn('opd_id', $assignedOpdIds));
                        $hasScope = true;
                    }
                }
                if (! empty($assignedInovatorIds)) {
                    if ($hasScope) {
                        $query->orWhereIn('user_id', $assignedInovatorIds);
                    } else {
                        $query->whereIn('user_id', $assignedInovatorIds);
                        $hasScope = true;
                    }
                }
            });
        } else {
            $disahkanQuery->whereRaw('1 = 0');
        }

        $counts = [
            'all' => (clone $baseQuery)->count(),
            'dalam_pendampingan' => (clone $baseQuery)->where('status', StatusPengajuan::DalamPendampingan)->count(),
            'disahkan_opd' => (clone $disahkanQuery)->count(),
            'lanjutan' => (clone $disahkanQuery)->whereIn('status', [
                StatusPengajuan::ReviewInternal,
                StatusPengajuan::SiapKirim,
                StatusPengajuan::Terkirim,
            ])->count(),
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

        $paginated = $baseQuery
            ->with(['inovasi.user', 'inovasi.opd', 'inovasi.dokumen', 'periodeLomba', 'skorPengajuan', 'kelengkapanIndikator'])
            ->orderByDesc('updated_at')
            ->paginate(15)
            ->withQueryString();

        $inovasiList = $paginated->through(function (PengajuanLomba $item) {
            $kelengkapan = $item->kelengkapanIndikator ?? collect();
            $filledCount = $kelengkapan->whereNotNull('parameter')->count();

            return [
                'id' => $item->id,
                'inovasi_id' => $item->inovasi_id,
                'nama_inovasi' => $item->inovasi?->nama_inovasi ?? '-',
                'nama_inisiator' => $item->inovasi?->nama_inisiator ?? '-',
                'tahapan' => $item->inovasi?->tahapan ?? '-',
                'urusan_utama' => $item->inovasi?->urusan_utama ?? '-',
                'status' => $item->status instanceof StatusPengajuan ? $item->status->value : (string) $item->status,
                'estimasi_skor_kematangan' => (float) ($item->estimasi_skor_kematangan ?? 0),
                'filled_indikator' => $filledCount,
                'total_indikator' => 20,
                'opd_nama' => $item->inovasi?->opd?->nama ?? $item->inovasi?->user?->nama_pemda ?? 'Perangkat Daerah',
                'inisiator_nama' => $item->inovasi?->user?->name ?? '-',
                'created_at' => $item->created_at?->format('d/m/Y') ?? '-',
                'periode_tahun' => $item->periodeLomba?->tahun ?? date('Y'),
            ];
        });

        return [
            'inovasiList' => $inovasiList,
            'counts' => $counts,
        ];
    }
}
