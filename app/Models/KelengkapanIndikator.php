<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $pengajuan_lomba_id
 * @property int $indikator_sid_id
 * @property string|null $parameter
 * @property string|null $catatan
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable(['pengajuan_lomba_id', 'indikator_sid_id', 'parameter', 'catatan'])]
class KelengkapanIndikator extends Model
{
    protected $table = 'kelengkapan_indikator';

    /** @return BelongsTo<PengajuanLomba, $this> */
    public function pengajuanLomba(): BelongsTo
    {
        return $this->belongsTo(PengajuanLomba::class);
    }

    /** @return BelongsTo<IndikatorSid, $this> */
    public function indikatorSid(): BelongsTo
    {
        return $this->belongsTo(IndikatorSid::class, 'indikator_sid_id');
    }
}
