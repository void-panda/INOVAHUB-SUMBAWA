<?php

namespace App\DTOs;

readonly class SkoringData
{
    /**
     * @param  array<int, array{indikator_id: int, tier: int, catatan?: string|null}>  $itemsSid
     * @param  array<int, array{indikator_id: int, tier: int, catatan?: string|null}>  $itemsSpd
     */
    public function __construct(
        public int $inovasiId,
        public array $itemsSid = [],
        public array $itemsSpd = [],
        public bool $isFinal = false,
    ) {}
}
