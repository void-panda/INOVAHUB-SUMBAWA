<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inovasi_versi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inovasi_baru_id')->constrained('inovasi')->cascadeOnDelete();
            $table->foreignId('inovasi_asal_id')->constrained('inovasi')->cascadeOnDelete();
            $table->integer('tahun');
            $table->text('catatan_pengembangan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inovasi_versi');
    }
};
