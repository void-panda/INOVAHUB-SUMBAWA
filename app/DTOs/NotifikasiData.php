<?php

namespace App\DTOs;

readonly class NotifikasiData
{
    public function __construct(
        public int $userId,
        public string $tipe,
        public string $pesan,
        public ?string $link = null
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return array_filter([
            'user_id' => $this->userId,
            'tipe' => $this->tipe,
            'pesan' => $this->pesan,
            'link' => $this->link,
        ], fn ($val) => $val !== null);
    }
}
