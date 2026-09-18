<?php

namespace Database\Seeders;

use App\Models\Opd;
use App\Models\User;
use Illuminate\Database\Seeder;

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

        $users = [
            [
                'name' => 'H. Mahmud Abdullah (Pimpinan)',
                'nama_pemda' => 'Pemerintah Kab. Sumbawa',
                'email' => 'pimpinan@sumbawakab.go.id',
                'opd_id' => null,
                'role' => 'pimpinan',
            ],
            [
                'name' => 'Administrator BAPPERIDA (Superadmin)',
                'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
                'email' => 'bapperida@sumbawakab.go.id',
                'opd_id' => $bapperida?->id,
                'role' => 'bapperida',
            ],
            [
                'name' => 'Dr. H. Iskandar, M.Si (Tim Penilai)',
                'nama_pemda' => 'Tim Penilai Lomba Inovasi',
                'email' => 'penilai@sumbawakab.go.id',
                'opd_id' => $bapperida?->id,
                'role' => 'tim_penilai',
            ],
            [
                'name' => 'Drs. Andi Wijaya, M.AP (Pendamping Utama)',
                'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
                'email' => 'pendamping@sumbawakab.go.id',
                'opd_id' => $bapperida?->id,
                'role' => 'pendamping',
            ],
            [
                'name' => 'Rina Rahmawati, S.STP (Pendamping Layanan)',
                'nama_pemda' => 'BAPPERIDA Kab. Sumbawa',
                'email' => 'pendamping2@sumbawakab.go.id',
                'opd_id' => $bapperida?->id,
                'role' => 'pendamping',
            ],
            [
                'name' => 'Ahmad Fauzi, S.Kom (Inovator Kominfo)',
                'nama_pemda' => 'Dinas Komunikasi dan Informatika',
                'email' => 'inovator@sumbawakab.go.id',
                'opd_id' => $kominfo?->id,
                'role' => 'inovator',
            ],
            [
                'name' => 'dr. Siti Maryam (Inovator Kesehatan)',
                'nama_pemda' => 'Dinas Kesehatan',
                'email' => 'inovator2@sumbawakab.go.id',
                'opd_id' => $dinkes?->id,
                'role' => 'inovator',
            ],
            [
                'name' => 'H. Suryadi, S.H. (Inovator Disdukcapil)',
                'nama_pemda' => 'Dinas Kependudukan dan Pencatatan Sipil',
                'email' => 'inovator3@sumbawakab.go.id',
                'opd_id' => $disdukcapil?->id,
                'role' => 'inovator',
            ],
            [
                'name' => 'Budi Santoso, S.Pd (Inovator Pendidikan)',
                'nama_pemda' => 'Dinas Pendidikan dan Kebudayaan',
                'email' => 'inovator4@sumbawakab.go.id',
                'opd_id' => $disdikbud?->id,
                'role' => 'inovator',
            ],
            [
                'name' => 'Fajar Saputra (Inovator Masyarakat)',
                'nama_pemda' => 'Komunitas Sabalong Samawa Inovatif',
                'email' => 'inovator5@sumbawakab.go.id',
                'opd_id' => null,
                'role' => 'inovator',
            ],
        ];

        foreach ($users as $userData) {
            $roleName = $userData['role'];
            unset($userData['role']);

            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                array_merge($userData, [
                    'password' => bcrypt('password'),
                    'email_verified_at' => now(),
                ])
            );

            $user->syncRoles([$roleName]);
        }
    }
}
