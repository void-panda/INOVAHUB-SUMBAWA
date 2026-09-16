<?php

namespace App\Http\Controllers;

use App\Services\NotifikasiService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotifikasiController extends Controller
{
    public function __construct(
        protected NotifikasiService $notifikasiService
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();
        $filter = $request->query('filter');
        $filterString = is_string($filter) ? $filter : null;

        $notifikasi = $this->notifikasiService->getNotificationList($user, 15, $filterString);

        return Inertia::render('notifikasi/index', [
            'notifikasi' => $notifikasi,
            'filter' => $filterString ?? 'all',
            'unreadCount' => $this->notifikasiService->getUnreadCount($user),
        ]);
    }

    public function markAsRead(Request $request, int $id): RedirectResponse
    {
        $notifikasi = $this->notifikasiService->markAsRead($request->user(), $id);

        $doRedirect = $request->boolean('redirect', true);
        $targetUrl = $request->input('redirect_to') ?? $notifikasi?->target_url ?? $notifikasi?->link;

        if ($doRedirect && ! empty($targetUrl)) {
            return redirect($targetUrl)->with('success', 'Notifikasi dibaca.');
        }

        return redirect()->back()->with('success', 'Notifikasi ditandai telah dibaca.');
    }

    public function markAllAsRead(Request $request): RedirectResponse
    {
        $this->notifikasiService->markAllAsRead($request->user());

        return redirect()->back()->with('success', 'Semua notifikasi ditandai telah dibaca.');
    }
}
