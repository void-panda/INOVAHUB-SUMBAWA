<?php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class ValidasiFilterData
{
    public function __construct(
        public ?string $status = null,
        public ?string $search = null
    ) {}

    public static function fromRequest(Request $request): self
    {
        $status = $request->query('status');
        $search = $request->query('search');

        return new self(
            status: is_string($status) ? $status : null,
            search: is_string($search) ? $search : null
        );
    }
}
