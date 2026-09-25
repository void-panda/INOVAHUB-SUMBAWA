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

    /**
     * Cek apakah masa pendaftaran / kompetisi lomba masih berlangsung.
     */
    public function isLombaBerjalan(): bool
    {
        if (! $this->aktif) {
            return false;
        }

        $now = now();
        $mulai = $this->tanggal_mulai ? Carbon::parse($this->tanggal_mulai)->startOfDay() : null;
        $selesai = $this->tanggal_selesai ? Carbon::parse($this->tanggal_selesai)->endOfDay() : null;

        if ($mulai && $now->lt($mulai)) {
            return false;
        }

        if ($selesai && $now->gt($selesai)) {
            return false;
        }

        return true;
    }

    /**
     * Cek apakah periode telah masuk fase Pasca Lomba (pendaftaran ditutup, saatnya pembinaan 20 indikator SID).
     */
    public function isPascaLomba(): bool
    {
        if (! $this->aktif) {
            return false;
        }

        if (! $this->tanggal_selesai) {
            return false;
        }

        return now()->gt(Carbon::parse($this->tanggal_selesai)->endOfDay());
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
