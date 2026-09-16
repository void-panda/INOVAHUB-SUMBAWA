<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('validasi_log', function (Blueprint $table) {
            $table->foreignId('pengajuan_lomba_id')->nullable()->after('inovasi_id')->constrained('pengajuan_lomba')->cascadeOnDelete();
            $table->foreignId('inovasi_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('validasi_log', function (Blueprint $table) {
            $table->dropForeign(['pengajuan_lomba_id']);
            $table->dropColumn('pengajuan_lomba_id');
        });
    }
};
