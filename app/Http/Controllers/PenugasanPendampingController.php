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
     * Daftar penugasan pendamping inovasi per Inovasi/OPD.
     */
    public function index(): Response
    {
        $periode = $this->inovasiRepository->getAktifPeriode();

        return Inertia::render('penugasan/index', [
            'penugasan' => $this->penugasanRepository->getAllForPeriode($periode),
            'pendampingList' => $this->penugasanRepository->getPendampingList(),
            'inovasiList' => $this->penugasanRepository->getInovasiList($periode),
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
            'inovasi_ids' => ['nullable', 'array'],
            'inovasi_ids.*' => ['exists:inovasi,id'],
            'inovasi_id' => ['nullable', 'exists:inovasi,id'],
            'opd_id' => ['nullable', 'exists:opd,id'],
            'inovator_id' => ['nullable', 'exists:users,id'],
        ]);

        $inovasiIds = $validated['inovasi_ids'] ?? [];
        if (! empty($validated['inovasi_id'])) {
            $inovasiIds[] = (int) $validated['inovasi_id'];
        }
        $inovasiIds = array_values(array_unique($inovasiIds));

        if (empty($inovasiIds) && empty($validated['opd_id']) && empty($validated['inovator_id'])) {
            return back()->withErrors(['inovasi_ids' => 'Pilih minimal satu Inovasi untuk ditugaskan.']);
        }

        if (! empty($inovasiIds)) {
            $this->penugasanService->assignInovasiBatch(
                (int) $validated['pendamping_id'],
                $inovasiIds,
                $periode->id
            );
        } else {
            $dto = PenugasanData::fromArray($validated, $periode->id);
            if ($this->penugasanRepository->exists($dto)) {
                return back()->withErrors(['pendamping_id' => 'Penugasan ini sudah terdaftar untuk periode aktif.']);
            }
            $this->penugasanService->createPenugasan($dto);
        }

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
