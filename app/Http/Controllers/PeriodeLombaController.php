<?php

namespace App\Http\Controllers;

use App\Models\PeriodeLomba;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PeriodeLombaController extends Controller
{
    /**
     * Display list of competition periods.
     */
    public function index(): Response
    {
        $periodes = PeriodeLomba::withCount('inovasi')
            ->orderBy('tahun', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'tahun' => $item->tahun,
                    'nama' => $item->nama ?? "IGA {$item->tahun}",
                    'aktif' => (bool) $item->aktif,
                    'inovasi_count' => $item->inovasi_count,
                    'created_at' => $item->created_at?->format('d M Y') ?? '',
                ];
            });

        return Inertia::render('penilai/periode/index', [
            'periodes' => $periodes,
        ]);
    }

    /**
     * Store new competition period.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tahun' => 'required|integer|min:2020|max:2100|unique:periode_lomba,tahun',
            'nama' => 'required|string|max:255',
            'set_aktif' => 'nullable|boolean',
        ]);

        DB::transaction(function () use ($validated) {
            $isAktif = !empty($validated['set_aktif']) || PeriodeLomba::count() === 0;

            if ($isAktif) {
                PeriodeLomba::query()->update(['aktif' => false]);
            }

            PeriodeLomba::create([
                'tahun' => $validated['tahun'],
                'nama' => $validated['nama'],
                'aktif' => $isAktif,
            ]);
        });

        return redirect()->back()->with('success', 'Periode lomba baru berhasil ditambahkan.');
    }

    /**
     * Set selected period as active.
     */
    public function setAktif(PeriodeLomba $periode): RedirectResponse
    {
        DB::transaction(function () use ($periode) {
            PeriodeLomba::query()->update(['aktif' => false]);
            $periode->update(['aktif' => true]);
        });

        return redirect()->back()->with('success', "Periode {$periode->nama} ({$periode->tahun}) sekarang aktif.");
    }
}
