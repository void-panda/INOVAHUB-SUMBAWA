<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $pendamping_id
 * @property int|null $opd_id
 * @property int|null $inovator_id
 * @property int $periode_lomba_id
 */
#[Fillable(['pendamping_id', 'opd_id', 'inovator_id', 'periode_lomba_id'])]
class PenugasanPendamping extends Model
{
    protected $table = 'penugasan_pendamping';

    /** @return BelongsTo<User, $this> */
    public function pendamping(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pendamping_id');
    }

    /** @return BelongsTo<Opd, $this> */
    public function opd(): BelongsTo
    {
        return $this->belongsTo(Opd::class);
    }

    /** @return BelongsTo<User, $this> */
    public function inovator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inovator_id');
    }

    /** @return BelongsTo<PeriodeLomba, $this> */
    public function periodeLomba(): BelongsTo
    {
        return $this->belongsTo(PeriodeLomba::class);
    }
}
