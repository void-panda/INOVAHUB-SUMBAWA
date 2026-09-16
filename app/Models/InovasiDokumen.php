<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $inovasi_id
 * @property int|null $pengajuan_lomba_id
 * @property int|null $indikator_sid_id
 * @property string|null $nomor_surat
 * @property string|null $tanggal_surat
 * @property string|null $tentang
 * @property string $jenis
 * @property string $path
 * @property string $nama_asal
 * @property string $mime
 * @property int $ukuran
 */
#[Fillable(['inovasi_id', 'pengajuan_lomba_id', 'indikator_sid_id', 'nomor_surat', 'tanggal_surat', 'tentang', 'jenis', 'path', 'nama_asal', 'mime', 'ukuran'])]
class InovasiDokumen extends Model
{
    protected $table = 'inovasi_dokumen';

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

    /** @return BelongsTo<IndikatorSid, $this> */
    public function indikatorSid(): BelongsTo
    {
        return $this->belongsTo(IndikatorSid::class, 'indikator_sid_id');
    }
}
