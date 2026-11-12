# Studio Basics — Day 22 Starter Project

Kelanjutan frontend hardcoded **Product 1 / Kemeja Linen Biru** dari Study Case Phase 1. Starter ini sengaja belum mengimplementasikan logika interaktif, agar peserta dapat mengerjakan sendiri materi DOM, event handling, state, dan asynchronous JavaScript.

## Cara menjalankan

1. Ekstrak ZIP, buka folder `studio-basics-day22` di VS Code.
2. Buka `index.html` di browser. Bisa langsung dibuka dari file lokal atau klik **Open with Live Server** (ekstensi VS Code, opsional).
3. Buka DevTools (F12), tab Console untuk debugging. Tidak ada npm install, backend, database, atau credential.
4. Ikuti `docs/PANDUAN-LATIHAN.md` berurutan; isi TODO di file `js/`. Catat hasil nyata di `docs/TESTING.md`.

## Baseline dan scope

Sumber: [HandOn-Javascript-Interactive-Website-With-Ai, branch main](https://github.com/GilangMohIkbal/HandOn-Javascript-Interactive-Website-With-Ai), terutama `project-AI/product-1.html` dan tiga SVG lokal `project-AI/assets/`. Harga Rp150.000, ukuran S/M/L, produk Kemeja Linen Biru, serta identitas Studio Basics diteruskan. Layout dan CSS disegarkan. Stok demo **10 unit total**, warna Dusty Blue, ukuran awal M, quantity 1 adalah keputusan starter, bukan data stok dari backend.

Berdasarkan klarifikasi mentor yang disampaikan peserta, lingkup repository pengumpulan baru adalah frontend hardcoded saja. Dokumen tertulis masih mencakup halaman API-driven dan fetch baseline; simulasi async di sini bukan pengganti literal syarat API tersebut. Tidak ada API atau backend yang diubah, disalin, ataupun dipanggil. Konfirmasi cakupan penilaian dengan mentor bila diperlukan.

## Struktur

```text
studio-basics-day22/
├── index.html
├── css/styles.css
├── js/
│   ├── product-data.js  # data statis, sudah disiapkan
│   ├── main.js          # TODO ukuran, quantity, validasi, add, toast
│   ├── cart.js          # TODO cart state, drawer, render
│   ├── gallery.js       # TODO carousel dan zoom
│   └── checkout.js      # TODO Promise, modal dan async checkout
├── assets/              # tiga ilustrasi SVG dari baseline
├── docs/
│   ├── PANDUAN-LATIHAN.md
│   └── TESTING.md
└── README.md
```

## Status starter

HTML, CSS, aset dan data produk telah disiapkan. Accordion native HTML, input angka bawaan browser dan tautan anchor dapat berfungsi tanpa JavaScript. Tombol ukuran, stepper, subtotal dinamis, carousel, cart, dialog dan async checkout **belum berfungsi**; ini disengaja. Loading spinner CSS sudah disediakan, tetapi hanya akan tampil setelah logika mengubah atribut `hidden`. Tidak ada solusi JS tersembunyi.

## Aturan latihan

- Gunakan vanilla JS, `addEventListener`, `textContent`, dan DOM API. Jangan gunakan SweetAlert2 atau library interaksi.
- Stok gabungan maksimal 10 unit untuk semua ukuran. Cart count menghitung jumlah unit, bukan jenis ukuran. Keranjang hanya state memori lokal; reload boleh mereset. Checkout sekadar simulasi tanpa transaksi.
- Hindari duplikasi listener, subtotal stale, dan double submit. Uji quantity invalid serta skenario async sukses/gagal.

## Catatan AI dan pengumpulan (lengkapi setelah pengerjaan)

AI membantu menyiapkan desain HTML/CSS, data dummy, struktur file, komentar TODO, panduan dan checklist. Logika interaksi belum dibuat oleh AI pada starter ini. Peserta harus mengisi logika, memahami perubahan dan memverifikasi sendiri hasilnya. Tambahkan catatan penggunaan AI yang sebenarnya selama pengerjaan berikutnya (review, debugging, dll).

Sebelum dikumpulkan: perbarui daftar fitur yang benar-benar selesai, isi hasil pengujian dan bukti, buat repository GitHub baru hanya untuk folder ini, cantumkan link repository asal dan commit submission yang dapat diakses mentor. Jangan menyatakan tes lulus bila belum dijalankan.
