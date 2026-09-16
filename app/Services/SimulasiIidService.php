<?php

namespace App\Services;

use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\SkorSpd;
use Illuminate\Support\Collection;

class SimulasiIidService
{
    public const YANDAS_LIST = [
        'Pendidikan',
        'Kesehatan',
        'Pekerjaan Umum & Penataan Ruang',
        'Perumahan Rakyat & Kawasan Permukiman',
        'Ketenteraman, Ketertiban Umum & Pelindungan Masyarakat',
        'Sosial',
    ];

    /**
     * Calculate comprehensive IID simulation data based on PengajuanLomba.
     */
    public function getSimulasiData(?int $periodeId = null): array
    {
        $periode = $periodeId
            ? PeriodeLomba::find($periodeId)
            : PeriodeLomba::where('aktif', true)->first();

        // 1. Calculate SPD Score (15 indicators)
        $spdScore = $this->calculateSpdScore();

        // 2. Fetch all submissions for period
        $query = PengajuanLomba::with(['inovasi.user', 'inovasi.opd', 'skorPengajuan']);
        if ($periode) {
            $query->where('periode_lomba_id', $periode->id);
        }
        $pengajuanList = $query->get();

        // Active innovations included in official submission
        $readyStatuses = ['disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'];
        $eligiblePengajuan = $pengajuanList->filter(function ($item) use ($readyStatuses) {
            $statusVal = $item->status instanceof \App\Enums\StatusPengajuan ? $item->status->value : (string) $item->status;

            return in_array($statusVal, $readyStatuses, true);
        });

        // 3. Calculate Yandas Compliance (6 Urusan Wajib Pelayanan Dasar)
        $yandasStatus = $this->checkYandasCompliance($eligiblePengajuan);

        // 4. Calculate SID Score
        $sidCalculation = $this->calculateSidScore($eligiblePengajuan, $yandasStatus['fulfilled_count'] >= 5);

        // 5. Total & IID Score
        $totalSkor = min(250.0, round($spdScore + $sidCalculation['total_sid'], 2));
        $iidScore = round(($totalSkor / 250.0) * 100.0, 2);
        $kategoriIga = $this->getKategoriIga($iidScore);

        // 6. OPD Innovation Ranking
        $opdRanking = $this->getOpdRanking($pengajuanList);

        return [
            'periode' => $periode,
            'spd_score' => $spdScore,
            'sid_score' => $sidCalculation['sid_rata_rata'],
            'skor_jumlah_inovasi' => $sidCalculation['skor_jumlah_inovasi'],
            'total_sid' => $sidCalculation['total_sid'],
            'total_skor' => $totalSkor,
            'iid_score' => $iidScore,
            'kategori_iga' => $kategoriIga,
            'yandas' => $yandasStatus,
            'opd_ranking' => $opdRanking,
            'inovasi_list' => $pengajuanList->map(function ($item) {
                $inovasi = $item->inovasi;
                $statusVal = $item->status instanceof \App\Enums\StatusPengajuan ? $item->status->value : (string) $item->status;

                return [
                    'id' => $item->id,
                    'inovasi_id' => $inovasi->id,
                    'nama_inovasi' => $inovasi->nama_inovasi,
                    'tahapan' => $inovasi->tahapan,
                    'status' => $statusVal,
                    'is_inovasi_daerah' => (bool) $item->is_inovasi_daerah,
                    'nama_inisiator' => $inovasi->nama_inisiator,
                    'opd_nama' => $inovasi->opd?->nama ?? $inovasi->user?->nama_pemda ?? 'OPD',
                    'urusan_utama' => $inovasi->urusan_utama,
                    'urusan_wajib' => $inovasi->urusan_wajib,
                    'estimasi_skor_kematangan' => $item->estimasi_skor_kematangan ?? 0,
                    'skor_sid_calculated' => round($item->skorPengajuan->sum('skor'), 2),
                ];
            }),
        ];
    }

    /**
     * Calculate Skor SPD (Max 63 Poin).
     */
    public function calculateSpdScore(): float
    {
        $skorSpdRecords = SkorSpd::with('indikator')->get();

        if ($skorSpdRecords->isEmpty()) {
            return 0.0;
        }

        $sum = 0.0;
        foreach ($skorSpdRecords as $record) {
            $bobot = (float) ($record->indikator?->bobot ?? 1.0);
            $tier = (int) $record->tier;
            $sum += $tier * $bobot;
        }

        return min(63.0, round($sum, 2));
    }

