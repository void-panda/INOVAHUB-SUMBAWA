<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $nama
 * @property string|null $kode
 * @property string|null $kontak
 */
#[Fillable(['nama', 'kode', 'kontak'])]
class Opd extends Model
{
    protected $table = 'opd';

    /** @return HasMany<User, $this> */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /** @return HasMany<Inovasi, $this> */
    public function inovasi(): HasMany
    {
        return $this->hasMany(Inovasi::class);
    }
}
