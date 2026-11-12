# Panduan latihan — Day 22

Tujuan: kamu menulis sendiri logika JavaScript. Desain sudah ada, sehingga fokus pada cara data berubah dan cara DOM mencerminkan data. Jangan mulai dari checkout; tuntaskan tahap dasar dulu.

## 01 — Pilihan ukuran (js/main.js)

**Target:** klik S, M, L mengubah label ukuran, active state, aria-pressed dan ringkasan. Ukuran awal M.

- Cari `#size-options` dan tombol di dalamnya. Baca atribut `data-size`.
- Pikirkan variabel state: ukuran apa yang dipilih sekarang? Gunakan `let` untuk data yang berubah.
- Ketika click, hapus active state lama dan aktifkan tombol terpilih; hanya satu yang aktif.
- Gunakan `textContent` pada `#selected-size` dan `#selection-summary`.

Petunjuk konsep: `querySelector`, `querySelectorAll`, `forEach`, `dataset`, `classList`, `setAttribute`, `addEventListener`.

Cek: klik L -> label L dan ringkasan L; klik S -> L tidak aktif lagi.

## 02 — Quantity dan subtotal (js/main.js)

**Target:** input dan tombol plus/minus memperbarui subtotal langsung, tanpa reload.

- Baca `#quantity.value` (string). Bagaimana mengubahnya ke angka? Bagaimana menolak input kosong sebelum konversi?
- Buat satu fungsi validasi reusable. Syarat: bilangan bulat, positif, tidak lebih dari `product.stock`. Bila cart sudah ada, pertimbangkan stok tersisa.
- Buat satu fungsi update UI: bila valid, harga × quantity. Format IDR dengan `Intl.NumberFormat` atau `toLocaleString('id-ID')`.
- Bila invalid, tampilkan `#quantity-error`, set `aria-invalid`, kosongkan subtotal valid sebelumnya (misal —), cegah Add to Cart. Bersihkan error saat kembali valid.
- Tombol plus/minus tidak boleh melewati batas. Tangani input manual, bukan hanya tombol.

Cek: 3 -> Rp450.000; 0, -1, 1.5, 11, kosong -> error; perbaiki menjadi 2 -> Rp300.000.

## 03 — Add to Cart (js/cart.js dan js/main.js)

**Target:** tambah produk terpilih ke cart, dengan feedback dan jumlah unit yang benar.

- Siapkan array cart kosong. Setiap item punya `id`, `size`, `quantity`, `price`.
- Sebelum menambah, hitung total quantity seluruh isi cart. Tolak jika total baru > stok 10.
- Cari apakah ukuran itu sudah ada. Jika ya, tambah quantity; jika tidak, buat item baru.
- Update header `#cart-count` serta `#product-feedback` dengan `textContent`. Panggil fungsi render cart dari langkah 04 ketika sudah tersedia.
- Pilihan implementasi: pertahankan input setelah berhasil; validasi ulang pada klik berikutnya, dan jangan mengurangi stok dua kali. Stok tersisa = stok total dikurangi quantity dalam cart.

Petunjuk konsep: `find`, `push`, `reduce`, object, conditional. Tidak perlu localStorage.

Cek: M ×2, M ×1, L ×2 -> 2 baris, 5 unit, total Rp750.000; tambah 6 lagi ditolak tanpa mengubah cart.

## 04 — Cart drawer (js/cart.js)

**Target:** klik Tas membuka dialog, menampilkan daftar cart, total, tombol +/- dan hapus.

- `showModal()` / `close()` untuk dialog; buka/tutup melalui event. Gunakan `#cart-item-template` dan clone isinya untuk setiap item. Isi `.item-size`, `.item-quantity`, `.item-total` dengan `textContent`.
- Render ulang `#cart-items` dari state. Toggle `#cart-empty` memakai hidden; nonaktifkan checkout jika kosong.
- Gunakan event delegation pada container cart (satu listener) atau pasang listener pada tombol baru setiap clone; jangan menambah listener pada container berkali-kali.
- Tentukan aturan minus: kuantitas 1 bisa tetap 1 dan gunakan Hapus untuk menghapus item. Plus memeriksa stok total. Setelah mutasi, render ulang cart dan validasi pilihan produk lagi.

Cek: hapus semua -> empty state, cart count 0, total Rp0, checkout disabled.

## 05 — Carousel dan zoom (js/gallery.js)

**Target:** tiga gambar baseline dapat berpindah melalui prev/next dan thumbnail, indikator ikut berubah.

