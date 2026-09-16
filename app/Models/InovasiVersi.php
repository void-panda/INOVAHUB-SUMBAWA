<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $inovasi_baru_id
 * @property int $inovasi_asal_id
 * @property int $tahun
 * @property string $catatan_pengembangan
 */
#[Fillable(['inovasi_baru_id', 'inovasi_asal_id', 'tahun', 'catatan_pengembangan'])]
class InovasiVersi extends Model
{
    protected $table = 'inovasi_versi';

    /** @return BelongsTo<Inovasi, $this> */
    public function inovasiBaru(): BelongsTo
    {
        return $this->belongsTo(Inovasi::class, 'inovasi_baru_id');
    }

    /** @return BelongsTo<Inovasi, $this> */
    public function inovasiAsal(): BelongsTo
    {
        return $this->belongsTo(Inovasi::class, 'inovasi_asal_id');
    }
}
