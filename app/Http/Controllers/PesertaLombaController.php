<?php

namespace App\Http\Controllers;

use App\Models\PeriodeLomba;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PesertaLombaController extends Controller
{
    /**
     * Tampilkan data peserta Lomba Inovasi Daerah Kabupaten Sumbawa.
     */
    public function index(Request $request): Response
    {
        $periodeAktif = PeriodeLomba::where('aktif', true)->first();

        // Ambil seluruh user dengan role inovator atau yang memiliki riwayat inovasi
        $peserta = User::query()
            ->role('inovator')
            ->with([
                'opd:id,nama,kode',
                'inovasi' => function ($query) use ($periodeAktif) {
                    $query->with([
                        'pengajuanLomba' => function ($q) use ($periodeAktif) {
                            if ($periodeAktif) {
                                $q->where('periode_lomba_id', $periodeAktif->id);
                            }
                            $q->with('periodeLomba:id,tahun,nama');
                        },
                    ]);
                },
            ])
            ->get()
            ->map(function (User $user) use ($periodeAktif) {
                $inovasiList = $user->inovasi->map(function ($inv) use ($periodeAktif) {
                    $activePengajuan = $periodeAktif
                        ? $inv->pengajuanLomba->firstWhere('periode_lomba_id', $periodeAktif->id)
                        : $inv->pengajuanLomba->first();

                    return [
                        'id' => $inv->id,
                        'nama_inovasi' => $inv->nama_inovasi,
                        'tahapan' => $inv->tahapan,
                        'is_inovasi_daerah' => (bool) $inv->is_inovasi_daerah,
                        'status' => $activePengajuan?->status?->value ?? (is_string($activePengajuan?->status) ? $activePengajuan->status : 'draft'),
                        'estimasi_skor_kematangan' => (float) ($activePengajuan?->estimasi_skor_kematangan ?? 0),
                        'periode_tahun' => $activePengajuan?->periodeLomba?->tahun ?? $periodeAktif?->tahun ?? date('Y'),
                        'pengajuan_id' => $activePengajuan?->id,
                    ];
                });

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'no_whatsapp' => $user->no_whatsapp,
                    'pekerjaan' => $user->pekerjaan,
                    'tipe_inovator' => $user->tipe_inovator ?? ($user->opd_id ? 'dinas' : 'masyarakat'),
                    'opd_id' => $user->opd_id,
                    'opd_nama' => $user->opd?->nama ?? $user->nama_pemda ?? ($user->tipe_inovator === 'masyarakat' ? 'Masyarakat Umum' : 'Perangkat Daerah'),
                    'status_aktif' => (bool) $user->status_aktif,
                    'created_at' => $user->created_at?->format('d/m/Y') ?? '-',
                    'total_inovasi' => $inovasiList->count(),
                    'total_inovasi_daerah' => $inovasiList->where('is_inovasi_daerah', true)->count(),
                    'inovasi_list' => $inovasiList->values()->all(),
                ];
            });

        $totalPeserta = $peserta->count();
        $totalOpd = $peserta->where('tipe_inovator', '!=', 'masyarakat')->count();
        $totalMasyarakat = $peserta->where('tipe_inovator', 'masyarakat')->count();
        $totalInovasiDilombakan = $peserta->sum('total_inovasi');

        return Inertia::render('penilai/peserta/index', [
            'peserta' => $peserta->values()->all(),
            'periode' => $periodeAktif ? [
                'id' => $periodeAktif->id,
                'tahun' => $periodeAktif->tahun,
                'nama' => $periodeAktif->nama,
            ] : null,
            'summary' => [
                'total_peserta' => $totalPeserta,
                'total_opd' => $totalOpd,
                'total_masyarakat' => $totalMasyarakat,
                'total_inovasi' => $totalInovasiDilombakan,
            ],
        ]);
    }
}
