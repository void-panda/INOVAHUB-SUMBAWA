<?php

namespace Tests\Feature;

use App\Enums\StatusPengajuan;
use App\Models\Inovasi;
use App\Models\Opd;
use App\Models\PengajuanLomba;
use App\Models\PenilaianJuri;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\OpdSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PenilaianJuriLombaTest extends TestCase
{
    use RefreshDatabase;

    public function test_multi_juri_scoring_and_status_flow(): void
    {
        $this->seed(RolePermissionSeeder::class);
        $this->seed(OpdSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $opd = Opd::first();
        $periode = PeriodeLomba::where('aktif', true)->firstOrFail();

        $inovator = User::factory()->create(['opd_id' => $opd?->id]);
        $inovator->assignRole('inovator');

        $juri1 = User::factory()->create(['name' => 'Juri Made']);
        $juri1->assignRole('tim_penilai');

        $juri2 = User::factory()->create(['name' => 'Juri Hamzan']);
        $juri2->assignRole('tim_penilai');

        // 1. Inovasi masih draft -> status "sedang_melengkapi_data"
        $inovasiDraft = Inovasi::create([
            'user_id' => $inovator->id,
            'opd_id' => $opd?->id,
            'nama_inovasi' => 'Inovasi Draft Belum Submit',
            'tahapan' => 'inisiatif',
            'nama_inisiator' => 'Pengusul Draft',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        $pengajuanDraft = PengajuanLomba::create([
            'inovasi_id' => $inovasiDraft->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::Draft,
        ]);

        // Juri 1 mengecek index
        $res = $this->actingAs($juri1)->get(route('penilai.skoring.index'));
        $res->assertOk();
        $items = $res->viewData('page')['props']['inovasi']['data'];
        $itemDraft = collect($items)->firstWhere('id', $pengajuanDraft->id);
        $this->assertSame('sedang_melengkapi_data', $itemDraft['status_juri']);

        // 2. Inovasi sudah disubmit lomba -> status "sudah_submit" bagi Juri 1 & Juri 2
        $inovasiSubmitted = Inovasi::create([
            'user_id' => $inovator->id,
            'opd_id' => $opd?->id,
            'nama_inovasi' => 'Inovasi Siap Dinilai Juri',
            'tahapan' => 'penerapan',
            'nama_inisiator' => 'Tim Inovator',
            'koordinat' => '-8.4,117.4',
            'waktu_penerapan' => '2026-03-01',
            'is_inovasi_daerah' => true,
            'status' => 'diajukan',
        ]);

        $pengajuanSubmitted = PengajuanLomba::create([
            'inovasi_id' => $inovasiSubmitted->id,
            'periode_lomba_id' => $periode->id,
            'user_id' => $inovator->id,
            'status' => StatusPengajuan::DisahkanOpd,
        ]);

        // Juri 1 melihat inovasi sudah submit tapi belum dia nilai
        $res = $this->actingAs($juri1)->get(route('penilai.skoring.index'));
        $items = $res->viewData('page')['props']['inovasi']['data'];
        $itemSubmitted = collect($items)->firstWhere('id', $pengajuanSubmitted->id);
        $this->assertSame('sudah_submit', $itemSubmitted['status_juri']);
        $this->assertNull($itemSubmitted['nilai_saya']);

        // 3. Juri 1 memberikan nilai (80.0) dan catatan
        $this->actingAs($juri1)->post(route('penilai.skoring.nilai.store', $pengajuanSubmitted), [
            'nilai' => 80.0,
            'catatan' => 'Inovasi sangat baik dan aplikatif.',
        ])->assertRedirect();

        $this->assertDatabaseHas('penilaian_juri', [
            'pengajuan_lomba_id' => $pengajuanSubmitted->id,
            'juri_id' => $juri1->id,
            'nilai' => 80.0,
        ]);

        // Juri 1 sekarang melihat statusnya "sudah_dinilai"
        $resJuri1 = $this->actingAs($juri1)->get(route('penilai.skoring.index'));
        $itemsJuri1 = $resJuri1->viewData('page')['props']['inovasi']['data'];
        $itemJuri1 = collect($itemsJuri1)->firstWhere('id', $pengajuanSubmitted->id);
        $this->assertSame('sudah_dinilai', $itemJuri1['status_juri']);
        $this->assertEquals(80.0, $itemJuri1['nilai_saya']);
        $this->assertEquals(80.0, $itemJuri1['nilai_rata_rata']);
        $this->assertEquals(1, $itemJuri1['jumlah_juri_menilai']);

        // Bagi Juri 2 yang belum menilai, statusnya masih "sudah_submit"
        $resJuri2 = $this->actingAs($juri2)->get(route('penilai.skoring.index'));
        $itemsJuri2 = $resJuri2->viewData('page')['props']['inovasi']['data'];
        $itemJuri2 = collect($itemsJuri2)->firstWhere('id', $pengajuanSubmitted->id);
        $this->assertSame('sudah_submit', $itemJuri2['status_juri']);
        $this->assertNull($itemJuri2['nilai_saya']);

        // 4. Juri 2 memberikan nilai (90.0)
        $this->actingAs($juri2)->post(route('penilai.skoring.nilai.store', $pengajuanSubmitted), [
            'nilai' => 90.0,
            'catatan' => 'Sangat relevan dengan kebutuhan daerah.',
        ])->assertRedirect();

        // Rata-rata nilai akhir: (80 + 90) / 2 = 85.0
        $pengajuanFresh = $pengajuanSubmitted->fresh();
        $this->assertEquals(85.0, $pengajuanFresh->nilai_rata_rata_juri);
        $this->assertEquals(2, $pengajuanFresh->jumlah_juri_menilai);

        // 5. Juri 1 mengedit nilainya menjadi 86.0
        $this->actingAs($juri1)->post(route('penilai.skoring.nilai.store', $pengajuanSubmitted), [
            'nilai' => 86.0,
            'catatan' => 'Revisi nilai setelah mendengarkan presentasi.',
        ])->assertRedirect();

        // Database tetap 2 record penilaian, tidak duplikat
        $this->assertEquals(2, PenilaianJuri::where('pengajuan_lomba_id', $pengajuanSubmitted->id)->count());

        // Rata-rata baru: (86 + 90) / 2 = 88.0
        $this->assertEquals(88.0, $pengajuanSubmitted->fresh()->nilai_rata_rata_juri);

        // 6. Cek halaman show detail
        $resShow = $this->actingAs($juri1)->get(route('penilai.skoring.show', $pengajuanSubmitted));
        $resShow->assertOk();
        $daftarPenilaian = $resShow->viewData('page')['props']['daftarPenilaianJuri'];
        $this->assertCount(2, $daftarPenilaian);
    }
}
