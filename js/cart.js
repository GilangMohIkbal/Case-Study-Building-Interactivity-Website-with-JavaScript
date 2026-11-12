// TODO 03 — State keranjang (array of objects)
// Buat array kosong. Item minimal: id, size, quantity, price.
// Jika ukuran sudah ada, tambah quantity item tersebut, bukan baris duplikat.
// Hitung total quantity seluruh ukuran, bukan stok masing-masing ukuran.
// Jangan melebihi product.stock; validasi sebelum mutasi state.
// Gunakan find(), reduce(), filter() atau loop yang kamu pahami.

// TODO 04 — Render cart dan drawer
// Elemen: #cart-count, #cart-dialog-count, #cart-empty, #cart-items,
// #cart-total, #checkout-open, #cart-open, #cart-close, #cart-dialog.
// Buka/tutup dialog melalui showModal()/close().
// Clone #cart-item-template untuk setiap item, isi teks dengan textContent.
// Kontrol tambah/kurang/hapus: data-action pada template.
// Tentukan data-size atau identitas item agar event tahu item mana dipilih.
// Render dari state setiap kali berubah. Cart kosong: checkout disabled.
// Setelah menghapus/kurangi, stok yang masih dapat dipilih bertambah lagi.
// Pastikan cart count menghitung unit, bukan jumlah baris ukuran.
