<?php

namespace App\Repositories;

use App\Models\Inovasi;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

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

        if ($isDaerah !== null) {
            $query->where('is_inovasi_daerah', $isDaerah);
        }

        return $query->orderByDesc('updated_at')->get();
    }

    /**
     * Ambil seluruh Inovasi Daerah Kabupaten Sumbawa.
     *
     * @return Collection<int, Inovasi>
     */
    public function getAllInovasiDaerah(): Collection
    {
        return Inovasi::where('is_inovasi_daerah', true)
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
                'pengajuanLomba.validasiLogs.user',
                'validasiLogs.user',
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
            'pengajuanLomba.validasiLogs.user',
            'validasiLogs.user',
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

