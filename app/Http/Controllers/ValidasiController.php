<?php

namespace App\Http\Controllers;

use App\DTOs\ValidasiFilterData;
use App\Models\PengajuanLomba;
use App\Repositories\InovasiRepository;
use App\Repositories\ValidasiRepository;
use App\Services\ValidasiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ValidasiController extends Controller
{
    public function __construct(
        private readonly ValidasiService $validasiService,
        private readonly ValidasiRepository $validasiRepository,
        private readonly InovasiRepository $inovasiRepository
    ) {}

    /**
     * Antrean pengajuan lomba & daftar binaan pendamping.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $periode = $this->inovasiRepository->getAktifPeriode();
        $filters = ValidasiFilterData::fromRequest($request);

        $penugasan = $this->validasiRepository->getPenugasanPendamping($user, $periode?->id);
        $antrean = $this->validasiRepository->getAntreanValidasi($penugasan, $periode, $filters);

        return Inertia::render('pendamping/index', [
            'inovasiList' => $antrean['inovasiList'],
            'counts' => $antrean['counts'],
            'filters' => [
                'status' => $filters->status ?? 'all',
                'search' => $filters->search ?? '',
            ],
            'penugasan' => $penugasan,
            'periode' => $periode,
        ]);
    }

    /**
     * Halaman review detail satu pengajuan lomba.
     */
    public function show(PengajuanLomba $pengajuan): Response
    {
        $pengajuan->load([
            'inovasi.user.opd',
            'inovasi.opd',
            'inovasi.dokumen',
            'periodeLomba',
            'skorPengajuan.indikator',
            'kelengkapanIndikator.indikatorSid',
        ]);

        $inovasi = $pengajuan->inovasi;
        if ($inovasi) {
            $inovasi->setRelation('dokumen', $pengajuan->inovasi->dokumen);
            $inovasi->setAttribute('status', $pengajuan->status instanceof \App\Enums\StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status);
            $inovasi->setAttribute('estimasi_skor_kematangan', $pengajuan->estimasi_skor_kematangan);
        }

        return Inertia::render('pendamping/validasi', [
            'pengajuan' => $pengajuan,
            'inovasi' => $inovasi,
        ]);
    }

    /**
     * Pengesahan akhir tingkat OPD oleh Verifikator OPD / Kepala OPD.
     */
    public function sahkanOpd(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $validated = $request->validate([
            'catatan' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->validasiService->sahkanOpd($request->user(), $pengajuan, $validated['catatan'] ?? null);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Pengajuan inovasi berhasil disahkan sebagai representasi resmi OPD.')]);

        return back();
    }

    /**
     * Tim Penilai memajukan pengajuan ke Review Internal.
     */
    public function reviewInternal(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $validated = $request->validate([
            'catatan' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->validasiService->reviewInternal($request->user(), $pengajuan, $validated['catatan'] ?? null);

        Inertia::flash('toast', ['type' => 'info', 'message' => __('Pengajuan masuk tahap review internal skoring.')]);

        return back();
    }

    /**
     * Admin menandai pengajuan Siap Kirim ke Kemendagri.
     */
    public function siapKirim(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $validated = $request->validate([
            'catatan' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->validasiService->siapKirim($request->user(), $pengajuan, $validated['catatan'] ?? null);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Pengajuan dinyatakan Siap Kirim ke portal Kemendagri.')]);

        return back();
    }

    /**
     * Admin memfinalisasi status pengajuan menjadi Terkirim.
     */
    public function kirim(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $validated = $request->validate([
            'catatan' => ['nullable', 'string', 'max:2000'],
        ]);

        $this->validasiService->kirim($request->user(), $pengajuan, $validated['catatan'] ?? null);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Pengajuan telah berstatus Terkirim.')]);

        return back();
    }
}
