<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PanduanController extends Controller
{
    /**
     * Tampilkan halaman Panduan Pengguna & Helpdesk INOVA-HUB.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $roles = $user ? $user->getRoleNames()->toArray() : [];

        $faqList = [
            [
                'question' => 'Apa itu INOVA-HUB Kabupaten Sumbawa?',
                'answer' => 'INOVA-HUB (Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa) adalah aplikasi dan platform penjaminan mutu Pemerintah Kabupaten Sumbawa untuk mengumpulkan, memverifikasi, mendampingi, dan memonitor data inovasi daerah sebelum disinkronkan ke sistem resmi BSKDN Kemendagri.',
            ],
            [
                'question' => 'Bagaimana alur validasi data inovasi di INOVA-HUB?',
                'answer' => 'Alur melalui 8 tahapan berjenjang: Draft -> Diajukan Validasi -> Sedang Divalidasi -> Perlu Revisi / Disetujui Pendamping -> Disahkan OPD -> Review Internal Tim Penilai -> Siap Kirim -> Terkirim & Termonitor.',
            ],
            [
                'question' => 'Apa syarat urusan wajib pelayanan dasar dalam skor IID?',
                'answer' => 'Untuk mendapatkan Skor Jumlah Inovasi (maksimal 76 poin), daerah wajib memiliki minimal 5 dari 6 urusan wajib pelayanan dasar yang terwakili di antara inovasi yang diajukan (Pendidikan, Kesehatan, Pekerjaan Umum, Perumahan Rakyat, Trantibum Linmas, & Sosial).',
            ],
            [
                'question' => 'Bagaimana cara mengajukan kembali inovasi dari periode sebelumnya?',
                'answer' => 'Inovator dapat membuka menu Arsip pada inovasi periode lama, lalu menekan tombol "Ajukan Kembali". Sistem akan menyalin data profil sebagai draft baru periode berjalan dan meminta Anda mengisi kolom wajib "Penjelasan Pengembangan dari Versi Sebelumnya".',
            ],
            [
                'question' => 'Apakah data lama akan terhapus saat periode lomba berganti?',
                'answer' => 'Tidak. Semua data, dokumen dukung, skor, dan catatan validasi dari tahun-tahun sebelumnya tetap tersimpan utuh secara read-only di menu Arsip dan tidak pernah dihapus.',
            ],
        ];

        $kontakHelpdesk = [
            'instansi' => 'Bappeda Kabupaten Sumbawa',
            'bidang' => 'Bidang Riset dan Inovasi Daerah (RIDA)',
            'alamat' => 'Jl. Garuda No. 1, Lemape, Sumbawa Besar, NTB',
            'email' => 'Bappeda@sumbawakab.go.id',
            'telepon' => '(0371) 21543',
            'jam_layanan' => 'Senin - Jumat, 08:00 - 16:00 WITA',
        ];

        return Inertia::render('panduan/index', [
            'userRoles' => $roles,
            'faqList' => $faqList,
            'kontakHelpdesk' => $kontakHelpdesk,
        ]);
    }
}
