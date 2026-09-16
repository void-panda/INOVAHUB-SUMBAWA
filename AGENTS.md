# Repository Inovasi Daerah — Kabupaten Sumbawa (INOVA-HUB)

Aplikasi web **INOVA-HUB** (Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa)
untuk mengumpulkan, memverifikasi, mendampingi, dan memonitor data inovasi daerah Kabupaten
Sumbawa sebagai quality-assurance layer sebelum data disalin ke sistem resmi
Kemendagri (indeks.inovasi.bskdn.kemendagri.go.id). Alur pendampingan &
validasi berjenjang, skoring SPD/SID, dan simulasi IID mengikuti Pedoman Umum
IGA 2026.

## Reference sources (urutan prioritas kebenaran)

> **`SS/` diabaikan** — jangan gunakan file di folder `SS/` atau `panduan_teknis.pdf`
> sebagai referensi. Selalu gunakan sumber di bawah ini.

1. `TOR_DINOLA_Sumbawa.md` — TOR resmi INOVA-HUB: aktor, alur status 8 langkah,
   entitas basis data, **formula skoring (§8)**, modul & pelaporan.
2. `DINOLA_TOR_Presentasi.md` — ringkasan slide TOR (penguat poin-poin TOR).
3. `docs/` — dokumen project (PRD, arsitektur, stack, database, UI, domain).

Repo sudah berisi kode Laravel yang berjalan (lihat `docs/`).

## Dokumen project (baca sesuai kebutuhan)

| Dokumen | Isi |
| --- | --- |
| `docs/PRD.md` | Kebutuhan fungsional, role & izin, alur validasi, **DOs/DON'Ts** |
| `docs/architecture.md` | Arsitektur monolith (Laravel → Postgres), pembagian modul |
| `docs/tech-stack.md` | Stack, struktur folder, pendekatan upload file |
| `docs/database.md` | Struktur database (sesuai entitas TOR §7), tabel & hubungan |
| `docs/ui-design.md` | Layar, form, navigasi per role |
| `docs/domain.md` | Glosarium & model penilaian (SPD/SID, bobot, parameter) |

## Role (satu sumber dari TOR §3 — 6 aktor → 4 role aplikasi)

- **`inovator`** — OPD **dan** masyarakat: input profil inovasi, unggah dokumen, ajukan validasi, revisi data.
- **`pendamping`** — Pendamping Inovasi **+** Verifikator OPD (1 role): verifikasi (`Disetujui`/`Revisi` + komentar), pengesahan OPD.
- **`tim_penilai`** — Tim Penilai Internal **+** Admin Bappeda (1 role): skoring SPD/SID, kelola master data (indikator, bobot, parameter, opd, user, penugasan, linimasa, periode), ekspor ke sistem pusat.
- **`pimpinan`** — Pimpinan Daerah: dashboard read-only.

RBAC memakai **spatie/laravel-permission** (roles & permissions granular per modul).

## Konvensi / gotcha penting

- **Alur status (8 langkah, TOR §5)**: `draft → diajukan → divalidasi → revisi|disetujui → disahkan_opd → review_internal → siap_kirim → terkirim`. Data tidak pernah dihapus; semua transisi tercatat di `validasi_log`.
- **Revisi wajib komentar** (catatan per-field dari Pendamping).
- **Periode & arsip**: inovasi terikat `periode_lomba` (tahun). Saat tahun berganti, inovasi periode lama otomatis berstatus arsip (read-only). Dari arsip Inovator bisa **"Ajukan Kembali"** → dibuat salinan baru + wajib kolom "Penjelasan Pengembangan" + rantai riwayat via `inovasi_versi`.
- **Bobot penilaian**: data master (`indikator_spd`/`indikator_sid` + parameter P1/P2/P3), TIDAK di-hardcode; bisa diperbarui `tim_penilai` tiap tahun tanpa deploy. Skor mengikuti formula TOR §8 (lihat `docs/domain.md`).
- **Storage file**: dokumen dukung (profil, proposal, SK, piagam, video, dll) disimpan di disk lokal (`storage/app/...`) + metadata path di DB (`inovasi_dokumen`).
- **Arsitektur monolith** sederhana; jangan pakai microservices/Saga untuk app CRUD/monitoring ini.
- **DB = PostgreSQL** (tetap; TOR menyebut MySQL hanya untuk kompatibilitas hosting — putusan proyek: Postgres).
- **UI pakai Inertia + React + shadcn/ui**: semua komponen dari shadcn/ui
  (`resources/js/components/ui/`) — jangan bikin UI manual/AI-slop. Setup di `docs/tech-stack.md`.
- **Desain Banner & Ikonografi**: Semua hero banner di seluruh halaman wajib seragam menggunakan gradien teal INOVA-HUB (`from-teal-600 via-teal-700 to-emerald-800 border-teal-500/30 text-white`) dengan siluet SVG Motif Kemang Satange khas Sumbawa. Dilarang menggunakan emoji/emotikon pada antarmuka; selalu gunakan ikon Lucide React.
- **Alur & Standar Antarmuka Inovator (TOR §5 & §7)**:
  1. Form input inovasi baru wajib langsung memuat kolom unggah dokumen pendukung umum (Proposal/Rancang Bangun, Piagam/Sertifikat Penghargaan, dan Link Video Dokumentasi).
  2. Pada tabel Inovasi Saya (`/inovasi`), kolom aksi wajib menyediakan ikon folder untuk langsung membuka lembar kerja 20 Indikator SID.
  3. Halaman 20 Indikator SID (`/inovasi/{id}/indikator`) wajib menampilkan progres bar dan simulasi skor kematangan di bagian atas, serta tabel 7 kolom: `Indikator` (kode & nama), `Keterangan`, `Informasi` (petunjuk teknis bukti dukung), `Bobot`, `Parameter` (modal dialog opsi P1, P2, P3, atau Tidak Dapat Diukur / 0), `Data Pendukung` (ikon folder menuju berkas indikator), dan `Jenis` (badge format file).
  4. Halaman upload dokumen pendukung indikator wajib memiliki tombol *"Upload Dokumen Baru"* (modal dialog) di atas tabel, serta kolom aksi *"Lihat / Preview File"* dan *"Hapus"*.
- **Izin Eksekusi File & Command (Always Allow Scope Project)**: Selalu lakukan pembuatan/modifikasi berkas dan eksekusi command (seperti `php artisan`, `npm`, build, dan test) secara langsung dan proaktif di dalam direktori project ini (`D:\CODE\repo-inovasi-daerah`) tanpa perlu meminta konfirmasi ulang kepada pengguna setiap langkah.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
