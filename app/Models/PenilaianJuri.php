<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $pengajuan_lomba_id
 * @property int $juri_id
 * @property float $nilai
 * @property string|null $catatan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'pengajuan_lomba_id',
    'juri_id',
    'nilai',
    'catatan',
])]
class PenilaianJuri extends Model
{
    protected $table = 'penilaian_juri';

    protected function casts(): array
    {
        return [
            'nilai' => 'float',
        ];
    }

    /** @return BelongsTo<PengajuanLomba, $this> */
    public function pengajuanLomba(): BelongsTo
    {
        return $this->belongsTo(PengajuanLomba::class);
    }

    /** @return BelongsTo<User, $this> */
    public function juri(): BelongsTo
    {
        return $this->belongsTo(User::class, 'juri_id');
    }
}
