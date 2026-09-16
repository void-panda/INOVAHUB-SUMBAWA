<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * @property int $id
 * @property int $tahun
 * @property bool $aktif
 */
#[Fillable(['tahun', 'aktif'])]
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
        return ['aktif' => 'boolean'];
    }
}
