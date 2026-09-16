<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Permissions granular per modul (spatie). Role → permission mapping harus tetap sesederhana TOR.
        $permissions = [
            'input-inovasi', 'submit-inovasi', 'revisi-inovasi',
            'validate-inovasi', 'approve-opd',
            'assign-pendamping', 'manage-master-data',
            'scoring-spd', 'scoring-sid', 'view-scoring',
            'view-dashboard', 'view-report',
        ];

        foreach ($permissions as $permission) {
            Permission::updateOrCreate(['name' => $permission]);
        }

        $roles = [
            'inovator' => ['input-inovasi', 'submit-inovasi', 'revisi-inovasi', 'view-dashboard'],
            'pendamping' => ['validate-inovasi', 'approve-opd', 'view-dashboard', 'view-report'],
            'tim_penilai' => ['assign-pendamping', 'manage-master-data', 'scoring-spd', 'scoring-sid', 'view-scoring', 'view-dashboard', 'view-report'],
            'pimpinan' => ['view-dashboard', 'view-report', 'view-scoring'],
        ];

        foreach ($roles as $name => $perms) {
            $role = Role::updateOrCreate(['name' => $name]);
            $role->syncPermissions($perms);
        }
    }
}
