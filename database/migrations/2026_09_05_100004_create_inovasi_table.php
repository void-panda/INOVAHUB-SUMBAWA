<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inovasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('opd_id')->nullable()->constrained('opd')->nullOnDelete();
            $table->boolean('is_inovasi_daerah')->default(false);
            $table->string('nama_inovasi');
            $table->string('inisiator')->default('opd');
            $table->string('kategori_inovasi', 50)->nullable();
            $table->string('tahapan')->default('inisiatif');
            $table->string('bentuk_inovasi')->default('pelayanan_publik');
            $table->string('jenis_inovasi')->default('non_digital');
            $table->string('klasifikasi')->default('non_tematik');
            $table->string('tematik')->nullable();
            $table->string('kriteria_inovasi')->nullable();
            $table->string('nama_inisiator');
            $table->string('koordinat');
            $table->string('lokasi')->nullable();
            $table->string('urusan_utama')->nullable();
            $table->string('urusan_wajib')->nullable();
            $table->date('waktu_uji_coba')->nullable();
            $table->date('waktu_penerapan');
            $table->date('waktu_pengembangan')->nullable();
            $table->decimal('anggaran_sebelum', 15, 2)->nullable();
            $table->decimal('anggaran_sesudah', 15, 2)->nullable();
            $table->boolean('is_penghargaan')->default(false);
            $table->string('nama_penghargaan')->nullable();
            $table->string('file_penghargaan')->nullable();
            $table->longText('rancang_bangun')->nullable();
            $table->text('tujuan')->nullable();
            $table->text('manfaat')->nullable();
            $table->text('hasil_inovasi')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'is_inovasi_daerah'], 'idx_inovasi_user_daerah');
            $table->index(['opd_id', 'is_inovasi_daerah'], 'idx_inovasi_opd_daerah');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inovasi');
    }
};
