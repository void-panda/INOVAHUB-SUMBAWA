<?php

namespace App\Services;

use App\DTOs\SkoringData;
use App\Enums\StatusPengajuan;
use App\Models\Notifikasi;
use App\Models\PengajuanLomba;
use App\Models\User;
use App\Models\ValidasiLog;
use App\Repositories\IndikatorRepository;
use App\Repositories\SkorRepository;
use Illuminate\Support\Facades\DB;

class SkoringService
{
    public function __construct(
        protected IndikatorRepository $indikatorRepository,
        protected SkorRepository $skorRepository
    ) {}

    public function processSkoring(User $penilai, PengajuanLomba $pengajuan, SkoringData $data): void
    {
        DB::transaction(function () use ($penilai, $pengajuan, $data) {
            $totalSkorSid = 0.0;
            $sidIndikators = $this->indikatorRepository->getAllSid()->keyBy('id');

            foreach ($data->itemsSid as $item) {
                $indikatorId = (int) $item['indikator_id'];
                $tier = (int) $item['tier'];
                $catatan = $item['catatan'] ?? null;

                $indikator = $sidIndikators->get($indikatorId);
                $bobot = $indikator !== null ? (float) $indikator->bobot : 1.0;
                $skorItem = $tier * $bobot;

                $this->skorRepository->saveSkorPengajuan($pengajuan->id, $indikatorId, $tier, $skorItem, $catatan);
                $totalSkorSid += $skorItem;
            }

            if ($pengajuan->periode_lomba_id && ! empty($data->itemsSpd)) {
                $spdIndikators = $this->indikatorRepository->getAllSpd()->keyBy('id');

                foreach ($data->itemsSpd as $item) {
                    $indikatorId = (int) $item['indikator_id'];
                    $tier = (int) $item['tier'];
                    $catatan = $item['catatan'] ?? null;

                    $indikator = $spdIndikators->get($indikatorId);
                    $bobot = $indikator !== null ? (float) $indikator->bobot : 1.0;
                    $skorItem = $tier * $bobot;

                    $this->skorRepository->saveSkorSpd($pengajuan->periode_lomba_id, $indikatorId, $tier, $skorItem, $catatan);
                }
            }

            // Estimasi skor kematangan
            $skorFinal = round($totalSkorSid, 2);

            $statusSebelum = $pengajuan->status instanceof StatusPengajuan
                ? $pengajuan->status->value
                : (string) $pengajuan->status;

            $targetStatus = $data->isFinal
                ? StatusPengajuan::SiapKirim
                : StatusPengajuan::ReviewInternal;

            $pengajuan->update([
                'estimasi_skor_kematangan' => $skorFinal,
                'status' => $targetStatus,
            ]);

            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $penilai->id,
                'status_sebelum' => $statusSebelum,
                'status_sesudah' => $targetStatus->value,
                'catatan' => $data->isFinal
                    ? 'Tim Penilai telah memfinalisasi skor penilaian inovasi (20 Indikator SID).'
                    : 'Tim Penilai menyimpan draft skor penilaian.',
            ]);

            if ($data->isFinal) {
                Notifikasi::create([
                    'user_id' => $pengajuan->user_id,
                    'tipe' => 'skoring_selesai',
                    'pesan' => "Penilaian skor inovasi '{$pengajuan->inovasi->nama_inovasi}' telah difinalisasi oleh Tim Penilai (Skor: {$skorFinal}).",
                    'link' => "/pengajuan-lomba/{$pengajuan->id}",
                ]);
            }
        });
    }
}
