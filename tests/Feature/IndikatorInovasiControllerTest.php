<?php

namespace Tests\Feature;

use App\Enums\StatusPengajuan;
use App\Models\IndikatorSid;
use App\Models\Inovasi;
use App\Models\InovasiDokumen;
use App\Models\KelengkapanIndikator;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use App\Mail\InovasiDiperiksaMail;
use Database\Seeders\IndikatorSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class IndikatorInovasiControllerTest extends TestCase
{
    use RefreshDatabase;

    private function setupUserAndPengajuan(): array
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);
        $this->seed(IndikatorSeeder::class);

        $user = User::factory()->create();
        $user->assignRole('inovator');

        $pendamping = User::factory()->create();
        $pendamping->assignRole('pendamping');

        $periode = PeriodeLomba::where('aktif', true)->first();

        $inovasi = Inovasi::create([
            'user_id' => $user->id,
            'nama_inovasi' => 'SI-INOVASI KABUPATEN SUMBAWA',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Bappeda Sumbawa',
            'koordinat' => '-8.4931,117.4193',
            'urusan_utama' => 'Komunikasi dan Informatika',
            'waktu_penerapan' => '2026-01-01',
            'is_inovasi_daerah' => true,
        ]);

        $pengajuan = PengajuanLomba::create([
            'inovasi_id' => $inovasi->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $user->id,
            'is_inovasi_daerah' => true,
            'status' => StatusPengajuan::DalamPendampingan,
            'is_arsip' => false,
        ]);

        return [$user, $pengajuan, $pendamping];
    }

    public function test_inovator_can_view_kelengkapan_indikator_page(): void
    {
        [$user, $pengajuan] = $this->setupUserAndPengajuan();

        $response = $this->actingAs($user)->get(route('pengajuan-lomba.indikator.index', $pengajuan));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('inovasi/indikator/index')
            ->has('indikatorList', 20)
            ->has('progress')
            ->has('skorEstimasi')
        );
    }

    public function test_inovator_can_update_parameter_for_indikator(): void
    {
        [$user, $pengajuan] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        $response = $this->actingAs($user)->post(
            route('pengajuan-lomba.indikator.parameter.update', [$pengajuan, $indikator]),
            [
                'parameter' => 'p2',
                'catatan' => 'Ditetapkan dengan SK Bupati Sumbawa No. 123/2026',
            ]
        );

        $response->assertRedirect();

        $this->assertDatabaseHas('kelengkapan_indikator', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_sid_id' => $indikator->id,
            'parameter' => 'p2',
            'catatan' => 'Ditetapkan dengan SK Bupati Sumbawa No. 123/2026',
        ]);
    }

    public function test_inovator_can_update_parameter_with_dynamic_options_and_score_is_calculated(): void
    {
        [$user, $pengajuan] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        // Configure dynamic options on indikator
        $indikator->update([
            'opsi' => [
                ['id' => 'opt_sub_1', 'label' => 'Memenuhi 1 atau 2 unsur', 'bobot' => 1.5],
                ['id' => 'opt_sub_2', 'label' => 'Memenuhi 3 atau 4 unsur', 'bobot' => 2.5],
            ],
        ]);

        // Choose opt_sub_2
        $response = $this->actingAs($user)->post(
            route('pengajuan-lomba.indikator.parameter.update', [$pengajuan, $indikator]),
            [
                'parameter' => 'opt_sub_2',
                'catatan' => 'Telah memenuhi unsur substansi lengkap.',
            ]
        );

        $response->assertRedirect();

        $this->assertDatabaseHas('kelengkapan_indikator', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_sid_id' => $indikator->id,
            'parameter' => 'opt_sub_2',
        ]);

        // Verify index calculation: pure points without multiplier
        $indexResponse = $this->actingAs($user)->get(route('pengajuan-lomba.indikator.index', $pengajuan));
        $indexResponse->assertOk();
        $expectedSkor = 2.5;
        $indexResponse->assertInertia(fn ($page) => $page
            ->where('skorEstimasi', $expectedSkor)
        );
    }

    public function test_pendamping_can_update_inline_komentar(): void
    {
        [, $pengajuan, $pendamping] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        $this->actingAs($pendamping)->post(
            route('pengajuan-lomba.indikator.komentar.update', [$pengajuan, $indikator]),
            [
                'komentar_pendamping' => 'Perlu lampirkan SK Bupati yang bertanda tangan lengkap.',
            ]
        )->assertRedirect();

        $this->assertDatabaseHas('skor_pengajuan', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_id' => $indikator->id,
            'komentar_pendamping' => 'Perlu lampirkan SK Bupati yang bertanda tangan lengkap.',
            'pendamping_id' => $pendamping->id,
        ]);
    }

    public function test_pendamping_can_update_inline_komentar_with_status_validasi(): void
    {
        [, $pengajuan, $pendamping] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        // 1. Valid status
        $this->actingAs($pendamping)->post(
            route('pengajuan-lomba.indikator.komentar.update', [$pengajuan, $indikator]),
            [
                'status_validasi' => 'valid',
                'komentar_pendamping' => 'Dokumen sudah sesuai dan terverifikasi.',
            ]
        )->assertRedirect();

        $this->assertDatabaseHas('skor_pengajuan', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_id' => $indikator->id,
            'status_validasi' => 'valid',
            'komentar_pendamping' => 'Dokumen sudah sesuai dan terverifikasi.',
        ]);

        // 2. Perlu revisi requires komentar
        $this->actingAs($pendamping)->post(
            route('pengajuan-lomba.indikator.komentar.update', [$pengajuan, $indikator]),
            [
                'status_validasi' => 'perlu_revisi',
                'komentar_pendamping' => '',
            ]
        )->assertSessionHasErrors('komentar_pendamping');

        // 3. Perlu revisi with komentar succeeds
        $this->actingAs($pendamping)->post(
            route('pengajuan-lomba.indikator.komentar.update', [$pengajuan, $indikator]),
            [
                'status_validasi' => 'perlu_revisi',
                'komentar_pendamping' => 'Mohon unggah dokumen SK yang bertanda tangan basah.',
            ]
        )->assertRedirect();

        $this->assertDatabaseHas('skor_pengajuan', [
            'pengajuan_lomba_id' => $pengajuan->id,
            'indikator_id' => $indikator->id,
            'status_validasi' => 'perlu_revisi',
            'komentar_pendamping' => 'Mohon unggah dokumen SK yang bertanda tangan basah.',
        ]);
    }

    public function test_inovator_can_view_dokumen_indikator_page(): void
    {
        [$user, $pengajuan] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        $response = $this->actingAs($user)->get(
            route('pengajuan-lomba.indikator.dokumen.index', [$pengajuan, $indikator])
        );

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('inovasi/indikator/dokumen')
            ->has('indikator')
            ->has('dokumenList')
        );
    }

    public function test_inovator_can_upload_and_delete_dokumen_for_indikator(): void
    {
        Storage::fake('local');
        [$user, $pengajuan] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        $file = UploadedFile::fake()->create('sk_bupati.pdf', 500, 'application/pdf');

        $response = $this->actingAs($user)->post(
            route('pengajuan-lomba.indikator.dokumen.store', [$pengajuan, $indikator]),
            [
                'nomor_surat' => '050/01/2026',
                'tanggal_surat' => '2026-01-15',
                'tentang' => 'Penetapan Inovasi Pelayanan Publik',
                'dokumen' => [$file],
            ]
        );

        $response->assertRedirect();

        $dokumen = InovasiDokumen::where('pengajuan_lomba_id', $pengajuan->id)
            ->where('indikator_sid_id', $indikator->id)
            ->first();

        $this->assertNotNull($dokumen);
        $this->assertSame('sk_bupati.pdf', $dokumen->nama_asal);
        $this->assertSame('050/01/2026', $dokumen->nomor_surat);

        // Hapus dokumen
        $deleteResponse = $this->actingAs($user)->delete(
            route('pengajuan-lomba.indikator.dokumen.destroy', [$pengajuan, $dokumen])
        );

        $deleteResponse->assertRedirect();
        $this->assertDatabaseMissing('inovasi_dokumen', ['id' => $dokumen->id]);
    }

    public function test_inovator_cannot_modify_parameter_when_pengajuan_is_locked(): void
    {
        [$user, $pengajuan] = $this->setupUserAndPengajuan();
        $indikator = IndikatorSid::where('kode', 'SID-01')->first();

        $pengajuan->update(['status' => StatusPengajuan::DisahkanOpd]);

        $response = $this->actingAs($user)->post(
            route('pengajuan-lomba.indikator.parameter.update', [$pengajuan, $indikator]),
            [
                'parameter' => 'p3',
            ]
        );

        $response->assertForbidden();
    }

    public function test_pendamping_can_send_examination_notification_to_innovator(): void
    {
        Mail::fake();

        [$user, $pengajuan] = $this->setupUserAndPengajuan();

        $pendamping = User::factory()->create();
        $pendamping->assignRole('pendamping');

        $response = $this->actingAs($pendamping)->post(
            route('pengajuan-lomba.indikator.kirim-notifikasi', $pengajuan)
        );

        $response->assertRedirect();
        $response->assertSessionHas('success');

        // Verify Mail sent to innovator
        Mail::assertSent(InovasiDiperiksaMail::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });

        // Verify In-App Notifikasi created
        $this->assertDatabaseHas('notifikasi', [
            'user_id' => $user->id,
            'tipe' => 'pemeriksaan_indikator',
            'link' => "/pengajuan-lomba/{$pengajuan->id}/indikator",
        ]);
    }

    public function test_inovator_cannot_send_examination_notification(): void
    {
        Mail::fake();

        [$user, $pengajuan] = $this->setupUserAndPengajuan();

        $response = $this->actingAs($user)->post(
            route('pengajuan-lomba.indikator.kirim-notifikasi', $pengajuan)
        );

        $response->assertForbidden();
        Mail::assertNothingSent();
    }
}
