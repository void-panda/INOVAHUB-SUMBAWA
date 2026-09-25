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
        ValidasiLog::query()->delete();

        $pendamping = User::where('email', 'pendamping@sumbawakab.go.id')->first();
        $pendamping2 = User::where('email', 'pendamping2@sumbawakab.go.id')->first();
        $timPenilai = User::where('email', 'penilai@sumbawakab.go.id')->first() ?? User::where('email', 'bapperida@sumbawakab.go.id')->first();
        $superadmin = User::where('email', 'bapperida@sumbawakab.go.id')->first();

        if (! $pendamping || ! $timPenilai) {
            return;
        }

        $allPengajuan = PengajuanLomba::with('inovasi.user')->get();

        foreach ($allPengajuan as $index => $pengajuan) {
            $assignedPendamping = ($index % 2 === 0) ? $pendamping : $pendamping2;
            $inovator = $pengajuan->inovasi->user ?? $superadmin;

            // Step 1: Draft -> Dalam Pendampingan (Inovator mengajukan inovasi)
            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $inovator->id,
                'status_sebelum' => 'draft',
                'status_sesudah' => 'dalam_pendampingan',
                'catatan' => 'Profil inovasi dan berkas umum diajukan untuk proses pendampingan dan asistensi teknis.',
                'created_at' => now()->subMonths(10),
            ]);

            // Step 2: Dalam Pendampingan -> Disahkan OPD (Pendamping menyetujui & verifikasi kelengkapan)
            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $assignedPendamping->id,
                'status_sebelum' => 'dalam_pendampingan',
                'status_sesudah' => 'disahkan_opd',
                'catatan' => '20 Indikator SID telah diperiksa. Bukti dukung telah memenuhi standar kelayakan dan disahkan oleh Kepala Perangkat Daerah / Pimpinan Lembaga.',
                'created_at' => now()->subMonths(9),
            ]);

            // Step 3: Disahkan OPD -> Review Internal (Tim Penilai Internal melakukan skoring & review)
            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $timPenilai->id,
                'status_sebelum' => 'disahkan_opd',
                'status_sesudah' => 'review_internal',
                'catatan' => 'Tim Penilai Internal melakukan verifikasi lapangan dan simulasi skoring kematangan SPD/SID.',
                'created_at' => now()->subMonths(8),
            ]);

            // Step 4: Review Internal -> Siap Kirim
            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $superadmin?->id ?? $timPenilai->id,
                'status_sebelum' => 'review_internal',
                'status_sesudah' => 'siap_kirim',
                'catatan' => 'Inovasi dinyatakan lolos quality assurance BAPPERIDA dan siap disinkronkan ke sistem IGA Kemendagri.',
                'created_at' => now()->subMonths(7),
            ]);

            // Step 5: Siap Kirim -> Terkirim (Khusus yang status akhirnya terkirim)
            if ($pengajuan->status->value === 'terkirim') {
                ValidasiLog::create([
                    'inovasi_id' => $pengajuan->inovasi_id,
                    'pengajuan_lomba_id' => $pengajuan->id,
                    'user_id' => $superadmin?->id ?? $timPenilai->id,
                    'status_sebelum' => 'siap_kirim',
                    'status_sesudah' => 'terkirim',
                    'catatan' => 'Data inovasi, bukti dukung, dan skor telah berhasil dikirimkan ke sistem resmi IGA Kemendagri.',
                    'created_at' => now()->subMonths(6),
                ]);
            }
        }
    }
}
