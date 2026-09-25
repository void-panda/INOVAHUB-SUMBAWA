<?php

namespace App\Http\Controllers;

use App\Services\SimulasiIidService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SimulasiIidController extends Controller
{
    public function __construct(
        private readonly SimulasiIidService $simulasiService
    ) {}

    /**
     * Tampilkan Halaman Simulasi IID & Kepatuhan Yandas.
     */
    public function index(Request $request): Response
    {
        $simulasi = $this->simulasiService->getSimulasiData();
        $isPimpinan = $request->user()?->hasRole('pimpinan') || str_starts_with($request->path(), 'pimpinan');
        $view = $isPimpinan ? 'pimpinan/simulasi/index' : 'superadmin/simulasi/index';

        return Inertia::render($view, [
            'simulasi' => $simulasi,
        ]);
    }
}
