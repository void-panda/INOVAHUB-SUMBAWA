<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('indikator_sid', function (Blueprint $table) {
            $table->id();
            $table->string('kode');
            $table->string('nama');
            $table->string('variabel')->nullable();
            $table->text('informasi')->nullable();
            $table->decimal('bobot', 4, 2);
            $table->string('p1')->nullable();
            $table->string('p2')->nullable();
            $table->string('p3')->nullable();
            $table->json('opsi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('indikator_sid');
    }
};
