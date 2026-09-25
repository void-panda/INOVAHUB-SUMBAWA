<?php

namespace App\Http\Controllers;

use App\Models\Linimasa;
use App\Models\PeriodeLomba;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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
        $now = now();

        $periodes = PeriodeLomba::withCount('inovasi')
            ->orderBy('tahun', 'desc')
            ->get()
            ->map(function ($item) use ($now) {
                $statusWaktu = 'unconfigured';
                $rentangWaktu = 'Belum diatur';

                if ($item->tanggal_mulai && $item->tanggal_selesai) {
                    $mulai = Carbon::parse($item->tanggal_mulai)->startOfDay();
                    $selesai = Carbon::parse($item->tanggal_selesai)->endOfDay();

                    $rentangWaktu = $mulai->translatedFormat('d M Y') . ' s.d ' . $selesai->translatedFormat('d M Y');

                    if ($now->lt($mulai)) {
                        $statusWaktu = 'upcoming';
                    } elseif ($now->gt($selesai)) {
                        $statusWaktu = 'closed';
                    } else {
                        $statusWaktu = 'active';
                    }
                }

                return [
                    'id' => $item->id,
                    'tahun' => $item->tahun,
                    'nama' => $item->nama ?? "IGA {$item->tahun}",
                    'tanggal_mulai' => $item->tanggal_mulai ? Carbon::parse($item->tanggal_mulai)->format('Y-m-d') : null,
                    'tanggal_selesai' => $item->tanggal_selesai ? Carbon::parse($item->tanggal_selesai)->format('Y-m-d') : null,
                    'rentang_waktu' => $rentangWaktu,
                    'status_waktu' => $statusWaktu,
                    'is_pasca_lomba' => $item->isPascaLomba(),
                    'is_lomba_aktif' => $item->isLombaBerjalan(),
                    'aktif' => (bool) $item->aktif,
                    'inovasi_count' => $item->inovasi_count,
                    'created_at' => $item->created_at?->format('d M Y') ?? '',
                ];
            });

        return Inertia::render('superadmin/periode/index', [
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
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'set_aktif' => 'nullable|boolean',
        ], [
            'tanggal_selesai.after_or_equal' => 'Tanggal penutupan harus sama dengan atau setelah tanggal mulai lomba.',
        ]);

        DB::transaction(function () use ($validated) {
            $isAktif = !empty($validated['set_aktif']) || PeriodeLomba::count() === 0;

            if ($isAktif) {
                PeriodeLomba::query()->update(['aktif' => false]);
            }

            $periode = PeriodeLomba::create([
                'tahun' => $validated['tahun'],
                'nama' => $validated['nama'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
                'aktif' => $isAktif,
            ]);

            // Sinkronisasi otomatis ke tabel linimasa untuk tahap pengumpulan
            Linimasa::updateOrCreate(
                [
                    'periode_lomba_id' => $periode->id,
                    'nama' => 'Pengumpulan & Input Profil Inovasi',
                ],
                [
                    'mulai' => $validated['tanggal_mulai'],
                    'selesai' => $validated['tanggal_selesai'],
                ]
            );
        });

        return redirect()->back()->with('success', 'Periode lomba baru berhasil ditambahkan.');
    }

    /**
     * Update existing competition period.
     */
    public function update(Request $request, PeriodeLomba $periode): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ], [
            'tanggal_selesai.after_or_equal' => 'Tanggal penutupan harus sama dengan atau setelah tanggal mulai lomba.',
        ]);

        DB::transaction(function () use ($periode, $validated) {
            $periode->update([
                'nama' => $validated['nama'],
                'tanggal_mulai' => $validated['tanggal_mulai'],
                'tanggal_selesai' => $validated['tanggal_selesai'],
            ]);

            // Perbarui juga data linimasa pengumpulan terkait
            Linimasa::updateOrCreate(
                [
                    'periode_lomba_id' => $periode->id,
                    'nama' => 'Pengumpulan & Input Profil Inovasi',
                ],
                [
                    'mulai' => $validated['tanggal_mulai'],
                    'selesai' => $validated['tanggal_selesai'],
                ]
            );
        });

        return redirect()->back()->with('success', "Periode {$periode->nama} ({$periode->tahun}) berhasil diperbarui.");
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

    /**
     * Akhiri masa pendaftaran lomba secara manual (menutup batas tanggal pendaftaran dan membuka fase 20 Indikator SID).
     */
    public function akhiriLomba(PeriodeLomba $periode): RedirectResponse
    {
        $penutupan = Carbon::yesterday()->format('Y-m-d');

        DB::transaction(function () use ($periode, $penutupan) {
            $periode->update(['tanggal_selesai' => $penutupan]);

            Linimasa::where('periode_lomba_id', $periode->id)
                ->where('nama', 'Pengumpulan & Input Profil Inovasi')
                ->update(['selesai' => $penutupan]);
        });

        return redirect()->back()->with(
            'success',
            "Masa pendaftaran lomba untuk periode {$periode->nama} ({$periode->tahun}) telah diakhiri. Sistem kini berada pada Fase Pasca Lomba (Pengisian 20 Indikator SID dibuka)."
        );
    }

    /**
     * Buka kembali masa pendaftaran lomba (memperpanjang tanggal_selesai).
     */
    public function bukaLomba(PeriodeLomba $periode): RedirectResponse
    {
        $penutupanBaru = Carbon::now()->addDays(30)->format('Y-m-d');

        DB::transaction(function () use ($periode, $penutupanBaru) {
            $periode->update(['tanggal_selesai' => $penutupanBaru]);

            Linimasa::where('periode_lomba_id', $periode->id)
                ->where('nama', 'Pengumpulan & Input Profil Inovasi')
                ->update(['selesai' => $penutupanBaru]);
        });

        return redirect()->back()->with(
            'success',
            "Periode {$periode->nama} ({$periode->tahun}) dibuka kembali hingga " . Carbon::parse($penutupanBaru)->translatedFormat('d F Y') . "."
        );
    }
}
