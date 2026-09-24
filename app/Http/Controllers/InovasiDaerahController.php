<?php

namespace App\Http\Controllers;

use App\Repositories\InovasiRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InovasiDaerahController extends Controller
{
    public function __construct(
        private readonly InovasiRepository $inovasiRepository
    ) {}

    /**
     * Daftar Inovasi Daerah resmi Kabupaten Sumbawa.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filters = $request->only(['search', 'tahapan']);
        $isPersonalScope = $user->hasRole('inovator') && ! $user->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan', 'pendamping']);
        $isPendampingScope = $user->hasRole('pendamping') && ! $user->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan']);

        if ($isPersonalScope) {
            $inovasi = $this->inovasiRepository->getByUserPaginated($user, true, 15, $filters);
        } elseif ($isPendampingScope) {
            $inovasi = $this->inovasiRepository->getInovasiDaerahByPendampingPaginated($user, 15, $filters);
        } else {
            $inovasi = $this->inovasiRepository->getAllInovasiDaerahPaginated(15, $filters);
        }

        $periode = $this->inovasiRepository->getAktifPeriode();

        return Inertia::render('inovasi/daerah', [
            'inovasi' => $inovasi,
            'periode' => $periode,
            'filters' => $filters,
            'isPersonalScope' => $isPersonalScope,
            'isPendampingScope' => $isPendampingScope,
        ]);
    }

    /**
     * Lembar rekapitulasi data Inovasi Daerah siap cetak / PDF (A4 Landscape).
     */
    public function printRekap(Request $request): Response
    {
        $user = $request->user();
        $isPersonalScope = $user->hasRole('inovator') && ! $user->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan', 'pendamping']);
        $isPendampingScope = $user->hasRole('pendamping') && ! $user->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan']);

        $periode = $this->inovasiRepository->getAktifPeriode();

        if ($isPersonalScope) {
            $inovasiRaw = $this->inovasiRepository->getByUser($user, true);
        } elseif ($isPendampingScope) {
            $inovasiRaw = $this->inovasiRepository->getInovasiDaerahByPendamping($user);
        } else {
            $inovasiRaw = $this->inovasiRepository->getAllInovasiDaerah();
        }

        $scores = [];
        $siapIgaCount = 0;

        $inovasiList = $inovasiRaw->map(function ($item) use (&$scores, &$siapIgaCount) {
            $pengajuanCollection = $item->pengajuanLomba ?? $item->pengajuan_lomba;
            $activePengajuan = $pengajuanCollection?->firstWhere('periodeLomba.aktif', true)
                ?? $pengajuanCollection?->firstWhere('periode_lomba.aktif', true)
                ?? $pengajuanCollection?->first();

            $score = $activePengajuan?->estimasi_skor_kematangan ?? null;
            if ($score !== null && ! is_nan((float) $score)) {
                $scores[] = (float) $score;
            }

            $status = $activePengajuan?->status?->value ?? (is_string($activePengajuan?->status) ? $activePengajuan->status : 'draft');
            if (in_array($status, ['siap_kirim', 'terkirim', 'disetujui', 'disahkan_opd'], true)) {
                $siapIgaCount++;
            }

            $kelengkapan = $activePengajuan?->kelengkapanIndikator ?? $activePengajuan?->kelengkapan_indikator;
            $filledCount = $kelengkapan?->whereNotNull('parameter')->count() ?? 0;

            return [
                'id' => $item->id,
                'nama_inovasi' => $item->nama_inovasi,
                'nama_inisiator' => $item->nama_inisiator ?: '-',
                'opd_nama' => $item->opd?->nama ?? $item->user?->nama_pemda ?? 'Masyarakat Umum',
                'urusan_utama' => $item->urusan_utama ?: '-',
                'tahapan' => $item->tahapan,
                'status' => $status,
                'estimasi_skor_kematangan' => (float) ($score ?? 0),
                'filled_indikator' => $filledCount,
                'dokumen_count' => $item->dokumen?->count() ?? 0,
                'waktu_penerapan' => $item->waktu_penerapan?->format('d/m/Y') ?? '-',
            ];
        });

        $avgScore = count($scores) > 0 ? array_sum($scores) / count($scores) : 0;

        return Inertia::render('inovasi/print-rekap', [
            'inovasiList' => $inovasiList->values()->all(),
            'periode' => $periode,
            'summary' => [
                'total_inovasi' => $inovasiList->count(),
                'total_daerah' => $inovasiRaw->count(),
                'total_siap_iga' => $siapIgaCount,
                'siap_iga_count' => $siapIgaCount,
                'avg_skor' => round($avgScore, 2),
            ],
            'tanggalCetak' => date('d F Y H:i'),
        ]);
    }
}
