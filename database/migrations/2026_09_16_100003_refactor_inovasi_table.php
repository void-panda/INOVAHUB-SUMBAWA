<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->dropForeign(['periode_lomba_id']);
            $table->dropForeign(['inovasi_asal_id']);
            $table->dropColumn([
                'periode_lomba_id',
                'status',
                'is_arsip',
                'penjelasan_pengembangan',
                'inovasi_asal_id',
                'estimasi_skor_kematangan',
            ]);
            $table->boolean('is_inovasi_daerah')->default(false)->after('opd_id');
        });
    }

    public function down(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->dropColumn('is_inovasi_daerah');
            $table->foreignId('periode_lomba_id')->nullable()->constrained('periode_lomba');
            $table->string('status')->default('draft');
            $table->boolean('is_arsip')->default(false);
            $table->text('penjelasan_pengembangan')->nullable();
            $table->foreignId('inovasi_asal_id')->nullable()->constrained('inovasi')->nullOnDelete();
            $table->float('estimasi_skor_kematangan')->nullable();
        });
    }
};
