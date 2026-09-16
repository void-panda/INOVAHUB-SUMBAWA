<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            OpdSeeder::class,
            RolePermissionSeeder::class,
            PeriodeSeeder::class,
            UserSeeder::class,
            IndikatorSeeder::class,
            PenugasanSeeder::class,
            InovasiSeeder::class,
            ValidasiLogSeeder::class,
            SkorSeeder::class,
            NotifikasiSeeder::class,
        ]);
    }
}
