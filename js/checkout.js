// TODO 06 — Custom modal dan asynchronous checkout simulation
// Selector: #checkout-open, #checkout-dialog, #checkout-close,
// #checkout-cancel, #checkout-confirm, #checkout-summary, #checkout-total,
// #checkout-loading, #checkout-feedback, input[name="checkout-scenario"].
// A. Buka dialog jika cart tidak kosong. Tampilkan ringkasan dan total.
//    Tutup drawer sebelum membuka modal agar dialog tidak bertumpuk.
// B. Buat function yang mengembalikan Promise. Gunakan setTimeout (misal 2s).
//    Skenario success -> resolve; error -> reject(new Error(...)).
//    Pilihan skenario tersedia pada modal. Tidak ada fetch atau API.
// C. Buat async event handler: validasi cart, cegah double click,
//    simpan snapshot pesanan, loading terlihat, kontrol dinonaktifkan.
//    Gunakan try/await/catch/finally untuk menangani kedua hasil.
// D. Success: tampilkan konfirmasi, kosongkan cart, render ulang.
//    Error: pertahankan cart, tampilkan alasan, izinkan retry.
//    Finally: hentikan loading; pulihkan kontrol yang sesuai.
// E. Saat pending, cegah penutupan modal (termasuk event cancel/Escape)
//    dan perubahan cart. Setelah selesai, jangan memproses sukses dua kali.
// F. Uji error lalu retry success, serta klik ganda.
