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

        $userRole = $user ? ($user->getRoleNames()->first() ?? 'inovator') : 'bapperida';

        // 1. Master Inovasi Aggregates (Direct SQL)
        $totalInovasi = Inovasi::count();
        $totalInovasiDaerah = Inovasi::where('is_inovasi_daerah', true)->count();

        $tahapanCountsRaw = Inovasi::select('tahapan', DB::raw('count(*) as aggregate'))
            ->groupBy('tahapan')
            ->pluck('aggregate', 'tahapan')
            ->toArray();
        $tahapanCounts = [
            'inisiatif' => (int) ($tahapanCountsRaw['inisiatif'] ?? 0),
            'ujicoba' => (int) ($tahapanCountsRaw['ujicoba'] ?? 0),
            'penerapan' => (int) ($tahapanCountsRaw['penerapan'] ?? 0),
        ];

        $urusanDistribution = Inovasi::select('urusan_utama', DB::raw('count(*) as count'))
            ->groupBy('urusan_utama')
            ->orderByDesc('count')
            ->take(6)
            ->get()
            ->map(function ($row) {
                return [
                    'urusan' => $row->urusan_utama ?: 'Lainnya / Umum',
                    'count' => (int) $row->count,
                ];
            })
            ->values();

        $opdAktifCount = Inovasi::whereNotNull('opd_id')->distinct('opd_id')->count('opd_id');

        // 2. Base Pengajuan Lomba Query (Direct SQL)
        $pengajuanBaseQuery = PengajuanLomba::query();
        if ($periode) {
            $pengajuanBaseQuery->where('periode_lomba_id', $periode->id);
        }

        $totalPengajuan = (clone $pengajuanBaseQuery)->count();
        $siapKirimCount = (clone $pengajuanBaseQuery)->whereIn('status', ['siap_kirim', 'terkirim'])->count();

        // 3. IID Simulation Data (Macro)
        $simulasi = $this->simulasiService->getSimulasiData($periode?->id);

        // 4. Status Breakdown for Pengajuan Lomba (5 Status) via SQL GROUP BY
        $statusCountsRaw = (clone $pengajuanBaseQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $allStatuses = [
            StatusPengajuan::DalamPendampingan->value,
            StatusPengajuan::DisahkanOpd->value,
            StatusPengajuan::ReviewInternal->value,
            StatusPengajuan::SiapKirim->value,
            StatusPengajuan::Terkirim->value,
        ];
        $statusCounts = [];
        foreach ($allStatuses as $st) {
            $statusCounts[$st] = (int) ($statusCountsRaw[$st] ?? 0);
        }

        // 5. Recent Audit Trail / Validation Logs
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

        // 6. Recent Inovasi Master
        $recentInovasi = Inovasi::with(['opd:id,nama', 'user:id,nama_pemda'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'nama_inovasi' => $item->nama_inovasi,
                    'is_inovasi_daerah' => (bool) $item->is_inovasi_daerah,
                    'tahapan' => $item->tahapan,
                    'opd_nama' => $item->opd?->nama ?? $item->user?->nama_pemda ?? 'OPD',
                    'created_at' => $item->created_at?->format('d M Y') ?? '',
                ];
            })
            ->values();

        // 7. Linimasa / Timeline IGA
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

        // 8. Role Specific Custom Dataset
        $roleData = [];
        if ($userRole === 'inovator' && $user) {
            $myMasterCount = Inovasi::where(function ($q) use ($user) {
                $q->where('user_id', $user->id);
                if ($user->opd_id) {
                    $q->orWhere('opd_id', $user->opd_id);
                }
            })->count();

            $myPengajuanQuery = (clone $pengajuanBaseQuery)->where(function ($q) use ($user) {
                $q->where('user_id', $user->id);
                if ($user->opd_id) {
                    $q->orWhereHas('inovasi', fn ($sq) => $sq->where('opd_id', $user->opd_id));
                }
            });

            $myPengajuanCount = (clone $myPengajuanQuery)->count();
            $myDisahkanCount = (clone $myPengajuanQuery)->where('status', StatusPengajuan::DisahkanOpd)->count();
            $myDalamPendampinganCount = (clone $myPengajuanQuery)->where('status', StatusPengajuan::DalamPendampingan)->count();
            $myAvgSkor = round((float) ((clone $myPengajuanQuery)->avg('estimasi_skor_kematangan') ?? 0), 2);

            $myInovasiList = (clone $myPengajuanQuery)
                ->with([
                    'inovasi:id,nama_inovasi,tahapan',
                    'dokumen:id,pengajuan_lomba_id',
                    'kelengkapanIndikator:id,pengajuan_lomba_id,parameter',
                ])
                ->latest('updated_at')
                ->take(8)
                ->get()
                ->map(function ($item) {
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
                })
                ->values();

            $roleData = [
                'total_my_inovasi' => $myMasterCount,
                'total_my_pengajuan' => $myPengajuanCount,
                'status_counts' => $statusCounts,
                'disahkan_opd_count' => $myDisahkanCount,
                'dalam_pendampingan_count' => $myDalamPendampinganCount,
                'avg_skor_kematangan' => $myAvgSkor,
                'my_inovasi_list' => $myInovasiList,
            ];
        } elseif ($userRole === 'pendamping' && $user) {
            $assignedInovasiIds = DB::table('penugasan_pendamping')
                ->where('pendamping_id', $user->id)
                ->whereNotNull('inovasi_id')
                ->pluck('inovasi_id')
                ->toArray();

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

            $assignedBase = (clone $pengajuanBaseQuery);
            $hasAssignment = ! empty($assignedInovasiIds) || ! empty($assignedOpdIds) || ! empty($assignedInovatorIds);

            if ($hasAssignment) {
                $assignedBase->where(function ($q) use ($assignedInovasiIds, $assignedOpdIds, $assignedInovatorIds) {
                    if (! empty($assignedInovasiIds)) {
                        $q->whereIn('inovasi_id', $assignedInovasiIds);
                    }
                    if (! empty($assignedOpdIds)) {
                        $q->orWhereHas('inovasi', fn ($i) => $i->whereIn('opd_id', $assignedOpdIds));
                    }
                    if (! empty($assignedInovatorIds)) {
                        $q->orWhereIn('user_id', $assignedInovatorIds);
                    }
                });
            }

            $totalAssigned = (clone $assignedBase)->count();
            $assignedDalamPendampingan = (clone $assignedBase)->where('status', StatusPengajuan::DalamPendampingan)->count();
            $assignedDisahkan = (clone $assignedBase)->where('status', StatusPengajuan::DisahkanOpd)->count();

            $pendingList = (clone $assignedBase)
                ->where('status', StatusPengajuan::DalamPendampingan)
                ->with(['inovasi.opd:id,nama', 'inovasi.user:id,nama_pemda'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'nama_inovasi' => $item->inovasi?->nama_inovasi,
                    'opd_nama' => $item->inovasi?->opd?->nama ?? $item->inovasi?->user?->nama_pemda ?? 'OPD',
                    'status' => $item->status instanceof StatusPengajuan ? $item->status->value : (string) $item->status,
                    'created_at' => $item->created_at?->format('d M Y') ?? '',
                ])
                ->values();

            $roleData = [
                'total_assigned' => $totalAssigned,
                'dalam_pendampingan' => $assignedDalamPendampingan,
                'disahkan_opd' => $assignedDisahkan,
                'pending_list' => $pendingList,
            ];
        }

        return [
            'user_role' => $userRole,
            'role_data' => $roleData,
            'periode' => $periode,
            'summary' => [
                'total_inovasi' => $totalInovasi,
                'total_inovasi_daerah' => $totalInovasiDaerah,
                'total_pengajuan' => $totalPengajuan,
                'siap_kirim_count' => $siapKirimCount,
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
