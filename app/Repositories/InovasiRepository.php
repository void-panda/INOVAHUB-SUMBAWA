<?php

namespace App\Repositories;

use App\Models\Inovasi;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class InovasiRepository
{
    /**
     * Ambil semua inovasi master milik user beserta status pengajuan aktifnya, dengan opsi filter inovasi daerah.
     *
     * @return Collection<int, Inovasi>
     */
    public function getByUser(User $user, ?bool $isDaerah = null): Collection
    {
        $query = $user->inovasi()
            ->with([
                'dokumen',
                'pengajuanLomba' => fn ($q) => $q->with(['periodeLomba', 'kelengkapanIndikator', 'skorPengajuan', 'penilaianJuri'])->latest(),
            ]);

        if ($isDaerah === true) {
            $query->where(function ($q) {
                $q->where('is_inovasi_daerah', true)
                    ->orWhereHas('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
            });
        } elseif ($isDaerah === false) {
            $query->where('is_inovasi_daerah', false)
                ->whereDoesntHave('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
        }

        return $query->orderByDesc('updated_at')->get();
    }

    /**
     * Ambil inovasi master milik user secara berpaginasi (server-side).
     *
     * @param  array{search?: string|null, tahapan?: string|null}  $filters
     * @return LengthAwarePaginator<int, Inovasi>
     */
    public function getByUserPaginated(User $user, ?bool $isDaerah = null, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = $user->inovasi()
            ->with([
                'dokumen',
                'pengajuanLomba' => fn ($q) => $q->with(['periodeLomba', 'kelengkapanIndikator', 'skorPengajuan', 'penilaianJuri'])->latest(),
            ]);

        if ($isDaerah === true) {
            $query->where(function ($q) {
                $q->where('is_inovasi_daerah', true)
                    ->orWhereHas('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
            });
        } elseif ($isDaerah === false) {
            $query->where('is_inovasi_daerah', false)
                ->whereDoesntHave('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
        }

        if (! empty($filters['opd_id'])) {
            $opdId = $filters['opd_id'];
            $query->where(function ($q) use ($opdId) {
                $q->where('opd_id', $opdId)
                    ->orWhereHas('user', fn ($u) => $u->where('opd_id', $opdId));
            });
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('nama_inovasi', 'ilike', "%{$search}%");
        }

        if (! empty($filters['tahapan']) && $filters['tahapan'] !== 'all') {
            $query->where('tahapan', $filters['tahapan']);
        }

        return $query->orderByDesc('updated_at')->paginate($perPage)->withQueryString();
    }

    /**
     * Ambil seluruh Inovasi Daerah Kabupaten Sumbawa.
     *
     * @return Collection<int, Inovasi>
     */
    public function getAllInovasiDaerah(): Collection
    {
        return Inovasi::where(function ($q) {
                $q->where('is_inovasi_daerah', true)
                    ->orWhereHas('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
            })
            ->with([
                'user.opd',
                'opd',
                'dokumen',
                'pengajuanLomba' => fn ($q) => $q->with(['periodeLomba', 'kelengkapanIndikator', 'skorPengajuan'])->latest(),
            ])
            ->orderByDesc('updated_at')
            ->get();
    }

    /**
     * Ambil seluruh Inovasi Daerah Kabupaten Sumbawa secara berpaginasi (server-side).
     *
     * @param  array{search?: string|null, tahapan?: string|null}  $filters
     * @return LengthAwarePaginator<int, Inovasi>
     */
    public function getAllInovasiDaerahPaginated(int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = Inovasi::with([
                'user.opd',
                'opd',
                'dokumen',
                'pengajuanLomba' => fn ($q) => $q->with(['periodeLomba', 'kelengkapanIndikator', 'skorPengajuan'])->latest(),
            ]);

        if (! empty($filters['opd_id'])) {
            $opdId = $filters['opd_id'];
            $query->where(function ($q) use ($opdId) {
                $q->where('opd_id', $opdId)
                    ->orWhereHas('user', fn ($u) => $u->where('opd_id', $opdId));
            });
        } else {
            $query->where(function ($q) {
                $q->where('is_inovasi_daerah', true)
                    ->orWhereHas('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
            });
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('nama_inovasi', 'ilike', "%{$search}%");
        }

        if (! empty($filters['tahapan']) && $filters['tahapan'] !== 'all') {
            $query->where('tahapan', $filters['tahapan']);
        }

        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $status = $filters['status'];
            $query->whereHas('pengajuanLomba', fn ($pl) => $pl->where('status', $status));
        }

        return $query->orderByDesc('updated_at')->paginate($perPage)->withQueryString();
    }

    /**
     * Ambil Inovasi Daerah yang didampingi oleh pendamping tertentu secara berpaginasi (server-side).
     *
     * @param  array{search?: string|null, tahapan?: string|null, opd_id?: int|string|null}  $filters
     * @return LengthAwarePaginator<int, Inovasi>
     */
    public function getInovasiDaerahByPendampingPaginated(User $user, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $penugasan = PenugasanPendamping::where('pendamping_id', $user->id)->get();
        $assignedInovasiIds = $penugasan->pluck('inovasi_id')->filter()->all();
        $assignedOpdIds = $penugasan->pluck('opd_id')->filter()->all();
        $assignedInovatorIds = $penugasan->pluck('inovator_id')->filter()->all();

        $query = Inovasi::where(function ($q) {
                $q->where('is_inovasi_daerah', true)
                    ->orWhereHas('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
            })
            ->where(function (Builder $q) use ($assignedInovasiIds, $assignedOpdIds, $assignedInovatorIds) {
                $hasFilter = false;
                if (! empty($assignedInovasiIds)) {
                    $q->whereIn('id', $assignedInovasiIds);
                    $hasFilter = true;
                }
                if (! empty($assignedOpdIds)) {
                    if ($hasFilter) {
                        $q->orWhereIn('opd_id', $assignedOpdIds);
                    } else {
                        $q->whereIn('opd_id', $assignedOpdIds);
                        $hasFilter = true;
                    }
                }
                if (! empty($assignedInovatorIds)) {
                    if ($hasFilter) {
                        $q->orWhereIn('user_id', $assignedInovatorIds);
                    } else {
                        $q->whereIn('user_id', $assignedInovatorIds);
                        $hasFilter = true;
                    }
                }
                if (! $hasFilter) {
                    $q->whereRaw('1 = 0');
                }
            })
            ->with([
                'user.opd',
                'opd',
                'dokumen',
                'pengajuanLomba' => fn ($q) => $q->with(['periodeLomba', 'kelengkapanIndikator', 'skorPengajuan'])->latest(),
            ]);

        if (! empty($filters['opd_id'])) {
            $opdId = $filters['opd_id'];
            $query->where(function ($q) use ($opdId) {
                $q->where('opd_id', $opdId)
                    ->orWhereHas('user', fn ($u) => $u->where('opd_id', $opdId));
            });
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where('nama_inovasi', 'ilike', "%{$search}%");
        }

        if (! empty($filters['tahapan']) && $filters['tahapan'] !== 'all') {
            $query->where('tahapan', $filters['tahapan']);
        }

        if (! empty($filters['status']) && $filters['status'] !== 'all') {
            $status = $filters['status'];
            $query->whereHas('pengajuanLomba', fn ($pl) => $pl->where('status', $status));
        }

        return $query->orderByDesc('updated_at')->paginate($perPage)->withQueryString();
    }

    /**
     * Ambil seluruh Inovasi Daerah yang didampingi oleh pendamping tertentu.
     *
     * @return Collection<int, Inovasi>
     */
    public function getInovasiDaerahByPendamping(User $user): Collection
    {
        $penugasan = PenugasanPendamping::where('pendamping_id', $user->id)->get();
        $assignedInovasiIds = $penugasan->pluck('inovasi_id')->filter()->all();
        $assignedOpdIds = $penugasan->pluck('opd_id')->filter()->all();
        $assignedInovatorIds = $penugasan->pluck('inovator_id')->filter()->all();

        return Inovasi::where(function ($q) {
                $q->where('is_inovasi_daerah', true)
                    ->orWhereHas('pengajuanLomba', fn ($pl) => $pl->where('is_inovasi_daerah', true));
            })
            ->where(function (Builder $q) use ($assignedInovasiIds, $assignedOpdIds, $assignedInovatorIds) {
                $hasFilter = false;
                if (! empty($assignedInovasiIds)) {
                    $q->whereIn('id', $assignedInovasiIds);
                    $hasFilter = true;
                }
                if (! empty($assignedOpdIds)) {
                    if ($hasFilter) {
                        $q->orWhereIn('opd_id', $assignedOpdIds);
                    } else {
                        $q->whereIn('opd_id', $assignedOpdIds);
                        $hasFilter = true;
                    }
                }
                if (! empty($assignedInovatorIds)) {
                    if ($hasFilter) {
                        $q->orWhereIn('user_id', $assignedInovatorIds);
                    } else {
                        $q->whereIn('user_id', $assignedInovatorIds);
                        $hasFilter = true;
                    }
                }
                if (! $hasFilter) {
                    $q->whereRaw('1 = 0');
                }
            })
            ->with([
                'user.opd',
                'opd',
                'dokumen',
                'pengajuanLomba' => fn ($q) => $q->with(['periodeLomba', 'kelengkapanIndikator', 'skorPengajuan'])->latest(),
            ])
            ->orderByDesc('updated_at')
            ->get();
    }

    /**
     * Cari inovasi beserta dokumen dan pengajuan untuk edit/view.
     */
    public function findWithDetails(int $id): ?Inovasi
    {
        return Inovasi::where('id', $id)
            ->with([
                'opd',
                'user.opd',
                'dokumen',
                'pengajuanAktif',
                'pengajuanLomba.periodeLomba',
            ])
            ->first();
    }

    /**
     * Cari inovasi lengkap dengan relasi untuk review.
     */
    public function findForReview(Inovasi $inovasi): Inovasi
    {
        return $inovasi->load([
            'user.opd',
            'opd',
            'dokumen',
            'pengajuanAktif',
            'pengajuanLomba.periodeLomba',
        ]);
    }

    /**
     * Dapatkan periode lomba aktif saat ini.
     */
    public function getAktifPeriode(): ?PeriodeLomba
    {
        return PeriodeLomba::where('aktif', true)->first();
    }

    /**
     * Dapatkan rantai versi / riwayat pengajuan lomba inovasi.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getVersionTree(Inovasi $inovasi): array
    {
        $history = $inovasi->pengajuanLomba()
            ->with('periodeLomba')
            ->orderBy('created_at')
            ->get();

        if ($history->isNotEmpty()) {
            return $history->map(fn ($p) => [
                'id' => $p->id,
                'tahun' => $p->periodeLomba?->tahun ?? (int) $p->created_at?->format('Y'),
                'status' => $p->status instanceof \App\Enums\StatusPengajuan ? $p->status->value : (string) $p->status,
                'penjelasan_pengembangan' => $p->penjelasan_pengembangan,
                'created_at' => $p->created_at?->format('d/m/Y H:i'),
            ])->all();
        }

        $versi = \App\Models\InovasiVersi::where('inovasi_baru_id', $inovasi->id)
            ->orWhere('inovasi_asal_id', $inovasi->id)
            ->with(['inovasiBaru', 'inovasiAsal'])
            ->get();

        return $versi->map(fn ($v) => [
            'id' => $v->id,
            'tahun' => $v->tahun,
            'catatan_pengembangan' => $v->catatan_pengembangan,
        ])->all();
    }
}

