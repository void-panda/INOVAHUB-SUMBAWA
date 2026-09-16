<?php

use App\Services\PengajuanLombaService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(fn () => app(PengajuanLombaService::class)->arsipkanPeriodeLama())
    ->yearlyOn(1, 1, '00:00');
