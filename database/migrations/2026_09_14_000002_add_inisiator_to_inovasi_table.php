<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->string('inisiator')->default('opd')->after('nama_inovasi');
        });
    }

    public function down(): void
    {
        Schema::table('inovasi', function (Blueprint $table) {
            $table->dropColumn('inisiator');
        });
    }
};
