<?php

namespace App\Exceptions;

use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InovasiStatusException extends DomainException
{
    public function __construct(string $message = 'Inovasi tidak dapat diproses pada status saat ini.', private int $statusCode = 403)
    {
        parent::__construct($message);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    /**
     * Render response saat exception dilempar di HTTP Request.
     */
    public function render(Request $request): RedirectResponse
    {
        if ($request->header('X-Inertia')) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $this->getMessage(),
            ]);

            return back();
        }

        abort($this->statusCode, $this->getMessage());
    }
}
