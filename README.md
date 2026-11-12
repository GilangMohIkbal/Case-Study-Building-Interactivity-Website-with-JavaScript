# Studio Basics — Interactive Product Detail

**Assignment Day 22 — Adding Interactivity to Websites with JavaScript**

Website detail produk e-commerce berbasis HTML, CSS, dan Vanilla JavaScript. Proyek ini merupakan pengembangan halaman hardcoded Product 1 (Kemeja Linen Biru) dari Study Case Phase 1. Fokusnya adalah manipulasi DOM, event handling, pengelolaan state, validasi, serta simulasi asynchronous checkout tanpa backend.

## Fitur

- Pilihan ukuran S/M/L dengan active state, `aria-pressed`, dan ringkasan pilihan dinamis.
- Input jumlah dan tombol tambah/kurang dengan subtotal otomatis tanpa reload.
- Validasi jumlah: wajib bilangan bulat positif, tidak boleh kosong atau melebihi stok yang tersedia.
- Add to Cart dengan feedback pada halaman, cart count, dan toast yang dapat ditutup atau menghilang otomatis.
- Shopping cart drawer: menampilkan item berdasarkan ukuran, menambah/mengurangi jumlah, menghapus item, menampilkan total serta empty state. Ukuran yang sama digabung menjadi satu baris.
- Carousel tiga gambar dengan thumbnail, navigasi berulang, indikator posisi, zoom dialog dan navigasi keyboard.
- Custom checkout dialog dengan ringkasan pesanan, simulasi sukses/gagal, loading, retry, dan perlindungan double submit. Checkout berhasil mengosongkan keranjang; checkout gagal mempertahankannya.
- Micro-interaction pada tombol, animasi cart count, drawer, modal, toast dan dukungan `prefers-reduced-motion`.
- Layout responsif untuk desktop dan mobile.

## Teknologi

HTML5, CSS3, Vanilla JavaScript, DOM API (`getElementById`, `querySelectorAll`, `addEventListener`, `textContent`, `classList`, `template`, `showModal`). Pengelolaan keranjang menggunakan array dan object (`find`, `filter`, `reduce`). Proses checkout menggunakan Promise, `setTimeout`, `async/await`, dan `try/catch/finally`. Tidak menggunakan framework, library interaksi, database, API, maupun credential.

## Cara menjalankan

1. Clone repository pengumpulan (atau ekstrak ZIP proyek).
2. Buka folder yang berisi `index.html` di VS Code.
3. Buka `index.html` di browser, atau gunakan ekstensi Live Server: klik kanan `index.html` → **Open with Live Server**.
4. Gunakan DevTools (F12) untuk memeriksa Console saat mencoba fitur.

Tidak diperlukan `npm install`, konfigurasi environment, maupun server backend.

## Struktur folder

```text
.
├── index.html
├── css/styles.css
├── js/
│   ├── product-data.js  # object produk dan daftar gambar
│   ├── main.js          # ukuran, quantity, validasi, subtotal, toast, init
│   ├── cart.js          # state, render dan event keranjang
│   ├── gallery.js       # carousel dan zoom
│   └── checkout.js      # modal, Promise dan async checkout
├── assets/              # tiga ilustrasi SVG produk
├── docs/
│   ├── PANDUAN-LATIHAN.md  # panduan awal (referensi belajar)
│   ├── TESTING.md          # hasil pemeriksaan dan bukti browser
│   ├── browser-check.py   # skrip pengujian otomatis opsional
│   ├── browser-results.json # output pemeriksaan aktual
│   └── evidence/          # screenshot pemeriksaan
└── README.md
```

## Data produk dan aturan bisnis demo

| Atribut        | Nilai                                   |
| -------------- | --------------------------------------- |
| Nama           | Kemeja Linen Biru                       |
| Harga per unit | Rp150.000                               |
| Warna          | Dusty Blue                              |
| Ukuran         | S, M, L                                 |
| Stok demo      | 10 unit total (gabungan seluruh ukuran) |
| Pilihan awal   | M, quantity 1                           |

Subtotal pilihan = harga × quantity. Total keranjang adalah penjumlahan harga × jumlah seluruh item. Stok yang dapat dipilih = stok total − jumlah unit dalam cart. Tidak ada stok terpisah per ukuran. Keranjang disimpan di memori JavaScript dan akan direset saat reload. Checkout adalah simulasi, bukan transaksi atau pengurangan inventaris sungguhan; setelah sukses, cart kosong dan stok demo kembali tersedia.

