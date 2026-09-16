<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $kode
 * @property string $nama
 * @property string|null $variabel
 * @property string $bobot
 * @property string|null $p1
 * @property string|null $p2
 * @property string|null $p3
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['kode', 'nama', 'variabel', 'bobot', 'p1', 'p2', 'p3'])]
class IndikatorSpd extends Model
{
    protected $table = 'indikator_spd';
}
