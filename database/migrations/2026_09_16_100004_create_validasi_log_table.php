<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('validasi_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inovasi_id')->nullable()->constrained('inovasi')->cascadeOnDelete();
            $table->foreignId('pengajuan_lomba_id')->nullable()->constrained('pengajuan_lomba')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('status_sebelum');
            $table->string('status_sesudah');
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index(['pengajuan_lomba_id', 'created_at'], 'idx_validasi_log_pengajuan_created');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('validasi_log');
    }
};
