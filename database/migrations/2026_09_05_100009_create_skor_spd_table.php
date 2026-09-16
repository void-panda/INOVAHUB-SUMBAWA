<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skor_spd', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_lomba_id')->constrained('periode_lomba');
            $table->foreignId('indikator_id')->constrained('indikator_spd');
            $table->unsignedTinyInteger('tier')->default(1);
            $table->decimal('skor', 6, 2);
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['periode_lomba_id', 'indikator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skor_spd');
    }
};
