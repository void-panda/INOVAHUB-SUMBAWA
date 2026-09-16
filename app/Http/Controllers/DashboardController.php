<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboardService
    ) {}

    /**
     * Tampilkan Dashboard Makro DINOLA.
     */
    public function index(Request $request): Response
    {
        $metrics = $this->dashboardService->getDashboardMetrics($request->user());

        return Inertia::render('dashboard', [
            'metrics' => $metrics,
        ]);
    }
}
