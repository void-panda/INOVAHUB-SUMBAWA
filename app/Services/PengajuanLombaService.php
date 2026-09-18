<?php

namespace App\Services;

use App\Enums\StatusPengajuan;
use App\Exceptions\InovasiStatusException;
use App\Models\Inovasi;
use App\Models\KelengkapanIndikator;
use App\Models\Notifikasi;
use App\Models\PengajuanLomba;
use App\Models\PenugasanPendamping;
use App\Models\PeriodeLomba;
use App\Models\SkorPengajuan;
use App\Models\User;
use App\Models\ValidasiLog;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PengajuanLombaService
{
    /**
     * Dapatkan informasi countdown tahapan pengumpulan lomba inovasi daerah.
     *
     * @return array{tahapan_nama: string, status: string, target_date: string, mulai: string, selesai: string, is_open: bool, periode_tahun: int}|null
     */
    public function getPengumpulanCountdown(?PeriodeLomba $periode = null): ?array
    {
        $targetPeriode = $periode ?? PeriodeLomba::where('aktif', true)->first();
        if (! $targetPeriode) {
            return null;
        }

        $now = now();
        $tahapanNama = 'Pengumpulan & Pendaftaran Inovasi';

        if ($targetPeriode->tanggal_mulai && $targetPeriode->tanggal_selesai) {
            $mulaiDate = \Carbon\Carbon::parse($targetPeriode->tanggal_mulai)->startOfDay();
            $selesaiDate = \Carbon\Carbon::parse($targetPeriode->tanggal_selesai)->endOfDay();
        } else {
            $linimasaRaw = DB::table('linimasa')
                ->where('periode_lomba_id', $targetPeriode->id)
                ->orderBy('mulai')
                ->get();

            $pengumpulanTahap = $linimasaRaw->first(function ($item) {
                $namaLower = strtolower($item->nama);
                return str_contains($namaLower, 'pengumpulan')
                    || str_contains($namaLower, 'pendaftaran')
                    || str_contains($namaLower, 'input profil');
            }) ?? $linimasaRaw->first();

            if (! $pengumpulanTahap) {
                return null;
            }

            $tahapanNama = $pengumpulanTahap->nama;
            $mulaiDate = \Carbon\Carbon::parse($pengumpulanTahap->mulai)->startOfDay();
            $selesaiDate = \Carbon\Carbon::parse($pengumpulanTahap->selesai)->endOfDay();
        }

        if ($now->lt($mulaiDate)) {
            $status = 'upcoming';
            $targetDate = $mulaiDate->toIso8601String();
        } elseif ($now->gt($selesaiDate)) {
            $status = 'closed';
            $targetDate = $selesaiDate->toIso8601String();
        } else {
            $status = 'active';
            $targetDate = $selesaiDate->toIso8601String();
        }

        return [
            'tahapan_nama' => $tahapanNama,
            'status' => $status,
            'target_date' => $targetDate,
            'mulai' => $mulaiDate->translatedFormat('d M Y'),
            'selesai' => $selesaiDate->translatedFormat('d M Y, 23:59') . ' WITA',
            'is_open' => $status === 'active',
            'periode_tahun' => (int) $targetPeriode->tahun,
        ];
    }

    /**
     * Daftarkan inovasi master ke periode lomba yang sedang aktif.
     */
    public function ajukanKeLomba(Inovasi $inovasi, User $user): PengajuanLomba
    {
        $periode = PeriodeLomba::where('aktif', true)->first();
        if (! $periode) {
            throw ValidationException::withMessages([
                'periode' => 'Tidak ada periode lomba yang sedang aktif saat ini.',
            ]);
        }

        $countdown = $this->getPengumpulanCountdown($periode);
        if ($countdown) {
            if ($countdown['status'] === 'closed') {
                throw ValidationException::withMessages([
                    'periode' => "Masa pengumpulan/pendaftaran inovasi untuk periode {$periode->nama} telah ditutup pada {$countdown['selesai']}.",
                ]);
            }
            if ($countdown['status'] === 'upcoming') {
                throw ValidationException::withMessages([
                    'periode' => "Masa pengumpulan inovasi untuk periode {$periode->nama} baru akan dibuka pada {$countdown['mulai']}.",
                ]);
            }
        }

        $exists = PengajuanLomba::where('inovasi_id', $inovasi->id)
            ->where('periode_lomba_id', $periode->id)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'inovasi' => 'Inovasi ini sudah terdaftar pada periode lomba tahun saat ini.',
            ]);
        }

        return DB::transaction(function () use ($inovasi, $user, $periode) {
            $pengajuan = PengajuanLomba::create([
                'inovasi_id' => $inovasi->id,
                'periode_lomba_id' => $periode->id,
                'user_id' => $user->id,
                'is_inovasi_daerah' => (bool) $inovasi->is_inovasi_daerah,
                'status' => StatusPengajuan::DalamPendampingan,
                'is_arsip' => false,
            ]);

            ValidasiLog::create([
                'inovasi_id' => $inovasi->id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $user->id,
                'status_sebelum' => 'draft',
                'status_sesudah' => StatusPengajuan::DalamPendampingan->value,
                'catatan' => "Inovasi diajukan ke Lomba Inovasi Daerah Periode {$periode->tahun}.",
            ]);

            // Beri notifikasi ke pendamping terkait
            $penugasan = PenugasanPendamping::where('periode_lomba_id', $periode->id)
                ->where(function (Builder $query) use ($inovasi, $user) {
                    if ($inovasi->opd_id) {
                        $query->where('opd_id', $inovasi->opd_id);
                    }
                    $query->orWhere('inovator_id', $user->id);
                })
                ->get();

            $pendampingIds = $penugasan->pluck('pendamping_id')->unique();
            if ($pendampingIds->isEmpty()) {
                $pendampingIds = User::role('pendamping')->pluck('id');
            }

            foreach ($pendampingIds as $pId) {
                Notifikasi::create([
                    'user_id' => $pId,
                    'tipe' => 'pengajuan_baru',
                    'pesan' => "Inovasi '{$inovasi->nama_inovasi}' diajukan ke lomba periode {$periode->tahun}.",
                    'link' => "/pengajuan-lomba/{$pengajuan->id}",
                ]);
            }

            return $pengajuan;
        });
    }

    /**
     * Tetapkan atau cabut status Inovasi Daerah (wewenang Tim Penilai / Bappeda).
     */
    public function tetapkanInovasiDaerah(PengajuanLomba $pengajuan, User $actor, bool $status = true): void
    {
        DB::transaction(function () use ($pengajuan, $actor, $status) {
            $statusVal = $pengajuan->status instanceof StatusPengajuan
                ? $pengajuan->status->value
                : (string) $pengajuan->status;

            $pengajuan->update(['is_inovasi_daerah' => $status]);
            $pengajuan->inovasi->update(['is_inovasi_daerah' => $status]);

            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $actor->id,
                'status_sebelum' => $statusVal,
                'status_sesudah' => $statusVal,
                'catatan' => $status
                    ? 'Ditetapkan sebagai Inovasi Daerah oleh Tim Penilai / Bappeda.'
                    : 'Status Inovasi Daerah dicabut.',
            ]);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'inovasi_daerah',
                'pesan' => $status
                    ? "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah ditetapkan sebagai Inovasi Daerah."
                    : "Status Inovasi Daerah untuk '{$pengajuan->inovasi->nama_inovasi}' telah diperbarui.",
                'link' => "/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Ajukan kembali inovasi dari arsip periode sebelumnya ke periode aktif saat ini.
     */
    public function ajukanKembali(PengajuanLomba $originalPengajuan, User $user, string $penjelasan): PengajuanLomba
    {
        $periode = PeriodeLomba::where('aktif', true)->first();
        if (! $periode) {
            throw ValidationException::withMessages([
                'periode' => 'Tidak ada periode lomba yang sedang aktif.',
            ]);
        }

        $exists = PengajuanLomba::where('inovasi_id', $originalPengajuan->inovasi_id)
            ->where('periode_lomba_id', $periode->id)
            ->exists();

        if ($exists) {
            throw ValidationException::withMessages([
                'inovasi' => 'Inovasi ini sudah terdaftar pada periode lomba tahun saat ini.',
            ]);
        }

        return DB::transaction(function () use ($originalPengajuan, $user, $periode, $penjelasan) {
            $newPengajuan = PengajuanLomba::create([
                'inovasi_id' => $originalPengajuan->inovasi_id,
                'periode_lomba_id' => $periode->id,
                'user_id' => $user->id,
                'is_inovasi_daerah' => (bool) $originalPengajuan->is_inovasi_daerah,
                'status' => StatusPengajuan::DalamPendampingan,
                'is_arsip' => false,
                'penjelasan_pengembangan' => $penjelasan,
                'pengajuan_asal_id' => $originalPengajuan->id,
                'estimasi_skor_kematangan' => $originalPengajuan->estimasi_skor_kematangan,
            ]);

            // Prefill skor indikator dari pengajuan sebelumnya
            $oldScores = SkorPengajuan::where('pengajuan_lomba_id', $originalPengajuan->id)->get();
            foreach ($oldScores as $s) {
                SkorPengajuan::create([
                    'pengajuan_lomba_id' => $newPengajuan->id,
                    'indikator_id' => $s->indikator_id,
                    'tier' => $s->tier,
                    'skor' => $s->skor,
                    'catatan' => $s->catatan,
                ]);
            }

            // Prefill kelengkapan indikator dari pengajuan sebelumnya
            $oldKelengkapan = KelengkapanIndikator::where('pengajuan_lomba_id', $originalPengajuan->id)->get();
            foreach ($oldKelengkapan as $k) {
                KelengkapanIndikator::create([
                    'pengajuan_lomba_id' => $newPengajuan->id,
                    'indikator_sid_id' => $k->indikator_sid_id,
                    'parameter' => $k->parameter,
                    'catatan' => $k->catatan,
                ]);
            }

            ValidasiLog::create([
                'inovasi_id' => $originalPengajuan->inovasi_id,
                'pengajuan_lomba_id' => $newPengajuan->id,
                'user_id' => $user->id,
                'status_sebelum' => 'arsip',
                'status_sesudah' => StatusPengajuan::DalamPendampingan->value,
                'catatan' => "Diajukan kembali dari arsip periode {$originalPengajuan->periodeLomba?->tahun}. Penjelasan: {$penjelasan}",
            ]);

            return $newPengajuan;
        });
    }

    /**
     * Kirim notifikasi 'Ping' ke pendamping tanpa mengubah status.
     */
    public function pingPendamping(PengajuanLomba $pengajuan, User $sender): void
    {
        $penugasan = PenugasanPendamping::where('periode_lomba_id', $pengajuan->periode_lomba_id)
            ->where(function (Builder $query) use ($pengajuan) {
                if ($pengajuan->inovasi->opd_id) {
                    $query->where('opd_id', $pengajuan->inovasi->opd_id);
                }
                $query->orWhere('inovator_id', $pengajuan->user_id);
            })
            ->get();

        $pendampingIds = $penugasan->pluck('pendamping_id')->unique();
        if ($pendampingIds->isEmpty()) {
            $pendampingIds = User::role('pendamping')->pluck('id');
        }

        foreach ($pendampingIds as $pId) {
            Notifikasi::create([
                'user_id' => $pId,
                'tipe' => 'ping_pendamping',
                'pesan' => "Inovator {$sender->name} meminta peninjauan dokumen indikator '{$pengajuan->inovasi->nama_inovasi}'.",
                'link' => "/pengajuan-lomba/{$pengajuan->id}/indikator",
            ]);
        }
    }

    /**
     * Rekomendasikan pengajuan dari Pendamping ke Kepala OPD.
     */
    public function rekomendasikanKeOpd(PengajuanLomba $pengajuan, User $pendamping, ?string $catatan = null): void
    {
        if ($pengajuan->status !== StatusPengajuan::DalamPendampingan) {
            throw new InovasiStatusException('Pengajuan hanya dapat direkomendasikan saat berstatus Dalam Pendampingan.', 422);
        }

        DB::transaction(function () use ($pengajuan, $pendamping, $catatan) {
            $sebelum = $pengajuan->status->value;
            $pengajuan->update(['status' => StatusPengajuan::DisahkanOpd]);

            ValidasiLog::create([
                'inovasi_id' => $pengajuan->inovasi_id,
                'pengajuan_lomba_id' => $pengajuan->id,
                'user_id' => $pendamping->id,
                'status_sebelum' => $sebelum,
                'status_sesudah' => StatusPengajuan::DisahkanOpd->value,
                'catatan' => $catatan ?? 'Direkomendasikan oleh Pendamping ke Kepala OPD.',
            ]);

            Notifikasi::create([
                'user_id' => $pengajuan->user_id,
                'tipe' => 'disahkan_opd',
                'pesan' => "Inovasi '{$pengajuan->inovasi->nama_inovasi}' telah direkomendasikan pendamping ke tahap pengesahan OPD.",
                'link' => "/pengajuan-lomba/{$pengajuan->id}",
            ]);
        });
    }

    /**
     * Arsipkan otomatis semua pengajuan yang terikat pada periode yang sudah tidak aktif.
     */
    public function arsipkanPeriodeLama(): int
    {
        $inactivePeriodeIds = PeriodeLomba::where('aktif', false)->pluck('id');

        return PengajuanLomba::whereIn('periode_lomba_id', $inactivePeriodeIds)
            ->where('is_arsip', false)
            ->update(['is_arsip' => true]);
    }
}
