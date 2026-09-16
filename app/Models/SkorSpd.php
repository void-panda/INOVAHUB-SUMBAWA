<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $periode_lomba_id
 * @property int $indikator_id
 * @property int $tier
 * @property float $skor
 * @property string|null $catatan
 */
#[Fillable(['periode_lomba_id', 'indikator_id', 'tier', 'skor', 'catatan'])]
class SkorSpd extends Model
{
    protected $table = 'skor_spd';

    /** @return BelongsTo<PeriodeLomba, $this> */
    public function periodeLomba(): BelongsTo
    {
        return $this->belongsTo(PeriodeLomba::class);
    }

    /** @return BelongsTo<IndikatorSpd, $this> */
    public function indikator(): BelongsTo
    {
        return $this->belongsTo(IndikatorSpd::class, 'indikator_id');
    }

    /** @return BelongsTo<IndikatorSpd, $this> */
    public function indikatorSpd(): BelongsTo
    {
        return $this->belongsTo(IndikatorSpd::class, 'indikator_id');
    }
}
