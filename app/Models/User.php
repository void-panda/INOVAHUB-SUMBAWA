<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $nama_pemda
 * @property string $tipe_inovator
 * @property int|null $opd_id
 * @property bool $status_aktif
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $no_whatsapp
 * @property string|null $pekerjaan
 * @property string|null $nip
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'nama_pemda', 'tipe_inovator', 'opd_id', 'status_aktif', 'email', 'no_whatsapp', 'pekerjaan', 'nip', 'password'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasRoles, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Cek apakah user merupakan inovator dari kalangan masyarakat.
     */
    public function isMasyarakat(): bool
    {
        return $this->tipe_inovator === 'masyarakat';
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'status_aktif' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Opd, $this> */
    public function opd(): BelongsTo
    {
        return $this->belongsTo(Opd::class);
    }

    /** @return HasMany<Inovasi, $this> */
    public function inovasi(): HasMany
    {
        return $this->hasMany(Inovasi::class);
    }

    /** @return HasMany<Notifikasi, $this> */
    public function notifikasi(): HasMany
    {
        return $this->hasMany(Notifikasi::class);
    }

    /** @return HasMany<ValidasiLog, $this> */
    public function validasiLogs(): HasMany
    {
        return $this->hasMany(ValidasiLog::class);
    }

    /**
     * Pemilik berdasarkan role saat ini (inovator biasa).
     *
     * @return HasMany<Inovasi, $this>
     */
    public function inovasiDimiliki(): HasMany
    {
        return $this->hasMany(Inovasi::class, 'user_id');
    }
}
