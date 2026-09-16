<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $inovasi_id
 * @property int $indikator_id
 * @property int $tier
 * @property float $skor
 * @property string|null $catatan
 */
#[Fillable(['inovasi_id', 'indikator_id', 'tier', 'skor', 'catatan'])]
class SkorInovasi extends Model
{
    protected $table = 'skor_inovasi';

    /** @return BelongsTo<Inovasi, $this> */
    public function inovasi(): BelongsTo
    {
        return $this->belongsTo(Inovasi::class);
    }

    /** @return BelongsTo<IndikatorSid, $this> */
    public function indikator(): BelongsTo
    {
        return $this->belongsTo(IndikatorSid::class, 'indikator_id');
    }

    /** @return BelongsTo<IndikatorSid, $this> */
    public function indikatorSid(): BelongsTo
    {
        return $this->belongsTo(IndikatorSid::class, 'indikator_id');
    }
}
