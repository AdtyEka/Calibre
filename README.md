# Calibre Web UI (Offline-First PWA)

Proyek ini adalah *frontend* modern dan responsif untuk Calibre Content Server. Dibangun menggunakan **Next.js (App Router)** dan **TypeScript**, aplikasi ini menerapkan arsitektur *Headless* dengan kapabilitas **Offline-First (PWA)**, memungkinkan pengguna untuk tetap menelusuri dan membaca katalog buku meskipun koneksi internet terputus.

---

## Struktur Direktori & Arsitektur

Proyek ini menggunakan *design pattern* **Service-Repository** untuk memisahkan secara tegas antara antarmuka pengguna (UI), logika bisnis, dan manajemen pemanggilan data (API vs IndexedDB lokal).

### 1. `public/` (Area Aset Statis & PWA)
Direktori untuk file statis yang diakses langsung oleh *browser* tanpa kompilasi Next.js.
* **`assets/images/`**: Aset gambar statis untuk UI (logo, ilustrasi *empty state*, *placeholder*). *Catatan: Cover buku dinamis dari server TIDAK disimpan di sini.*
* **`icons/`**: Ikon aplikasi berbagai ukuran untuk kebutuhan instalasi PWA.
* **`manifest.json`**: Konfigurasi PWA yang mendefinisikan nama aplikasi, warna tema, dan ikon agar web dapat diinstal ke perangkat (Mobile/Desktop).
* **`sw.js`**: *Service Worker*. Skrip *background* yang bertugas mencegat *request* jaringan dan melayani aset dari *cache* saat perangkat *offline*.

### 2. `src/app/` (Area Routing & Halaman)
Jantung dari aplikasi berbasis Next.js App Router.
* **`page.tsx` & `layout.tsx`**: Definisi antarmuka halaman dan kerangka global (seperti *font* dasar dan metadata).
* **`ClientLayout.tsx`**: Komponen khusus sisi klien (*client-side*) untuk membungkus aplikasi dengan berbagai *Provider* (Theme, Network Status, Query Client).

### 3. `src/components/` (Area Blok Bangunan Visual)
Berisi seluruh komponen React. Komponen di sini bersifat "bodoh" (hanya menerima *props* dan merender UI) dan tidak mengatur logika *fetching* data kompleks.
* **`common/`**: Komponen universal yang digunakan lintas halaman (misal: `<OfflineBanner />`, `<SEO />`).
* **`layouts/`**: Komponen kerangka navigasi utama (misal: `<Navbar />`, `<Sidebar />`, `<Footer />`).
* **`providers/`**: Tempat untuk *Context API wrappers* (misal: `<NetworkProvider />`).
* **`sections/`**: Blok UI besar yang merepresentasikan satu bagian utuh dari halaman untuk menjaga `page.tsx` tetap bersih (misal: `<HeroSection />`, `<BookGridSection />`).
* **`ui/`**: Komponen *atomic* dan *reusable* berukuran kecil (Button, Input, Card). Tempat di mana komponen *library* seperti shadcn/ui atau animasi interaktif berada.

### 4. `src/hooks/` (Area Reusable Logic)
Kumpulan *Custom React Hooks* untuk memisahkan logika dari komponen visual.
* **`useNetwork.ts`**: Mendeteksi perubahan status jaringan (*online/offline*) pengguna secara *real-time*.
* **`useBooks.ts`**: *Hook* untuk memanggil lapisan *Service* dan mengelola *state* komponen (loading, error, data buku).

### 5. `src/lib/` (Area Konfigurasi & Utility)
* **`db/`**: Skrip inisialisasi dan skema untuk **IndexedDB** (menggunakan *library* seperti Dexie.js). Ini adalah *database* lokal di *browser* untuk menyimpan katalog buku dan file EPUB/PDF saat mode *offline*.
* **`calibre.ts`**: Konfigurasi *instance* HTTP (via Fetch/Axios) menuju API server VPS Calibre, termasuk pengaturan *base URL* dan *headers*.
* **`utils.ts`**: Kumpulan fungsi pembantu (*helper*), seperti penggabungan *class Tailwind* (`cn`) atau fungsi memformat ukuran file.

### 6. `src/repositories/` (Area Data Access Layer)
Lapisan terbawah yang berurusan langsung dengan sumber data (I/O). **Tidak ada logika bisnis atau UI di sini.**
* **`apiRepository.ts`**: Berisi murni fungsi-fungsi pemanggilan API HTTP ke server Calibre (berjalan hanya saat koneksi internet aktif).
* **`localRepository.ts`**: Berisi fungsi CRUD (`get`, `put`, `delete`) yang berinteraksi langsung dengan IndexedDB di *browser* (berjalan untuk menyimpan *cache* atau saat mode *offline*).

### 7. `src/services/` (Area Business Logic Layer)
**Otak pengambil keputusan** dari aplikasi. Komponen UI/Hooks hanya diperbolehkan memanggil fungsi dari direktori ini.
* **`bookService.ts`**: Mengatur alur data. Contoh logika: *Jika pengguna meminta daftar buku, periksa koneksi. Jika online, ambil dari `apiRepository` lalu simpan *cache*-nya melalui `localRepository`. Jika offline, langsung ambil data dari `localRepository`.*

### 8. `src/types/` (Area Definisi Data / TypeScript)
* **`index.ts`**: Berisi seluruh definisi *interface* atau *type* TypeScript (misal: `Book`, `Author`, `Metadata`). Menjamin keamanan tipe data (Type Safety) di seluruh ekosistem aplikasi.

---

### Alur Kerja Data (Offline-First Flow)

1. **UI Meminta Data:** Komponen di `src/components/sections` memanggil fungsi di `src/hooks/useBooks.ts`.
2. **Service Menilai Situasi:** Hook memanggil `src/services/bookService.ts`. Service mengecek apakah perangkat sedang *online* atau *offline*.
3. **Delegasi ke Repository:** - **Jika Online:** Service memanggil `apiRepository` untuk menarik data segar dari server VPS, lalu menggunakan `localRepository` untuk menyalin (*cache*) data tersebut ke IndexedDB.
   - **Jika Offline:** Service mem- *bypass* API dan langsung meminta data dari `localRepository` (IndexedDB).
4. **Render UI:** Service mengembalikan data ke Hook, dan UI me-*render* katalog buku secara instan tanpa hambatan.