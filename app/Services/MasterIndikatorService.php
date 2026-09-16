<?php

namespace App\Services;

use App\DTOs\IndikatorData;
use App\Models\IndikatorSid;
use App\Models\IndikatorSpd;
use App\Repositories\IndikatorRepository;
use Illuminate\Database\Eloquent\Collection;

class MasterIndikatorService
{
    public function __construct(
        protected IndikatorRepository $indikatorRepository
    ) {}

    /**
     * @return Collection<int, IndikatorSpd>
     */
    public function getSpdIndikatorList(): Collection
    {
        return $this->indikatorRepository->getAllSpd();
    }

    /**
     * @return Collection<int, IndikatorSid>
     */
    public function getSidIndikatorList(): Collection
    {
        return $this->indikatorRepository->getAllSid();
    }

    public function createSpd(IndikatorData $data): IndikatorSpd
    {
        return $this->indikatorRepository->createSpd($data);
    }

    public function updateSpd(int $id, IndikatorData $data): bool
    {
        $indikator = $this->indikatorRepository->findSpdById($id);

        if ($indikator === null) {
            return false;
        }

        return $this->indikatorRepository->updateSpd($indikator, $data);
    }

    public function createSid(IndikatorData $data): IndikatorSid
    {
        return $this->indikatorRepository->createSid($data);
    }

    public function updateSid(int $id, IndikatorData $data): bool
    {
        $indikator = $this->indikatorRepository->findSidById($id);

        if ($indikator === null) {
            return false;
        }

        return $this->indikatorRepository->updateSid($indikator, $data);
    }
}
