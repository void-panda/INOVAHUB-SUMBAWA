<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @property int $id
 * @property int $tahun
 * @property string|null $nama
 * @property Carbon|null $tanggal_mulai
 * @property Carbon|null $tanggal_selesai
 * @property bool $aktif
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['tahun', 'nama', 'tanggal_mulai', 'tanggal_selesai', 'aktif'])]
class PeriodeLomba extends Model
{
    protected $table = 'periode_lomba';

    /** @return HasMany<PengajuanLomba, $this> */
    public function pengajuanLomba(): HasMany
    {
        return $this->hasMany(PengajuanLomba::class);
    }

    /** @return HasManyThrough<Inovasi, PengajuanLomba, $this> */
    public function inovasi(): HasManyThrough
    {
        return $this->hasManyThrough(Inovasi::class, PengajuanLomba::class, 'periode_lomba_id', 'id', 'id', 'inovasi_id');
    }

    /** @return HasMany<Linimasa, $this> */
    public function linimasa(): HasMany
    {
        return $this->hasMany(Linimasa::class);
    }

    protected function casts(): array
    {
        return [
            'aktif' => 'boolean',
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
        ];
    }
}
