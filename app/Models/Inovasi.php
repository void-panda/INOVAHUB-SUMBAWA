<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $opd_id
 * @property bool $is_inovasi_daerah
 * @property string $nama_inovasi
 * @property string $tahapan
 * @property string|null $inisiator
 * @property string|null $bentuk_inovasi
 * @property string|null $jenis_inovasi
 * @property string|null $klasifikasi
 * @property string|null $tematik
 * @property string|null $kriteria_inovasi
 * @property string $nama_inisiator
 * @property string $koordinat
 * @property string|null $lokasi
 * @property string|null $urusan_utama
 * @property string|null $urusan_wajib
 * @property Carbon|null $waktu_uji_coba
 * @property Carbon $waktu_penerapan
 * @property Carbon|null $waktu_pengembangan
 * @property string|null $anggaran_sebelum
 * @property string|null $anggaran_sesudah
 * @property bool $is_penghargaan
 * @property string|null $nama_penghargaan
 * @property string|null $rancang_bangun
 * @property string|null $tujuan
 * @property string|null $manfaat
 * @property string|null $hasil_inovasi
 * @property string|null $file_penghargaan
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'user_id', 'opd_id', 'is_inovasi_daerah', 'nama_inovasi', 'tahapan', 'inisiator',
    'bentuk_inovasi', 'jenis_inovasi', 'klasifikasi', 'tematik', 'kriteria_inovasi',
    'nama_inisiator', 'koordinat', 'lokasi', 'urusan_utama', 'urusan_wajib',
    'waktu_uji_coba', 'waktu_penerapan', 'waktu_pengembangan',
    'anggaran_sebelum', 'anggaran_sesudah', 'is_penghargaan', 'nama_penghargaan',
    'rancang_bangun', 'tujuan', 'manfaat', 'hasil_inovasi',
    'file_penghargaan',
])]
class Inovasi extends Model
{
    protected $table = 'inovasi';

    protected function casts(): array
    {
        return [
            'is_inovasi_daerah' => 'boolean',
            'waktu_uji_coba' => 'date',
            'waktu_penerapan' => 'date',
            'waktu_pengembangan' => 'date',
            'is_penghargaan' => 'boolean',
            'anggaran_sebelum' => 'decimal:2',
            'anggaran_sesudah' => 'decimal:2',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Opd, $this> */
    public function opd(): BelongsTo
    {
        return $this->belongsTo(Opd::class);
    }

    /** @return HasMany<PengajuanLomba, $this> */
    public function pengajuanLomba(): HasMany
    {
        return $this->hasMany(PengajuanLomba::class);
    }

    /** @return HasOne<PengajuanLomba, $this> */
    public function pengajuanAktif(): HasOne
    {
        return $this->hasOne(PengajuanLomba::class)
            ->whereHas('periodeLomba', function ($q) {
                $q->where('aktif', true);
            })
            ->where('is_arsip', false);
    }

    protected $appends = ['status'];

    /** @return HasMany<InovasiDokumen, $this> */
    public function dokumen(): HasMany
    {
        return $this->hasMany(InovasiDokumen::class);
    }

    /** @return HasMany<ValidasiLog, $this> */
    public function validasiLogs(): HasMany
    {
        return $this->hasMany(ValidasiLog::class);
    }

    /**
     * Dapatkan status alur aktif inovasi dari siklus lomba berjalan.
     */
    public function getStatusAttribute(): string
    {
        return $this->pengajuanAktif?->status?->value ?? 'draft';
    }
}
