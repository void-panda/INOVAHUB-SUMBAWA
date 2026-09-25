<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengajuan_lomba', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inovasi_id')->constrained('inovasi')->cascadeOnDelete();
            $table->foreignId('periode_lomba_id')->nullable()->constrained('periode_lomba')->nullOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_inovasi_daerah')->default(false);
            $table->string('status')->default('dalam_pendampingan');
            $table->boolean('is_arsip')->default(false);
            $table->text('penjelasan_pengembangan')->nullable();
            $table->foreignId('pengajuan_asal_id')->nullable()->constrained('pengajuan_lomba')->nullOnDelete();
            $table->float('estimasi_skor_kematangan')->nullable();
            $table->timestamps();

            $table->unique(['inovasi_id', 'periode_lomba_id']);
            $table->index(['periode_lomba_id', 'status'], 'idx_pengajuan_periode_status');
            $table->index(['inovasi_id', 'is_arsip'], 'idx_pengajuan_inovasi_arsip');
            $table->index(['user_id', 'periode_lomba_id'], 'idx_pengajuan_user_periode');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengajuan_lomba');
    }
};
