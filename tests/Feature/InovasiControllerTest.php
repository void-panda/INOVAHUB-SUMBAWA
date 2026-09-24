<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\InovasiDokumen;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InovasiControllerTest extends TestCase
{
    use RefreshDatabase;

    private function inovator(): User
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('inovator');

        return $user;
    }

    public function test_inovator_can_store_master_inovasi(): void
    {
        $user = $this->inovator();

        $this->actingAs($user)->post(route('inovasi.store'), [
            'nama_inovasi' => 'Sistem Pelayanan Terpadu Digital',
            'tahapan' => 'penerapan',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'tematik' => 'digitalisasi',
            'kriteria_inovasi' => 'kriteria_3',
            'nama_inisiator' => 'Dinas Kominfo',
            'koordinat' => '-8.4931,117.4193',
            'lokasi' => 'Kecamatan Sumbawa',
            'urusan_utama' => 'Komunikasi dan Informatika',
            'urusan_wajib' => ['Pendidikan'],
            'waktu_penerapan' => '2026-03-01',
            'anggaran_sebelum' => 100000000,
            'anggaran_sesudah' => 50000000,
            'is_penghargaan' => true,
            'nama_penghargaan' => 'Top 45 KIPP 2024',
            'rancang_bangun' => 'Narasi rancang bangun lengkap minimal 300 kata untuk inovasi daerah.',
            'tujuan' => 'Tujuan inovasi',
            'manfaat' => 'Manfaat inovasi',
            'hasil_inovasi' => 'Hasil nyata inovasi',
        ])->assertRedirect();

        $inovasi = Inovasi::where('nama_inovasi', 'Sistem Pelayanan Terpadu Digital')->first();
        $this->assertNotNull($inovasi);
        $this->assertSame($user->id, $inovasi->user_id);
        $this->assertSame('Pendidikan', $inovasi->urusan_wajib);
        $this->assertSame('pelayanan_publik', $inovasi->bentuk_inovasi);
        $this->assertSame('digital', $inovasi->jenis_inovasi);
        $this->assertSame('tematik', $inovasi->klasifikasi);
        $this->assertSame('digitalisasi', $inovasi->tematik);
        $this->assertSame('kriteria_3', $inovasi->kriteria_inovasi);
        $this->assertTrue($inovasi->is_penghargaan);
        $this->assertSame('Top 45 KIPP 2024', $inovasi->nama_penghargaan);
        $this->assertSame('Tujuan inovasi', $inovasi->tujuan);
    }

    public function test_novel_user_cannot_edit_others_inovasi(): void
    {
        $owner = $this->inovator();
        $other = User::factory()->create();
        $other->assignRole('inovator');

        $this->actingAs($owner)->post(route('inovasi.store'), [
            'nama_inovasi' => 'Inovasi Rahasia',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Dinas Sehat',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-05-01',
        ])->assertRedirect();

        $inovasi = Inovasi::where('nama_inovasi', 'Inovasi Rahasia')->first();

        $this->actingAs($other)
            ->get(route('inovasi.edit', ['inovasi' => $inovasi->id]))
            ->assertForbidden();
    }

    public function test_non_inovator_cannot_create_inovasi(): void
    {
        $this->seed(RolePermissionSeeder::class);

        $pimpinan = User::factory()->create();
        $pimpinan->assignRole('pimpinan');

        $response = $this->actingAs($pimpinan)
            ->get(route('inovasi.create'));

        $this->assertTrue(in_array($response->getStatusCode(), [403, 302], true));
    }

    public function test_inovator_can_update_master_and_upload_dokumen(): void
    {
        $user = $this->inovator();

        $this->actingAs($user)->post(route('inovasi.store'), [
            'nama_inovasi' => 'Inovasi Update',
            'tahapan' => 'ujicoba',
            'nama_inisiator' => 'Dinas Sehat',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-04-01',
        ])->assertRedirect();

        $inovasi = Inovasi::where('nama_inovasi', 'Inovasi Update')->firstOrFail();

        $this->actingAs($user)->put(route('inovasi.update', $inovasi), [
            'nama_inovasi' => 'Inovasi Update v2',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Dinas Sehat',
            'koordinat' => '-8.4,117.4',
            'urusan_utama' => 'Komunikasi dan Informatika',
            'waktu_penerapan' => '2026-06-01',
        ])->assertRedirect();

        $this->assertSame('Inovasi Update v2', $inovasi->fresh()->nama_inovasi);
        $this->assertSame('penerapan', $inovasi->fresh()->tahapan);

        $file = UploadedFile::fake()->create('proposal.pdf', 100);

        $this->actingAs($user)->post(route('inovasi.dokumen.store', $inovasi), [
            'dokumen' => [$file],
        ])->assertRedirect();

        $this->assertDatabaseCount('inovasi_dokumen', 1);
        $this->assertDatabaseHas('inovasi_dokumen', [
            'inovasi_id' => $inovasi->id,
            'nama_asal' => 'proposal.pdf',
        ]);
    }

    public function test_inovator_masyarakat_can_store_inovasi_with_simplified_fields(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $masyarakat = User::factory()->masyarakat()->create();
        $masyarakat->assignRole('inovator');

        $this->actingAs($masyarakat)->post(route('inovasi.store'), [
            'nama_inovasi' => 'Alat Perangkap Hama Berbasis Surya',
            'inisiator' => 'masyarakat',
            'nama_inisiator' => 'Kelompok Tani Harapan Jaya',
            'tahapan' => 'penerapan',
            'bentuk_inovasi' => 'lainnya',
            'jenis_inovasi' => 'non_digital',
            'koordinat' => '-8.5037, 117.4241',
            'lokasi' => 'Desa Moyo Hilir, Kec. Moyo Hilir',
            'waktu_penerapan' => '2026-02-15',
            'rancang_bangun' => 'Inovasi perangkap hama tenaga surya yang dikembangkan secara swadaya untuk menghemat pestisida...',
        ])->assertRedirect();

        $inovasi = Inovasi::where('nama_inovasi', 'Alat Perangkap Hama Berbasis Surya')->first();
        $this->assertNotNull($inovasi);
        $this->assertSame($masyarakat->id, $inovasi->user_id);
        $this->assertSame('masyarakat', $inovasi->inisiator);
        $this->assertSame('Kelompok Tani Harapan Jaya', $inovasi->nama_inisiator);
        $this->assertSame('Desa Moyo Hilir, Kec. Moyo Hilir', $inovasi->lokasi);
        $this->assertSame('non_tematik', $inovasi->klasifikasi);
        $this->assertNull($inovasi->urusan_utama);
    }

    public function test_create_and_edit_pass_tipe_inovator_prop(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $dinas = User::factory()->create(['tipe_inovator' => 'dinas']);
        $dinas->assignRole('inovator');

        $masyarakat = User::factory()->masyarakat()->create();
        $masyarakat->assignRole('inovator');

        // Test create page for dinas
        $this->actingAs($dinas)
            ->get(route('inovasi.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('inovasi/create')
                ->where('tipeInovator', 'dinas')
            );

        // Test create page for masyarakat
        $this->actingAs($masyarakat)
            ->get(route('inovasi.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('inovasi/create')
                ->where('tipeInovator', 'masyarakat')
            );
    }

    public function test_pendamping_can_download_and_preview_dokumen(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $inovator = User::factory()->create();
        $inovator->assignRole('inovator');

        $pendamping = User::factory()->create();
        $pendamping->assignRole('pendamping');

        Storage::fake('local');
        $file = UploadedFile::fake()->create('pedoman.pdf', 100);
        $path = $file->store('dokumen_inovasi', 'local');

        $inovasi = Inovasi::create([
            'nama_inovasi' => 'Inovasi Uji Dokumen',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Inovator Kominfo',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);
        $dokumen = InovasiDokumen::create([
            'inovasi_id' => $inovasi->id,
            'nama_asal' => 'pedoman.pdf',
            'path' => $path,
            'mime' => 'application/pdf',
            'ukuran' => 102400,
            'jenis' => 'dokumen-dukung',
        ]);

        $this->actingAs($pendamping)
            ->get(route('inovasi.dokumen.download', $dokumen))
            ->assertOk();

        $this->actingAs($pendamping)
            ->get(route('inovasi.dokumen.preview', $dokumen))
            ->assertOk();
    }

    public function test_inovator_can_view_bank_inovasi_biasa_and_inovasi_daerah_separately(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $inovator = User::factory()->create();
        $inovator->assignRole('inovator');

        // 1. Inovasi Biasa (is_inovasi_daerah = false)
        Inovasi::create([
            'nama_inovasi' => 'Inovasi Biasa Contoh',
            'tahapan' => 'inisiatif',
            'nama_inisiator' => 'Inisiator Biasa',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => false,
        ]);

        // 2. Inovasi Daerah (is_inovasi_daerah = true)
        Inovasi::create([
            'nama_inovasi' => 'Inovasi Daerah Resmi',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Inisiator Daerah',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'user_id' => $inovator->id,
            'is_inovasi_daerah' => true,
        ]);

        // Test /inovasi only returns inovasi biasa (count 1)
        $this->actingAs($inovator)
            ->get(route('inovasi.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('inovasi/index')
                ->has('inovasi.data', 1)
                ->where('inovasi.data.0.nama_inovasi', 'Inovasi Biasa Contoh')
            );

        // Test /inovasi-daerah only returns inovasi daerah (count 1)
        $this->actingAs($inovator)
            ->get(route('inovasi.daerah'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('inovasi/daerah')
                ->has('inovasi.data', 1)
                ->where('inovasi.data.0.nama_inovasi', 'Inovasi Daerah Resmi')
            );

        // Test Tim Penilai can also view all inovasi daerah
        $penilai = User::factory()->create();
        $penilai->assignRole('tim_penilai');

        $this->actingAs($penilai)
            ->get(route('inovasi.daerah'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('inovasi/daerah')
                ->has('inovasi.data', 1)
                ->where('inovasi.data.0.nama_inovasi', 'Inovasi Daerah Resmi')
            );
    }

    public function test_inovator_can_submit_inovasi_to_lomba(): void
    {
        $user = $this->inovator();

        $inovasi = Inovasi::create([
            'user_id' => $user->id,
            'nama_inovasi' => 'Inovasi Siap Lomba',
            'tahapan' => 'penerapan',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'non_digital',
            'klasifikasi' => 'non_tematik',
            'nama_inisiator' => 'Pemberdayaan Masyarakat',
            'koordinat' => '-8.4931,117.4193',
            'waktu_penerapan' => '2026-01-01',
        ]);

        $this->actingAs($user)
            ->post(route('inovasi.submit', $inovasi))
            ->assertRedirect(route('pengajuan-lomba.index'));

        $this->assertDatabaseHas('pengajuan_lomba', [
            'inovasi_id' => $inovasi->id,
            'status' => 'dalam_pendampingan',
        ]);
    }
}
