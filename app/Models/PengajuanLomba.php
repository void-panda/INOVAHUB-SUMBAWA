<?php

namespace App\Models;

use App\Enums\StatusPengajuan;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $inovasi_id
 * @property int|null $periode_lomba_id
 * @property int $user_id
 * @property bool $is_inovasi_daerah
 * @property StatusPengajuan|string $status
 * @property bool $is_arsip
 * @property string|null $penjelasan_pengembangan
 * @property int|null $pengajuan_asal_id
 * @property float|null $estimasi_skor_kematangan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'inovasi_id',
    'periode_lomba_id',
    'user_id',
    'is_inovasi_daerah',
    'status',
    'is_arsip',
    'penjelasan_pengembangan',
    'pengajuan_asal_id',
    'estimasi_skor_kematangan',
])]
class PengajuanLomba extends Model
{
    protected $table = 'pengajuan_lomba';

    protected function casts(): array
    {
        return [
            'is_inovasi_daerah' => 'boolean',
            'is_arsip' => 'boolean',
            'status' => StatusPengajuan::class,
            'estimasi_skor_kematangan' => 'float',
        ];
    }

    /** @return BelongsTo<Inovasi, $this> */
    public function inovasi(): BelongsTo
    {
        return $this->belongsTo(Inovasi::class);
    }

    /** @return BelongsTo<PeriodeLomba, $this> */
    public function periodeLomba(): BelongsTo
    {
        return $this->belongsTo(PeriodeLomba::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<PengajuanLomba, $this> */
    public function pengajuanAsal(): BelongsTo
    {
        return $this->belongsTo(PengajuanLomba::class, 'pengajuan_asal_id');
    }

    /** @return HasMany<PengajuanLomba, $this> */
    public function versiTurunan(): HasMany
    {
        return $this->hasMany(PengajuanLomba::class, 'pengajuan_asal_id');
    }

    /** @return HasMany<SkorPengajuan, $this> */
    public function skorPengajuan(): HasMany
    {
        return $this->hasMany(SkorPengajuan::class);
    }

    /** @return HasMany<ValidasiLog, $this> */
    public function validasiLogs(): HasMany
    {
        return $this->hasMany(ValidasiLog::class);
    }

    /** @return HasMany<InovasiDokumen, $this> */
    public function dokumen(): HasMany
    {
        return $this->hasMany(InovasiDokumen::class);
    }

    /** @return HasMany<KelengkapanIndikator, $this> */
    public function kelengkapanIndikator(): HasMany
    {
        return $this->hasMany(KelengkapanIndikator::class);
    }

    public function isAktif(): bool
    {
        return (bool) ($this->periodeLomba?->aktif && ! $this->is_arsip);
    }

    public function canDiajukanKembali(): bool
    {
        return $this->is_arsip;
    }

    public function skorTotal(): float
    {
        return (float) $this->skorPengajuan()->sum('skor');
    }

    // Forwarding accessors to master Inovasi for convenience & export compatibility
    public function getNamaInovasiAttribute(): ?string
    {
        return $this->inovasi?->nama_inovasi;
    }

    public function getTahapanAttribute(): ?string
    {
        return $this->inovasi?->tahapan;
    }

    public function getNamaInisiatorAttribute(): ?string
    {
        return $this->inovasi?->nama_inisiator;
    }

    public function getInisiatorAttribute(): ?string
    {
        return $this->inovasi?->inisiator;
    }

    public function getBentukInovasiAttribute(): ?string
    {
        return $this->inovasi?->bentuk_inovasi;
    }

    public function getJenisInovasiAttribute(): ?string
    {
        return $this->inovasi?->jenis_inovasi;
    }

    public function getTematikAttribute(): ?string
    {
        return $this->inovasi?->tematik;
    }

    public function getUrusanUtamaAttribute(): ?string
    {
        return $this->inovasi?->urusan_utama;
    }

    public function getUrusanWajibAttribute(): ?string
    {
        return $this->inovasi?->urusan_wajib;
    }

    public function getWaktuUjiCobaAttribute(): mixed
    {
        return $this->inovasi?->waktu_uji_coba;
    }

    public function getWaktuPenerapanAttribute(): mixed
    {
        return $this->inovasi?->waktu_penerapan;
    }

    public function getWaktuPengembanganAttribute(): mixed
    {
        return $this->inovasi?->waktu_pengembangan;
    }

    public function getOpdAttribute(): ?Opd
    {
        return $this->inovasi?->opd;
    }
}
