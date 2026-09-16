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
