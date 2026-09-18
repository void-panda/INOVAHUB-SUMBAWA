<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $pengajuan_lomba_id
 * @property int $indikator_id
 * @property int $tier
 * @property float $skor
 * @property string|null $catatan
 * @property string|null $komentar_pendamping
 * @property string $status_validasi
 * @property int|null $pendamping_id
 * @property Carbon|null $komentar_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'pengajuan_lomba_id',
    'indikator_id',
    'tier',
    'skor',
    'catatan',
    'komentar_pendamping',
    'status_validasi',
    'pendamping_id',
    'komentar_at',
])]
class SkorPengajuan extends Model
{
    protected $table = 'skor_pengajuan';

    protected function casts(): array
    {
        return [
            'skor' => 'float',
            'tier' => 'integer',
            'komentar_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<PengajuanLomba, $this> */
    public function pengajuanLomba(): BelongsTo
    {
        return $this->belongsTo(PengajuanLomba::class);
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

    /** @return BelongsTo<User, $this> */
    public function pendamping(): BelongsTo
    {
        return $this->belongsTo(User::class, 'pendamping_id');
    }
}
