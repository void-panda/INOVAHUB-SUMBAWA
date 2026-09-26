<?php

use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\IndikatorInovasiController;
use App\Http\Controllers\InovasiController;
use App\Http\Controllers\InovasiDaerahController;
use App\Http\Controllers\MasterIndikatorController;
use App\Http\Controllers\MasterOpdController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\PengajuanLombaController;
use App\Http\Controllers\PenugasanPendampingController;
use App\Http\Controllers\PeriodeLombaController;
use App\Http\Controllers\PesertaLombaController;
use App\Http\Controllers\SimulasiIidController;
use App\Http\Controllers\SkoringController;
use App\Http\Controllers\Superadmin\RekapitulasiNilaiController;
use App\Http\Controllers\ValidasiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/captcha/refresh', function (Request $request) {
    $num1 = rand(1, 9);
    $num2 = rand(1, 9);
    $question = "Berapa {$num1} + {$num2}?";
    $answer = $num1 + $num2;

    $request->session()->put('captcha_answer', $answer);

    return response()->json(['question' => $question]);
})->name('captcha.refresh');

Route::middleware(['auth', 'verified'])->group(function () {
    // ==========================================
    // SHARED / GENERAL ROUTES
    // ==========================================
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/panduan', [PanduanController::class, 'index'])->name('panduan.index');
    Route::get('/inovasi/{inovasi}/print', [InovasiController::class, 'print'])->name('inovasi.print');

    Route::prefix('notifikasi')
        ->name('notifikasi.')
        ->group(function () {
            Route::get('/', [NotifikasiController::class, 'index'])->name('index');
            Route::post('/{id}/baca', [NotifikasiController::class, 'markAsRead'])->name('baca');
            Route::post('/baca-semua', [NotifikasiController::class, 'markAllAsRead'])->name('baca-semua');
        });

    // Akses Dokumen Inovasi (Download & Pratinjau untuk Inovator, Pendamping, Tim Penilai, & Pimpinan)
    Route::prefix('inovasi/dokumen')
        ->name('inovasi.dokumen.')
        ->group(function () {
            Route::get('/{dokumen}/download', [InovasiController::class, 'download'])->name('download');
            Route::get('/{dokumen}/preview', [InovasiController::class, 'preview'])->name('preview');
        });

    Route::get('/inovasi/{inovasi}/indikator', [InovasiController::class, 'indikatorRedirect'])->name('inovasi.indikator.redirect');

    // Inovasi Daerah Resmi (Kompetisi Lomba IGA) & 20 Indikator SID
    Route::prefix('inovasi-daerah')
        ->name('inovasi-daerah.')
        ->group(function () {
            Route::get('/', [InovasiDaerahController::class, 'index'])->name('index');
            Route::get('/print-rekap', [InovasiDaerahController::class, 'printRekap'])->name('print-rekap');

            // Rute Kelengkapan 20 Indikator SID per Inovasi Daerah
            Route::prefix('{pengajuan}/indikator')->name('indikator.')->group(function () {
                Route::get('/', [IndikatorInovasiController::class, 'index'])->name('index');
                Route::post('/kirim-notifikasi', [IndikatorInovasiController::class, 'kirimNotifikasiPemeriksaan'])->name('kirim-notifikasi');
                Route::post('/{indikator}/parameter', [IndikatorInovasiController::class, 'updateParameter'])->name('parameter.update');
                Route::post('/{indikator}/komentar', [IndikatorInovasiController::class, 'updateKomentar'])->name('komentar.update');
                Route::get('/{indikator}/dokumen', [IndikatorInovasiController::class, 'dokumen'])->name('dokumen.index');
                Route::post('/{indikator}/dokumen', [IndikatorInovasiController::class, 'uploadDokumen'])->name('dokumen.store');
                Route::delete('/dokumen/{dokumen}', [IndikatorInovasiController::class, 'destroyDokumen'])->name('dokumen.destroy');
            });
        });

    // ==========================================
    // 1. DOMAIN SUPERADMIN (BAPPERIDA)
    // ==========================================
    Route::middleware(['role:bapperida'])
        ->prefix('superadmin')
        ->name('superadmin.')
        ->group(function () {
            // Menu Utama Bapperida
            Route::get('/inovasi-daerah', [InovasiDaerahController::class, 'index'])->name('inovasi-daerah.index');
            Route::get('/simulasi', [SimulasiIidController::class, 'index'])->name('simulasi.index');

            // Penyelenggaraan Lomba & Pembinaan
            Route::prefix('pengajuan-lomba')->name('pengajuan.')->group(function () {
                Route::get('/', [PengajuanLombaController::class, 'index'])->name('index');
                Route::post('/', [PengajuanLombaController::class, 'store'])->name('store');
                Route::get('/{pengajuan}', [PengajuanLombaController::class, 'show'])->name('show');
                Route::post('/{pengajuan}/tetapkan', [PengajuanLombaController::class, 'tetapkanInovasiDaerah'])->name('tetapkan');
                Route::post('/{pengajuan}/ajukan-kembali', [PengajuanLombaController::class, 'ajukanKembali'])->name('ajukan-kembali');
                Route::post('/{pengajuan}/rekomendasikan', [PengajuanLombaController::class, 'rekomendasikan'])->name('rekomendasikan');
                Route::post('/{pengajuan}/sahkan-opd', [ValidasiController::class, 'sahkanOpd'])->name('sahkan-opd');
                Route::post('/{pengajuan}/review-internal', [ValidasiController::class, 'reviewInternal'])->name('review-internal');
                Route::post('/{pengajuan}/siap-kirim', [ValidasiController::class, 'siapKirim'])->name('siap-kirim');
                Route::post('/{pengajuan}/kirim', [ValidasiController::class, 'kirim'])->name('kirim');
            });

            Route::get('/peserta-lomba', [PesertaLombaController::class, 'index'])->name('peserta.index');

            Route::prefix('rekapitulasi-nilai')->name('rekapitulasi.')->group(function () {
                Route::get('/', [RekapitulasiNilaiController::class, 'index'])->name('index');
                Route::get('/{pengajuan}', [RekapitulasiNilaiController::class, 'show'])->name('show');
            });

            Route::prefix('penugasan-pendamping')->name('penugasan.')->group(function () {
                Route::get('/', [PenugasanPendampingController::class, 'index'])->name('index');
                Route::post('/', [PenugasanPendampingController::class, 'store'])->name('store');
                Route::delete('/{penugasan}', [PenugasanPendampingController::class, 'destroy'])->name('destroy');
            });

            // Administrasi & Master Data
            Route::prefix('periode')->name('periode.')->group(function () {
                Route::get('/', [PeriodeLombaController::class, 'index'])->name('index');
                Route::post('/', [PeriodeLombaController::class, 'store'])->name('store');
                Route::put('/{periode}', [PeriodeLombaController::class, 'update'])->name('update');
                Route::patch('/{periode}/set-aktif', [PeriodeLombaController::class, 'setAktif'])->name('set-aktif');
                Route::patch('/{periode}/akhiri-lomba', [PeriodeLombaController::class, 'akhiriLomba'])->name('akhiri-lomba');
                Route::patch('/{periode}/buka-lomba', [PeriodeLombaController::class, 'bukaLomba'])->name('buka-lomba');
            });

            Route::prefix('indikator')->name('indikator.')->group(function () {
                Route::get('/', [MasterIndikatorController::class, 'index'])->name('index');
                Route::post('/spd', [MasterIndikatorController::class, 'storeSpd'])->name('spd.store');
                Route::put('/spd/{id}', [MasterIndikatorController::class, 'updateSpd'])->name('spd.update');
                Route::post('/sid', [MasterIndikatorController::class, 'storeSid'])->name('sid.store');
                Route::put('/sid/{id}', [MasterIndikatorController::class, 'updateSid'])->name('sid.update');
            });

            Route::prefix('opd')->name('opd.')->group(function () {
                Route::get('/', [MasterOpdController::class, 'index'])->name('index');
                Route::post('/', [MasterOpdController::class, 'store'])->name('store');
                Route::put('/{opd}', [MasterOpdController::class, 'update'])->name('update');
                Route::delete('/{opd}', [MasterOpdController::class, 'destroy'])->name('destroy');
            });

            Route::prefix('users')->name('users.')->group(function () {
                Route::get('/', [AdminUserController::class, 'index'])->name('index');
                Route::post('/', [AdminUserController::class, 'store'])->name('store');
                Route::put('/{user}', [AdminUserController::class, 'update'])->name('update');
                Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy');
                Route::patch('/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('toggle-status');
            });
        });

    // ==========================================
    // 2. DOMAIN PENILAI (TIM PENILAI / JURI)
    // ==========================================
    Route::middleware(['role:tim_penilai'])
        ->prefix('penilai')
        ->name('penilai.')
        ->group(function () {
            Route::get('/inovasi-daerah', [InovasiDaerahController::class, 'index'])->name('inovasi-daerah.index');

            Route::prefix('skoring')->name('skoring.')->group(function () {
                Route::get('/', [SkoringController::class, 'index'])->name('index');
                Route::get('/{pengajuan}', [SkoringController::class, 'show'])->name('show');
                Route::post('/{pengajuan}', [SkoringController::class, 'store'])->name('store');
                Route::post('/{pengajuan}/nilai-juri', [SkoringController::class, 'storeNilaiJuri'])->name('nilai.store');
            });
        });

    // ==========================================
    // 3. DOMAIN PENDAMPING (VERIFIKATOR OPD)
    // ==========================================
    Route::middleware(['role:pendamping'])
        ->prefix('pendamping')
        ->name('pendamping.')
        ->group(function () {
            Route::get('/inovasi-daerah', [InovasiDaerahController::class, 'index'])->name('inovasi-daerah.index');

            Route::prefix('validasi')->name('validasi.')->group(function () {
                Route::get('/', [ValidasiController::class, 'index'])->name('index');
                Route::get('/{pengajuan}', [ValidasiController::class, 'show'])->name('show');
                Route::post('/{pengajuan}/sahkan-opd', [ValidasiController::class, 'sahkanOpd'])->name('sahkan-opd');
            });
        });

    // ==========================================
    // 4. DOMAIN INOVATOR (OPD & MASYARAKAT)
    // ==========================================
    Route::middleware(['role:inovator'])
        ->prefix('inovator')
        ->name('inovator.')
        ->group(function () {
            Route::get('/inovasi-daerah', [InovasiDaerahController::class, 'index'])->name('inovasi-daerah.index');

            Route::prefix('inovasi')->name('inovasi.')->group(function () {
                Route::get('/', [InovasiController::class, 'index'])->name('index');
                Route::get('/create', [InovasiController::class, 'create'])->name('create');
                Route::post('/', [InovasiController::class, 'store'])->name('store');
                Route::get('/{inovasi}/edit', [InovasiController::class, 'edit'])->name('edit');
                Route::put('/{inovasi}', [InovasiController::class, 'update'])->name('update');
                Route::delete('/{inovasi}', [InovasiController::class, 'destroy'])->name('destroy');
                Route::post('/{inovasi}/dokumen', [InovasiController::class, 'upload'])->name('dokumen.store');
                Route::delete('/dokumen/{dokumen}', [InovasiController::class, 'destroyDokumen'])->name('dokumen.destroy');
                Route::post('/{inovasi}/submit', [InovasiController::class, 'submit'])->name('submit');
            });
        });

    // ==========================================
    // 5. DOMAIN PIMPINAN DAERAH
    // ==========================================
    Route::middleware(['role:pimpinan'])
        ->prefix('pimpinan')
        ->name('pimpinan.')
        ->group(function () {
            Route::get('/inovasi-daerah', [InovasiDaerahController::class, 'index'])->name('inovasi-daerah.index');
            Route::get('/simulasi', [SimulasiIidController::class, 'index'])->name('simulasi.index');
        });

    // ==========================================
    // BACKWARD COMPATIBILITY ALIASES & REDIRECTS
    // ==========================================
    Route::get('/inovasi', fn () => redirect()->route('inovator.inovasi.index'))->name('inovasi.index');
    Route::get('/inovasi/create', fn () => redirect()->route('inovator.inovasi.create'))->name('inovasi.create');
    Route::get('/inovasi/{inovasi}/edit', fn (\App\Models\Inovasi $inovasi) => redirect()->route('inovator.inovasi.edit', $inovasi))->name('inovasi.edit');

    Route::prefix('pengajuan-lomba')->name('pengajuan-lomba.')->group(function () {
        Route::get('/', function (Request $request) {
            $user = $request->user();
            if ($user && $user->hasRole('inovator') && ! $user->hasAnyRole(['bapperida', 'tim_penilai', 'pimpinan', 'pendamping'])) {
                return redirect()->route('inovator.inovasi.index');
            }
            return redirect()->route('superadmin.pengajuan.index');
        })->name('index');
        Route::post('/', [PengajuanLombaController::class, 'store'])->name('store');
        Route::get('/{pengajuan}', [PengajuanLombaController::class, 'show'])->name('show');
        Route::post('/{pengajuan}/tetapkan', [PengajuanLombaController::class, 'tetapkanInovasiDaerah'])->name('tetapkan');
        Route::post('/{pengajuan}/ajukan-kembali', [PengajuanLombaController::class, 'ajukanKembali'])->name('ajukan-kembali');
        Route::post('/{pengajuan}/rekomendasikan', [PengajuanLombaController::class, 'rekomendasikan'])->name('rekomendasikan');
        Route::post('/{pengajuan}/sahkan-opd', [ValidasiController::class, 'sahkanOpd'])->name('sahkan-opd');
        Route::post('/{pengajuan}/review-internal', [ValidasiController::class, 'reviewInternal'])->name('review-internal');
        Route::post('/{pengajuan}/siap-kirim', [ValidasiController::class, 'siapKirim'])->name('siap-kirim');
        Route::post('/{pengajuan}/kirim', [ValidasiController::class, 'kirim'])->name('kirim');
        Route::get('/{pengajuan}/indikator', fn (\App\Models\PengajuanLomba $pengajuan) => redirect()->route('inovasi-daerah.indikator.index', $pengajuan))->name('indikator.index');
    });

    Route::get('/penilai/periode', fn () => redirect()->route('superadmin.periode.index'))->name('penilai.periode.index');
    Route::get('/penilai/indikator', fn () => redirect()->route('superadmin.indikator.index'))->name('penilai.indikator.index');
    Route::get('/penilai/opd', fn () => redirect()->route('superadmin.opd.index'))->name('penilai.opd.index');
    Route::get('/penilai/users', fn () => redirect()->route('superadmin.users.index'))->name('penilai.users.index');
    Route::get('/penilai/peserta-lomba', fn () => redirect()->route('superadmin.peserta.index'))->name('penilai.peserta-lomba.index');
    Route::get('/penugasan-pendamping', fn () => redirect()->route('superadmin.penugasan.index'))->name('penugasan.index');
    Route::get('/pendamping/inovasi', fn () => redirect()->route('pendamping.validasi.index'))->name('pendamping.index');
    Route::get('/simulasi', function (Request $request) {
        $user = $request->user();
        if ($user && $user->hasRole('pimpinan')) {
            return redirect()->route('pimpinan.simulasi.index');
        }
        return redirect()->route('superadmin.simulasi.index');
    })->name('simulasi.index');
});

require __DIR__.'/settings.php';
