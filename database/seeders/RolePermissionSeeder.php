<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache permission Spatie
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Permissions granular per modul
        $permissions = [
            // Modul Inovasi
            'input-inovasi',
            'submit-inovasi',
            'revisi-inovasi',
            'delete-inovasi',
            'view-inovasi',

            // Modul Validasi & Pendampingan
            'validate-inovasi',
            'approve-opd',
            'tolak-inovasi',
            'review-indikator',
            'assign-pendamping',

            // Modul Penilaian & Skoring
            'scoring-spd',
            'scoring-sid',
            'view-scoring',
            'penetapan-inovasi-daerah',

            // Modul Master Data & Administrasi
            'manage-master-data',
            'manage-opd',
            'manage-users',
            'manage-periode',
            'manage-indikator',

            // Modul Laporan & Dashboard
            'view-dashboard',
            'view-report',
            'export-laporan',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        // 2. Definisi Role dan Mapping Permissions
        $roles = [
            // Superadmin BAPPERIDA: Hak akses penuh ke seluruh modul sistem (TOR §3)
            'bapperida' => $permissions,

            // Tim Penilai Internal: Skoring SPD/SID, review inovasi daerah, monitoring & laporan
            'tim_penilai' => [
                'scoring-spd',
                'scoring-sid',
                'view-scoring',
                'view-dashboard',
                'view-report',
                'penetapan-inovasi-daerah',
                'export-laporan',
            ],

            // Pendamping Inovasi + Verifikator OPD: Validasi berjenjang, catatan review per indikator, pengesahan
            'pendamping' => [
                'validate-inovasi',
                'approve-opd',
                'tolak-inovasi',
                'review-indikator',
                'view-dashboard',
                'view-report',
            ],

            // Inovator (OPD & Masyarakat): Input profil inovasi, upload dokumen, lengkapi 20 indikator SID, ajukan validasi
            'inovator' => [
                'input-inovasi',
                'submit-inovasi',
                'revisi-inovasi',
                'delete-inovasi',
                'view-inovasi',
                'view-dashboard',
            ],

            // Pimpinan Daerah (Bupati/Sekda): Monitoring eksekutif read-only, capaian skor, ekspor laporan
            'pimpinan' => [
                'view-dashboard',
                'view-report',
                'view-scoring',
                'export-laporan',
            ],
        ];

        foreach ($roles as $name => $perms) {
            $role = Role::updateOrCreate(['name' => $name]);
            $role->syncPermissions($perms);
        }
    }
}
