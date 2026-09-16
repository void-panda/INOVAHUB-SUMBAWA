<?php

namespace App\DTOs;

readonly class IndikatorData
{
    public function __construct(
        public string $kode,
        public string $nama,
        public ?string $variabel,
        public float $bobot,
        public ?string $p1 = null,
        public ?string $p2 = null,
        public ?string $p3 = null,
    ) {}

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'kode' => $this->kode,
            'nama' => $this->nama,
            'variabel' => $this->variabel,
            'bobot' => $this->bobot,
            'p1' => $this->p1,
            'p2' => $this->p2,
            'p3' => $this->p3,
        ];
    }
}
