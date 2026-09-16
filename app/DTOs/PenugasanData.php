<?php

namespace App\DTOs;

readonly class PenugasanData
{
    public function __construct(
        public int $pendampingId,
        public ?int $opdId,
        public ?int $inovatorId,
        public int $periodeLombaId
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data, int $periodeLombaId): self
    {
        return new self(
            pendampingId: (int) $data['pendamping_id'],
            opdId: isset($data['opd_id']) && $data['opd_id'] ? (int) $data['opd_id'] : null,
            inovatorId: isset($data['inovator_id']) && $data['inovator_id'] ? (int) $data['inovator_id'] : null,
            periodeLombaId: $periodeLombaId
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
            'periode_lomba_id' => $this->periodeLombaId,
        ];
    }
}
