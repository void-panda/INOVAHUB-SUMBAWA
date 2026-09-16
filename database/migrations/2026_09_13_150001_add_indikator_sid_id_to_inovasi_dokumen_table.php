<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inovasi_dokumen', function (Blueprint $table) {
            $table->foreignId('indikator_sid_id')
                ->nullable()
                ->after('inovasi_id')
                ->constrained('indikator_sid')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('inovasi_dokumen', function (Blueprint $table) {
            $table->dropConstrainedForeignId('indikator_sid_id');
        });
    }
};
