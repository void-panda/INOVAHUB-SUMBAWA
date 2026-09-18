<?php

namespace App\Http\Controllers;

use App\DTOs\SkoringData;
use App\Enums\StatusPengajuan;
use App\Models\PengajuanLomba;
use App\Repositories\IndikatorRepository;
use App\Repositories\SkorRepository;
use App\Services\SkoringService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkoringController extends Controller
{
    public function __construct(
        protected SkoringService $skoringService,
        protected IndikatorRepository $indikatorRepository,
        protected SkorRepository $skorRepository
    ) {}

    public function index(): Response
    {
        $pengajuanList = PengajuanLomba::with(['inovasi.user', 'inovasi.opd', 'periodeLomba'])
            ->whereIn('status', [
                StatusPengajuan::DalamPendampingan->value,
                StatusPengajuan::DisahkanOpd->value,
                StatusPengajuan::ReviewInternal->value,
                StatusPengajuan::SiapKirim->value,
            ])
            ->latest()
            ->paginate(15);

        $formattedInovasi = $pengajuanList->through(function ($item) {
            return [
                'id' => $item->id,
                'inovasi_id' => $item->inovasi_id,
                'nama_inovasi' => $item->inovasi?->nama_inovasi ?? 'Tanpa Nama',
                'tahapan' => $item->inovasi?->tahapan ?? 'penerapan',
                'status' => $item->status?->value ?? (string) $item->status,
                'is_inovasi_daerah' => (bool) $item->is_inovasi_daerah,
                'estimasi_skor_kematangan' => $item->estimasi_skor_kematangan,
                'created_at' => $item->created_at?->format('d M Y') ?? '',
                'user' => $item->inovasi?->user ? [
                    'name' => $item->inovasi->user->name,
                    'nama_pemda' => $item->inovasi->user->nama_pemda,
                ] : null,
                'opd' => $item->inovasi?->opd ? [
                    'nama' => $item->inovasi->opd->nama,
                ] : null,
                'periode_lomba' => $item->periodeLomba ? [
                    'tahun' => $item->periodeLomba->tahun,
                    'nama' => $item->periodeLomba->nama ?? (string) $item->periodeLomba->tahun,
                ] : null,
            ];
        });

        return Inertia::render('penilai/skoring/index', [
            'inovasi' => $formattedInovasi,
            'pengajuanList' => $pengajuanList,
        ]);
    }

    public function show(PengajuanLomba $pengajuan): Response
    {
        $pengajuan->load([
            'inovasi.user',
            'inovasi.opd',
            'inovasi.dokumen',
            'validasiLogs.user',
            'kelengkapanIndikator.indikatorSid',
            'periodeLomba',
        ]);

        $spdList = $this->indikatorRepository->getAllSpd();
        $sidList = $this->indikatorRepository->getAllSid();

        $existingSkorSid = $this->skorRepository->getSkorSidForPengajuan($pengajuan->id);
        $existingSkorSpd = $pengajuan->periode_lomba_id
            ? $this->skorRepository->getSkorSpdForPeriode($pengajuan->periode_lomba_id)
            : collect();

        $inovasiDetail = [
            'id' => $pengajuan->id,
            'inovasi_id' => $pengajuan->inovasi_id,
            'nama_inovasi' => $pengajuan->inovasi?->nama_inovasi ?? 'Inovasi',
            'tahapan' => $pengajuan->inovasi?->tahapan ?? 'penerapan',
            'status' => $pengajuan->status?->value ?? (string) $pengajuan->status,
            'nama_inisiator' => $pengajuan->inovasi?->nama_inisiator ?? '-',
            'periode_lomba_id' => $pengajuan->periode_lomba_id,
            'estimasi_skor_kematangan' => $pengajuan->estimasi_skor_kematangan,
            'user' => $pengajuan->inovasi?->user ? [
                'name' => $pengajuan->inovasi->user->name,
                'nama_pemda' => $pengajuan->inovasi->user->nama_pemda,
            ] : null,
            'opd' => $pengajuan->inovasi?->opd ? [
                'nama' => $pengajuan->inovasi->opd->nama,
            ] : null,
            'dokumen' => $pengajuan->inovasi?->dokumen->map(fn ($d) => [
                'id' => $d->id,
                'nama_asal' => $d->nama_asal ?? basename($d->path),
                'ukuran' => $d->ukuran ?? 0,
            ])->values()->all() ?? [],
        ];

        return Inertia::render('penilai/skoring/show', [
            'pengajuan' => $pengajuan,
            'inovasi' => $inovasiDetail,
            'spdList' => $spdList,
            'sidList' => $sidList,
            'existingSkorSid' => $existingSkorSid,
            'existingSkorSpd' => $existingSkorSpd,
        ]);
    }

    public function store(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $validated = $request->validate([
            'items_sid' => ['present', 'array'],
            'items_sid.*.indikator_id' => ['required', 'integer', 'exists:indikator_sid,id'],
            'items_sid.*.tier' => ['required', 'integer', 'min:1', 'max:3'],
            'items_sid.*.catatan' => ['nullable', 'string'],

            'items_spd' => ['present', 'array'],
            'items_spd.*.indikator_id' => ['required', 'integer', 'exists:indikator_spd,id'],
            'items_spd.*.tier' => ['required', 'integer', 'min:1', 'max:3'],
            'items_spd.*.catatan' => ['nullable', 'string'],

            'is_final' => ['nullable', 'boolean'],
        ]);

        $dto = new SkoringData(
            inovasiId: $pengajuan->inovasi_id,
            itemsSid: $validated['items_sid'] ?? [],
            itemsSpd: $validated['items_spd'] ?? [],
            isFinal: (bool) ($validated['is_final'] ?? false)
        );

        $this->skoringService->processSkoring($request->user(), $pengajuan, $dto);

        $pesan = $dto->isFinal
            ? 'Penilaian SPD/SID berhasil difinalisasi.'
            : 'Draft penilaian SPD/SID berhasil disimpan.';

        return redirect()->route('penilai.skoring.index')->with('success', $pesan);
    }
}
