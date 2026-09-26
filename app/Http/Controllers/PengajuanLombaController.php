<?php

namespace App\Http\Controllers;

use App\Http\Requests\AjukanKembaliRequest;
use App\Models\Inovasi;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Repositories\PengajuanLombaRepository;
use App\Services\PengajuanLombaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengajuanLombaController extends Controller
{
    public function __construct(
        private readonly PengajuanLombaService $pengajuanService,
        private readonly PengajuanLombaRepository $pengajuanRepository
    ) {}

    /**
     * Daftar pengajuan lomba (berdasarkan role user atau periode aktif).
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Role inovator dilebur ke menu Inovasi Saya
        if ($user->hasRole('inovator') && ! $user->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan', 'pendamping'])) {
            return redirect()->route('inovasi.index');
        }

        $periodeId = $request->input('periode_id');

        $periodeAktif = PeriodeLomba::where('aktif', true)->first();
        $targetPeriodeId = $periodeId ?: $periodeAktif?->id;

        $query = PengajuanLomba::with([
            'inovasi.user',
            'inovasi.opd',
            'periodeLomba',
            'skorPengajuan',
            'kelengkapanIndikator',
        ]);

        if ($targetPeriodeId) {
            $query->where('periode_lomba_id', $targetPeriodeId);
        }

        // Filter per role
        if ($user->hasRole('inovator')) {
            $query->where('user_id', $user->id);
        } elseif ($user->hasRole('pendamping')) {
            // Optional: filter by assignment or show all in OPD
            if ($user->opd_id) {
                $query->whereHas('inovasi', fn ($i) => $i->where('opd_id', $user->opd_id));
            }
        }

        if ($request->filled('status') && $request->input('status') !== 'all') {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('is_inovasi_daerah') && $request->input('is_inovasi_daerah') !== 'all') {
            $query->where('is_inovasi_daerah', filter_var($request->input('is_inovasi_daerah'), FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('kategori_inovasi') && $request->input('kategori_inovasi') !== 'all') {
            $query->whereHas('inovasi', function ($q) use ($request) {
                $q->where('kategori_inovasi', $request->input('kategori_inovasi'));
            });
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('inovasi', function ($q) use ($search) {
                $q->where('nama_inovasi', 'ilike', "%{$search}%")
                    ->orWhere('nama_inisiator', 'ilike', "%{$search}%");
            });
        }

        $pengajuan = $query->latest()->paginate(15)->withQueryString();
        $allPeriodes = PeriodeLomba::orderByDesc('tahun')->get();

        return Inertia::render('pengajuan-lomba/index', [
            'pengajuan' => $pengajuan,
            'periodes' => $allPeriodes,
            'activePeriode' => $periodeAktif,
            'countdown' => $this->pengajuanService->getPengumpulanCountdown($periodeAktif),
            'filters' => $request->only(['periode_id', 'status', 'is_inovasi_daerah', 'kategori_inovasi', 'search']),
        ]);
    }

    /**
     * Daftarkan inovasi master ke periode lomba aktif.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'inovasi_id' => ['required', 'exists:inovasi,id'],
        ]);

        $inovasi = Inovasi::findOrFail($validated['inovasi_id']);

        // Pastikan user memiliki inovasi ini (Inovator hanya boleh mendaftarkan inovasi miliknya)
        abort_unless($inovasi->user_id === $request->user()->id || $request->user()->can('validate-inovasi'), 403);

        $pengajuan = $this->pengajuanService->ajukanKeLomba($inovasi, $request->user());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Inovasi ':nama' berhasil didaftarkan ke periode lomba!", ['nama' => $inovasi->nama_inovasi]),
        ]);

        return to_route('inovasi.index');
    }

    /**
     * Tampilkan detail pengajuan lomba.
     */
    public function show(Request $request, PengajuanLomba $pengajuan): Response
    {
        // Pastikan inovator hanya bisa melihat pengajuan miliknya sendiri
        if ($request->user()->hasRole('inovator') && ! $request->user()->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan', 'pendamping'])) {
            abort_unless(
                $pengajuan->user_id === $request->user()->id || $pengajuan->inovasi?->user_id === $request->user()->id,
                403,
                'Anda tidak memiliki akses ke pengajuan inovasi ini.'
            );
        }

        $pengajuan->load([
            'inovasi.user.opd',
            'inovasi.opd',
            'inovasi.dokumen',
            'periodeLomba',
            'skorPengajuan.indikator',
            'skorPengajuan.pendamping',
            'kelengkapanIndikator.indikatorSid',
            'validasiLogs.user',
            'pengajuanAsal.periodeLomba',
            'penilaianJuri.juri',
        ]);

        $daftarPenilaianJuri = $pengajuan->penilaianJuri->map(fn ($p) => [
            'id' => $p->id,
            'nama_juri' => $p->juri?->name ?? 'Juri Lomba',
            'nilai' => $p->nilai,
            'catatan' => $p->catatan,
            'updated_at' => $p->updated_at?->format('d M Y, H:i') ?? '',
        ]);

        $dokumenUmum = $this->pengajuanRepository->getDokumenUmum($pengajuan->inovasi_id)
            ->map(fn ($d) => [
                'id' => $d->id,
                'nama_asal' => $d->nama_asal ?? basename($d->path),
                'jenis' => $d->jenis,
                'mime' => $d->mime,
                'path' => $d->path,
                'ukuran' => $d->ukuran ?? 0,
            ]);

        $isPascaLomba = $pengajuan->is_arsip || ($pengajuan->periodeLomba ? $pengajuan->periodeLomba->isPascaLomba() : false);

        return Inertia::render('pengajuan-lomba/show', [
            'pengajuan' => $pengajuan,
            'isPascaLomba' => $isPascaLomba,
            'nilaiRataRataJuri' => $pengajuan->nilai_rata_rata_juri,
            'jumlahJuriMenilai' => $pengajuan->jumlah_juri_menilai,
            'daftarPenilaianJuri' => $daftarPenilaianJuri,
            'dokumenUmum' => $dokumenUmum,
            'canManageInovasiDaerah' => $request->user()->hasAnyRole(['bapperida', 'tim_penilai']),
            'canRekomendasikan' => $request->user()->hasRole('pendamping') || $request->user()->hasAnyRole(['bapperida', 'tim_penilai']),
            'canNilaiJuri' => $request->user()->hasRole('tim_penilai') || $request->user()->can('scoring-spd') || $request->user()->can('scoring-sid'),
            'isInovator' => $request->user()->hasRole('inovator') && ! $request->user()->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan', 'pendamping']),
        ]);
    }

    /**
     * Tetapkan / cabut status Inovasi Daerah (wewenang Tim Penilai / Bappeda).
     */
    public function tetapkanInovasiDaerah(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        abort_unless($request->user()->hasAnyRole(['bapperida', 'tim_penilai']), 403, 'Hanya BAPPERIDA / Tim Penilai yang berwenang menetapkan Inovasi Daerah.');

        $status = $request->boolean('status', true);
        $this->pengajuanService->tetapkanInovasiDaerah($pengajuan, $request->user(), $status);

        $msg = $status
            ? 'Inovasi berhasil ditetapkan sebagai Inovasi Daerah Kabupaten Sumbawa.'
            : 'Status Inovasi Daerah berhasil dicabut.';

        Inertia::flash('toast', ['type' => 'success', 'message' => __($msg)]);

        return back();
    }


    /**
     * Ajukan kembali dari arsip periode sebelumnya ke periode aktif.
     */
    public function ajukanKembali(AjukanKembaliRequest $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        abort_unless($pengajuan->is_arsip, 400, 'Hanya pengajuan dari periode arsip yang dapat diajukan kembali.');

        $validated = $request->validated();

        $newPengajuan = $this->pengajuanService->ajukanKembali(
            $pengajuan,
            $request->user(),
            $validated['penjelasan_pengembangan']
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Inovasi berhasil diajukan kembali untuk periode lomba aktif dengan data indikator tersinkronisasi.'),
        ]);

        return to_route('pengajuan-lomba.show', $newPengajuan);
    }

    /**
     * Rekomendasikan pengajuan dari Pendamping ke OPD.
     */
    public function rekomendasikan(Request $request, PengajuanLomba $pengajuan): RedirectResponse
    {
        abort_unless($request->user()->hasRole('pendamping') || $request->user()->hasAnyRole(['bapperida', 'tim_penilai']), 403);

        $this->pengajuanService->rekomendasikanKeOpd(
            $pengajuan,
            $request->user(),
            $request->input('catatan')
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Pengajuan berhasil direkomendasikan untuk pengesahan Kepala OPD.'),
        ]);

        return back();
    }
}