- State `activeImageIndex` awal 0. Data gambar sudah tersedia dalam `product.images`.
- Ubah `src`, `alt`, indikator, dan active state thumbnail. Pastikan hanya satu aria-pressed true.
- Pikirkan bagaimana index terakhir kembali 0, dan index 0 dengan prev menjadi terakhir. Petunjuk: operator modulo atau if/else.
- Sinkronkan zoom dialog dan carousel utama. Tombol zoom, close, prev dan next sudah tersedia. Opsional: keyboard arrow saat dialog terbuka.

Cek: dari foto 3, next -> foto 1; klik thumbnail 2 -> foto belakang dan indikator 02 / 03.

## 06 — Async checkout (js/checkout.js)

**Target:** checkout hanya untuk cart yang valid, memperagakan loading, sukses, gagal dan retry tanpa backend.

1. Buka dialog konfirmasi dari cart, tampilkan total dan ringkasan. Tutup drawer sebelum membuka modal. Batalkan tanpa mengubah cart.
2. Buat fungsi yang **mengembalikan Promise**. Di dalamnya gunakan `setTimeout` untuk simulasi proses 2 detik. Pilihan radio success -> resolve; error -> reject dengan Error.
3. Buat handler `async` untuk konfirmasi. Sebelum `await`, pastikan cart valid, buat snapshot, set flag processing, tampilkan loading (`hidden = false`) dan nonaktifkan kontrol. Cegah klik ganda, perubahan cart serta penutupan dialog selama pending (event `cancel` untuk Escape).
4. `try`: await Promise; jika sukses, tampilkan hasil, kosongkan cart, render ulang. Cegah konfirmasi ulang setelah sukses.
5. `catch`: tampilkan pesan error; jangan menghapus cart. Pengguna dapat memilih success dan mencoba lagi.
6. `finally`: sembunyikan loading dan pulihkan kontrol yang sesuai, tidak mengaktifkan kembali konfirmasi yang sudah berhasil. Buka lagi dialog untuk transaksi demo berikutnya dengan state baru.

Pikirkan: apa bedanya `return` nilai biasa dan `return` Promise? Mengapa `try/catch` berada di sekitar `await`? Apa yang tetap harus dijalankan meski error?

Cek: skenario gagal -> cart tetap sama, loading hilang; retry sukses -> cart kosong, konfirmasi sukses; double click tidak menghasilkan dua pesanan. Ini simulasi, bukan request Fetch API.

## 07 — Toast (js/main.js)

**Target:** pesan sukses/error muncul pada halaman, kemudian hilang sendiri.

- Gunakan `#toast`, `#toast-message`, `#toast-close`, atribut hidden, dan kelas `is-error`.
- Gunakan `textContent` untuk teks; `setTimeout` untuk auto-hide; `clearTimeout` bila pesan baru datang sebelum timer lama selesai.
- Pasang event close sekali. Jangan mengandalkan toast saja untuk pesan validasi; gunakan juga feedback dekat input.
- Catatan: toast di luar dialog modal native bisa berada di bawah top layer. Untuk feedback checkout, utamakan `#checkout-feedback` dalam dialog; toast utama dipakai ketika dialog tertutup.

## 08 — Micro-interaction (css/styles.css + JS bila perlu)

Tambahkan efek hover terangkat, active turun, animasi cart count, transisi toast/dialog. Gunakan `transition`, `transform`, dan `classList` untuk memicu animasi saat count berubah. Hormati `prefers-reduced-motion`; jangan membuat animasi wajib untuk memahami status. Hover warna dan spinner dasar sudah disiapkan sebagai desain, bukan solusi latihan.

## 09 — Pengujian dan dokumentasi

Isi `TESTING.md` dengan hasil aktual, bukan hanya expected. Ambil screenshot setelah fitur selesai. Periksa tidak ada error console, tidak ada request API, mobile tidak overflow, dan navigasi keyboard bekerja. Perbarui README dan catatan AI. Selesaikan tahap wajib dahulu; tahap carousel, modal, toast, dan animasi adalah pengayaan sesuai arahan mentor.

## Cara meminta bantuan AI tanpa menyerahkan pengerjaan

Contoh: “Ini fungsi validasi quantity yang saya buat. Tolong tunjukkan letak kesalahan dan berikan hint, jangan langsung berikan solusi lengkap.” Setelah diperbaiki, jelaskan sendiri alur input -> state -> render DOM. Simpan bukti progres melalui commit bertahap di repo baru.
