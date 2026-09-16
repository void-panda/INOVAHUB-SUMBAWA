<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kelengkapan_indikator', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inovasi_id')->constrained('inovasi')->cascadeOnDelete();
            $table->foreignId('indikator_sid_id')->constrained('indikator_sid')->cascadeOnDelete();
            $table->string('parameter')->nullable(); // 'p1', 'p2', 'p3', null
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['inovasi_id', 'indikator_sid_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kelengkapan_indikator');
    }
};
