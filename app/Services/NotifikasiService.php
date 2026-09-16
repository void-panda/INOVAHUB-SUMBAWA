<?php

namespace App\Services;

use App\DTOs\NotifikasiData;
use App\Models\Notifikasi;
use App\Models\User;
use App\Repositories\NotifikasiRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class NotifikasiService
{
    public function __construct(
        protected NotifikasiRepository $notifikasiRepository
    ) {}

    /**
     * @return LengthAwarePaginator<int, Notifikasi>
     */
    public function getNotificationList(User $user, int $perPage = 15, ?string $filter = null): LengthAwarePaginator
    {
        return $this->notifikasiRepository->getPaginatedForUser($user, $perPage, $filter);
    }

    /**
     * @return Collection<int, Notifikasi>
     */
    public function getRecentNotifications(User $user, int $limit = 5): Collection
    {
        return $this->notifikasiRepository->getRecentForUser($user, $limit);
    }

    public function getUnreadCount(User $user): int
    {
        return $this->notifikasiRepository->getUnreadCount($user);
    }

    public function markAsRead(User $user, int $notifikasiId): ?Notifikasi
    {
        $notifikasi = $this->notifikasiRepository->findForUser($user, $notifikasiId);

        if ($notifikasi !== null) {
            $this->notifikasiRepository->markAsRead($notifikasi);
        }

        return $notifikasi;
    }

    public function markAllAsRead(User $user): int
    {
        return $this->notifikasiRepository->markAllAsReadForUser($user);
    }

    public function sendNotification(int $userId, string $tipe, string $pesan, ?string $link = null): Notifikasi
    {
        $dto = new NotifikasiData(
            userId: $userId,
            tipe: $tipe,
            pesan: $pesan,
            link: $link
        );

        return $this->notifikasiRepository->create($dto);
    }
}
