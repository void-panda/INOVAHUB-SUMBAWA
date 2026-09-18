<?php

namespace App\Http\Controllers;

use App\DTOs\InovasiData;
use App\Http\Requests\InovasiStoreRequest;
use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\InovasiDokumen;
use App\Models\ValidasiLog;
use App\Repositories\InovasiRepository;
use App\Services\InovasiService;
use App\Services\PengajuanLombaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InovasiController extends Controller
{
    public function __construct(
        private readonly InovasiService $inovasiService,
        private readonly InovasiRepository $inovasiRepository,
        private readonly PengajuanLombaService $pengajuanLombaService
    ) {}

    /**
     * Daftar Inovasi Biasa / Bank Data milik user (role inovator).
     */
    public function index(Request $request): Response
    {
        $inovasi = $this->inovasiRepository->getByUser($request->user(), false);
        $countdown = app(\App\Services\PengajuanLombaService::class)->getPengumpulanCountdown();

        return Inertia::render('inovasi/index', [
            'inovasi' => $inovasi,
            'countdown' => $countdown,
        ]);
    }

    /**
     * Daftar Inovasi Daerah resmi Kabupaten Sumbawa.
     */
    public function daerah(Request $request): Response
    {
        $user = $request->user();
        $inovasi = $user->hasRole('inovator') && ! $user->hasAnyRole(['tim_penilai', 'pimpinan', 'pendamping'])
            ? $this->inovasiRepository->getByUser($user, true)
            : $this->inovasiRepository->getAllInovasiDaerah();

        $periode = $this->inovasiRepository->getAktifPeriode();

        return Inertia::render('inovasi/daerah', [
            'inovasi' => $inovasi,
            'periode' => $periode,
        ]);
    }

    /**
     * Form input inovasi baru.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('inovasi/create', $this->formProps($request));
    }

    /**
     * Simpan inovasi draft.
     */
    public function store(InovasiStoreRequest $request): RedirectResponse
    {
        $periode = $this->inovasiRepository->getAktifPeriode();
        abort_unless($periode !== null, 400, 'Tidak ada periode lomba aktif saat ini.');

        $dto = InovasiData::fromRequest($request, $periode->id);

        /** @var UploadedFile[] $files */
        $files = $request->file('dokumen', []);
        $inovasi = $this->inovasiService->createDraft($request->user(), $dto, $files);

        // Simpan file khusus proposal / profil inovasi jika diunggah
        if ($request->hasFile('proposal')) {
            $this->inovasiService->uploadFiles($inovasi, [$request->file('proposal')], 'proposal');
        }

        // Simpan file khusus PPT presentasi jika diunggah
        if ($request->hasFile('ppt')) {
            $this->inovasiService->uploadFiles($inovasi, [$request->file('ppt')], 'ppt');
        }

        // Simpan file khusus sertifikat / penghargaan jika diunggah
        if ($request->hasFile('sertifikat')) {
            $this->inovasiService->uploadFiles($inovasi, [$request->file('sertifikat')], 'penghargaan');
        }

        // Simpan link video jika ada
        if ($request->filled('link_video')) {
            $this->inovasiService->addVideoLink(
                $inovasi,
                (string) $request->input('link_video'),
                $request->input('nama_video') ? (string) $request->input('nama_video') : null
            );
        }

        // Simpan link medsos jika ada
        if ($request->filled('link_medsos')) {
            $this->inovasiService->addMedsosLink(
                $inovasi,
                (string) $request->input('link_medsos')
            );
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Inovasi berhasil disimpan sebagai draft. Silakan klik ikon folder untuk melengkapi 20 Indikator SID.'),
        ]);

        return to_route('inovasi.index');
    }

    /**
     * Form edit inovasi milik user (draft / revisi).
     */
    public function edit(Request $request, Inovasi $inovasi): Response
    {
        $this->authorizeOwned($request, $inovasi);

        $story = $this->inovasiRepository->findWithDetails($inovasi->id);
        $rantaiVersi = $this->inovasiRepository->getVersionTree($inovasi);

        $pemilikInovasi = $inovasi->user;
        $tipeInovator = $pemilikInovasi?->tipe_inovator ?? $request->user()?->tipe_inovator ?? 'dinas';

        return Inertia::render('inovasi/edit', [
            'inovasi' => $story,
            'rantaiVersi' => $rantaiVersi,
            ...$this->formProps($request, $tipeInovator),
        ]);
    }

    /**
     * Ajukan kembali inovasi dari arsip ke periode lomba aktif.
     */
    public function ajukanKembali(Request $request, Inovasi $inovasi): RedirectResponse
    {
        $this->authorizeOwned($request, $inovasi);

        $request->validate([
            'penjelasan_pengembangan' => ['required', 'string', 'min:10', 'max:2000'],
        ]);

        $newInovasi = $this->inovasiService->ajukanKembali(
            $inovasi,
            (string) $request->input('penjelasan_pengembangan')
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Inovasi berhasil diajukan kembali ke periode lomba aktif sebagai draft baru.'),
        ]);

        return to_route('inovasi.edit', $newInovasi);
    }

    /**
     * Perbarui inovasi draft / revisi.
     */
    public function update(InovasiStoreRequest $request, Inovasi $inovasi): RedirectResponse
    {
        $this->authorizeOwned($request, $inovasi);

        $periode = $this->inovasiRepository->getAktifPeriode();
        abort_unless($periode !== null, 400, 'Tidak ada periode lomba aktif saat ini.');

        $dto = InovasiData::fromRequest($request, $periode->id);

        /** @var UploadedFile[] $files */
        $files = $request->file('dokumen', []);
        $this->inovasiService->updateDraft($inovasi, $dto, $files);

        // Simpan file khusus proposal / profil inovasi jika diunggah
        if ($request->hasFile('proposal')) {
            $this->inovasiService->uploadFiles($inovasi, [$request->file('proposal')], 'proposal');
        }

        // Simpan file khusus PPT presentasi jika diunggah
        if ($request->hasFile('ppt')) {
            $this->inovasiService->uploadFiles($inovasi, [$request->file('ppt')], 'ppt');
        }

        // Simpan file khusus sertifikat / penghargaan jika diunggah
        if ($request->hasFile('sertifikat')) {
            $this->inovasiService->uploadFiles($inovasi, [$request->file('sertifikat')], 'penghargaan');
        }

        // Simpan link video jika ada
        if ($request->filled('link_video')) {
            $this->inovasiService->addVideoLink(
                $inovasi,
                (string) $request->input('link_video'),
                $request->input('nama_video') ? (string) $request->input('nama_video') : null
            );
        }

        // Simpan link medsos jika ada
        if ($request->filled('link_medsos')) {
            $this->inovasiService->addMedsosLink(
                $inovasi,
                (string) $request->input('link_medsos')
            );
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Data profil inovasi berhasil diperbarui.')]);

        return to_route('inovasi.edit', $inovasi);
    }

    /**
     * Submit inovasi ke Lomba Inovasi Daerah (draft/revisi → dalam_pendampingan).
     */
    public function submit(Request $request, Inovasi $inovasi): RedirectResponse
    {
        $this->authorizeOwned($request, $inovasi);

        $pengajuanAktif = $inovasi->pengajuanAktif;

        if (! $pengajuanAktif) {
            $this->pengajuanLombaService->ajukanKeLomba($inovasi, $request->user());
        } else {
            $statusSebelum = $pengajuanAktif->status instanceof StatusPengajuan
                ? $pengajuanAktif->status->value
                : (string) $pengajuanAktif->status;

            $pengajuanAktif->update(['status' => StatusPengajuan::DalamPendampingan]);

            ValidasiLog::create([
                'inovasi_id' => $inovasi->id,
                'pengajuan_lomba_id' => $pengajuanAktif->id,
                'user_id' => $request->user()->id,
                'status_sebelum' => $statusSebelum,
                'status_sesudah' => StatusPengajuan::DalamPendampingan->value,
                'catatan' => 'Inovasi telah diperbaiki dan disubmit kembali ke Lomba oleh Inovator.',
            ]);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Inovasi ':nama' berhasil dikirim ke Lomba Inovasi Daerah.", ['nama' => $inovasi->nama_inovasi]),
        ]);

        return to_route('pengajuan-lomba.index');
    }

    /**
     * Hapus inovasi draft beserta file-nya.
     */
    public function destroy(Request $request, Inovasi $inovasi): RedirectResponse
    {
        $this->authorizeOwned($request, $inovasi);

        $this->inovasiService->deleteDraft($inovasi);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Inovasi dihapus.')]);

        return to_route('inovasi.index');
    }

    /**
     * Hapus satu dokumen pendukung.
     */
    public function destroyDokumen(Request $request, InovasiDokumen $dokumen): RedirectResponse
    {
        $this->authorizeOwned($request, $dokumen->inovasi);

        $this->inovasiService->deleteDokumen($dokumen);

        return back();
    }

    /**
     * Unduh dokumen pendukung / Buka link video.
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\RedirectResponse
     */
    public function download(Request $request, InovasiDokumen $dokumen)
    {
        $user = $request->user();
        if (! $user->can('validate-inovasi')
            && ! $user->can('input-inovasi')
            && ! $user->can('scoring-spd')
            && ! $user->can('scoring-sid')
            && ! $user->can('view-scoring')
            && ! $user->can('view-report')
            && ! $user->hasRole(['inovator', 'pendamping', 'tim_penilai', 'pimpinan'])) {
            abort(403, 'Anda tidak memiliki hak akses untuk mengunduh dokumen ini.');
        }

        if ($dokumen->jenis === 'video' || $dokumen->mime === 'url') {
            return redirect()->away($dokumen->path);
        }

        if (! Storage::disk('local')->exists($dokumen->path)) {
            abort(404, 'Berkas dokumen tidak ditemukan di penyimpanan server.');
        }

        return Storage::disk('local')->download($dokumen->path, $dokumen->nama_asal);
    }

    /**
     * Tampilkan pratinjau (inline) dokumen pendukung.
     *
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|\Illuminate\Http\RedirectResponse
     */
    public function preview(Request $request, InovasiDokumen $dokumen)
    {
        $user = $request->user();
        if (! $user->can('validate-inovasi')
            && ! $user->can('input-inovasi')
            && ! $user->can('scoring-spd')
            && ! $user->can('scoring-sid')
            && ! $user->can('view-scoring')
            && ! $user->can('view-report')
            && ! $user->hasRole(['inovator', 'pendamping', 'tim_penilai', 'pimpinan'])) {
            abort(403, 'Anda tidak memiliki hak akses untuk melihat pratinjau dokumen ini.');
        }

        if ($dokumen->jenis === 'video' || $dokumen->mime === 'url') {
            return redirect()->away($dokumen->path);
        }

        if (! Storage::disk('local')->exists($dokumen->path)) {
            abort(404, 'Berkas tidak ditemukan.');
        }

        return Storage::disk('local')->response($dokumen->path, $dokumen->nama_asal, [
            'Content-Disposition' => 'inline; filename="'.$dokumen->nama_asal.'"',
        ]);
    }

    /**
     * Unggah dokumen pendukung / simpan link video pada inovasi draft/revisi.
     */
    public function upload(Request $request, Inovasi $inovasi): RedirectResponse
    {
        $this->authorizeOwned($request, $inovasi);

        $jenis = (string) ($request->input('jenis') ?: 'dokumen-dukung');

        if ($jenis === 'video') {
            $request->validate([
                'url' => ['required', 'url', 'max:500'],
                'nama_video' => ['nullable', 'string', 'max:255'],
            ]);
            if ($request->filled('url')) {
                $this->inovasiService->addVideoLink(
                    $inovasi,
                    (string) $request->input('url'),
                    $request->input('nama_video') ? (string) $request->input('nama_video') : null
                );
            }
        } else {
            $request->validate([
                'dokumen' => ['required', 'array', 'min:1'],
            ]);

            /** @var UploadedFile[] $files */
            $files = $request->file('dokumen', []);
            $this->inovasiService->uploadFiles($inovasi, $files, $jenis);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Dokumen pendukung berhasil ditambahkan.')]);

        return back();
    }

    /**
     * Pengalihan rute legacy indikator inovasi ke lembar kerja pengajuan lomba aktif.
     */
    public function indikatorRedirect(Inovasi $inovasi): RedirectResponse
    {
        $pengajuan = $inovasi->pengajuanAktif;
        if ($pengajuan) {
            return redirect()->route('pengajuan-lomba.indikator.index', $pengajuan);
        }

        return redirect()->route('inovasi.index')->with('warning', 'Inovasi ini belum diajukan ke periode lomba aktif.');
    }

    /**
     * Tampilan lembar profil inovasi siap cetak (A4 / PDF print view).
     */
    public function print(Inovasi $inovasi): Response
    {
        $inovasi->load([
            'user',
            'opd',
            'dokumen',
            'pengajuanLomba.skorPengajuan.indikator',
            'pengajuanLomba.validasiLogs.user',
            'pengajuanLomba.periodeLomba',
        ]);

        $activePengajuan = $inovasi->pengajuanAktif;
        $skorTotalSid = $activePengajuan ? round((float) $activePengajuan->skorPengajuan->sum('skor'), 2) : 0.0;
        $logs = $activePengajuan
            ? $activePengajuan->validasiLogs->sortByDesc('created_at')->values()
            : collect();

        return Inertia::render('inovasi/print', [
            'inovasi' => [
                'id' => $inovasi->id,
                'nama_inovasi' => $inovasi->nama_inovasi,
                'kategori_inovasi' => $inovasi->kategori_inovasi,
                'nama_inisiator' => $inovasi->nama_inisiator,
                'jenis_inovasi' => $inovasi->jenis_inovasi,
                'bentuk_inovasi' => $inovasi->bentuk_inovasi,
                'tematik' => $inovasi->tematik,
                'tahapan' => $inovasi->tahapan,
                'waktu_ujicoba' => $inovasi->waktu_uji_coba?->format('d F Y') ?? '',
                'waktu_penerapan' => $inovasi->waktu_penerapan?->format('d F Y') ?? '',
                'rancang_bangun' => $inovasi->rancang_bangun,
                'tujuan' => $inovasi->tujuan,
                'manfaat' => $inovasi->manfaat,
                'hasil_inovasi' => $inovasi->hasil_inovasi,
                'urusan_utama' => $inovasi->urusan_utama,
                'urusan_wajib' => $inovasi->urusan_wajib ? (is_array($inovasi->urusan_wajib) ? $inovasi->urusan_wajib : json_decode($inovasi->urusan_wajib, true)) : [],
                'status' => $activePengajuan?->status?->value ?? (is_string($activePengajuan?->status) ? $activePengajuan->status : 'draft'),
                'estimasi_skor_kematangan' => $activePengajuan?->estimasi_skor_kematangan ?? 0.0,
                'skor_total_sid' => $skorTotalSid,
                'opd_nama' => $inovasi->opd?->nama ?? $inovasi->user?->nama_pemda ?? 'Perangkat Daerah',
                'periode_nama' => $activePengajuan?->periodeLomba?->nama ?? 'Periode ' . date('Y'),
                'dokumen_list' => $inovasi->dokumen->map(fn($d) => [
                    'id' => $d->id,
                    'jenis_dokumen' => $d->jenis,
                    'nama_file' => $d->nama_asal ?? basename($d->path),
                    'nomor_surat' => $d->nomor_surat ?? '-',
                    'tanggal_surat' => $d->tanggal_surat?->format('d/m/Y') ?? '-',
                    'keterangan' => $d->tentang ?? '-',
                ])->values()->all(),
                'validasi_logs' => $logs->map(fn($l) => [
                    'id' => $l->id,
                    'user_nama' => $l->user?->name ?? 'Sistem',
                    'status_sebelum' => $l->status_sebelum,
                    'status_sesudah' => $l->status_sesudah,
                    'catatan' => $l->catatan,
                    'created_at' => $l->created_at?->format('d/m/Y H:i') ?? '',
                ])->values()->all(),
            ],
            'rantaiVersi' => $this->inovasiRepository->getVersionTree($inovasi),
            'tanggalCetak' => date('d F Y H:i'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formProps(?Request $request = null, ?string $tipeInovator = null): array
    {
        /** @var array<string, string> $urusanConfig */
        $urusanConfig = config('urusan.inovasi');

        $urusanList = [];
        foreach ($urusanConfig as $value => $label) {
            $urusanList[] = ['value' => $value, 'label' => $label];
        }

        $user = $request?->user() ?? auth()->user();

        return [
            'urusanList' => $urusanList,
            'urusanWajibList' => config('urusan.wajib'),
            'periode' => $this->inovasiRepository->getAktifPeriode(),
            'tipeInovator' => $tipeInovator ?? $user?->tipe_inovator ?? 'dinas',
        ];
    }

    private function authorizeOwned(Request $request, Inovasi $inovasi): void
    {
        abort_unless($inovasi->user_id === $request->user()->id || $request->user()->can('validate-inovasi'), 403);
    }
}
