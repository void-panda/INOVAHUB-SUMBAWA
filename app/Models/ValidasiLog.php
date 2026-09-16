<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $inovasi_id
 * @property int|null $pengajuan_lomba_id
 * @property int $user_id
 * @property string $status_sebelum
 * @property string $status_sesudah
 * @property string|null $catatan
 */
#[Fillable(['inovasi_id', 'pengajuan_lomba_id', 'user_id', 'status_sebelum', 'status_sesudah', 'catatan'])]
class ValidasiLog extends Model
{
    protected $table = 'validasi_log';

    /** @return BelongsTo<Inovasi, $this> */
    public function inovasi(): BelongsTo
    {
        return $this->belongsTo(Inovasi::class);
    }

    /** @return BelongsTo<PengajuanLomba, $this> */
    public function pengajuanLomba(): BelongsTo
    {
        return $this->belongsTo(PengajuanLomba::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
