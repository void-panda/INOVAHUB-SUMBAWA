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
            'opsi' => ['nullable', 'array'],
            'opsi.*.id' => ['nullable', 'string'],
            'opsi.*.label' => ['nullable', 'string'],
            'opsi.*.bobot' => ['nullable', 'numeric', 'min:0'],
        ]);

        $defaultOpsi = [
            ['id' => 'p1', 'label' => 'Tier 1 - Bukti Standar Minimal', 'bobot' => 1.0],
            ['id' => 'p2', 'label' => 'Tier 2 - Bukti Standar Menengah', 'bobot' => 2.0],
            ['id' => 'p3', 'label' => 'Tier 3 - Bukti Standar Tertinggi', 'bobot' => 3.0],
        ];

        $opsi = $request->has('opsi') ? $this->formatOpsi($validated['opsi']) : $defaultOpsi;

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? ($opsi[0]['label'] ?? null),
            p2: $validated['p2'] ?? ($opsi[1]['label'] ?? null),
            p3: $validated['p3'] ?? ($opsi[2]['label'] ?? null),
            opsi: $opsi,
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
            'opsi' => ['nullable', 'array'],
            'opsi.*.id' => ['nullable', 'string'],
            'opsi.*.label' => ['nullable', 'string'],
            'opsi.*.bobot' => ['nullable', 'numeric', 'min:0'],
        ]);

        $existing = \App\Models\IndikatorSpd::find($id);
        $opsi = $request->has('opsi')
            ? $this->formatOpsi($validated['opsi'])
            : ($existing?->opsi);

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? ($opsi[0]['label'] ?? $existing?->p1),
            p2: $validated['p2'] ?? ($opsi[1]['label'] ?? $existing?->p2),
            p3: $validated['p3'] ?? ($opsi[2]['label'] ?? $existing?->p3),
            opsi: $opsi,
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
            'informasi' => ['nullable', 'string'],
            'bobot' => ['required', 'numeric', 'min:0'],
            'p1' => ['nullable', 'string'],
            'p2' => ['nullable', 'string'],
            'p3' => ['nullable', 'string'],
            'opsi' => ['nullable', 'array'],
            'opsi.*.id' => ['nullable', 'string'],
            'opsi.*.label' => ['nullable', 'string'],
            'opsi.*.bobot' => ['nullable', 'numeric', 'min:0'],
        ]);

        $defaultOpsi = [
            ['id' => 'p1', 'label' => 'Tier 1 - Bukti Standar Minimal', 'bobot' => 1.0],
            ['id' => 'p2', 'label' => 'Tier 2 - Bukti Standar Menengah', 'bobot' => 2.0],
            ['id' => 'p3', 'label' => 'Tier 3 - Bukti Standar Tertinggi', 'bobot' => 3.0],
        ];

        $opsi = $request->has('opsi') ? $this->formatOpsi($validated['opsi']) : $defaultOpsi;

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? ($opsi[0]['label'] ?? null),
            p2: $validated['p2'] ?? ($opsi[1]['label'] ?? null),
            p3: $validated['p3'] ?? ($opsi[2]['label'] ?? null),
            opsi: $opsi,
            informasi: $validated['informasi'] ?? null,
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
            'informasi' => ['nullable', 'string'],
            'bobot' => ['required', 'numeric', 'min:0'],
            'p1' => ['nullable', 'string'],
            'p2' => ['nullable', 'string'],
            'p3' => ['nullable', 'string'],
            'opsi' => ['nullable', 'array'],
            'opsi.*.id' => ['nullable', 'string'],
            'opsi.*.label' => ['nullable', 'string'],
            'opsi.*.bobot' => ['nullable', 'numeric', 'min:0'],
        ]);

        $existing = \App\Models\IndikatorSid::find($id);
        $opsi = $request->has('opsi')
            ? $this->formatOpsi($validated['opsi'])
            : ($existing?->opsi);

        $dto = new IndikatorData(
            kode: $validated['kode'],
            nama: $validated['nama'],
            variabel: $validated['variabel'] ?? null,
            bobot: (float) $validated['bobot'],
            p1: $validated['p1'] ?? ($opsi[0]['label'] ?? $existing?->p1),
            p2: $validated['p2'] ?? ($opsi[1]['label'] ?? $existing?->p2),
            p3: $validated['p3'] ?? ($opsi[2]['label'] ?? $existing?->p3),
            opsi: $opsi,
            informasi: $validated['informasi'] ?? null,
        );

        $this->masterIndikatorService->updateSid($id, $dto);

        return redirect()->back()->with('success', 'Indikator SID berhasil diperbarui.');
    }

    /**
     * @param array<int, mixed>|null $rawOpsi
     * @return array<int, array{id: string, label: string, bobot: float}>|null
     */
    private function formatOpsi(?array $rawOpsi): ?array
    {
        if (!is_array($rawOpsi) || empty($rawOpsi)) {
            return null;
        }

        $formatted = [];
        $index = 1;
        foreach ($rawOpsi as $item) {
            if (!is_array($item)) {
                continue;
            }
            $label = trim((string) ($item['label'] ?? ''));
            if ($label === '') {
                continue;
            }
            $id = trim((string) ($item['id'] ?? ''));
            if ($id === '') {
                $id = 'p' . $index;
            }
            $bobot = isset($item['bobot']) ? (float) $item['bobot'] : (float) $index;

            $formatted[] = [
                'id' => $id,
                'label' => $label,
                'bobot' => $bobot,
            ];
            $index++;
        }

        return !empty($formatted) ? $formatted : null;
    }
}
