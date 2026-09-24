<?php

namespace App\Repositories;

use App\Models\InovasiDokumen;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PengajuanLombaRepository
{
    /**
     * Dapatkan dokumen umum inovasi (dokumen pendukung lomba selain indikator SID).
     *
     * @return Collection<int, InovasiDokumen>
     */
    public function getDokumenUmum(int $inovasiId): Collection
    {
        return InovasiDokumen::where('inovasi_id', $inovasiId)
            ->whereNull('indikator_sid_id')
            ->get();
    }

    /**
     * Dapatkan pengajuan lomba lengkap untuk halaman skoring juri.
     */
    public function findForSkoring(int $pengajuanId): ?PengajuanLomba
    {
        return PengajuanLomba::with([
            'inovasi.user.opd',
            'inovasi.opd',
            'inovasi.dokumen',
            'periodeLomba',
            'skorPengajuan.indikator',
            'penilaianJuri.juri',
        ])->find($pengajuanId);
    }

    /**
     * Dapatkan daftar peserta lomba inovasi (user inovator beserta inovasi dan pengajuannya).
     *
     * @return Collection<int, User>
     */
    public function getPesertaLomba(?PeriodeLomba $periodeAktif): Collection
    {
        return User::whereHas('roles', fn ($q) => $q->where('name', 'inovator'))
            ->whereHas('inovasi')
            ->with([
                'opd:id,nama',
                'inovasi' => function ($q) use ($periodeAktif) {
                    $q->with([
                        'pengajuanLomba' => function ($pq) use ($periodeAktif) {
                            if ($periodeAktif) {
                                $pq->where('periode_lomba_id', $periodeAktif->id);
                            }
                            $pq->with('periodeLomba:id,tahun,nama');
                        },
                    ]);
                },
            ])
            ->get();
    }

    /**
     * Dapatkan daftar peserta lomba inovasi berpaginasi (server-side).
     *
     * @param  array{search?: string|null, tipe?: string|null}  $filters
     * @return LengthAwarePaginator<int, User>
     */
    public function getPesertaLombaPaginated(?PeriodeLomba $periodeAktif, int $perPage = 15, array $filters = []): LengthAwarePaginator
    {
        $query = User::whereHas('roles', fn ($q) => $q->where('name', 'inovator'))
            ->whereHas('inovasi')
            ->with([
                'opd:id,nama',
                'inovasi' => function ($q) use ($periodeAktif) {
                    $q->with([
                        'pengajuanLomba' => function ($pq) use ($periodeAktif) {
                            if ($periodeAktif) {
                                $pq->where('periode_lomba_id', $periodeAktif->id);
                            }
                            $pq->with('periodeLomba:id,tahun,nama');
                        },
                    ]);
                },
            ]);

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%")
                    ->orWhere('email', 'ilike', "%{$search}%")
                    ->orWhere('nama_pemda', 'ilike', "%{$search}%");
            });
        }

        if (! empty($filters['tipe']) && $filters['tipe'] !== 'all') {
            $query->where('tipe_inovator', $filters['tipe']);
        }

        return $query->orderBy('name')->paginate($perPage)->withQueryString();
    }
}
