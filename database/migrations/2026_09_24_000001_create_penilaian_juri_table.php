<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penilaian_juri', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_lomba_id')->constrained('pengajuan_lomba')->cascadeOnDelete();
            $table->foreignId('juri_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('nilai', 5, 2);
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->unique(['pengajuan_lomba_id', 'juri_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_juri');
    }
};
