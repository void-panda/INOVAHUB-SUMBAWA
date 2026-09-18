<?php

namespace Database\Seeders;

use App\Models\Inovasi;
use App\Models\Notifikasi;
use App\Models\PengajuanLomba;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotifikasiSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        if ($users->isEmpty()) {
            return;
        }

        $inovatorKominfo = User::where('email', 'inovator@sumbawakab.go.id')->first();
        $inovatorDinkes = User::where('email', 'inovator2@sumbawakab.go.id')->first();
        $pendamping = User::where('email', 'pendamping@sumbawakab.go.id')->first();
        $timPenilai = User::where('email', 'penilai@sumbawakab.go.id')->first() ?? User::where('email', 'bapperida@sumbawakab.go.id')->first();
        $pimpinan = User::where('email', 'pimpinan@sumbawakab.go.id')->first();

        $kampungIklim = Inovasi::where('nama_inovasi', 'like', '%KAMPUNG IKLIM%')->first();
        $sipotek = Inovasi::where('nama_inovasi', 'like', '%SI-POTEK%')->first();
        $sirabangPengajuan = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%SI-RABANG%'))->first();
        $smartWaterPengajuan = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%SMART WATER%'))->first();
        $etangkapPengajuan = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%E-TANGKAP%'))->first();

        $notifications = [
            [
                'user_id' => $inovatorKominfo?->id ?? $users->first()->id,
                'tipe' => 'revisi',
                'pesan' => 'Inovasi GERAKAN KAMPUNG IKLIM memerlukan revisi pada bukti dukung SK dan dokumentasi.',
                'link' => $kampungIklim ? "/inovasi/{$kampungIklim->id}/edit" : '/inovasi',
                'dibaca_at' => null,
            ],
            [
                'user_id' => $inovatorDinkes?->id ?? $users->first()->id,
                'tipe' => 'disetujui',
                'pesan' => 'Selamat! Inovasi SI-POTEK SAMAWA telah disetujui dan disahkan oleh Kepala OPD.',
                'link' => '/inovasi-daerah',
                'dibaca_at' => now()->subHours(2),
            ],
            [
                'user_id' => $pendamping?->id ?? $users->first()->id,
                'tipe' => 'pengajuan',
                'pesan' => 'Ada pengajuan proposal inovasi baru E-TANGKAP SAMAWA yang memerlukan pendampingan.',
                'link' => $etangkapPengajuan ? "/pendamping/inovasi/{$etangkapPengajuan->id}" : '/pendamping/inovasi',
                'dibaca_at' => now()->subDay(),
            ],
            [
                'user_id' => $timPenilai?->id ?? $users->first()->id,
                'tipe' => 'review',
                'pesan' => 'Inovasi SI-RABANG telah disahkan OPD dan memasuki tahap Review Internal Tim Penilai.',
                'link' => $sirabangPengajuan ? "/penilai/skoring/{$sirabangPengajuan->id}" : '/penilai/skoring',
                'dibaca_at' => null,
            ],
            [
                'user_id' => $inovatorKominfo?->id ?? $users->first()->id,
                'tipe' => 'pengesahan',
                'pesan' => 'Inovasi SMART WATER METER telah disahkan dan berstatus Siap Kirim ke BSKDN Kemendagri.',
                'link' => $smartWaterPengajuan ? "/pengajuan-lomba/{$smartWaterPengajuan->id}" : '/inovasi-daerah',
                'dibaca_at' => now()->subDays(3),
            ],
            [
                'user_id' => $pimpinan?->id ?? $users->first()->id,
                'tipe' => 'info',
                'pesan' => 'Laporan Rekapitulasi Indeks Inovasi Daerah (IID) Kabupaten Sumbawa Periode 2026 telah diperbarui.',
                'link' => '/dashboard',
                'dibaca_at' => null,
            ],
        ];

        foreach ($notifications as $notif) {
            Notifikasi::create($notif);
        }
    }
}
