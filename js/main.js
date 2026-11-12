// DAY 22 — kerjakan berurutan. Lihat docs/PANDUAN-LATIHAN.md.
// Script defer: HTML sudah selesai diparsing saat script dijalankan.
// product tersedia dari product-data.js. Belum ada event listener atau fungsi jadi.

// TODO 01 — DOM selector dan pilihan ukuran
// Ambil elemen #size-options, #selected-size, #selection-summary.
// Siapkan state awal ukuran M. Pasang event click pada tombol ukuran.
// Update state, class is-active, aria-pressed, dan ringkasan.

// TODO 02 — Quantity, validasi, dan subtotal
// Selector: #quantity, #qty-minus, #qty-plus, #quantity-error,
// #subtotal, #selection-summary, #stock-label, #add-to-cart.
// Gunakan event input dan click. Ubah input menjadi number dan validasi.
// Tolak kosong, 0, negatif, pecahan, dan jumlah melebihi stok total.
// Saat valid, perbarui subtotal dan ringkasan; saat invalid, tampilkan alasan
// dan cegah penambahan ke tas. Jangan biarkan subtotal lama terlihat valid.
// Gunakan satu fungsi pembaruan untuk semua jalur input.

// TODO 03 — Hubungkan Add to Cart dengan cart.js
// Saat klik, validasi kembali ukuran/quantity serta stok gabungan di cart.
// Jika valid, panggil fungsi penambahan cart yang kamu buat sendiri.
// Render ulang cart count, subtotal keranjang, dan feedback halaman.
// Gunakan #product-feedback dan kemudian sambungkan toast (TODO 07).

// TODO 07 — Toast notification
// Selector: #toast, #toast-message, #toast-close.
// Tampilkan feedback dengan textContent, hidden, classList.
// Gunakan setTimeout untuk menutup otomatis, clearTimeout jika ada toast lama.
// Pasang listener close satu kali saja.

// TODO 09 — Inisialisasi
// Setelah fungsi masing-masing modul selesai, panggil inisialisasinya di sini.
// Jangan memasang ulang listener tetap setiap kali render.
