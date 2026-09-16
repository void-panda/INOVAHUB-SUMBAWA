# INOVA-HUB Coding Standards & Architecture Guidelines

Dokumen ini mendokumentasikan standar penulisan kode (coding standards) dan arsitektur layer yang diterapkan pada proyek **INOVA-HUB** (Pembinaan Terintegrasi untuk Meningkatkan Kualitas Inovasi Pelayanan Publik di Kabupaten Sumbawa).

---

## 1. Arsitektur Layer (Backend Laravel)

INOVA-HUB menggunakan arsitektur **Thin Controller + Service Layer + Repository Layer + DTO**:

```
[ Request / Inertia Page ]
           │
           ▼
    [ Controller ]  ──(Thin: Authorization, DTO construction, Response/Inertia rendering)
           │
           ▼
     [ Service ]    ──(Business Logic, Transaction, Event Dispatch, Exception Throwing)
           │
           ├──► [ DTO ] (Data Transfer Object: Readonly Payload)
           │
           ▼
    [ Repository ]  ──(Data Access & Complex Queries Read-Only)
           │
           ▼
     [ Eloquent ]   ──(Database Models)
```

### 1.1 Thin Controller (`app/Http/Controllers/`)
- Controller **hanya** bertugas menerima HTTP Request, melakukan otorisasi (via Policy/Gate/$user->can()), mengkonstruksi DTO jika perlu, memanggil Service/Repository, dan mengembalikan Response (Inertia::render / back() / redirect()).
- Tidak ada business logic, query kompleks, mutasi file, atau penulisan log transaksi di Controller.

### 1.2 Service Layer (`app/Services/`)
- Tempat seluruh **Business Logic** dan aturan domain (state transition, transaksi DB, kalkulasi skor, mutasi file, notifikasi, dll).
- Menerima DTO atau tipe data terdefinisi.
- Menggunakan Database Transaction (`DB::transaction(...)`) untuk operasi multi-step.
- Melempar Domain/Custom Exception (misal: `InovasiStatusException`) jika aturan bisnis dilanggar.
- Menghasilkan return value berupa Model / DTO / boolean.

### 1.3 Repository Layer (`app/Repositories/`)
- Tempat pengisolasian **Query Data** (Read Operations).
- Mengenkapsulasi query Eloquent kompleks, eager loading, pencarian, filter, dan paginasi.
- **Prinsip**: Repository bertugas membaca data (`find*`, `get*`, `paginate*`). Operasi `create`/`update`/`delete` sederhana dilakukan oleh Service via Model Eloquent.

### 1.4 Data Transfer Object / DTO (`app/DTOs/`)
- Murni berupa PHP `readonly class` untuk mentransfer data bertipe jelas antara Layer (Controller ➔ Service).
- Wajib memiliki method statis `fromRequest(Request $request)` atau `fromArray(array $data)`.
- Menghindari penggunaan raw array (`array $data`) yang tidak aman dan tidak ber-autocomplete.

### 1.5 Custom Domain Exceptions (`app/Exceptions/`)
- Exception spesifik domain yang memperjelas pelanggaran aturan bisnis (misal: `InovasiStatusException`).
- Ditangkap secara anggun atau dikonversi ke flash message / HTTP exception yang tepat.

---

## 2. Frontend Standards (React + Inertia + TypeScript)

### 2.1 Strong Typing (`resources/js/types/`)
- Semua entitas domain utama wajib didefinisikan secara eksplisit di `resources/js/types/models.ts`.
- Hindari penggunaan type `any` atau catch-all index sign `[key: string]: unknown` pada entitas core.
- Strict null check & unused variables check diaktifkan pada `tsconfig.json`.

### 2.2 UI Components
- **WAJIB** menggunakan `shadcn/ui` yang ada di `resources/js/components/ui/`.
- Jangan membuat UI manual / styling inline yang menyimpang dari skema desain shadcn/ui.

---

## 3. Formatting & Quality Check Tools

- **PHP Code Style**: Run `composer lint` (Laravel Pint).
- **PHP Static Analysis**: Run `composer types:check` (PHPStan Level 7).
- **JS/TS Lint & Type Check**: Run `npm run types:check` (TypeScript compiler `tsc --noEmit`).
- **Tests**: Run `php artisan test` (PHPUnit).

---

## 4. Alur Status Inovasi & Transisi (TOR §5)

```
[ draft ] ──(inovator: submit)──► [ diajukan ]
                                       │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                 [ divalidasi ]              [ revisi ] (kembali ke inovator)
                         │                           │
                         ▼                           └─► (ajukan ulang) ─► [ diajukan ]
                 [ disetujui ]
                         │
                         ▼
                 [ disahkan_opd ]
                         │
                         ▼
               [ review_internal ]
                         │
                         ▼
                [ siap_kirim ]
                         │
                         ▼
                  [ terkirim ]
```

---