## Alur asynchronous checkout

1. Masukkan produk ke tas, buka drawer, lalu pilih Lanjutkan checkout.
2. Pilih skenario Berhasil atau Gagal pada dialog dan klik Konfirmasi demo.
3. `simulateOrder()` mengembalikan Promise dengan jeda sekitar 2 detik. Handler `async` menunggu hasil melalui `await`. Kontrol dikunci saat pending dan indikator loading ditampilkan.
4. Jika resolve, tampilkan pesan berhasil dan kosongkan cart. Jika reject, tampilkan pesan error dan pertahankan cart agar bisa retry.
5. `finally` menghentikan loading dan mengembalikan kontrol sesuai status.

Tidak ada Fetch API atau endpoint baru: simulasi ini hanya untuk mempraktikkan asynchronous JavaScript pada frontend hardcoded.

## Kualitas kode dan finalisasi

- HTML, CSS, dan JavaScript dirapikan tanpa mengganti identitas visual atau fitur utama.
- Komentar instruksi TODO yang sudah selesai dihapus; komentar yang tersisa menjelaskan aturan stok, sinkronisasi galeri, pemasangan listener, dan perilaku async yang tidak langsung terlihat dari nama fungsi.
- `getRemainingStock()` menjadi satu sumber perhitungan stok; `getCartSnapshot()` dan `clearCart()` membatasi akses langsung ke state cart dari checkout.
- `clearProductFeedback()` membersihkan feedback pada perubahan ukuran, input quantity, dan tombol plus/minus.
- Penamaan variabel, blok conditional, format galeri, dan label durasi timer dibuat lebih eksplisit. Aturan reduced motion dikonsolidasikan.

File [panduan latihan](docs/PANDUAN-LATIHAN.md) dipertahankan sebagai referensi pembelajaran, bukan daftar pekerjaan yang belum selesai.

## Pengujian

Skenario pengujian mencakup pilihan ukuran, input valid/invalid, stok gabungan, cart, carousel, checkout sukses/gagal/retry, double submit, toast, layout responsif dan error JavaScript. Pengujian tambahan memeriksa pembersihan feedback, stok pada batas maksimum, sinkronisasi setelah checkout, fokus keyboard dan reduced motion.

**Hasil finalisasi 12 November 2026:** seluruh 26 skenario regresi dan 5 pemeriksaan tambahan kualitas (31/31) lulus pada Chromium 144.0.7559.96 menggunakan Playwright, dengan konten HTML/CSS/JS dan SVG yang disematkan di browser (navigasi langsung file lokal dibatasi lingkungan pengujian). Semua lima file JavaScript juga lulus `node --check` (Node.js v22.16.0). Tidak ditemukan page error atau request fetch/XHR pada alur yang diuji. Pengujian ini bukan bukti bahwa Live Server atau seluruh browser/perangkat telah diuji.

Lihat [tabel pengujian dan bukti screenshot](docs/TESTING.md) serta [output pemeriksaan](docs/browser-results.json). Untuk menguji ulang secara manual, buka website dan ikuti langkah pada tabel tersebut; periksa hasil aktual pada browser sendiri sebelum mengumpulkan.

## Baseline dan cakupan

Sumber proyek: [HandOn-Javascript-Interactive-Website-With-Ai](https://github.com/GilangMohIkbal/HandOn-Javascript-Interactive-Website-With-Ai), branch `main`, khususnya `project-AI/product-1.html` dan tiga ilustrasi SVG di `project-AI/assets/`. Nama produk, harga, ukuran, aset dan identitas Studio Basics dipertahankan; desain serta interaksi dikembangkan untuk Day 22.

## Penggunaan AI

AI digunakan untuk membantu menyiapkan starter HTML/CSS, struktur file, data dummy, serta review implementasi, refactoring ringan untuk readability, pengujian browser dan pembaruan dokumentasi. Peserta harus mengisi logika, memahami perubahan dan memverifikasi sendiri hasilnya. Hasil review terdokumentasi pada bagian pengujian; peserta tetap bertanggung jawab memverifikasi hasil di lingkungan sendiri.
