<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $opdList = \App\Models\Opd::orderBy('nama')->get(['id', 'nama', 'kode']);

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'opdList' => $opdList,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (($validated['pekerjaan'] ?? null) === 'ASN') {
            $validated['tipe_inovator'] = 'dinas';
            $validated['opd_id'] = ! empty($validated['opd_id']) ? (int) $validated['opd_id'] : null;
            $validated['nip'] = ! empty($validated['nip']) ? trim($validated['nip']) : null;
            if ($validated['opd_id']) {
                $opd = \App\Models\Opd::find($validated['opd_id']);
                if ($opd) {
                    $validated['nama_pemda'] = $opd->nama;
                }
            }
        } else {
            $validated['tipe_inovator'] = 'masyarakat';
            $validated['opd_id'] = null;
            $validated['nip'] = null;
        }

        $validated['no_whatsapp'] = ! empty($validated['no_whatsapp']) ? trim($validated['no_whatsapp']) : null;

        $request->user()->fill($validated);

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
            try {
                $request->user()->sendEmailVerificationNotification();
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('Gagal mengirim verifikasi email saat ubah profil: ' . $e->getMessage());
            }
        }

        $request->user()->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Profile updated.')]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's profile.
     */
    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
