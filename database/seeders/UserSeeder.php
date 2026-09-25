<?php

namespace Database\Seeders;

use App\Models\Opd;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $bapperida = Opd::where('kode', 'BAP')->first();
        $kominfo = Opd::where('kode', 'DISKOMINFO')->first();
        $dinkes = Opd::where('kode', 'DINKES')->first();
        $disdikbud = Opd::where('kode', 'DISDIKBUD')->first();
        $disdukcapil = Opd::where('kode', 'DISDUKCAPIL')->first();
        $diskan = Opd::where('kode', 'DISKAN')->first();
        $pupr = Opd::where('kode', 'PUPR')->first();
        $dlh = Opd::where('kode', 'DLH')->first();
        $pertanian = Opd::where('kode', 'DISTAN')->first() ?? Opd::where('nama', 'like', '%Pertanian%')->first();

        $users = [
            // 1. Superadmin BAPPERIDA (Full Access, TOR §3)
            [
                'name' => 'Administrator BAPPERIDA (Superadmin)',
                'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
                'email' => 'bapperida@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $bapperida?->id,
                'no_whatsapp' => '081234567001',
                'pekerjaan' => 'Administrator Sistem & Pengelola Inovasi Daerah',
                'status_aktif' => true,
                'role' => 'bapperida',
            ],

            // 2. Tim Penilai Internal & Skoring
            [
                'name' => 'Dr. H. Iskandar, M.Si (Tim Penilai)',
                'nama_pemda' => 'Tim Penilai Lomba Inovasi',
                'email' => 'penilai@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $bapperida?->id,
                'no_whatsapp' => '081234567002',
                'pekerjaan' => 'Analis Kebijakan / Tim Penilai Teknis',
                'status_aktif' => true,
                'role' => 'tim_penilai',
            ],

            // 3. Pendamping Utama (BAPPERIDA)
            [
                'name' => 'Drs. Andi Wijaya, M.AP (Pendamping Utama)',
                'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
                'email' => 'pendamping@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $bapperida?->id,
                'no_whatsapp' => '081234567003',
                'pekerjaan' => 'Fasilitator & Pendamping Inovasi Pelayanan Publik',
                'status_aktif' => true,
                'role' => 'pendamping',
            ],

            // 4. Pendamping Layanan (Verifikator OPD)
            [
                'name' => 'Rina Rahmawati, S.STP (Pendamping Layanan)',
                'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
                'email' => 'pendamping2@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $bapperida?->id,
                'no_whatsapp' => '081234567004',
                'pekerjaan' => 'Verifikator Dokumen & Asistensi Inovasi',
                'status_aktif' => true,
                'role' => 'pendamping',
            ],

            // 5. Inovator OPD: DISKOMINFO
            [
                'name' => 'Ahmad Fauzi, S.Kom (Inovator Kominfo)',
                'nama_pemda' => 'Dinas Komunikasi dan Informatika',
                'email' => 'inovator@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $kominfo?->id,
                'no_whatsapp' => '081234567005',
                'pekerjaan' => 'Pranata Komputer Ahli Muda',
                'status_aktif' => true,
                'role' => 'inovator',
            ],

            // 6. Inovator OPD: DINKES
            [
                'name' => 'dr. Siti Maryam (Inovator Kesehatan)',
                'nama_pemda' => 'Dinas Kesehatan',
                'email' => 'inovator2@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $dinkes?->id,
                'no_whatsapp' => '081234567006',
                'pekerjaan' => 'Dokter Umum / Penanggung Jawab Pelayanan',
                'status_aktif' => true,
                'role' => 'inovator',
            ],

            // 7. Inovator OPD: DISDUKCAPIL
            [
                'name' => 'H. Suryadi, S.H. (Inovator Disdukcapil)',
                'nama_pemda' => 'Dinas Kependudukan dan Pencatatan Sipil',
                'email' => 'inovator3@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $disdukcapil?->id,
                'no_whatsapp' => '081234567007',
                'pekerjaan' => 'Kepala Seksi Identitas & Dokumen Penduduk',
                'status_aktif' => true,
                'role' => 'inovator',
            ],

            // 8. Inovator OPD: DISDIKBUD
            [
                'name' => 'Budi Santoso, S.Pd (Inovator Pendidikan)',
                'nama_pemda' => 'Dinas Pendidikan dan Kebudayaan',
                'email' => 'inovator4@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $disdikbud?->id,
                'no_whatsapp' => '081234567008',
                'pekerjaan' => 'Pengembang Model Pembelajaran Digital',
                'status_aktif' => true,
                'role' => 'inovator',
            ],

            // 9. Inovator Masyarakat: Komunitas Sabalong Samawa Inovatif
            [
                'name' => 'Fajar Saputra (Inovator Masyarakat)',
                'nama_pemda' => 'Komunitas Sabalong Samawa Inovatif',
                'email' => 'inovator5@sumbawakab.go.id',
                'tipe_inovator' => 'masyarakat',
                'opd_id' => null,
                'no_whatsapp' => '081234567010',
                'pekerjaan' => 'Pegiat Teknologi & Pengusaha Muda Sumbawa',
                'status_aktif' => true,
                'role' => 'inovator',
            ],

            // 10. Inovator OPD: PUPR
            [
                'name' => 'Ir. Hendra Kusuma, M.T. (Inovator PUPR)',
                'nama_pemda' => 'Dinas Pekerjaan Umum dan Penataan Ruang',
                'email' => 'inovator_pupr@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => $pupr?->id,
                'no_whatsapp' => '081234567009',
                'pekerjaan' => 'Teknik Pengairan Ahli Madya',
                'status_aktif' => true,
                'role' => 'inovator',
            ],

            // 11. Pimpinan Daerah (Bupati/Sekda)
            [
                'name' => 'H. Mahmud Abdullah (Pimpinan)',
                'nama_pemda' => 'Pemerintah Kab. Sumbawa',
                'email' => 'pimpinan@sumbawakab.go.id',
                'tipe_inovator' => 'dinas',
                'opd_id' => null,
                'no_whatsapp' => '081234567011',
                'pekerjaan' => 'Pimpinan Daerah Kabupaten Sumbawa',
                'status_aktif' => true,
                'role' => 'pimpinan',
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);

            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                array_merge($userData, [
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ])
            );

            $user->syncRoles([$roleName]);
        }
    }
}
