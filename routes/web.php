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
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/simulasi', [SimulasiIidController::class, 'index'])->name('simulasi.index');
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
    Route::middleware(['auth', 'verified'])
        ->prefix('inovasi-daerah')
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

    // Backward compatibility aliases
    Route::get('/pengajuan-lomba/{pengajuan}/indikator', fn (\App\Models\PengajuanLomba $pengajuan) => redirect()->route('inovasi-daerah.indikator.index', $pengajuan))->name('pengajuan-lomba.indikator.index');

    // Data Peserta Lomba Inovasi Daerah (Admin BAPPERIDA)
    Route::middleware(['auth', 'verified', 'permission:manage-master-data'])
        ->get('/penilai/peserta-lomba', [PesertaLombaController::class, 'index'])
        ->name('penilai.peserta-lomba.index');

    // Inovasi Master (Repositori Bank Data Inovasi Biasa)
    Route::middleware(['auth', 'verified', 'permission:input-inovasi'])
        ->prefix('inovasi')
        ->name('inovasi.')
        ->group(function () {
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

    // Pengajuan Lomba Inovasi Daerah
    Route::prefix('pengajuan-lomba')
        ->name('pengajuan-lomba.')
        ->group(function () {
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

    Route::middleware(['auth', 'verified', 'permission:manage-master-data'])
        ->prefix('penilai/periode')
        ->name('penilai.periode.')
        ->group(function () {
            Route::get('/', [PeriodeLombaController::class, 'index'])->name('index');
            Route::post('/', [PeriodeLombaController::class, 'store'])->name('store');
            Route::put('/{periode}', [PeriodeLombaController::class, 'update'])->name('update');
            Route::patch('/{periode}/set-aktif', [PeriodeLombaController::class, 'setAktif'])->name('set-aktif');
        });

    Route::middleware(['auth', 'verified', 'permission:validate-inovasi'])
        ->prefix('pendamping/inovasi')
        ->name('pendamping.')
        ->group(function () {
            Route::get('/', [ValidasiController::class, 'index'])->name('index');
            Route::get('/{pengajuan}', [ValidasiController::class, 'show'])->name('show');
            Route::post('/{pengajuan}/sahkan-opd', [ValidasiController::class, 'sahkanOpd'])->name('sahkan-opd');
        });

    Route::middleware(['auth', 'verified', 'permission:assign-pendamping'])
        ->prefix('penugasan-pendamping')
        ->name('penugasan.')
        ->group(function () {
            Route::get('/', [PenugasanPendampingController::class, 'index'])->name('index');
            Route::post('/', [PenugasanPendampingController::class, 'store'])->name('store');
            Route::delete('/{penugasan}', [PenugasanPendampingController::class, 'destroy'])->name('destroy');
        });

    Route::middleware(['auth', 'verified', 'permission:scoring-spd|scoring-sid'])
        ->prefix('penilai/skoring')
        ->name('penilai.skoring.')
        ->group(function () {
            Route::get('/', [SkoringController::class, 'index'])->name('index');
            Route::get('/{pengajuan}', [SkoringController::class, 'show'])->name('show');
            Route::post('/{pengajuan}', [SkoringController::class, 'store'])->name('store');
            Route::post('/{pengajuan}/nilai-juri', [SkoringController::class, 'storeNilaiJuri'])->name('nilai.store');
        });

    Route::middleware(['auth', 'verified', 'permission:manage-master-data'])
        ->prefix('penilai/indikator')
        ->name('penilai.indikator.')
        ->group(function () {
            Route::get('/', [MasterIndikatorController::class, 'index'])->name('index');
            Route::post('/spd', [MasterIndikatorController::class, 'storeSpd'])->name('spd.store');
            Route::put('/spd/{id}', [MasterIndikatorController::class, 'updateSpd'])->name('spd.update');
            Route::post('/sid', [MasterIndikatorController::class, 'storeSid'])->name('sid.store');
            Route::put('/sid/{id}', [MasterIndikatorController::class, 'updateSid'])->name('sid.update');
        });

    Route::middleware(['auth', 'verified', 'permission:manage-master-data'])
        ->prefix('penilai/users')
        ->name('penilai.users.')
        ->group(function () {
            Route::get('/', [AdminUserController::class, 'index'])->name('index');
            Route::post('/', [AdminUserController::class, 'store'])->name('store');
            Route::put('/{user}', [AdminUserController::class, 'update'])->name('update');
            Route::delete('/{user}', [AdminUserController::class, 'destroy'])->name('destroy');
            Route::patch('/{user}/toggle-status', [AdminUserController::class, 'toggleStatus'])->name('toggle-status');
        });

    Route::middleware(['auth', 'verified', 'permission:manage-master-data'])
        ->prefix('penilai/opd')
        ->name('penilai.opd.')
        ->group(function () {
            Route::get('/', [MasterOpdController::class, 'index'])->name('index');
            Route::post('/', [MasterOpdController::class, 'store'])->name('store');
            Route::put('/{opd}', [MasterOpdController::class, 'update'])->name('update');
            Route::delete('/{opd}', [MasterOpdController::class, 'destroy'])->name('destroy');
        });
});

require __DIR__.'/settings.php';
