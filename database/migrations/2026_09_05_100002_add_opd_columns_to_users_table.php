<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('nama_pemda')->after('name');
            $table->foreignId('opd_id')->nullable()->after('nama_pemda')
                ->constrained('opd')->nullOnDelete();
            $table->boolean('status_aktif')->default(true)->after('opd_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('opd_id');
            $table->dropColumn(['nama_pemda', 'status_aktif']);
        });
    }
};
