<?php

namespace App\Http\Controllers;

use App\Models\IndikatorSid;
use App\Models\InovasiDokumen;
use App\Models\KelengkapanIndikator;
use App\Models\PengajuanLomba;
use App\Models\SkorPengajuan;
use App\Services\InovasiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndikatorInovasiController extends Controller
{
    public function __construct(
        private readonly InovasiService $inovasiService
    ) {}

    /**
     * Halaman kelengkapan indikator SID untuk pengajuan lomba.
     * Menampilkan 20 indikator (SID-01 s.d. SID-20, exclude SID-21 agregat).
     */
    public function index(Request $request, PengajuanLomba $pengajuan): Response
    {
        $this->authorizeAccess($request, $pengajuan);

        $inovasi = $pengajuan->inovasi;

        $indikatorList = IndikatorSid::where('kode', '!=', 'SID-21')
            ->orderBy('kode')
            ->get();

        $kelengkapan = $pengajuan->kelengkapanIndikator()
            ->get()
            ->keyBy('indikator_sid_id');

        $skorList = $pengajuan->skorPengajuan()
            ->with('pendamping')
            ->get()
            ->keyBy('indikator_id');

        // Hitung rincian dokumen per indikator beserta ekstensi/mime
        $dokumenList = InovasiDokumen::where(function ($q) use ($inovasi, $pengajuan) {
            $q->where('pengajuan_lomba_id', $pengajuan->id)
                ->orWhere('inovasi_id', $inovasi->id);
        })
            ->whereNotNull('indikator_sid_id')
            ->get();

        $dokumenInfo = [];
        foreach ($dokumenList as $dok) {
            $indId = $dok->indikator_sid_id;
            if (! isset($dokumenInfo[$indId])) {
                $dokumenInfo[$indId] = [
                    'count' => 0,
                    'types' => [],
                ];
            }
            $dokumenInfo[$indId]['count']++;

            $ext = strtoupper(pathinfo((string) $dok->nama_asal, PATHINFO_EXTENSION));
            if ($dok->mime === 'url' || $dok->jenis === 'video') {
                $ext = 'Link/Video';
            } elseif (! $ext) {
                $ext = 'Berkas';
            }
            if (! in_array($ext, $dokumenInfo[$indId]['types'], true)) {
                $dokumenInfo[$indId]['types'][] = $ext;
            }
        }

        // Hitung progres & skor estimasi
        // Hitung progres & skor estimasi
        $filled = $kelengkapan->filter(fn ($k) => $k->parameter !== null && $k->parameter !== '')->count();
        $totalIndikator = $indikatorList->count();

        $skorEstimasi = 0;
        foreach ($indikatorList as $ind) {
            $kel = $kelengkapan->get($ind->id);
            if ($kel && $kel->parameter) {
                $opsiList = $ind->opsi_list;
                $matchingOpsi = collect($opsiList)->firstWhere('id', $kel->parameter);
                if ($matchingOpsi) {
                    $skorEstimasi += (float) ($matchingOpsi['bobot'] ?? 0) * (float) $ind->bobot;
                } else {
                    $tierMap = ['p1' => 1, 'p2' => 2, 'p3' => 3];
                    $tier = $tierMap[strtolower($kel->parameter)] ?? 0;
                    $skorEstimasi += $tier * (float) $ind->bobot;
                }
            }
        }

        return Inertia::render('inovasi/indikator/index', [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'inovasi_id' => $inovasi->id,
                'nama_inovasi' => $inovasi->nama_inovasi,
                'status' => $pengajuan->status instanceof \App\Enums\StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status,
                'tahapan' => $inovasi->tahapan,
                'is_arsip' => (bool) $pengajuan->is_arsip,
                'is_inovasi_daerah' => (bool) $pengajuan->is_inovasi_daerah,
            ],
            'indikatorList' => $indikatorList,
            'kelengkapan' => $kelengkapan,
            'skorList' => $skorList,
            'dokumenInfo' => $dokumenInfo,
            'progress' => [
                'filled' => $filled,
                'total' => $totalIndikator,
                'persen' => $totalIndikator > 0
                    ? (int) round(($filled / $totalIndikator) * 100)
                    : 0,
            ],
            'skorEstimasi' => round($skorEstimasi, 2),
            'skorMaks' => 111.00, // 37 bobot dasar × 3 (SID-01 s.d. SID-20)
            'canComment' => $request->user()->hasRole('pendamping') || $request->user()->hasAnyRole(['bapperida', 'tim_penilai']),
        ]);
    }

    /**
     * Update parameter pilihan inovator untuk satu indikator.
     */
    public function updateParameter(
        Request $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): RedirectResponse {
        $this->authorizeAccess($request, $pengajuan);
        $this->abortIfLocked($pengajuan);

        $validated = $request->validate([
            'parameter' => ['nullable', 'string', 'max:50'],
            'catatan' => ['nullable', 'string', 'max:1000'],
        ]);

        KelengkapanIndikator::updateOrCreate(
            [
                'pengajuan_lomba_id' => $pengajuan->id,
                'indikator_sid_id' => $indikator->id,
            ],
            [
                'parameter' => $validated['parameter'] ?? null,
                'catatan' => $validated['catatan'] ?? null,
            ]
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Parameter untuk {$indikator->kode} berhasil diperbarui."),
        ]);

        return back();
    }

    /**
     * Update komentar pendamping inline untuk satu indikator.
     */
    public function updateKomentar(
        Request $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): RedirectResponse {
        abort_unless(
            $request->user()->hasRole('pendamping') || $request->user()->hasAnyRole(['bapperida', 'tim_penilai']),
            403,
            'Hanya pendamping atau tim penilai/BAPPERIDA yang dapat memberikan catatan review indikator.'
        );

        $validated = $request->validate([
            'komentar_pendamping' => ['nullable', 'string', 'max:1000'],
        ]);

        $skor = SkorPengajuan::firstOrNew([
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_id' => $indikator->id,
        ]);

        $skor->komentar_pendamping = $validated['komentar_pendamping'];
        $skor->pendamping_id = $request->user()->id;
        $skor->komentar_at = now();
        if (! $skor->exists) {
            $skor->tier = 1;
            $skor->skor = 0.0;
        }
        $skor->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Catatan pendamping untuk {$indikator->kode} berhasil disimpan."),
        ]);

        return back();
    }

    /**
     * Halaman upload dokumen pendukung per indikator.
     */
    public function dokumen(
        Request $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): Response {
        $this->authorizeAccess($request, $pengajuan);

        $inovasi = $pengajuan->inovasi;

        $dokumenList = InovasiDokumen::where(function ($q) use ($inovasi, $pengajuan) {
            $q->where('pengajuan_lomba_id', $pengajuan->id)
                ->orWhere('inovasi_id', $inovasi->id);
        })
            ->where('indikator_sid_id', $indikator->id)
            ->latest()
            ->get();

        $kelengkapan = KelengkapanIndikator::where('pengajuan_lomba_id', $pengajuan->id)
            ->where('indikator_sid_id', $indikator->id)
            ->first();

        $skor = SkorPengajuan::where('pengajuan_lomba_id', $pengajuan->id)
            ->where('indikator_id', $indikator->id)
            ->with('pendamping')
            ->first();

        return Inertia::render('inovasi/indikator/dokumen', [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'inovasi_id' => $inovasi->id,
                'nama_inovasi' => $inovasi->nama_inovasi,
                'status' => $pengajuan->status instanceof \App\Enums\StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status,
                'is_arsip' => (bool) $pengajuan->is_arsip,
            ],
            'indikator' => $indikator,
            'dokumenList' => $dokumenList,
            'kelengkapan' => $kelengkapan,
            'skor' => $skor,
        ]);
    }

    /**
     * Upload dokumen pendukung untuk indikator tertentu.
     */
    public function uploadDokumen(
        Request $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): RedirectResponse {
        $this->authorizeAccess($request, $pengajuan);
        $this->abortIfLocked($pengajuan);

        $request->validate([
            'nomor_surat' => ['nullable', 'string', 'max:255'],
            'tanggal_surat' => ['nullable', 'date'],
            'tentang' => ['nullable', 'string', 'max:500'],
            'dokumen' => ['required'],
            'dokumen.*' => ['file', 'max:20480'],
            'jenis' => ['nullable', 'string'],
        ]);

        $uploaded = $request->file('dokumen');
        /** @var \Illuminate\Http\UploadedFile[] $files */
        $files = is_array($uploaded) ? $uploaded : [$uploaded];
        $jenis = (string) ($request->input('jenis') ?: 'dokumen-dukung');

        $this->inovasiService->uploadFilesForIndikator(
            $pengajuan->inovasi,
            $files,
            $indikator->id,
            $jenis,
            $request->filled('nomor_surat') ? (string) $request->input('nomor_surat') : null,
            $request->filled('tanggal_surat') ? (string) $request->input('tanggal_surat') : null,
            $request->filled('tentang') ? (string) $request->input('tentang') : null,
            $pengajuan->id
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Dokumen pendukung untuk {$indikator->kode} berhasil diunggah."),
        ]);

        return back();
    }

    /**
     * Hapus dokumen pendukung indikator.
     */
    public function destroyDokumen(
        Request $request,
        PengajuanLomba $pengajuan,
        InovasiDokumen $dokumen
    ): RedirectResponse {
        $this->authorizeAccess($request, $pengajuan);
        $this->abortIfLocked($pengajuan);

        $this->inovasiService->deleteDokumen($dokumen);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Dokumen pendukung berhasil dihapus.'),
        ]);

        return back();
    }

    private function authorizeAccess(Request $request, PengajuanLomba $pengajuan): void
    {
        $user = $request->user();
        abort_unless(
            $pengajuan->user_id === $user->id
                || $pengajuan->inovasi->user_id === $user->id
                || $user->can('validate-inovasi')
                || $user->hasRole('bapperida')
                || $user->hasRole('tim_penilai')
                || $user->hasRole('pendamping'),
            403
        );
    }

    private function abortIfLocked(PengajuanLomba $pengajuan): void
    {
        $statusVal = $pengajuan->status instanceof \App\Enums\StatusPengajuan
            ? $pengajuan->status->value
            : (string) $pengajuan->status;

        abort_unless(
            in_array($statusVal, ['dalam_pendampingan'], true) && ! $pengajuan->is_arsip,
            403,
            'Indikator tidak dapat diubah saat pengajuan sudah disahkan atau diarsipkan.'
        );
    }
}
