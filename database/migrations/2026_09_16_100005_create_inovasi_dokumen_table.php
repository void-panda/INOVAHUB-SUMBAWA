<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inovasi_dokumen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inovasi_id')->constrained('inovasi')->cascadeOnDelete();
            $table->foreignId('pengajuan_lomba_id')->nullable()->constrained('pengajuan_lomba')->cascadeOnDelete();
            $table->foreignId('indikator_sid_id')->nullable()->constrained('indikator_sid')->nullOnDelete();
            $table->string('nomor_surat')->nullable();
            $table->date('tanggal_surat')->nullable();
            $table->string('tentang')->nullable();
            $table->string('jenis');
            $table->string('path');
            $table->string('nama_asal');
            $table->string('mime');
            $table->unsignedBigInteger('ukuran');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inovasi_dokumen');
    }
};
