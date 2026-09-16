<?php

namespace App\Repositories;

use App\DTOs\IndikatorData;
use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use Illuminate\Database\Eloquent\Collection;

class IndikatorRepository
{
    /**
     * @return Collection<int, IndikatorSpd>
     */
    public function getAllSpd(): Collection
    {
        return IndikatorSpd::orderBy('kode')->get();
    }

    /**
     * @return Collection<int, IndikatorSid>
     */
    public function getAllSid(): Collection
    {
        return IndikatorSid::orderBy('kode')->get();
    }

    public function findSpdById(int $id): ?IndikatorSpd
    {
        return IndikatorSpd::find($id);
    }

    public function findSidById(int $id): ?IndikatorSid
    {
        return IndikatorSid::find($id);
    }

    public function createSpd(IndikatorData $data): IndikatorSpd
    {
        return IndikatorSpd::create($data->toArray());
    }

    public function updateSpd(IndikatorSpd $indikator, IndikatorData $data): bool
    {
        return $indikator->update($data->toArray());
    }

    public function createSid(IndikatorData $data): IndikatorSid
    {
        return IndikatorSid::create($data->toArray());
    }

    public function updateSid(IndikatorSid $indikator, IndikatorData $data): bool
    {
        return $indikator->update($data->toArray());
    }
}
