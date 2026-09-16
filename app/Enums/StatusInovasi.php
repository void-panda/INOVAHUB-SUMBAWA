<?php

namespace App\Enums;

enum StatusInovasi: string
{
    case Draft = 'draft';
    case Diajukan = 'diajukan';
    case Divalidasi = 'divalidasi';
    case Revisi = 'revisi';
    case Disetujui = 'disetujui';
    case DisahkanOpd = 'disahkan_opd';
    case ReviewInternal = 'review_internal';
    case SiapKirim = 'siap_kirim';
    case Terkirim = 'terkirim';
}
