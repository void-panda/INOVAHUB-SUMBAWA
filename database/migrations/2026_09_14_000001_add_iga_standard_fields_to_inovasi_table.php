<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->string('bentuk_inovasi')->default('pelayanan_publik')->after('tahapan');
            $table->string('jenis_inovasi')->default('non_digital')->after('bentuk_inovasi');
            $table->string('klasifikasi')->default('non_tematik')->after('jenis_inovasi');
            $table->string('tematik')->nullable()->after('klasifikasi');
            $table->string('kriteria_inovasi')->nullable()->after('tematik');
            $table->string('lokasi')->nullable()->after('koordinat');
            $table->decimal('anggaran_sebelum', 15, 2)->nullable()->after('waktu_pengembangan');
            $table->decimal('anggaran_sesudah', 15, 2)->nullable()->after('anggaran_sebelum');
            $table->boolean('is_penghargaan')->default(false)->after('anggaran_sesudah');
            $table->string('nama_penghargaan')->nullable()->after('is_penghargaan');
            $table->longText('rancang_bangun')->nullable()->after('nama_penghargaan');
            $table->text('tujuan')->nullable()->after('rancang_bangun');
            $table->text('manfaat')->nullable()->after('tujuan');
            $table->text('hasil_inovasi')->nullable()->after('manfaat');
        });
    }

    public function down(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->dropColumn([
                'bentuk_inovasi',
                'jenis_inovasi',
                'klasifikasi',
                'tematik',
                'kriteria_inovasi',
                'lokasi',
                'anggaran_sebelum',
                'anggaran_sesudah',
                'is_penghargaan',
                'nama_penghargaan',
                'rancang_bangun',
                'tujuan',
                'manfaat',
                'hasil_inovasi',
            ]);
        });
    }
};
