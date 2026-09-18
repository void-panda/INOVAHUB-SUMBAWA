<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->string('kategori_inovasi', 50)->nullable()->after('inisiator');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->dropColumn('kategori_inovasi');
        });
    }
};
