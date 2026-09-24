<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pengajuan_lomba', function (Blueprint $table) {
            $table->index(['periode_lomba_id', 'status'], 'idx_pengajuan_periode_status');
            $table->index(['inovasi_id', 'is_arsip'], 'idx_pengajuan_inovasi_arsip');
            $table->index(['user_id', 'periode_lomba_id'], 'idx_pengajuan_user_periode');
        });

        Schema::table('inovasi', function (Blueprint $table) {
            $table->index(['user_id', 'is_inovasi_daerah'], 'idx_inovasi_user_daerah');
            $table->index(['opd_id', 'is_inovasi_daerah'], 'idx_inovasi_opd_daerah');
        });

        Schema::table('validasi_log', function (Blueprint $table) {
            $table->index(['pengajuan_lomba_id', 'created_at'], 'idx_validasi_log_pengajuan_created');
        });
    }

    public function down(): void
    {
        Schema::table('pengajuan_lomba', function (Blueprint $table) {
            $table->dropIndex('idx_pengajuan_periode_status');
            $table->dropIndex('idx_pengajuan_inovasi_arsip');
            $table->dropIndex('idx_pengajuan_user_periode');
        });

        Schema::table('inovasi', function (Blueprint $table) {
            $table->dropIndex('idx_inovasi_user_daerah');
            $table->dropIndex('idx_inovasi_opd_daerah');
        });

        Schema::table('validasi_log', function (Blueprint $table) {
            $table->dropIndex('idx_validasi_log_pengajuan_created');
        });
    }
};
