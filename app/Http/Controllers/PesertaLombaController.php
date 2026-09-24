<?php

namespace App\Http\Controllers;

use App\Models\PeriodeLomba;
use App\Models\User;
use App\Repositories\PengajuanLombaRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PesertaLombaController extends Controller
{
    public function __construct(
        private readonly PengajuanLombaRepository $pengajuanRepository
    ) {}

    /**
     * Tampilkan data peserta Lomba Inovasi Daerah Kabupaten Sumbawa.
     */
    public function index(Request $request): Response
    {
        $periodeAktif = PeriodeLomba::where('aktif', true)->first();

        $filters = $request->only(['search', 'tipe']);

        // Ambil data peserta lomba inovasi secara berpaginasi (server-side)
        $paginated = $this->pengajuanRepository->getPesertaLombaPaginated($periodeAktif, 15, $filters);

        $peserta = $paginated->through(function (User $user) use ($periodeAktif) {
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

        $baseUserQuery = User::whereHas('roles', fn ($q) => $q->where('name', 'inovator'))->whereHas('inovasi');
        $totalPeserta = (clone $baseUserQuery)->count();
        $totalOpd = (clone $baseUserQuery)->where(function ($q) {
            $q->where('tipe_inovator', '!=', 'masyarakat')->orWhereNotNull('opd_id');
        })->count();
        $totalMasyarakat = (clone $baseUserQuery)->where('tipe_inovator', 'masyarakat')->whereNull('opd_id')->count();
        $totalInovasiDilombakan = \App\Models\Inovasi::whereHas('user.roles', fn ($q) => $q->where('name', 'inovator'))->count();

        return Inertia::render('penilai/peserta/index', [
            'peserta' => $peserta,
            'filters' => $filters,
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
