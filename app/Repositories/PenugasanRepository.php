<?php

namespace App\Repositories;

use App\DTOs\PenugasanData;
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
            ->with(['pendamping', 'opd', 'inovator'])
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
            ->get(['id', 'name', 'email', 'nama_pemda']);
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
            ->when($data->opdId, fn ($q) => $q->where('opd_id', $data->opdId))
            ->when($data->inovatorId, fn ($q) => $q->where('inovator_id', $data->inovatorId))
            ->exists();
    }
}
