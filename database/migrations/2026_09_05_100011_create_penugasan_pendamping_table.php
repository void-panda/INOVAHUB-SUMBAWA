<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penugasan_pendamping', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendamping_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('opd_id')->nullable()->constrained('opd')->nullOnDelete();
            $table->foreignId('inovator_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('periode_lomba_id')->constrained('periode_lomba');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penugasan_pendamping');
    }
};
