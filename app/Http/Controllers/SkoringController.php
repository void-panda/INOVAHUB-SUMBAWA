<?php

namespace App\Http\Controllers;

use App\DTOs\SkoringData;
use App\Enums\StatusPengajuan;
use App\Models\PengajuanLomba;
use App\Models\PenilaianJuri;
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

    public function index(Request $request): Response
    {
        $periodeAktif = \App\Models\PeriodeLomba::where('aktif', true)->first();
        $user = $request->user();

        $query = PengajuanLomba::with([
            'inovasi.user',
            'inovasi.opd',
            'periodeLomba',
            'penilaianJuri.juri',
        ])
            ->where('is_arsip', false);

        if ($periodeAktif) {
            $query->where('periode_lomba_id', $periodeAktif->id);
        }

        $pengajuanList = $query->latest()->paginate(15);

        $formattedInovasi = $pengajuanList->through(function ($item) use ($user) {
            $penilaianSaya = $item->penilaianJuri->firstWhere('juri_id', $user->id);

            // Kondisi status penilaian juri:
            // 1. Sedang melengkapi data: inovasi masih draft (belum disubmit ke lomba)
            // 2. Sudah di Submit: inovasi sudah disubmit, tapi juri login belum menilai
            // 3. Sudah dinilai: juri login sudah menginput nilai
            $isDraft = $item->status === StatusPengajuan::Draft
                || (is_string($item->status) && $item->status === 'draft')
                || ($item->inovasi && isset($item->inovasi->status) && $item->inovasi->status === 'draft');

            if ($isDraft) {
                $statusJuri = 'sedang_melengkapi_data';
            } elseif ($penilaianSaya) {
                $statusJuri = 'sudah_dinilai';
            } else {
                $statusJuri = 'sudah_submit';
            }

            return [
                'id' => $item->id,
                'inovasi_id' => $item->inovasi_id,
                'nama_inovasi' => $item->inovasi?->nama_inovasi ?? 'Tanpa Nama',
                'tahapan' => $item->inovasi?->tahapan ?? 'penerapan',
                'status' => $item->status?->value ?? (string) $item->status,
                'status_juri' => $statusJuri,
                'is_inovasi_daerah' => (bool) $item->is_inovasi_daerah,
                'nilai_saya' => $penilaianSaya?->nilai,
                'catatan_saya' => $penilaianSaya?->catatan,
                'nilai_rata_rata' => $item->nilai_rata_rata_juri,
                'jumlah_juri_menilai' => $item->jumlah_juri_menilai,
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

        $canInputNilai = $user->hasRole('tim_penilai') || $user->can('scoring-spd') || $user->can('scoring-sid');
        $isBapperida = $user->hasRole('bapperida') && ! $user->hasRole('tim_penilai');

        return Inertia::render('penilai/skoring/index', [
            'inovasi' => $formattedInovasi,
            'pengajuanList' => $pengajuanList,
            'canInputNilai' => $canInputNilai,
            'isBapperida' => $isBapperida,
            'periodeAktif' => $periodeAktif ? [
                'id' => $periodeAktif->id,
                'tahun' => $periodeAktif->tahun,
                'nama' => $periodeAktif->nama ?? (string) $periodeAktif->tahun,
            ] : null,
        ]);
    }

    public function show(Request $request, PengajuanLomba $pengajuan): Response
    {
        $user = $request->user();

        $pengajuan->load([
            'inovasi.user',
            'inovasi.opd',
            'inovasi.dokumen',
            'periodeLomba',
            'penilaianJuri.juri',
        ]);

        $inovasi = $pengajuan->inovasi;

        // Dokumen umum inovasi (Proposal, SK/Piagam, Link Video, PPT)
        $dokumenUmum = \App\Models\InovasiDokumen::where('inovasi_id', $inovasi->id)
            ->whereNull('indikator_sid_id')
            ->get()
            ->map(fn ($d) => [
                'id' => $d->id,
                'nama_asal' => $d->nama_asal ?? basename($d->path),
                'jenis' => $d->jenis,
                'mime' => $d->mime,
                'path' => $d->path,
                'ukuran' => $d->ukuran ?? 0,
            ]);

        $penilaianSaya = $pengajuan->penilaianJuri->firstWhere('juri_id', $user->id);

        $daftarPenilaianJuri = $pengajuan->penilaianJuri->map(fn ($p) => [
            'id' => $p->id,
            'juri_id' => $p->juri_id,
            'nama_juri' => $p->juri?->name ?? 'Juri',
            'nilai' => $p->nilai,
            'catatan' => $p->catatan,
            'updated_at' => $p->updated_at?->format('d M Y, H:i') ?? '',
            'is_saya' => $p->juri_id === $user->id,
        ]);

        // Status juri untuk inovasi ini
        $isDraft = $pengajuan->status === StatusPengajuan::Draft
            || (is_string($pengajuan->status) && $pengajuan->status === 'draft')
            || ($inovasi && isset($inovasi->status) && $inovasi->status === 'draft');

        if ($isDraft) {
            $statusJuri = 'sedang_melengkapi_data';
        } elseif ($penilaianSaya) {
            $statusJuri = 'sudah_dinilai';
        } else {
            $statusJuri = 'sudah_submit';
        }

        $inovasiDetail = [
            'id' => $pengajuan->id,
            'inovasi_id' => $pengajuan->inovasi_id,
            'nama_inovasi' => $inovasi?->nama_inovasi ?? 'Inovasi',
            'tahapan' => $inovasi?->tahapan ?? 'penerapan',
            'status' => $pengajuan->status?->value ?? (string) $pengajuan->status,
            'status_juri' => $statusJuri,
            'nama_inisiator' => $inovasi?->nama_inisiator ?? '-',
            'inisiator' => $inovasi?->inisiator ?? '-',
            'bentuk_inovasi' => $inovasi?->bentuk_inovasi ?? '-',
            'jenis_inovasi' => $inovasi?->jenis_inovasi ?? '-',
            'tematik' => $inovasi?->tematik ?? '-',
            'urusan_utama' => $inovasi?->urusan_utama ?? '-',
            'waktu_uji_coba' => $inovasi?->waktu_uji_coba ? \Illuminate\Support\Carbon::parse($inovasi->waktu_uji_coba)->format('d M Y') : '-',
            'waktu_penerapan' => $inovasi?->waktu_penerapan ? \Illuminate\Support\Carbon::parse($inovasi->waktu_penerapan)->format('d M Y') : '-',
            'rancang_bangun' => $inovasi?->rancang_bangun ?? '',
            'tujuan' => $inovasi?->tujuan ?? '',
            'manfaat' => $inovasi?->manfaat ?? '',
            'hasil_inovasi' => $inovasi?->hasil_inovasi ?? '',
            'link_video' => $inovasi?->link_video ?? '',
            'periode_lomba_id' => $pengajuan->periode_lomba_id,
            'nilai_rata_rata' => $pengajuan->nilai_rata_rata_juri,
            'jumlah_juri_menilai' => $pengajuan->jumlah_juri_menilai,
            'user' => $inovasi?->user ? [
                'name' => $inovasi->user->name,
                'nama_pemda' => $inovasi->user->nama_pemda,
            ] : null,
            'opd' => $inovasi?->opd ? [
                'nama' => $inovasi->opd->nama,
            ] : null,
            'periode_lomba' => $pengajuan->periodeLomba ? [
                'tahun' => $pengajuan->periodeLomba->tahun,
                'nama' => $pengajuan->periodeLomba->nama ?? (string) $pengajuan->periodeLomba->tahun,
            ] : null,
            'dokumen_umum' => $dokumenUmum,
        ];

        $canInputNilai = $user->hasRole('tim_penilai') || $user->can('scoring-spd') || $user->can('scoring-sid');
        $isBapperida = $user->hasRole('bapperida') && ! $user->hasRole('tim_penilai');

        return Inertia::render('penilai/skoring/show', [
            'pengajuan' => $pengajuan,
            'inovasi' => $inovasiDetail,
            'canInputNilai' => $canInputNilai,
            'isBapperida' => $isBapperida,
            'penilaianSaya' => $penilaianSaya ? [
                'id' => $penilaianSaya->id,
                'nilai' => $penilaianSaya->nilai,
                'catatan' => $penilaianSaya->catatan,
            ] : null,
            'daftarPenilaianJuri' => $daftarPenilaianJuri,
        ]);
    }

    public function storeNilaiJuri(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $user = $request->user();
        abort_if(
            $user->hasRole('bapperida') && ! $user->hasRole('tim_penilai'),
            403,
            'BAPPERIDA bertindak sebagai penyelenggara/sekretariat dan tidak berwenang menginput nilai juri.'
        );

        $validated = $request->validate([
            'nilai' => ['required', 'numeric', 'min:0', 'max:100'],
            'catatan' => ['nullable', 'string', 'max:5000'],
        ]);

        PenilaianJuri::updateOrCreate(
            [
                'pengajuan_lomba_id' => $pengajuan->id,
                'juri_id' => $request->user()->id,
            ],
            [
                'nilai' => (float) $validated['nilai'],
                'catatan' => $validated['catatan'] ?? null,
            ]
        );

        return back()->with('success', 'Penilaian dan catatan juri berhasil disimpan.');
    }



    public function store(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        $statusVal = $pengajuan->status instanceof StatusPengajuan
            ? $pengajuan->status->value
            : (string) $pengajuan->status;

        if (in_array($statusVal, [StatusPengajuan::SiapKirim->value, StatusPengajuan::Terkirim->value], true)) {
            return back()->with('error', 'Penilaian untuk inovasi ini telah difinalisasi dan tidak dapat diubah lagi.');
        }

        $validated = $request->validate([
            'items_sid' => ['present', 'array'],
            'items_sid.*.indikator_id' => ['required', 'integer', 'exists:indikator_sid,id'],
            'items_sid.*.tier' => ['required', 'integer', 'min:0', 'max:3'],
            'items_sid.*.catatan' => ['nullable', 'string'],

            'items_spd' => ['nullable', 'array'],
            'items_spd.*.indikator_id' => ['required', 'integer', 'exists:indikator_spd,id'],
            'items_spd.*.tier' => ['required', 'integer', 'min:0', 'max:3'],
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
            ? 'Penilaian inovasi (20 Indikator SID) berhasil difinalisasi.'
            : 'Draft penilaian inovasi berhasil disimpan.';

        return redirect()->route('penilai.skoring.index')->with('success', $pesan);
    }
}