    /**
     * Check 6 Urusan Wajib Pelayanan Dasar compliance.
     */
    public function checkYandasCompliance(Collection $eligiblePengajuan): array
    {
        $fulfilledYandas = [];

        foreach (self::YANDAS_LIST as $yandas) {
            $hasInovasi = $eligiblePengajuan->contains(function ($item) use ($yandas) {
                $inovasi = $item->inovasi;
                if (! $inovasi || ! $inovasi->urusan_wajib) {
                    return false;
                }
                $list = json_decode($inovasi->urusan_wajib, true);
                if (is_array($list)) {
                    return in_array($yandas, $list, true);
                }

                return str_contains((string) $inovasi->urusan_wajib, $yandas);
            });

            $fulfilledYandas[$yandas] = $hasInovasi;
        }

        $fulfilledCount = count(array_filter($fulfilledYandas));

        return [
            'items' => $fulfilledYandas,
            'fulfilled_count' => $fulfilledCount,
            'total_required' => 6,
            'is_compliant' => $fulfilledCount >= 5,
        ];
    }

    /**
     * Calculate SID Score & Skor Jumlah Inovasi.
     */
    public function calculateSidScore(Collection $eligiblePengajuan, bool $yandasCompliant): array
    {
        $n = $eligiblePengajuan->count();

        // Sum SID scores for all eligible innovations
        $sumSidInovasi = 0.0;
        foreach ($eligiblePengajuan as $item) {
            $sumSidInovasi += $item->skorPengajuan->sum('skor');
        }

        $divisor = max(12, $n);
        $sidRataRata = $divisor > 0 ? ($sumSidInovasi / $divisor) : 0.0;

        // Skor Jumlah Inovasi = MIN(n, 200) * 0.38 if Yandas >= 5, else 0
        $skorJumlahInovasi = $yandasCompliant ? (min($n, 200) * 0.38) : 0.0;

        $totalSid = min(187.0, round($sidRataRata + $skorJumlahInovasi, 2));

        return [
            'n' => $n,
            'sum_sid_raw' => round($sumSidInovasi, 2),
            'sid_rata_rata' => round($sidRataRata, 2),
            'skor_jumlah_inovasi' => round($skorJumlahInovasi, 2),
            'total_sid' => $totalSid,
        ];
    }

    /**
     * Get IGA Category label.
     */
    public function getKategoriIga(float $iidScore): array
    {
        if ($iidScore >= 65.01) {
            return [
                'label' => 'Sangat Inovatif',
                'color' => 'emerald',
                'bg' => 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
                'badge' => 'default',
            ];
        }

        if ($iidScore >= 40.01) {
            return [
                'label' => 'Inovatif',
                'color' => 'blue',
                'bg' => 'bg-blue-500/10 text-blue-600 border-blue-500/30',
                'badge' => 'secondary',
            ];
        }

        if ($iidScore >= 0.01) {
            return [
                'label' => 'Kurang Inovatif',
                'color' => 'amber',
                'bg' => 'bg-amber-500/10 text-amber-600 border-amber-500/30',
                'badge' => 'outline',
            ];
        }

        return [
            'label' => 'Tidak Dapat Dinilai',
            'color' => 'rose',
            'bg' => 'bg-rose-500/10 text-rose-600 border-rose-500/30',
            'badge' => 'destructive',
        ];
    }

    /**
     * Get Ranking of OPD by Innovation performance.
     */
    public function getOpdRanking(Collection $pengajuanList): Collection
    {
        $allOpds = Opd::all();

        $grouped = $pengajuanList->groupBy(function ($item) {
            return $item->inovasi->opd_id ?? 0;
        });

        $ranking = $allOpds->map(function ($opd) use ($grouped) {
            $items = $grouped->get($opd->id, collect());
            $totalInovasi = $items->count();
            $approvedCount = $items->filter(function ($i) {
                $statusVal = $i->status instanceof \App\Enums\StatusPengajuan ? $i->status->value : (string) $i->status;

                return in_array($statusVal, ['disahkan_opd', 'review_internal', 'siap_kirim', 'terkirim'], true);
            })->count();
            $avgScore = $items->avg('estimasi_skor_kematangan') ?? 0;

            return [
                'id' => $opd->id,
                'kode' => $opd->kode,
                'nama' => $opd->nama,
                'total_inovasi' => $totalInovasi,
                'approved_count' => $approvedCount,
                'avg_skor' => round($avgScore, 2),
            ];
        })->sortByDesc('approved_count')->sortByDesc('avg_skor')->values();

        return $ranking;
    }
}
