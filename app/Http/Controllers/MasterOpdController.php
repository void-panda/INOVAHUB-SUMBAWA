<?php

namespace App\Http\Controllers;

use App\Models\Opd;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class MasterOpdController extends Controller
{
    /**
     * Tampilkan daftar seluruh Perangkat Daerah (OPD).
     */
    public function index(Request $request): Response
    {
        $query = Opd::withCount(['users', 'inovasi']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'ilike', "%{$search}%")
                    ->orWhere('kode', 'ilike', "%{$search}%")
                    ->orWhere('kontak', 'ilike', "%{$search}%");
            });
        }

        $opdList = $query->orderBy('nama')->paginate(15)->withQueryString()->through(fn (Opd $opd) => [
            'id' => $opd->id,
            'nama' => $opd->nama,
            'kode' => $opd->kode,
            'kontak' => $opd->kontak,
            'users_count' => $opd->users_count,
            'inovasi_count' => $opd->inovasi_count,
            'can_delete' => $opd->users_count === 0 && $opd->inovasi_count === 0,
        ]);

        return Inertia::render('superadmin/opd/index', [
            'opdList' => $opdList,
            'filters' => $request->only(['search']),
            'metrics' => [
                'total_opd' => Opd::count(),
                'total_inovasi_opd' => Opd::has('inovasi')->count(),
                'total_opd_aktif' => Opd::has('users')->count(),
            ],
        ]);
    }

    /**
     * Simpan Perangkat Daerah baru.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255', 'unique:opd,nama'],
            'kode' => ['nullable', 'string', 'max:50', 'unique:opd,kode'],
            'kontak' => ['nullable', 'string', 'max:255'],
        ], [
            'nama.required' => 'Nama Perangkat Daerah wajib diisi.',
            'nama.unique' => 'Nama Perangkat Daerah sudah terdaftar.',
            'kode.unique' => 'Kode singkatan Perangkat Daerah sudah digunakan.',
        ]);

        $opd = Opd::create([
            'nama' => trim($validated['nama']),
            'kode' => ! empty($validated['kode']) ? strtoupper(trim($validated['kode'])) : null,
            'kontak' => ! empty($validated['kontak']) ? trim($validated['kontak']) : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Perangkat Daerah ':nama' berhasil ditambahkan.", ['nama' => $opd->nama]),
        ]);

        return back();
    }

    /**
     * Perbarui data Perangkat Daerah.
     */
    public function update(Request $request, Opd $opd): RedirectResponse
    {
        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255', Rule::unique('opd')->ignore($opd->id)],
            'kode' => ['nullable', 'string', 'max:50', Rule::unique('opd')->ignore($opd->id)],
            'kontak' => ['nullable', 'string', 'max:255'],
        ], [
            'nama.required' => 'Nama Perangkat Daerah wajib diisi.',
            'nama.unique' => 'Nama Perangkat Daerah sudah terdaftar.',
            'kode.unique' => 'Kode singkatan Perangkat Daerah sudah digunakan.',
        ]);

        $opd->update([
            'nama' => trim($validated['nama']),
            'kode' => ! empty($validated['kode']) ? strtoupper(trim($validated['kode'])) : null,
            'kontak' => ! empty($validated['kontak']) ? trim($validated['kontak']) : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Data Perangkat Daerah ':nama' berhasil diperbarui.", ['nama' => $opd->nama]),
        ]);

        return back();
    }

    /**
     * Hapus Perangkat Daerah (hanya jika belum memiliki relasi pengguna atau inovasi).
     */
    public function destroy(Opd $opd): RedirectResponse
    {
        if ($opd->users()->exists() || $opd->inovasi()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __("Perangkat Daerah ':nama' tidak dapat dihapus karena sudah memiliki data inovasi atau akun pengguna terkait.", ['nama' => $opd->nama]),
            ]);

            return back();
        }

        $nama = $opd->nama;
        $opd->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __("Perangkat Daerah ':nama' berhasil dihapus.", ['nama' => $nama]),
        ]);

        return back();
    }
}
