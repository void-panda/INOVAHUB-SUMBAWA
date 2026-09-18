<?php

namespace App\Services;

use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\ValidasiLog;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function __construct(
        private readonly SimulasiIidService $simulasiService,
        private readonly PengajuanLombaService $pengajuanService,
    ) {}

    /**
     * Fetch complete dynamic dashboard aggregate dataset tailored by User Role.
     */
    public function getDashboardMetrics(?\App\Models\User $user = null, ?int $periodeId = null): array
    {
        $periode = $periodeId
            ? PeriodeLomba::find($periodeId)
            : PeriodeLomba::where('aktif', true)->first();

        $userRole = $user ? ($user->getRoleNames()->first() ?? 'inovator') : 'tim_penilai';

        // 1. Inovasi Master
        $masterInovasiQuery = Inovasi::with(['user', 'opd']);
        $allMasterInovasi = $masterInovasiQuery->get();

        // 2. Pengajuan Lomba in Periode
        $pengajuanQuery = PengajuanLomba::with(['inovasi.user', 'inovasi.opd', 'dokumen', 'kelengkapanIndikator']);
        if ($periode) {
            $pengajuanQuery->where('periode_lomba_id', $periode->id);
        }
        $allPengajuan = $pengajuanQuery->get();

        // 3. IID Simulation Data (Macro)
        $simulasi = $this->simulasiService->getSimulasiData($periode?->id);

        // 4. Status Breakdown for Pengajuan Lomba (5 Status Baru)
        $allStatuses = [
            StatusPengajuan::DalamPendampingan->value,
            StatusPengajuan::DisahkanOpd->value,
            StatusPengajuan::ReviewInternal->value,
            StatusPengajuan::SiapKirim->value,
            StatusPengajuan::Terkirim->value,
        ];
        $statusCounts = array_fill_keys($allStatuses, 0);

        foreach ($allPengajuan as $item) {
            $st = $item->status instanceof StatusPengajuan ? $item->status->value : (string) $item->status;
            if (isset($statusCounts[$st])) {
                $statusCounts[$st]++;
            }
        }

        // 5. Tahapan Breakdown (Master)
        $tahapanCounts = [
            'inisiatif' => $allMasterInovasi->where('tahapan', 'inisiatif')->count(),
            'ujicoba' => $allMasterInovasi->where('tahapan', 'ujicoba')->count(),
            'penerapan' => $allMasterInovasi->where('tahapan', 'penerapan')->count(),
        ];

        // 6. Distribution by Urusan Utama
        $urusanDistribution = $allMasterInovasi
            ->groupBy('urusan_utama')
            ->map(function ($items, $key) {
                return [
                    'urusan' => $key ?: 'Lainnya / Umum',
                    'count' => $items->count(),
                ];
            })
            ->values()
            ->sortByDesc('count')
            ->take(6)
            ->values();

        // 7. Active OPDs count
        $opdAktifCount = $allMasterInovasi->pluck('opd_id')->filter()->unique()->count();

        // 8. Recent Audit Trail / Validation Logs
        $recentLogsQuery = ValidasiLog::with(['user', 'inovasi', 'pengajuanLomba.inovasi']);
        if ($userRole === 'inovator' && $user) {
            $recentLogsQuery->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhereHas('inovasi', fn ($i) => $i->where('user_id', $user->id)->orWhere('opd_id', $user->opd_id));
            });
        }
        $recentLogs = $recentLogsQuery
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($log) {
                $nama = $log->inovasi?->nama_inovasi
                    ?? $log->pengajuanLomba?->inovasi?->nama_inovasi
                    ?? 'Inovasi';

                return [
                    'id' => $log->id,
                    'user_nama' => $log->user?->name ?? 'Sistem',
                    'inovasi_nama' => $nama,
                    'status_sebelum' => $log->status_sebelum,
                    'status_sesudah' => $log->status_sesudah,
                    'catatan' => $log->catatan,
                    'created_at' => $log->created_at?->diffForHumans() ?? '',
                ];
            });

        // 9. Recent Inovasi Master
        $recentInovasi = $allMasterInovasi->sortByDesc('created_at')->take(5)->map(function ($item) {
            return [
                'id' => $item->id,
                'nama_inovasi' => $item->nama_inovasi,
                'is_inovasi_daerah' => (bool) $item->is_inovasi_daerah,
                'tahapan' => $item->tahapan,
                'opd_nama' => $item->opd?->nama ?? $item->user?->nama_pemda ?? 'OPD',
                'created_at' => $item->created_at?->format('d M Y') ?? '',
            ];
        })->values();

        // 10. Linimasa / Timeline IGA
        $linimasa = $periode
            ? DB::table('linimasa')
                ->where('periode_lomba_id', $periode->id)
                ->orderBy('mulai')
                ->get()
                ->map(function ($item) {
                    $today = date('Y-m-d');
                    $isCurrent = $today >= $item->mulai && $today <= $item->selesai;
                    $isPassed = $today > $item->selesai;

                    return [
                        'id' => $item->id,
                        'nama' => $item->nama,
                        'mulai' => date('d M Y', strtotime($item->mulai)),
                        'selesai' => date('d M Y', strtotime($item->selesai)),
                        'is_current' => $isCurrent,
                        'is_passed' => $isPassed,
                    ];
                })
            : collect([]);

        // 11. Role Specific Custom Dataset
        $roleData = [];
        if ($userRole === 'inovator' && $user) {
            $myMasterInovasi = $allMasterInovasi->filter(function ($item) use ($user) {
                return $item->user_id === $user->id || ($user->opd_id && $item->opd_id === $user->opd_id);
            });

            $myPengajuan = $allPengajuan->filter(function ($item) use ($user) {
                return $item->user_id === $user->id || ($user->opd_id && $item->inovasi?->opd_id === $user->opd_id);
            });

            $roleData = [
                'total_my_inovasi' => $myMasterInovasi->count(),
                'total_my_pengajuan' => $myPengajuan->count(),
                'status_counts' => $statusCounts,
                'disahkan_opd_count' => $myPengajuan->where('status', StatusPengajuan::DisahkanOpd)->count(),
                'dalam_pendampingan_count' => $myPengajuan->where('status', StatusPengajuan::DalamPendampingan)->count(),
                'avg_skor_kematangan' => round((float) ($myPengajuan->avg('estimasi_skor_kematangan') ?? 0), 2),
                'my_inovasi_list' => $myPengajuan->sortByDesc('updated_at')->take(8)->map(function ($item) {
                    $filledIndikator = $item->kelengkapanIndikator ? $item->kelengkapanIndikator->filter(fn ($k) => ! empty($k->parameter))->count() : 0;

                    return [
                        'id' => $item->id,
                        'inovasi_id' => $item->inovasi_id,
                        'nama_inovasi' => $item->inovasi?->nama_inovasi,
                        'tahapan' => $item->inovasi?->tahapan,
                        'status' => $item->status instanceof StatusPengajuan ? $item->status->value : (string) $item->status,
                        'skor_kematangan' => round((float) ($item->estimasi_skor_kematangan ?? 0), 2),
                        'indikator_filled' => $filledIndikator,
                        'dokumen_count' => $item->dokumen ? $item->dokumen->count() : 0,
                        'updated_at' => $item->updated_at?->format('d M Y') ?? '',
                        'updated_at_relative' => $item->updated_at?->diffForHumans() ?? '',
                    ];
                })->values(),
            ];
        } elseif ($userRole === 'pendamping' && $user) {
            $assignedOpdIds = DB::table('penugasan_pendamping')
                ->where('pendamping_id', $user->id)
                ->whereNotNull('opd_id')
                ->pluck('opd_id')
                ->toArray();

            $assignedInovatorIds = DB::table('penugasan_pendamping')
                ->where('pendamping_id', $user->id)
                ->whereNotNull('inovator_id')
                ->pluck('inovator_id')
                ->toArray();

            $assignedItems = $allPengajuan->filter(function ($item) use ($assignedOpdIds, $assignedInovatorIds) {
                return in_array($item->inovasi?->opd_id, $assignedOpdIds, true)
                    || in_array($item->user_id, $assignedInovatorIds, true);
            });

            if ($assignedItems->isEmpty()) {
                $assignedItems = $allPengajuan;
            }

            $roleData = [
                'total_assigned' => $assignedItems->count(),
                'dalam_pendampingan' => $assignedItems->where('status', StatusPengajuan::DalamPendampingan)->count(),
                'disahkan_opd' => $assignedItems->where('status', StatusPengajuan::DisahkanOpd)->count(),
                'pending_list' => $assignedItems->where('status', StatusPengajuan::DalamPendampingan)->take(5)->map(fn ($item) => [
                    'id' => $item->id,
                    'nama_inovasi' => $item->inovasi?->nama_inovasi,
                    'opd_nama' => $item->inovasi?->opd?->nama ?? $item->inovasi?->user?->nama_pemda ?? 'OPD',
                    'status' => $item->status instanceof StatusPengajuan ? $item->status->value : (string) $item->status,
                    'created_at' => $item->created_at?->format('d M Y') ?? '',
                ])->values(),
            ];
        }

        return [
            'user_role' => $userRole,
            'role_data' => $roleData,
            'periode' => $periode,
            'summary' => [
                'total_inovasi' => $allMasterInovasi->count(),
                'total_inovasi_daerah' => $allMasterInovasi->where('is_inovasi_daerah', true)->count(),
                'total_pengajuan' => $allPengajuan->count(),
                'siap_kirim_count' => $allPengajuan->filter(fn ($p) => in_array($p->status instanceof StatusPengajuan ? $p->status->value : (string) $p->status, ['siap_kirim', 'terkirim'], true))->count(),
                'opd_aktif_count' => $opdAktifCount > 0 ? $opdAktifCount : Opd::count(),
                'iid_score' => $simulasi['iid_score'],
                'kategori_iga' => $simulasi['kategori_iga'],
                'yandas_compliant' => $simulasi['yandas']['is_compliant'],
                'yandas_count' => $simulasi['yandas']['fulfilled_count'],
            ],
            'status_counts' => $statusCounts,
            'tahapan_counts' => $tahapanCounts,
            'urusan_distribution' => $urusanDistribution,
            'top_opd' => $simulasi['opd_ranking']->take(5),
            'recent_logs' => $recentLogs,
            'recent_inovasi' => $recentInovasi,
            'linimasa' => $linimasa,
            'countdown' => $this->pengajuanService->getPengumpulanCountdown($periode),
            'simulasi_brief' => [
                'spd_score' => $simulasi['spd_score'],
                'sid_score' => $simulasi['sid_score'],
                'skor_jumlah_inovasi' => $simulasi['skor_jumlah_inovasi'],
                'total_skor' => $simulasi['total_skor'],
            ],
        ];
    }
}
