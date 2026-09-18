<?php

namespace App\Http\Controllers;

use App\Models\Opd;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class AdminUserController extends Controller
{
    /**
     * Tampilkan daftar seluruh pengguna sistem.
     */
    public function index(Request $request): Response
    {
        $users = User::with(['roles', 'opd'])
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nama_pemda' => $user->nama_pemda,
                'tipe_inovator' => $user->tipe_inovator,
                'opd_id' => $user->opd_id,
                'opd_nama' => $user->opd?->nama,
                'status_aktif' => (bool) $user->status_aktif,
                'roles' => $user->roles->pluck('name')->all(),
                'role_utama' => $user->roles->first()?->name ?? 'inovator',
                'created_at' => $user->created_at?->format('d/m/Y'),
            ]);

        $roles = Role::orderBy('name')->pluck('name')->all();
        $opdList = Opd::orderBy('nama')->get(['id', 'nama', 'kode']);

        return Inertia::render('penilai/users/index', [
            'users' => $users,
            'roles' => $roles,
            'opdList' => $opdList,
            'metrics' => [
                'total' => $users->count(),
                'bapperida' => $users->filter(fn ($u) => in_array('bapperida', $u['roles']))->count(),
                'pendamping' => $users->filter(fn ($u) => in_array('pendamping', $u['roles']))->count(),
                'penilai' => $users->filter(fn ($u) => in_array('tim_penilai', $u['roles']))->count(),
                'inovator' => $users->filter(fn ($u) => in_array('inovator', $u['roles']))->count(),
                'pimpinan' => $users->filter(fn ($u) => in_array('pimpinan', $u['roles']))->count(),
            ],
        ]);
    }

    /**
     * Simpan pengguna / pendamping baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name'],
            'opd_id' => ['nullable', 'exists:opd,id'],
            'nama_pemda' => ['nullable', 'string', 'max:255'],
            'status_aktif' => ['boolean'],
        ]);

        $opd = ! empty($validated['opd_id']) ? Opd::find($validated['opd_id']) : null;
        $namaPemda = ! empty($validated['nama_pemda']) ? $validated['nama_pemda'] : ($opd?->nama ?? 'Pemerintah Kab. Sumbawa');

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'opd_id' => $validated['opd_id'] ?? null,
            'nama_pemda' => $namaPemda,
            'tipe_inovator' => ! empty($validated['opd_id']) ? 'dinas' : 'masyarakat',
            'status_aktif' => $request->boolean('status_aktif', true),
            'email_verified_at' => now(),
        ]);

        $user->assignRole($validated['role']);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Pengguna ':nama' dengan role ':role' berhasil ditambahkan.", [
                'nama' => $user->name,
                'role' => ucfirst($validated['role']),
            ]),
        ]);

        return back();
    }

    /**
     * Perbarui data pengguna dan rolenya.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', Password::defaults()],
            'role' => ['required', 'string', 'exists:roles,name'],
            'opd_id' => ['nullable', 'exists:opd,id'],
            'nama_pemda' => ['nullable', 'string', 'max:255'],
            'status_aktif' => ['boolean'],
        ]);

        $opd = ! empty($validated['opd_id']) ? Opd::find($validated['opd_id']) : null;
        $namaPemda = ! empty($validated['nama_pemda']) ? $validated['nama_pemda'] : ($opd?->nama ?? $user->nama_pemda);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'opd_id' => $validated['opd_id'] ?? null,
            'nama_pemda' => $namaPemda,
            'tipe_inovator' => ! empty($validated['opd_id']) ? 'dinas' : 'masyarakat',
            'status_aktif' => $request->boolean('status_aktif', true),
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);
        $user->syncRoles([$validated['role']]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Data pengguna ':nama' berhasil diperbarui.", ['nama' => $user->name]),
        ]);

        return back();
    }

    /**
     * Hapus pengguna.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->id === $user->id, 400, 'Anda tidak dapat menghapus akun Anda sendiri.');

        $nama = $user->name;
        $user->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Pengguna ':nama' berhasil dihapus.", ['nama' => $nama]),
        ]);

        return back();
    }

    /**
     * Toggle status aktif pengguna.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        abort_if($request->user()->id === $user->id, 400, 'Anda tidak dapat menonaktifkan akun Anda sendiri.');

        $newStatus = ! $user->status_aktif;
        $user->update(['status_aktif' => $newStatus]);

        $msg = $newStatus
            ? "Akun ':nama' berhasil diaktifkan."
            : "Akun ':nama' berhasil dinonaktifkan.";

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __($msg, ['nama' => $user->name]),
        ]);

        return back();
    }
}
