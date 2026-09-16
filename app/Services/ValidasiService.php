<?php

namespace App\Services;

use App\Enums\StatusPengajuan;
use App\Exceptions\InovasiStatusException;
use App\Models\Notifikasi;
use App\Models\PengajuanLomba;
use App\Models\User;
use App\Models\ValidasiLog;
use Illuminate\Support\Facades\DB;

class ValidasiService
{
    /**
     * Pengesahan resmi tingkat Perangkat Daerah (OPD) oleh Kepala OPD / Verifikator OPD.
     */
    public function sahkanOpd(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $statusSebelum = $pengajuan->status instanceof StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status;
            $pengajuan->update(['status' => StatusPengajuan::DisahkanOpd]);

            $pesanLog = $catatan ?? 'Inovasi telah disahkan oleh Perangkat Daerah (OPD).';
            $this->logStatus($pengajuan, $user->id, $statusSebelum, StatusPengajuan::DisahkanOpd->value, $pesanLog);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'disahkan_opd',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah disahkan oleh Perangkat Daerah (OPD).",
                'link' => "/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Pengajuan masuk ke tahap Review Internal Tim Penilai / Bappeda.
     */
    public function reviewInternal(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $statusSebelum = $pengajuan->status instanceof StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status;
            $pengajuan->update(['status' => StatusPengajuan::ReviewInternal]);

            $pesanLog = $catatan ?? 'Inovasi masuk tahap review internal skoring SPD/SID oleh Tim Penilai.';
            $this->logStatus($pengajuan, $user->id, $statusSebelum, StatusPengajuan::ReviewInternal->value, $pesanLog);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'review',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' sedang dalam tahap review internal tim penilai.",
                'link' => "/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Tandai pengajuan siap dikirim ke BSKDN Kemendagri.
     */
    public function siapKirim(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $statusSebelum = $pengajuan->status instanceof StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status;
            $pengajuan->update(['status' => StatusPengajuan::SiapKirim]);

            $pesanLog = $catatan ?? 'Inovasi dinyatakan siap kirim ke portal Kemendagri.';
            $this->logStatus($pengajuan, $user->id, $statusSebelum, StatusPengajuan::SiapKirim->value, $pesanLog);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'siap_kirim',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah berstatus siap kirim ke Kemendagri.",
                'link' => "/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Finalisasi pengiriman ke BSKDN Kemendagri.
     */
    public function kirim(User $user, PengajuanLomba $pengajuan, ?string $catatan = null): void
    {
        DB::transaction(function () use ($user, $pengajuan, $catatan) {
            $statusSebelum = $pengajuan->status instanceof StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status;
            $pengajuan->update(['status' => StatusPengajuan::Terkirim]);

            $pesanLog = $catatan ?? 'Inovasi telah berhasil dikirim ke portal Index Inovasi BSKDN Kemendagri.';
            $this->logStatus($pengajuan, $user->id, $statusSebelum, StatusPengajuan::Terkirim->value, $pesanLog);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'terkirim',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah terkirim ke portal resmi BSKDN Kemendagri.",
                'link' => "/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    private function logStatus(PengajuanLomba $pengajuan, int $userId, string $statusSebelum, string $statusSesudah, ?string $catatan): void
    {
        ValidasiLog::create([
            'inovasi_id' => $pengajuan->inovasi_id,
            'pengajuan_lomba_id' => $pengajuan->id,
            'user_id' => $userId,
            'status_sebelum' => $statusSebelum,
            'status_sesudah' => $statusSesudah,
            'catatan' => $catatan,
        ]);
    }
}
