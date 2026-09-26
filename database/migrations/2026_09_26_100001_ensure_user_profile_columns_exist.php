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
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'nama_pemda')) {
                $table->string('nama_pemda')->nullable()->after('name');
            }
            if (! Schema::hasColumn('users', 'tipe_inovator')) {
                $table->string('tipe_inovator', 20)->default('dinas')->after('nama_pemda');
            }
            if (! Schema::hasColumn('users', 'opd_id')) {
                $table->foreignId('opd_id')->nullable()->after('tipe_inovator')->constrained('opd')->nullOnDelete();
            }
            if (! Schema::hasColumn('users', 'status_aktif')) {
                $table->boolean('status_aktif')->default(true)->after('opd_id');
            }
            if (! Schema::hasColumn('users', 'no_whatsapp')) {
                $table->string('no_whatsapp', 30)->nullable()->after('email_verified_at');
            }
            if (! Schema::hasColumn('users', 'pekerjaan')) {
                $table->string('pekerjaan', 50)->nullable()->after('no_whatsapp');
            }
            if (! Schema::hasColumn('users', 'nip')) {
                $table->string('nip', 20)->nullable()->after('pekerjaan');
            }
            if (! Schema::hasColumn('users', 'two_factor_secret')) {
                $table->text('two_factor_secret')->nullable()->after('password');
            }
            if (! Schema::hasColumn('users', 'two_factor_recovery_codes')) {
                $table->text('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            }
            if (! Schema::hasColumn('users', 'two_factor_confirmed_at')) {
                $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['nip', 'pekerjaan', 'no_whatsapp', 'nama_pemda', 'tipe_inovator'] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $columnsToDrop[] = $column;
                }
            }
            if (! empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
