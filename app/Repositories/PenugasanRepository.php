<?php

namespace App\Repositories;

use App\DTOs\PenugasanData;
use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class PenugasanRepository
{
    /**
     * @return Collection<int, PenugasanPendamping>
     */
    public function getAllForPeriode(?PeriodeLomba $periode): Collection
    {
        return PenugasanPendamping::query()
            ->when($periode, fn ($q) => $q->where('periode_lomba_id', $periode->id))
            ->with(['pendamping.opd', 'inovasi.opd', 'inovasi.user', 'opd', 'inovator'])
            ->orderByDesc('id')
            ->get();
    }

    /**
     * @return Collection<int, User>
     */
    public function getPendampingList(): Collection
    {
        return User::role('pendamping')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'nama_pemda', 'opd_id']);
    }

    /**
     * Daftar Inovasi dengan informasi pendamping saat ini pada periode lomba aktif.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getInovasiList(?PeriodeLomba $periode): array
    {
        $inovasiList = Inovasi::with(['opd', 'user'])
            ->orderBy('nama_inovasi')
            ->get();

        $assignments = $periode
            ? PenugasanPendamping::where('periode_lomba_id', $periode->id)
                ->whereNotNull('inovasi_id')
                ->with('pendamping')
                ->get()
                ->keyBy('inovasi_id')
            : collect();

        return $inovasiList->map(function (Inovasi $inovasi) use ($assignments) {
            $assignment = $assignments->get($inovasi->id);

            return [
                'id' => $inovasi->id,
                'nama_inovasi' => $inovasi->nama_inovasi,
                'tahapan' => $inovasi->tahapan,
                'inisiator' => $inovasi->nama_inisiator ?? $inovasi->inisiator,
                'opd_nama' => $inovasi->opd?->nama ?? $inovasi->nama_pemda ?? 'Umum / Non-OPD',
                'inovator_nama' => $inovasi->user?->name ?? '-',
                'current_pendamping_id' => $assignment?->pendamping_id,
                'current_pendamping_name' => $assignment?->pendamping?->name,
                'penugasan_id' => $assignment?->id,
            ];
        })->toArray();
    }

    /**
     * @return Collection<int, Opd>
     */
    public function getOpdList(): Collection
    {
        return Opd::orderBy('nama')->get(['id', 'nama', 'kode']);
    }

    /**
     * @return Collection<int, User>
     */
    public function getInovatorList(): Collection
    {
        return User::role('inovator')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'nama_pemda']);
    }

    /**
     * Cek apakah penugasan serupa sudah terdaftar.
     */
    public function exists(PenugasanData $data): bool
    {
        return PenugasanPendamping::where('periode_lomba_id', $data->periodeLombaId)
            ->where('pendamping_id', $data->pendampingId)
            ->when($data->inovasiId, fn ($q) => $q->where('inovasi_id', $data->inovasiId))
            ->when($data->opdId, fn ($q) => $q->where('opd_id', $data->opdId))
            ->when($data->inovatorId, fn ($q) => $q->where('inovator_id', $data->inovatorId))
            ->exists();
    }
}
