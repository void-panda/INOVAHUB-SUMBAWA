<?php

return [
    /*
    | Urusan pemerintahan yang dapat dipilih pada profil inovasi.
    | ponytail: list statis berbasis Pedoman IGA; pindah ke data master
    | (tabel indikator master) bila urusan berubah tiap tahun.
    */
    'inovasi' => [
        'Pendidikan' => 'Pendidikan',
        'Kesehatan' => 'Kesehatan',
        'Pekerjaan Umum dan Penataan Ruang' => 'Pekerjaan Umum dan Penataan Ruang',
        'Perumahan dan Kawasan Permukiman' => 'Perumahan dan Kawasan Permukiman',
        'Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat' => 'Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat',
        'Sosial' => 'Sosial',
        'Komunikasi dan Informatika' => 'Komunikasi dan Informatika',
        'Pariwisata' => 'Pariwisata',
        'Perindustrian dan Perdagangan' => 'Perindustrian dan Perdagangan',
        'Pertanian' => 'Pertanian',
        'Koperasi, Usaha Kecil dan Menengah' => 'Koperasi, Usaha Kecil dan Menengah',
        'Lingkungan Hidup' => 'Lingkungan Hidup',
        'Kependudukan dan Catatan Sipil' => 'Kependudukan dan Catatan Sipil',
        'Perpustakaan dan Kearsipan' => 'Perpustakaan dan Kearsipan',
        'Transportasi' => 'Transportasi',
        'Lainnya' => 'Lainnya',
    ],

    /*
    | 6 urusan wajib pelayanan dasar (TOR §5 / pedoman IGA).
    | Kepatuhan = minimal 5 dari 6 terwakili di antara inovasi siap_kirim.
    */
    'wajib' => [
        'Pendidikan',
        'Kesehatan',
        'Pekerjaan Umum dan Penataan Ruang',
        'Perumahan dan Kawasan Permukiman',
        'Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat',
        'Sosial',
    ],
];
