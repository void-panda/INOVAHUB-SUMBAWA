<?php

namespace App\Services;

use App\Enums\StatusPengajuan;
use App\Exceptions\InovasiStatusException;
use App\Models\Notifikasi;
use App\Models\PengajuanLomba;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ValidasiService
{
    /**
     * Pengesahan resmi tingkat Perangkat Daerah (OPD) oleh Kepala OPD / Verifikator OPD.
     */
    public function sahkanOpd(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $pengajuan->update(['status' => StatusPengajuan::DisahkanOpd]);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'disahkan_opd',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah disahkan oleh Perangkat Daerah (OPD).",
                'link' => "/inovator/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Pengajuan masuk ke tahap Review Internal Tim Penilai / Bappeda.
     */
    public function reviewInternal(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $pengajuan->update(['status' => StatusPengajuan::ReviewInternal]);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'review',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' sedang dalam tahap review internal tim penilai.",
                'link' => "/inovator/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Tandai pengajuan siap dikirim ke BSKDN Kemendagri.
     */
    public function siapKirim(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $pengajuan->update(['status' => StatusPengajuan::SiapKirim]);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'siap_kirim',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah berstatus siap kirim ke Kemendagri.",
                'link' => "/inovator/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Finalisasi pengiriman ke BSKDN Kemendagri.
     */
    public function kirim(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $pengajuan->update(['status' => StatusPengajuan::Terkirim]);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'terkirim',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah terkirim ke portal resmi BSKDN Kemendagri.",
                'link' => "/inovator/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }
}
