<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('kelengkapan_indikator')->truncate();

        Schema::table('kelengkapan_indikator', function (Blueprint $table) {
            $table->dropForeign(['inovasi_id']);
            $table->dropUnique(['inovasi_id', 'indikator_sid_id']);
            $table->dropColumn('inovasi_id');

            $table->foreignId('pengajuan_lomba_id')->constrained('pengajuan_lomba')->cascadeOnDelete();
            $table->unique(['pengajuan_lomba_id', 'indikator_sid_id']);
        });
    }

    public function down(): void
    {
        DB::table('kelengkapan_indikator')->truncate();

        Schema::table('kelengkapan_indikator', function (Blueprint $table) {
            $table->dropForeign(['pengajuan_lomba_id']);
            $table->dropUnique(['pengajuan_lomba_id', 'indikator_sid_id']);
            $table->dropColumn('pengajuan_lomba_id');

            $table->foreignId('inovasi_id')->constrained('inovasi')->cascadeOnDelete();
            $table->unique(['inovasi_id', 'indikator_sid_id']);
        });
    }
};
