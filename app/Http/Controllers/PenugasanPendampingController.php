<?php

namespace App\Http\Controllers;

use App\DTOs\PenugasanData;
use App\Models\PenugasanPendamping;
use App\Repositories\InovasiRepository;
use App\Repositories\PenugasanRepository;
use App\Services\PenugasanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PenugasanPendampingController extends Controller
{
    public function __construct(
        private readonly PenugasanService $penugasanService,
        private readonly PenugasanRepository $penugasanRepository,
        private readonly InovasiRepository $inovasiRepository
    ) {}

    /**
     * Daftar penugasan pendamping inovasi per OPD/Inovator.
     */
    public function index(): Response
    {
        $periode = $this->inovasiRepository->getAktifPeriode();

        return Inertia::render('penugasan/index', [
            'penugasan' => $this->penugasanRepository->getAllForPeriode($periode),
            'pendampingList' => $this->penugasanRepository->getPendampingList(),
            'opdList' => $this->penugasanRepository->getOpdList(),
            'inovatorList' => $this->penugasanRepository->getInovatorList(),
            'periode' => $periode,
        ]);
    }

    /**
     * Simpan penugasan baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $periode = $this->inovasiRepository->getAktifPeriode();
        abort_unless($periode !== null, 400, 'Tidak ada periode lomba aktif.');

        $validated = $request->validate([
            'pendamping_id' => ['required', 'exists:users,id'],
            'opd_id' => ['nullable', 'exists:opd,id'],
            'inovator_id' => ['nullable', 'exists:users,id'],
        ]);

        if (empty($validated['opd_id']) && empty($validated['inovator_id'])) {
            return back()->withErrors(['opd_id' => 'Pilih salah satu OPD atau Inovator untuk ditugaskan.']);
        }

        $dto = PenugasanData::fromArray($validated, $periode->id);

        if ($this->penugasanRepository->exists($dto)) {
            return back()->withErrors(['pendamping_id' => 'Penugasan ini sudah terdaftar untuk periode aktif.']);
        }

        $this->penugasanService->createPenugasan($dto);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Penugasan pendamping berhasil disimpan.')]);

        return back();
    }

    /**
     * Hapus penugasan.
     */
    public function destroy(PenugasanPendamping $penugasan): RedirectResponse
    {
        $this->penugasanService->deletePenugasan($penugasan);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Penugasan berhasil dihapus.')]);

        return back();
    }
}
