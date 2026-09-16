<?php

namespace App\Http\Controllers;

use App\DTOs\IndikatorData;
use App\Services\MasterIndikatorService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MasterIndikatorController extends Controller
{
    public function __construct(
        protected MasterIndikatorService $masterIndikatorService
    ) {}

    public function index(): Response
    {
        return Inertia::render('penilai/indikator/index', [
            'spdList' => $this->masterIndikatorService->getSpdIndikatorList(),
            'sidList' => $this->masterIndikatorService->getSidIndikatorList(),
        ]);
    }

    public function storeSpd(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:indikator_spd,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'variabel' => ['nullable', 'string', 'max:255'],
            'bobot' => ['required', 'numeric', 'min:0'],
            'p1' => ['nullable', 'string'],
            'p2' => ['nullable', 'string'],
            'p3' => ['nullable', 'string'],
        ]);

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? null,
            p2: $validated['p2'] ?? null,
            p3: $validated['p3'] ?? null
        );

        $this->masterIndikatorService->createSpd($dto);

        return redirect()->back()->with('success', 'Indikator SPD berhasil ditambahkan.');
    }

    public function updateSpd(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:indikator_spd,kode,'.$id],
            'nama' => ['required', 'string', 'max:255'],
            'variabel' => ['nullable', 'string', 'max:255'],
            'bobot' => ['required', 'numeric', 'min:0'],
            'p1' => ['nullable', 'string'],
            'p2' => ['nullable', 'string'],
            'p3' => ['nullable', 'string'],
        ]);

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? null,
            p2: $validated['p2'] ?? null,
            p3: $validated['p3'] ?? null
        );

        $this->masterIndikatorService->updateSpd($id, $dto);

        return redirect()->back()->with('success', 'Indikator SPD berhasil diperbarui.');
    }

    public function storeSid(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:indikator_sid,kode'],
            'nama' => ['required', 'string', 'max:255'],
            'variabel' => ['nullable', 'string', 'max:255'],
            'bobot' => ['required', 'numeric', 'min:0'],
            'p1' => ['nullable', 'string'],
            'p2' => ['nullable', 'string'],
            'p3' => ['nullable', 'string'],
        ]);

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? null,
            p2: $validated['p2'] ?? null,
            p3: $validated['p3'] ?? null
        );

        $this->masterIndikatorService->createSid($dto);

        return redirect()->back()->with('success', 'Indikator SID berhasil ditambahkan.');
    }

    public function updateSid(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'kode' => ['required', 'string', 'max:20', 'unique:indikator_sid,kode,'.$id],
            'nama' => ['required', 'string', 'max:255'],
            'variabel' => ['nullable', 'string', 'max:255'],
            'bobot' => ['required', 'numeric', 'min:0'],
            'p1' => ['nullable', 'string'],
            'p2' => ['nullable', 'string'],
            'p3' => ['nullable', 'string'],
        ]);

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? null,
            p2: $validated['p2'] ?? null,
            p3: $validated['p3'] ?? null
        );

        $this->masterIndikatorService->updateSid($id, $dto);

        return redirect()->back()->with('success', 'Indikator SID berhasil diperbarui.');
    }
}
