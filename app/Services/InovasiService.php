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

    private function storageDir(int $inovasiId): string
    {
        return "inovasi/{$inovasiId}";
    }
}
