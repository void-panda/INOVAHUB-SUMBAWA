<?php

namespace App\Services;

use App\DTOs\InovasiData;
use App\Models\Inovasi;
use App\Models\InovasiDokumen;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class InovasiService
{
    /**
     * Buat data master inovasi baru beserta pengunggahan file pendukung profil.
     *
     * @param  UploadedFile[]  $files
     */
    public function createDraft(User $user, InovasiData $dto, array $files = []): Inovasi
    {
        return DB::transaction(function () use ($user, $dto, $files) {
            $data = $dto->toArray();

            /** @var Inovasi $inovasi */
            $inovasi = $user->inovasi()->create($data);

            if (! empty($files)) {
                $this->saveFiles($inovasi, $files);
            }

            return $inovasi;
        });
    }

    /**
     * Perbarui data master inovasi.
     *
     * @param  UploadedFile[]  $files
     */
    public function updateDraft(Inovasi $inovasi, InovasiData $dto, array $files = []): Inovasi
    {
        return DB::transaction(function () use ($inovasi, $dto, $files) {
            $inovasi->update($dto->toArray());

            if (! empty($files)) {
                $this->saveFiles($inovasi, $files);
            }

            return $inovasi;
        });
    }

    /**
     * Hapus master inovasi beserta seluruh file terkait.
     */
    public function deleteDraft(Inovasi $inovasi): void
    {
        DB::transaction(function () use ($inovasi) {
            Storage::disk('local')->deleteDirectory($this->storageDir($inovasi->id));
            $inovasi->delete();
        });
    }

    /**
     * Unggah berkas pendukung profil umum.
     *
     * @param  UploadedFile[]  $files
     */
    public function uploadFiles(Inovasi $inovasi, array $files, string $jenis = 'dokumen-dukung'): void
    {
        $this->saveFiles($inovasi, $files, $jenis);
    }

    /**
     * Unggah berkas pendukung yang ditautkan ke indikator SID tertentu.
     *
     * @param  UploadedFile[]  $files
     */
    public function uploadFilesForIndikator(
        Inovasi $inovasi,
        array $files,
        int $indikatorSidId,
        string $jenis = 'dokumen-dukung',
        ?string $nomorSurat = null,
        ?string $tanggalSurat = null,
        ?string $tentang = null,
        ?int $pengajuanLombaId = null
    ): void {
        foreach ($files as $file) {
            $path = $file->storeAs(
                $this->storageDir($inovasi->id),
                uniqid().'.'.$file->getClientOriginalExtension(),
                'local',
            );

            $inovasi->dokumen()->create([
                'pengajuan_lomba_id' => $pengajuanLombaId,
                'indikator_sid_id' => $indikatorSidId,
                'nomor_surat' => $nomorSurat,
                'tanggal_surat' => $tanggalSurat,
                'tentang' => $tentang,
                'jenis' => $jenis,
                'path' => $path,
                'nama_asal' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'ukuran' => $file->getSize(),
            ]);
        }
    }

    /**
     * Tambah link video dokumentasi (Google Drive, YouTube, dll).
     */
    public function addVideoLink(Inovasi $inovasi, string $url, ?string $namaVideo = null): void
    {
        $inovasi->dokumen()->create([
            'jenis' => 'video',
            'path' => $url,
            'nama_asal' => $namaVideo ?: $url,
            'mime' => 'url',
            'ukuran' => 0,
        ]);
    }

    /**
     * Tambah link postingan media sosial (Instagram, TikTok, YouTube, dll).
     */
    public function addMedsosLink(Inovasi $inovasi, string $url): void
    {
        $inovasi->dokumen()->create([
            'jenis' => 'medsos',
            'path' => $url,
            'nama_asal' => $url,
            'mime' => 'url',
            'ukuran' => 0,
        ]);
    }

    /**
     * Hapus satu dokumen pendukung.
     */
    public function deleteDokumen(InovasiDokumen $dokumen): void
    {
        if ($dokumen->mime !== 'url' && Storage::disk('local')->exists($dokumen->path)) {
            Storage::disk('local')->delete($dokumen->path);
        }
        $dokumen->delete();
    }

    /**
     * @param  UploadedFile[]  $files
     */
    private function saveFiles(Inovasi $inovasi, array $files, string $jenis = 'dokumen-dukung'): void
    {
        foreach ($files as $file) {
            $path = $file->storeAs(
                $this->storageDir($inovasi->id),
                uniqid().'.'.$file->getClientOriginalExtension(),
                'local',
            );

            $inovasi->dokumen()->create([
                'jenis' => $jenis,
                'path' => $path,
                'nama_asal' => $file->getClientOriginalName(),
                'mime' => $file->getMimeType(),
                'ukuran' => $file->getSize(),
            ]);
        }
    }

    /**
     * Susun metadata dokumen per indikator SID (jumlah, jenis/ekstensi, waktu update terakhir).
     *
     * @param  iterable<\App\Models\InovasiDokumen>  $dokumenList
     * @return array<int, array{count: int, types: string[], last_updated: ?string}>
     */
    public function hitungDokumenInfo(iterable $dokumenList): array
    {
        $dokumenInfo = [];
        $dokumenLastUpdated = [];

        foreach ($dokumenList as $dok) {
            $indId = $dok->indikator_sid_id;
            if (! $indId) {
                continue;
            }

            if (! isset($dokumenInfo[$indId])) {
                $dokumenInfo[$indId] = [
                    'count' => 0,
                    'types' => [],
                    'last_updated' => null,
                ];
                $dokumenLastUpdated[$indId] = null;
            }
            $dokumenInfo[$indId]['count']++;

            $dokTime = $dok->updated_at ?? $dok->created_at;
            if ($dokTime && ($dokumenLastUpdated[$indId] === null || $dokTime->gt($dokumenLastUpdated[$indId]))) {
                $dokumenLastUpdated[$indId] = $dokTime;
                $dokumenInfo[$indId]['last_updated'] = $dokTime->toIso8601String();
            }

            $ext = strtoupper(pathinfo((string) $dok->nama_asal, PATHINFO_EXTENSION));
            if ($dok->mime === 'url' || $dok->jenis === 'video') {
                $ext = 'Link/Video';
            } elseif (! $ext) {
                $ext = 'Berkas';
            }

            if (! in_array($ext, $dokumenInfo[$indId]['types'], true)) {
                $dokumenInfo[$indId]['types'][] = $ext;
            }
        }

        return $dokumenInfo;
    }

    /**
     * Hitung progres kelengkapan dan estimasi skor SID kematangan.
     *
     * @param  iterable<\App\Models\IndikatorSid>  $indikatorList
     * @param  \Illuminate\Support\Collection<int, \App\Models\KelengkapanIndikator>  $kelengkapanMap
     * @return array{filled: int, total: int, persen: int, skorEstimasi: float}
     */
    public function hitungSkorEstimasiDanProgres(iterable $indikatorList, $kelengkapanMap): array
    {
        $filled = $kelengkapanMap->filter(fn ($k) => $k->parameter !== null && $k->parameter !== '')->count();
        $totalIndikator = is_countable($indikatorList) ? count($indikatorList) : 0;

        $skorEstimasi = 0.0;
        foreach ($indikatorList as $ind) {
            $kel = $kelengkapanMap->get($ind->id);
            if ($kel && $kel->parameter) {
                $opsiList = $ind->opsi_list;
                $matchingOpsi = collect($opsiList)->firstWhere('id', $kel->parameter);
                if ($matchingOpsi && isset($matchingOpsi['bobot'])) {
                    $skorEstimasi += (float) $matchingOpsi['bobot'];
                } else {
                    $tierMap = ['p1' => 1, 'p2' => 2, 'p3' => 3];
                    $tier = $tierMap[strtolower($kel->parameter)] ?? 0;
                    $skorEstimasi += $tier;
                }
            }
        }

        return [
            'filled' => $filled,
            'total' => $totalIndikator,
            'persen' => $totalIndikator > 0 ? (int) round(($filled / $totalIndikator) * 100) : 0,
            'skorEstimasi' => round($skorEstimasi, 2),
        ];
    }

    private function storageDir(int $inovasiId): string
    {
        return "inovasi/{$inovasiId}";
    }
}

