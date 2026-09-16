<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property string $tipe
 * @property string $pesan
 * @property string|null $link
 * @property Carbon|null $dibaca_at
 * @property-read string $target_url
 */
#[Fillable(['user_id', 'tipe', 'pesan', 'link', 'dibaca_at'])]
class Notifikasi extends Model
{
    protected $table = 'notifikasi';

    protected $appends = ['target_url'];

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getTargetUrlAttribute(): string
    {
        if (! empty($this->link)) {
            return $this->link;
        }

        return match ($this->tipe) {
            'revisi' => '/inovasi',
            'disetujui', 'disahkan_opd', 'pengesahan' => '/inovasi',
            'pengajuan' => '/pendamping/inovasi',
            'review', 'skoring' => '/penilai/skoring',
            default => '/dashboard',
        };
    }

    protected function casts(): array
    {
        return ['dibaca_at' => 'datetime'];
    }
}
