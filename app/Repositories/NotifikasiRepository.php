<?php

namespace App\Repositories;

use App\DTOs\NotifikasiData;
use App\Models\Notifikasi;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class NotifikasiRepository
{
    /**
     * @return LengthAwarePaginator<int, Notifikasi>
     */
    public function getPaginatedForUser(User $user, int $perPage = 15, ?string $filter = null): LengthAwarePaginator
    {
        $query = Notifikasi::where('user_id', $user->id);

        if ($filter === 'unread') {
            $query->whereNull('dibaca_at');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function getUnreadCount(User $user): int
    {
        return Notifikasi::where('user_id', $user->id)
            ->whereNull('dibaca_at')
            ->count();
    }

    /**
     * @return Collection<int, Notifikasi>
     */
    public function getRecentForUser(User $user, int $limit = 5): Collection
    {
        return Notifikasi::where('user_id', $user->id)
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function findForUser(User $user, int $id): ?Notifikasi
    {
        return Notifikasi::where('user_id', $user->id)
            ->where('id', $id)
            ->first();
    }

    public function markAsRead(Notifikasi $notifikasi): bool
    {
        if ($notifikasi->dibaca_at !== null) {
            return true;
        }

        return $notifikasi->update(['dibaca_at' => Carbon::now()]);
    }

    public function markAllAsReadForUser(User $user): int
    {
        return Notifikasi::where('user_id', $user->id)
            ->whereNull('dibaca_at')
            ->update(['dibaca_at' => Carbon::now()]);
    }

    public function create(NotifikasiData $data): Notifikasi
    {
        return Notifikasi::create($data->toArray());
    }
}
