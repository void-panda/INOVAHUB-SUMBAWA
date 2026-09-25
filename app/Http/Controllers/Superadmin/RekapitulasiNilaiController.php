<?php

namespace App\Http\Controllers\Superadmin;

use App\Enums\StatusPengajuan;
use App\Http\Controllers\Controller;
use App\Models\InovasiDokumen;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RekapitulasiNilaiController extends Controller
{
    /**
     * Tampilkan monitoring rekapitulasi penilaian juri untuk BAPPERIDA.
     */
    public function index(Request $request): Response
    {
        $periodeAktif = PeriodeLomba::where('aktif', true)->first();

        $query = PengajuanLomba::with([
            'inovasi.user',
            'inovasi.opd',
            'periodeLomba',
            'penilaianJuri.juri',
        ])->where('is_arsip', false);

        if ($periodeAktif) {
            $query->where('periode_lomba_id', $periodeAktif->id);
        }

        $pengajuanList = $query->latest()->paginate(15);

        $formattedInovasi = $pengajuanList->through(function ($item) {
            $isDraft = $item->status === StatusPengajuan::Draft
                || (is_string($item->status) && $item->status === 'draft')
                || ($item->inovasi && isset($item->inovasi->status) && $item->inovasi->status === 'draft');

            $statusLomba = $isDraft ? 'sedang_melengkapi_data' : 'sudah_submit';

            return [
                'id' => $item->id,
                'inovasi_id' => $item->inovasi_id,
                'nama_inovasi' => $item->inovasi?->nama_inovasi ?? 'Tanpa Nama',
                'tahapan' => $item->inovasi?->tahapan ?? 'penerapan',
                'status' => $item->status?->value ?? (string) $item->status,
                'status_juri' => $statusLomba,
                'is_inovasi_daerah' => (bool) $item->is_inovasi_daerah,
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

        return Inertia::render('superadmin/rekapitulasi/index', [
            'inovasi' => $formattedInovasi,
            'pengajuanList' => $pengajuanList,
            'periodeAktif' => $periodeAktif ? [
                'id' => $periodeAktif->id,
                'tahun' => $periodeAktif->tahun,
                'nama' => $periodeAktif->nama ?? (string) $periodeAktif->tahun,
            ] : null,
        ]);
    }

    /**
     * Tampilkan detail evaluasi kualitatif dan rekap nilai seluruh juri (Read-only Monitoring Bapperida).
     */
    public function show(Request $request, PengajuanLomba $pengajuan): Response
    {
        $pengajuan->load([
            'inovasi.user',
            'inovasi.opd',
            'inovasi.dokumen',
            'periodeLomba',
            'penilaianJuri.juri',
        ]);

        $inovasi = $pengajuan->inovasi;

        $dokumenUmum = InovasiDokumen::where('inovasi_id', $inovasi->id)
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

        $daftarPenilaianJuri = $pengajuan->penilaianJuri->map(fn ($p) => [
            'id' => $p->id,
            'juri_id' => $p->juri_id,
            'nama_juri' => $p->juri?->name ?? 'Juri Lomba',
            'nilai' => $p->nilai,
            'catatan' => $p->catatan,
            'updated_at' => $p->updated_at?->format('d M Y, H:i') ?? '',
        ]);

        $isDraft = $pengajuan->status === StatusPengajuan::Draft
            || (is_string($pengajuan->status) && $pengajuan->status === 'draft')
            || ($inovasi && isset($inovasi->status) && $inovasi->status === 'draft');

        $inovasiDetail = [
            'id' => $pengajuan->id,
            'inovasi_id' => $pengajuan->inovasi_id,
            'nama_inovasi' => $inovasi?->nama_inovasi ?? 'Inovasi',
            'tahapan' => $inovasi?->tahapan ?? 'penerapan',
            'status' => $pengajuan->status?->value ?? (string) $pengajuan->status,
            'status_juri' => $isDraft ? 'sedang_melengkapi_data' : 'sudah_submit',
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

        return Inertia::render('superadmin/rekapitulasi/show', [
            'pengajuan' => $pengajuan,
            'inovasi' => $inovasiDetail,
            'daftarPenilaianJuri' => $daftarPenilaianJuri,
        ]);
    }
}
