<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $periode_lomba_id
 * @property string $nama
 * @property Carbon $mulai
 * @property Carbon $selesai
 */
#[Fillable(['periode_lomba_id', 'nama', 'mulai', 'selesai'])]
class Linimasa extends Model
{
    protected $table = 'linimasa';

    public $timestamps = false;

    /** @return BelongsTo<PeriodeLomba, $this> */
    public function periodeLomba(): BelongsTo
    {
        return $this->belongsTo(PeriodeLomba::class);
    }

    protected function casts(): array
    {
        return [
            'mulai' => 'date',
            'selesai' => 'date',
        ];
    }
}
