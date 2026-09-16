<?php

namespace Database\Seeders;

use App\Models\PengajuanLomba;
use App\Models\User;
use App\Models\ValidasiLog;
use Illuminate\Database\Seeder;

class ValidasiLogSeeder extends Seeder
{
    public function run(): void
    {
        $pengajuanSmartWater = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%SMART WATER METER%'))
            ->where('is_arsip', false)
            ->first();

        $pengajuanSipotek = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%SI-POTEK%'))
            ->where('is_arsip', false)
            ->first();

        $pengajuanSirabang = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%SI-RABANG%'))
            ->where('is_arsip', false)
            ->first();

        $pengajuanKampungIklim = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%KAMPUNG IKLIM%'))
            ->where('is_arsip', false)
            ->first();

        $pengajuanEtangkap = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%E-TANGKAP%'))
            ->where('is_arsip', false)
            ->first();

        $pendamping = User::where('email', 'pendamping@sumbawakab.go.id')->first();
        $inovatorKominfo = User::where('email', 'inovator@sumbawakab.go.id')->first();
        $timPenilai = User::where('email', 'tim_penilai@sumbawakab.go.id')->first();

        if (! $pendamping) {
            return;
        }

        $logs = [];

        // 1. Logs untuk SMART WATER METER (Status: siap_kirim)
        if ($pengajuanSmartWater) {
            $logs[] = [
                'inovasi_id' => $pengajuanSmartWater->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSmartWater->id,
                'user_id' => $inovatorKominfo?->id ?? $pendamping->id,
                'status_sebelum' => 'draft',
                'status_sesudah' => 'dalam_pendampingan',
                'catatan' => 'Inovasi diajukan ke periode lomba 2026 dan masuk tahap pendampingan.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanSmartWater->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSmartWater->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => 'dalam_pendampingan',
                'status_sesudah' => 'disahkan_opd',
                'catatan' => 'Seluruh bukti dukung 20 Indikator SID telah lengkap dan direkomendasikan untuk pengesahan Kepala OPD.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanSmartWater->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSmartWater->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => 'disahkan_opd',
                'status_sesudah' => 'review_internal',
                'catatan' => 'Kepala OPD telah menandatangani SPTJM. Pengajuan masuk review skoring internal Tim Penilai.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanSmartWater->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSmartWater->id,
                'user_id' => $timPenilai?->id ?? $pendamping->id,
                'status_sebelum' => 'review_internal',
                'status_sesudah' => 'siap_kirim',
                'catatan' => 'Tim Penilai memfinalisasi skor kematangan (132.00). Status Siap Kirim ke BSKDN Kemendagri.',
            ];
        }

        // 2. Logs untuk SI-RABANG (Status: review_internal)
        if ($pengajuanSirabang) {
            $logs[] = [
                'inovasi_id' => $pengajuanSirabang->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSirabang->id,
                'user_id' => $inovatorKominfo?->id ?? $pendamping->id,
                'status_sebelum' => 'draft',
                'status_sesudah' => 'dalam_pendampingan',
                'catatan' => 'Inovasi diajukan ke periode lomba 2026.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanSirabang->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSirabang->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => 'dalam_pendampingan',
                'status_sesudah' => 'disahkan_opd',
                'catatan' => 'Verifikasi dokumen teknis selesai. Diteruskan untuk pengesahan Kepala Dinas.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanSirabang->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSirabang->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => 'disahkan_opd',
                'status_sesudah' => 'review_internal',
                'catatan' => 'Disahkan oleh Kepala Dinas PUPR. Masuk proses review internal Tim Penilai.',
            ];
        }

        // 3. Logs untuk SI-POTEK (Status: disahkan_opd)
        if ($pengajuanSipotek) {
            $logs[] = [
                'inovasi_id' => $pengajuanSipotek->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSipotek->id,
                'user_id' => $pengajuanSipotek->user_id,
                'status_sebelum' => 'draft',
                'status_sesudah' => 'dalam_pendampingan',
                'catatan' => 'Diajukan ke tahapan pendampingan OPD.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanSipotek->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanSipotek->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => 'dalam_pendampingan',
                'status_sesudah' => 'disahkan_opd',
                'catatan' => 'Verifikasi dan pendampingan 20 Indikator tuntas. Disahkan oleh Kepala Dinas Kesehatan.',
            ];
        }

        // 4. Logs untuk KAMPUNG IKLIM (Status: revisi)
        if ($pengajuanKampungIklim) {
            $logs[] = [
                'inovasi_id' => $pengajuanKampungIklim->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanKampungIklim->id,
                'user_id' => $inovatorKominfo?->id ?? $pendamping->id,
                'status_sebelum' => 'draft',
                'status_sesudah' => 'dalam_pendampingan',
                'catatan' => 'Pengajuan masuk antrean pendampingan.',
            ];
            $logs[] = [
                'inovasi_id' => $pengajuanKampungIklim->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanKampungIklim->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => 'dalam_pendampingan',
                'status_sesudah' => 'revisi',
                'catatan' => 'Mohon lengkapi Surat Keputusan (SK) Kelompok Kader Lingkungan Desa dan Dokumentasi Foto Titik Biopori pada Indikator SID-02 dan SID-08.',
            ];
        }

        // 5. Logs untuk E-TANGKAP (Status: dalam_pendampingan)
        if ($pengajuanEtangkap) {
            $logs[] = [
                'inovasi_id' => $pengajuanEtangkap->inovasi_id,
                'pengajuan_lomba_id' => $pengajuanEtangkap->id,
                'user_id' => $inovatorKominfo?->id ?? $pendamping->id,
                'status_sebelum' => 'draft',
                'status_sesudah' => 'dalam_pendampingan',
                'catatan' => 'Diajukan ke periode lomba 2026. Menunggu jadwal desk pendampingan inovasi daerah.',
            ];
        }

        foreach ($logs as $log) {
            ValidasiLog::create($log);
        }
    }
}
