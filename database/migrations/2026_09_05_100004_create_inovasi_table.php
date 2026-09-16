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
            $table->foreignId('periode_lomba_id')->constrained('periode_lomba');
            $table->string('nama_inovasi');
            $table->string('tahapan')->default('inisiatif');
            $table->string('nama_inisiator');
            $table->string('koordinat');
            $table->string('urusan_utama')->nullable();
            $table->string('urusan_wajib')->nullable();
            $table->date('waktu_uji_coba')->nullable();
            $table->date('waktu_penerapan');
            $table->date('waktu_pengembangan')->nullable();
            $table->string('file_penghargaan')->nullable();
            $table->float('estimasi_skor_kematangan')->nullable();
            $table->string('status')->default('draft');
            $table->boolean('is_arsip')->default(false);
            $table->text('penjelasan_pengembangan')->nullable();
            $table->foreignId('inovasi_asal_id')->nullable()
                ->constrained('inovasi')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inovasi');
    }
};
