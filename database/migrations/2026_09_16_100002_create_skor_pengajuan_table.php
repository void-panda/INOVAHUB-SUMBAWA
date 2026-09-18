<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('skor_pengajuan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pengajuan_lomba_id')->constrained('pengajuan_lomba')->cascadeOnDelete();
            $table->foreignId('indikator_id')->constrained('indikator_sid');
            $table->unsignedTinyInteger('tier')->default(1);
            $table->decimal('skor', 6, 2);
            $table->text('catatan')->nullable();
            $table->text('komentar_pendamping')->nullable();
            $table->string('status_validasi', 30)->default('belum_divalidasi');
            $table->foreignId('pendamping_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('komentar_at')->nullable();
            $table->timestamps();

            $table->unique(['pengajuan_lomba_id', 'indikator_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skor_pengajuan');
    }
};
