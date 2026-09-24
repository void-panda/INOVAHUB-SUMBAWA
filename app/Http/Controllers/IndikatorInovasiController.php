<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreIndikatorDokumenRequest;
use App\Http\Requests\UpdateIndikatorKomentarRequest;
use App\Http\Requests\UpdateIndikatorParameterRequest;
use App\Mail\InovasiDiperiksaMail;
use App\Models\IndikatorSid;
use App\Models\InovasiDokumen;
use App\Models\Notifikasi;
use App\Models\PengajuanLomba;
use App\Repositories\IndikatorRepository;
use App\Services\InovasiService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class IndikatorInovasiController extends Controller
{
    public function __construct(
        private readonly InovasiService $inovasiService,
        private readonly IndikatorRepository $indikatorRepository
    ) {}

    /**
     * Halaman kelengkapan indikator SID untuk pengajuan lomba.
     * Menampilkan 20 indikator (SID-01 s.d. SID-20, exclude SID-21 agregat).
     */
    public function index(Request $request, PengajuanLomba $pengajuan): Response
    {
        $this->authorizeAccess($request, $pengajuan);

        $inovasi = $pengajuan->inovasi;

        $indikatorList = $this->indikatorRepository->getSidKompetisi();
        $kelengkapan = $this->indikatorRepository->getKelengkapanMap($pengajuan);
        $skorList = $this->indikatorRepository->getSkorMap($pengajuan);
        $dokumenList = $this->indikatorRepository->getDokumenIndikatorList($inovasi->id, $pengajuan->id);

        $dokumenInfo = $this->inovasiService->hitungDokumenInfo($dokumenList);
        $progress = $this->inovasiService->hitungSkorEstimasiDanProgres($indikatorList, $kelengkapan);

        $user = $request->user();
        $isBapperida = $user->hasRole('bapperida');
        $isTimPenilai = $user->hasRole('tim_penilai') && ! $isBapperida;
        $isPendamping = $user->hasRole('pendamping') && ! $isBapperida && ! $isTimPenilai;
        $isOwner = ($pengajuan->user_id === $user->id) || ($inovasi->user_id === $user->id);
        $statusVal = $pengajuan->status instanceof \App\Enums\StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status;

        $canManageParameter = false;
        if ($isBapperida && $statusVal !== 'terkirim' && ! $pengajuan->is_arsip) {
            $canManageParameter = true;
        } elseif ($isTimPenilai && ! in_array($statusVal, ['siap_kirim', 'terkirim'], true) && ! $pengajuan->is_arsip) {
            $canManageParameter = true;
        } elseif ($isOwner && ! in_array($statusVal, ['disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'], true) && ! $pengajuan->is_arsip) {
            $canManageParameter = true;
        }

        $isDokumenLocked = in_array($statusVal, ['disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'], true) || (bool) $pengajuan->is_arsip;
        $canUpload = $isBapperida ? ($statusVal !== 'terkirim' && ! $pengajuan->is_arsip) : (! $isDokumenLocked && $isOwner);

        return Inertia::render('inovasi/indikator/index', [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'inovasi_id' => $inovasi->id,
                'nama_inovasi' => $inovasi->nama_inovasi,
                'status' => $statusVal,
                'tahapan' => $inovasi->tahapan,
                'is_arsip' => (bool) $pengajuan->is_arsip,
                'is_inovasi_daerah' => (bool) $pengajuan->is_inovasi_daerah,
                'inovator_nama' => $pengajuan->user?->name ?? $inovasi->user?->name ?? 'Inovator',
                'inovator_email' => $pengajuan->user?->email ?? $inovasi->user?->email ?? '',
            ],
            'indikatorList' => $indikatorList,
            'kelengkapan' => $kelengkapan,
            'skorList' => $skorList,
            'dokumenInfo' => $dokumenInfo,
            'progress' => [
                'filled' => $progress['filled'],
                'total' => $progress['total'],
                'persen' => $progress['persen'],
            ],
            'skorEstimasi' => $progress['skorEstimasi'],
            'skorMaks' => 60.00, // 20 indikator × 3 poin maksimal
            'canComment' => $user->hasRole('pendamping') || $user->hasAnyRole(['bapperida', 'tim_penilai']),
            'isPendamping' => $isPendamping,
            'isTimPenilai' => $isTimPenilai,
            'isLocked' => $isDokumenLocked,
            'canManageParameter' => $canManageParameter,
            'canUpload' => $canUpload,
        ]);
    }

    /**
     * Update parameter pilihan inovator untuk satu indikator.
     */
    public function updateParameter(
        UpdateIndikatorParameterRequest $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): RedirectResponse {
        $this->authorizeAccess($request, $pengajuan);
        $this->abortIfCannotUpdateParameter($request, $pengajuan);

        $validated = $request->validated();

        $this->indikatorRepository->updateOrCreateKelengkapan(
            pengajuanId: $pengajuan->id,
            indikatorId: $indikator->id,
            parameter: $validated['parameter'] ?? null,
            catatan: $validated['catatan'] ?? null
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
        UpdateIndikatorKomentarRequest $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): RedirectResponse {
        abort_unless(
            $request->user()->hasRole('pendamping') || $request->user()->hasAnyRole(['bapperida', 'tim_penilai']),
            403,
            'Hanya pendamping atau tim penilai/BAPPERIDA yang dapat memberikan catatan review indikator.'
        );

        $validated = $request->validated();

        $this->indikatorRepository->updateOrCreateKomentar(
            pengajuanId: $pengajuan->id,
            indikatorId: $indikator->id,
            pendampingId: $request->user()->id,
            komentar: $validated['komentar_pendamping'] ?? null,
            statusValidasi: $validated['status_validasi'] ?? null
        );

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

        $dokumenList = $this->indikatorRepository->getDokumenForSpesifikIndikator($inovasi->id, $pengajuan->id, $indikator->id);

        $kelengkapan = $pengajuan->kelengkapanIndikator()
            ->where('indikator_sid_id', $indikator->id)
            ->first();

        $skor = $pengajuan->skorPengajuan()
            ->where('indikator_id', $indikator->id)
            ->with('pendamping')
            ->first();

        $user = $request->user();
        $isBapperida = $user->hasRole('bapperida');
        $isTimPenilai = $user->hasRole('tim_penilai') && ! $isBapperida;
        $isPendamping = $user->hasRole('pendamping') && ! $isBapperida && ! $isTimPenilai;
        $isOwner = ($pengajuan->user_id === $user->id) || ($inovasi->user_id === $user->id);
        $statusVal = $pengajuan->status instanceof \App\Enums\StatusPengajuan ? $pengajuan->status->value : (string) $pengajuan->status;

        $isDokumenLocked = in_array($statusVal, ['disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'], true) || (bool) $pengajuan->is_arsip;
        $canUpload = $isBapperida ? ($statusVal !== 'terkirim' && ! $pengajuan->is_arsip) : (! $isDokumenLocked && $isOwner);

        return Inertia::render('inovasi/indikator/dokumen', [
            'pengajuan' => [
                'id' => $pengajuan->id,
                'inovasi_id' => $inovasi->id,
                'nama_inovasi' => $inovasi->nama_inovasi,
                'status' => $statusVal,
                'is_arsip' => (bool) $pengajuan->is_arsip,
            ],
            'indikator' => $indikator,
            'dokumenList' => $dokumenList,
            'kelengkapan' => $kelengkapan,
            'skor' => $skor,
            'isPendamping' => $isPendamping,
            'isTimPenilai' => $isTimPenilai,
            'isLocked' => $isDokumenLocked,
            'canUpload' => $canUpload,
        ]);
    }

    /**
     * Upload dokumen pendukung untuk indikator tertentu.
     */
    public function uploadDokumen(
        StoreIndikatorDokumenRequest $request,
        PengajuanLomba $pengajuan,
        IndikatorSid $indikator
    ): RedirectResponse {
        $this->authorizeAccess($request, $pengajuan);
        $this->abortIfCannotUploadOrDelete($request, $pengajuan);

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
        $this->abortIfCannotUploadOrDelete($request, $pengajuan);

        $this->inovasiService->deleteDokumen($dokumen);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Dokumen pendukung berhasil dihapus.'),
        ]);

        return back();
    }

    /**
     * Kirim notifikasi pemeriksaan dari Pendamping kepada Inovator via Email dan In-App.
     */
    public function kirimNotifikasiPemeriksaan(
        Request $request,
        PengajuanLomba $pengajuan
    ): RedirectResponse {
        $user = $request->user();
        abort_unless(
            $user->hasRole('pendamping')
                || $user->hasAnyRole(['bapperida', 'tim_penilai'])
                || $user->can('validate-inovasi'),
            403,
            'Hanya pendamping atau tim penilai yang dapat mengirimkan notifikasi hasil pemeriksaan.'
        );

        $inovasi = $pengajuan->inovasi;
        $inovator = $pengajuan->user ?? $inovasi->user;

        if (! $inovator) {
            return back()->with('error', 'Akun inovator tidak ditemukan.');
        }

        $tanggalFormat = Carbon::now()->locale('id')->translatedFormat('l, d F Y');
        $namaInovasi = $inovasi->nama_inovasi;
        $pesanNotifikasi = "Inovasi '{$namaInovasi}' telah diperiksa tanggal {$tanggalFormat}, silahkan cek akun anda.";
        $actionUrl = url("/pengajuan-lomba/{$pengajuan->id}/indikator");

        // 1. Simpan Notifikasi ke Lonceng Aplikasi INOVA-HUB
        Notifikasi::create([
            'user_id' => $inovator->id,
            'tipe' => 'pemeriksaan_indikator',
            'pesan' => $pesanNotifikasi,
            'link' => "/pengajuan-lomba/{$pengajuan->id}/indikator",
        ]);

        // 2. Kirim Email Resmi ke Akun Inovator
        if (! empty($inovator->email)) {
            try {
                Mail::to($inovator->email)->send(
                    new InovasiDiperiksaMail(
                        inovator: $inovator,
                        pendamping: $user,
                        pengajuan: $pengajuan,
                        tanggalPemeriksaan: $tanggalFormat,
                        actionUrl: $actionUrl
                    )
                );
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return back()->with('success', "Notifikasi pemeriksaan berhasil dikirim ke email inovator ({$inovator->email}).");
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

    private function abortIfCannotUploadOrDelete(Request $request, PengajuanLomba $pengajuan): void
    {
        $user = $request->user();
        $isBapperida = $user->hasRole('bapperida');
        $isOwner = ($pengajuan->user_id === $user->id) || ($pengajuan->inovasi?->user_id === $user->id);

        // Tim Penilai & Pendamping DILARANG mengunggah atau menghapus berkas bukti dukung
        abort_if(
            $user->hasRole('tim_penilai') && ! $isBapperida,
            403,
            'Tim Penilai bertindak sebagai evaluator dan tidak diperkenankan mengunggah atau menghapus berkas bukti dukung indikator.'
        );

        abort_if(
            $user->hasRole('pendamping') && ! $isBapperida,
            403,
            'Pendamping bertindak sebagai reviewer dan tidak diperkenankan mengunggah atau menghapus berkas bukti dukung indikator.'
        );

        // Hanya Inovator pemilik pengajuan atau Superadmin BAPPERIDA yang berhak upload/delete
        abort_unless(
            $isOwner || $isBapperida,
            403,
            'Hanya inovator pemilik inovasi yang berhak mengelola berkas bukti dukung indikator.'
        );

        // Pengecekan status kunci
        $statusVal = $pengajuan->status instanceof \App\Enums\StatusPengajuan
            ? $pengajuan->status->value
            : (string) $pengajuan->status;

        $lockedStatuses = [
            'disahkan_opd',
            'review_internal',
            'siap_kirim',
            'terkirim',
        ];

        if (! $isBapperida) {
            abort_if(
                in_array($statusVal, $lockedStatuses, true) || (bool) $pengajuan->is_arsip,
                403,
                'Berkas bukti dukung terkunci (read-only) karena pengajuan sudah disahkan OPD, masuk review internal, siap kirim, terkirim, atau diarsipkan.'
            );
        } else {
            abort_if(
                $statusVal === 'terkirim' || (bool) $pengajuan->is_arsip,
                403,
                'Berkas bukti dukung terkunci karena pengajuan telah terkirim ke Kemendagri atau diarsipkan.'
            );
        }
    }

    private function abortIfCannotUpdateParameter(Request $request, PengajuanLomba $pengajuan): void
    {
        $user = $request->user();
        $isBapperida = $user->hasRole('bapperida');
        $isTimPenilai = $user->hasRole('tim_penilai');
        $isPendamping = $user->hasRole('pendamping') && ! $isBapperida && ! $isTimPenilai;
        $isOwner = ($pengajuan->user_id === $user->id) || ($pengajuan->inovasi?->user_id === $user->id);

        abort_if(
            $isPendamping,
            403,
            'Pendamping bertindak sebagai reviewer dan tidak diperkenankan mengubah parameter indikator.'
        );

        $statusVal = $pengajuan->status instanceof \App\Enums\StatusPengajuan
            ? $pengajuan->status->value
            : (string) $pengajuan->status;

        if ($isBapperida) {
            abort_if(
                $statusVal === 'terkirim' || (bool) $pengajuan->is_arsip,
                403,
                'Parameter terkunci karena pengajuan telah terkirim ke Kemendagri atau diarsipkan.'
            );
            return;
        }

        if ($isTimPenilai) {
            abort_if(
                in_array($statusVal, ['siap_kirim', 'terkirim'], true) || (bool) $pengajuan->is_arsip,
                403,
                'Tim Penilai hanya dapat mengoreksi parameter sebelum inovasi berstatus Siap Kirim atau Terkirim.'
            );
            return;
        }

        if ($isOwner) {
            abort_if(
                in_array($statusVal, ['disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'], true) || (bool) $pengajuan->is_arsip,
                403,
                'Inovator tidak dapat mengubah parameter setelah pengajuan disahkan Kepala OPD.'
            );
            return;
        }

        abort(403, 'Anda tidak memiliki hak akses untuk mengubah parameter indikator ini.');
    }
}
