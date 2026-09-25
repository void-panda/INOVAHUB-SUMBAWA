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
        Notifikasi::query()->delete();

        $users = User::all();
        if ($users->isEmpty()) {
            return;
        }

        $inovatorKominfo = User::where('email', 'inovator@sumbawakab.go.id')->first();
        $inovatorDinkes = User::where('email', 'inovator2@sumbawakab.go.id')->first();
        $pendamping = User::where('email', 'pendamping@sumbawakab.go.id')->first();
        $timPenilai = User::where('email', 'penilai@sumbawakab.go.id')->first() ?? User::where('email', 'bapperida@sumbawakab.go.id')->first();
        $pimpinan = User::where('email', 'pimpinan@sumbawakab.go.id')->first();

        $sabalong = Inovasi::where('nama_inovasi', 'like', '%SI-SABALONG%')->first();
        $pelita = Inovasi::where('nama_inovasi', 'like', '%PELITA KEMANG%')->first();
        $sambatPengajuan = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%E-SAMAWA SAMBAT%'))->first();
        $etangkapPengajuan = PengajuanLomba::whereHas('inovasi', fn ($q) => $q->where('nama_inovasi', 'like', '%E-TANGKAP%'))->first();

        $notifications = [
            [
                'user_id' => $inovatorDinkes?->id ?? $users->first()->id,
                'tipe' => 'disetujui',
                'pesan' => 'Inovasi PELITA KEMANG telah disetujui dan disahkan oleh Kepala OPD untuk periode lomba.',
                'link' => '/inovasi-daerah',
                'dibaca_at' => now()->subHours(4),
            ],
            [
                'user_id' => $inovatorKominfo?->id ?? $users->first()->id,
                'tipe' => 'pengajuan',
                'pesan' => 'Inovasi SI-SABALONG telah berhasil dikirimkan ke sistem IGA Kemendagri.',
                'link' => $sabalong ? "/inovasi/{$sabalong->id}" : '/inovasi',
                'dibaca_at' => null,
            ],
            [
                'user_id' => $pendamping?->id ?? $users->first()->id,
                'tipe' => 'pendampingan',
                'pesan' => 'Asistensi bukti dukung 20 Indikator SID untuk E-TANGKAP SAMAWA telah selesai.',
                'link' => $etangkapPengajuan ? "/inovasi/{$etangkapPengajuan->inovasi_id}/indikator" : '/inovasi-daerah',
                'dibaca_at' => now()->subDay(),
            ],
            [
                'user_id' => $timPenilai?->id ?? $users->first()->id,
                'tipe' => 'review',
                'pesan' => 'Inovasi E-SAMAWA SAMBAT telah disahkan OPD dan telah melalui proses Review Internal.',
                'link' => $sambatPengajuan ? "/inovasi-daerah" : '/inovasi-daerah',
                'dibaca_at' => null,
            ],
            [
                'user_id' => $pimpinan?->id ?? $users->first()->id,
                'tipe' => 'info',
                'pesan' => 'Rekapitulasi 10 Inovasi Daerah Kabupaten Sumbawa siap dipantau pada Dashboard Eksekutif.',
                'link' => '/dashboard',
                'dibaca_at' => null,
            ],
        ];

        foreach ($notifications as $n) {
            Notifikasi::create($n);
        }
    }
}
