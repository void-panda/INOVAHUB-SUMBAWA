<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inovasi_dokumen', function (Blueprint $table) {
            $table->foreignId('pengajuan_lomba_id')->nullable()->after('inovasi_id')->constrained('pengajuan_lomba')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('inovasi_dokumen', function (Blueprint $table) {
            $table->dropForeign(['pengajuan_lomba_id']);
            $table->dropColumn('pengajuan_lomba_id');
        });
    }
};
