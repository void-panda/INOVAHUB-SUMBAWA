<?php

namespace App\DTOs;

readonly class PenugasanData
{
    public function __construct(
        public int $pendampingId,
        public ?int $opdId,
        public ?int $inovatorId,
        public int $periodeLombaId,
        public ?int $inovasiId = null,
        /** @var array<int, int> */
        public array $inovasiIds = []
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data, int $periodeLombaId): self
    {
        $inovasiIds = [];
        if (isset($data['inovasi_ids']) && is_array($data['inovasi_ids'])) {
            $inovasiIds = array_map('intval', $data['inovasi_ids']);
        } elseif (isset($data['inovasi_id']) && $data['inovasi_id']) {
            $inovasiIds = [(int) $data['inovasi_id']];
        }

        return new self(
            pendampingId: (int) $data['pendamping_id'],
            opdId: isset($data['opd_id']) && $data['opd_id'] ? (int) $data['opd_id'] : null,
            inovatorId: isset($data['inovator_id']) && $data['inovator_id'] ? (int) $data['inovator_id'] : null,
            periodeLombaId: $periodeLombaId,
            inovasiId: isset($data['inovasi_id']) && $data['inovasi_id'] ? (int) $data['inovasi_id'] : ($inovasiIds[0] ?? null),
            inovasiIds: $inovasiIds
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'pendamping_id' => $this->pendampingId,
            'opd_id' => $this->opdId,
            'inovator_id' => $this->inovatorId,
            'inovasi_id' => $this->inovasiId,
            'periode_lomba_id' => $this->periodeLombaId,
        ];
    }
}
