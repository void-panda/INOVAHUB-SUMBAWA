<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('indikator_sid', function (Blueprint $table) {
            $table->text('informasi')->nullable()->after('variabel');
        });
    }

    public function down(): void
    {
        Schema::table('indikator_sid', function (Blueprint $table) {
            $table->dropColumn('informasi');
        });
    }
};
