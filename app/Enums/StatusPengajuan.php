<?php

namespace App\Enums;

enum StatusPengajuan: string
{
    case Draft = 'draft';
    case DalamPendampingan = 'dalam_pendampingan';
    case DisahkanOpd = 'disahkan_opd';
    case ReviewInternal = 'review_internal';
    case SiapKirim = 'siap_kirim';
    case Terkirim = 'terkirim';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft (Sedang Melengkapi Data)',
            self::DalamPendampingan => 'Dalam Pendampingan',
            self::DisahkanOpd => 'Disahkan OPD',
            self::ReviewInternal => 'Review Internal',
            self::SiapKirim => 'Siap Kirim',
            self::Terkirim => 'Terkirim',
        };
    }
}
