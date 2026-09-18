<?php

namespace Database\Seeders;

use App\Models\Opd;
use Illuminate\Database\Seeder;

class OpdSeeder extends Seeder
{
    public function run(): void
    {
        $opds = [
            ['nama' => 'BAPPERIDA (Badan Perencanaan Pembangunan, Riset dan Inovasi Daerah)', 'kode' => 'BAP'],
            ['nama' => 'Dinas Komunikasi dan Informatika', 'kode' => 'DISKOMINFO'],
            ['nama' => 'Dinas Kesehatan', 'kode' => 'DINKES'],
            ['nama' => 'Dinas Pendidikan dan Kebudayaan', 'kode' => 'DISDIKBUD'],
            ['nama' => 'Dinas Kependudukan dan Pencatatan Sipil', 'kode' => 'DISDUKCAPIL'],
            ['nama' => 'Dinas Kelautan dan Perikanan', 'kode' => 'DISKAN'],
            ['nama' => 'Dinas Pekerjaan Umum dan Penataan Ruang', 'kode' => 'PUPR'],
            ['nama' => 'Dinas Perumahan dan Kawasan Permukiman', 'kode' => 'DISPERKIM'],
            ['nama' => 'Dinas Sosial', 'kode' => 'DINSOS'],
        ];

        foreach ($opds as $opd) {
            Opd::updateOrCreate(['kode' => $opd['kode']], $opd);
        }
    }
}
