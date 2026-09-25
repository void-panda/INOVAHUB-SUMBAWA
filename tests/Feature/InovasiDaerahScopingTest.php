<?php

namespace Tests\Feature;

use App\Models\Inovasi;
use App\Models\PengajuanLomba;
use App\Models\PeriodeLomba;
use App\Models\User;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class InovasiDaerahScopingTest extends TestCase
{
    use RefreshDatabase;

    private PeriodeLomba $periode;
    private User $inovatorA;
    private User $inovatorB;
    private User $timPenilai;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolePermissionSeeder::class);
        $this->seed(PeriodeSeeder::class);

        $this->periode = PeriodeLomba::where('aktif', true)->first();

        $this->inovatorA = User::factory()->create(['name' => 'Inovator A']);
        $this->inovatorA->assignRole('inovator');

        $this->inovatorB = User::factory()->create(['name' => 'Inovator B']);
        $this->inovatorB->assignRole('inovator');

        $this->timPenilai = User::factory()->create(['name' => 'Tim Penilai']);
        $this->timPenilai->assignRole('tim_penilai');
    }

    private function createInovasi(User $user, string $nama, bool $isDaerah = true): Inovasi
    {
        return Inovasi::create([
            'user_id' => $user->id,
            'is_inovasi_daerah' => $isDaerah,
            'nama_inovasi' => $nama,
            'tahapan' => 'penerapan',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'nama_inisiator' => 'Inisiator Test',
            'koordinat' => '-8.5000, 117.4000',
            'waktu_penerapan' => '2024-01-01',
            'rancang_bangun' => 'Rancang bangun pengujian sistem inovasi daerah.',
            'tujuan' => 'Tujuan inovasi pengujian.',
            'manfaat' => 'Manfaat inovasi pengujian.',
        ]);
    }

    public function test_inovator_only_sees_their_own_inovasi_daerah(): void
    {
        // Inovasi Daerah milik Inovator A
        $invA = $this->createInovasi($this->inovatorA, 'Inovasi Daerah A', true);
        PengajuanLomba::create([
            'inovasi_id' => $invA->id,
            'user_id' => $this->inovatorA->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        // Inovasi Daerah milik Inovator B
        $invB = $this->createInovasi($this->inovatorB, 'Inovasi Daerah B', true);
        PengajuanLomba::create([
            'inovasi_id' => $invB->id,
            'user_id' => $this->inovatorB->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        // Inovasi Biasa milik Inovator A (bukan Inovasi Daerah)
        $this->createInovasi($this->inovatorA, 'Inovasi Biasa A', false);

        $response = $this->actingAs($this->inovatorA)->get(route('inovasi-daerah.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('inovasi/daerah')
            ->where('isPersonalScope', true)
            ->has('inovasi.data', 1)
            ->where('inovasi.data.0.id', $invA->id)
            ->where('inovasi.data.0.nama_inovasi', 'Inovasi Daerah A')
        );
    }

    public function test_tim_penilai_sees_all_inovasi_daerah(): void
    {
        $invA = $this->createInovasi($this->inovatorA, 'Inovasi Daerah A', true);
        PengajuanLomba::create([
            'inovasi_id' => $invA->id,
            'user_id' => $this->inovatorA->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        $invB = $this->createInovasi($this->inovatorB, 'Inovasi Daerah B', true);
        PengajuanLomba::create([
            'inovasi_id' => $invB->id,
            'user_id' => $this->inovatorB->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->timPenilai)->get(route('inovasi-daerah.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('inovasi/daerah')
            ->where('isPersonalScope', false)
            ->has('inovasi.data', 2)
        );
    }

    public function test_inovator_print_rekap_is_scoped_to_own_inovasi(): void
    {
        $invA = $this->createInovasi($this->inovatorA, 'Inovasi Daerah A', true);
        PengajuanLomba::create([
            'inovasi_id' => $invA->id,
            'user_id' => $this->inovatorA->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        $invB = $this->createInovasi($this->inovatorB, 'Inovasi Daerah B', true);
        PengajuanLomba::create([
            'inovasi_id' => $invB->id,
            'user_id' => $this->inovatorB->id,
            'periode_lomba_id' => $this->periode->id,
            'is_inovasi_daerah' => true,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->inovatorA)->get(route('inovasi-daerah.print-rekap'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('inovasi/print-rekap')
            ->has('inovasiList', 1)
            ->where('inovasiList.0.id', $invA->id)
        );
    }

    public function test_pendamping_only_sees_assigned_opd_inovasi_daerah(): void
    {
        $opdKominfo = \App\Models\Opd::create(['nama' => 'Dinas Komunikasi dan Informatika', 'kode' => 'KOMINFO']);
        $opdDinkes = \App\Models\Opd::create(['nama' => 'Dinas Kesehatan', 'kode' => 'DINKES']);

        $pendamping = User::factory()->create(['name' => 'Pendamping Kominfo']);
        $pendamping->assignRole('pendamping');

        \App\Models\PenugasanPendamping::create([
            'pendamping_id' => $pendamping->id,
            'opd_id' => $opdKominfo->id,
            'periode_lomba_id' => $this->periode->id,
        ]);

        $invKominfo = Inovasi::create([
            'user_id' => $this->inovatorA->id,
            'opd_id' => $opdKominfo->id,
            'is_inovasi_daerah' => true,
            'nama_inovasi' => 'Inovasi Kominfo',
            'tahapan' => 'penerapan',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'nama_inisiator' => 'Inisiator Kominfo',
            'koordinat' => '-8.5000, 117.4000',
            'waktu_penerapan' => '2024-01-01',
            'rancang_bangun' => 'Rancang bangun Kominfo.',
            'tujuan' => 'Tujuan Kominfo.',
            'manfaat' => 'Manfaat Kominfo.',
        ]);

        $invDinkes = Inovasi::create([
            'user_id' => $this->inovatorB->id,
            'opd_id' => $opdDinkes->id,
            'is_inovasi_daerah' => true,
            'nama_inovasi' => 'Inovasi Dinkes',
            'tahapan' => 'penerapan',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'nama_inisiator' => 'Inisiator Dinkes',
            'koordinat' => '-8.5000, 117.4000',
            'waktu_penerapan' => '2024-01-01',
            'rancang_bangun' => 'Rancang bangun Dinkes.',
            'tujuan' => 'Tujuan Dinkes.',
            'manfaat' => 'Manfaat Dinkes.',
        ]);

        $response = $this->actingAs($pendamping)->get(route('inovasi-daerah.index'));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('inovasi/daerah')
            ->where('isPendampingScope', true)
            ->where('isPersonalScope', false)
            ->has('inovasi.data', 1)
            ->where('inovasi.data.0.id', $invKominfo->id)
            ->where('inovasi.data.0.nama_inovasi', 'Inovasi Kominfo')
        );
    }

    public function test_inovasi_daerah_can_be_filtered_by_opd_id()
    {
        $opdKominfo = \App\Models\Opd::create(['nama' => 'Dinas Komunikasi dan Informatika', 'kode' => 'DISKOMINFO']);
        $opdDinkes = \App\Models\Opd::create(['nama' => 'Dinas Kesehatan', 'kode' => 'DINKES']);

        $invKominfo = Inovasi::create([
            'user_id' => $this->inovatorA->id,
            'opd_id' => $opdKominfo->id,
            'is_inovasi_daerah' => true,
            'nama_inovasi' => 'Aplikasi Kominfo Satu',
            'tahapan' => 'penerapan',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'nama_inisiator' => 'Inisiator Kominfo',
            'koordinat' => '-8.5000, 117.4000',
            'waktu_penerapan' => '2024-01-01',
            'rancang_bangun' => 'Rancang bangun Kominfo.',
            'tujuan' => 'Tujuan Kominfo.',
            'manfaat' => 'Manfaat Kominfo.',
        ]);

        $invDinkes = Inovasi::create([
            'user_id' => $this->inovatorB->id,
            'opd_id' => $opdDinkes->id,
            'is_inovasi_daerah' => true,
            'nama_inovasi' => 'Aplikasi Dinkes Satu',
            'tahapan' => 'penerapan',
            'inisiator' => 'opd',
            'bentuk_inovasi' => 'pelayanan_publik',
            'jenis_inovasi' => 'digital',
            'klasifikasi' => 'tematik',
            'nama_inisiator' => 'Inisiator Dinkes',
            'koordinat' => '-8.5000, 117.4000',
            'waktu_penerapan' => '2024-01-01',
            'rancang_bangun' => 'Rancang bangun Dinkes.',
            'tujuan' => 'Tujuan Dinkes.',
            'manfaat' => 'Manfaat Dinkes.',
        ]);

        $response = $this->actingAs($this->timPenilai)->get(route('inovasi-daerah.index', ['opd_id' => $opdDinkes->id]));

        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('inovasi/daerah')
            ->where('selectedOpd.id', $opdDinkes->id)
            ->where('selectedOpd.nama', 'Dinas Kesehatan')
            ->has('inovasi.data', 1)
            ->where('inovasi.data.0.id', $invDinkes->id)
            ->where('inovasi.data.0.nama_inovasi', 'Aplikasi Dinkes Satu')
        );
    }
}
