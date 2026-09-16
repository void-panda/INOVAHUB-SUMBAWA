<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skor_inovasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inovasi_id')->constrained('inovasi')->cascadeOnDelete();
            $table->foreignId('indikator_id')->constrained('indikator_sid');
            $table->unsignedTinyInteger('tier')->default(1);
            $table->decimal('skor', 6, 2);
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['inovasi_id', 'indikator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skor_inovasi');
    }
};
