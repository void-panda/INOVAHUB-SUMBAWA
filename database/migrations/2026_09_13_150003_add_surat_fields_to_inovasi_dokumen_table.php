<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inovasi_dokumen', function (Blueprint $table) {
            $table->string('nomor_surat')->nullable()->after('indikator_sid_id');
            $table->date('tanggal_surat')->nullable()->after('nomor_surat');
            $table->string('tentang')->nullable()->after('tanggal_surat');
        });
    }

    public function down(): void
    {
        Schema::table('inovasi_dokumen', function (Blueprint $table) {
            $table->dropColumn(['nomor_surat', 'tanggal_surat', 'tentang']);
        });
    }
};
