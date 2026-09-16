<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('linimasa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_lomba_id')->constrained('periode_lomba');
            $table->string('nama');
            $table->date('mulai');
            $table->date('selesai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('linimasa');
    }
};
