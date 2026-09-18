<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $kode
 * @property string $nama
 * @property string|null $variabel
 * @property string|null $informasi
 * @property string $bobot
 * @property string|null $p1
 * @property string|null $p2
 * @property string|null $p3
 * @property array|null $opsi
 * @property-read array $opsi_list
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['kode', 'nama', 'variabel', 'informasi', 'bobot', 'p1', 'p2', 'p3', 'opsi'])]
class IndikatorSid extends Model
{
    protected $table = 'indikator_sid';

    protected $casts = [
        'opsi' => 'array',
        'bobot' => 'float',
    ];

    protected $appends = ['opsi_list'];

    /**
     * @return array<int, array{id: string, label: string, bobot: float}>
     */
    public function getOpsiListAttribute(): array
    {
        if (is_array($this->opsi) && !empty($this->opsi)) {
            $list = [];
            foreach ($this->opsi as $idx => $opt) {
                $list[] = [
                    'id' => (string) ($opt['id'] ?? 'p' . ($idx + 1)),
                    'label' => (string) ($opt['label'] ?? ''),
                    'bobot' => (float) ($opt['bobot'] ?? ($idx + 1)),
                ];
            }
            return $list;
        }

        $fallback = [];
        if (!empty($this->p1)) {
            $fallback[] = ['id' => 'p1', 'label' => $this->p1, 'bobot' => 1.0];
        }
        if (!empty($this->p2)) {
            $fallback[] = ['id' => 'p2', 'label' => $this->p2, 'bobot' => 2.0];
        }
        if (!empty($this->p3)) {
            $fallback[] = ['id' => 'p3', 'label' => $this->p3, 'bobot' => 3.0];
        }

        return $fallback;
    }
}
