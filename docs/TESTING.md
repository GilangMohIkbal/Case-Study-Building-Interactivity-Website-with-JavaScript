# Checklist pengujian Day 22

Isi setelah implementasi. Semua baris berikut adalah skenario target, **belum diuji terhadap fitur final**. Ganti `NOT RUN` dengan PASS/FAIL disertai actual result dan bukti screenshot/output browser. Lakukan reset/reload sebelum skenario yang perlu cart kosong.

| ID | Input / kondisi | Expected result | Actual result | Bukti |
|---|---|---|---|---|
| T01 | Buka index.html | Produk, harga Rp150.000, 3 thumbnail, ukuran M, stok 10, qty 1 tampil | NOT RUN | — |
| T02 | Klik S lalu L | Label/ringkasan mengikuti ukuran; satu tombol aktif | NOT RUN | — |
| T03 | Ubah qty menjadi 3 | Subtotal Rp450.000 tanpa reload | NOT RUN | — |
| T04 | Input 0 | Ditolak, feedback jelas, cart tidak bertambah | NOT RUN | — |
| T05 | Input -1 | Ditolak | NOT RUN | — |
| T06 | Input 1.5 | Ditolak | NOT RUN | — |
| T07 | Input 11 | Ditolak | NOT RUN | — |
| T08 | Kosongkan input | Ditolak, subtotal lama tidak dianggap valid | NOT RUN | — |
| T09 | Input 2 setelah invalid | Error hilang; subtotal Rp300.000 | NOT RUN | — |
| T10 | Minus dari 1, plus dari 10 (cart kosong) | Tidak keluar batas | NOT RUN | — |
| T11 | Tambahkan M ×2 | Feedback sukses, cart count 2, total Rp300.000 | NOT RUN | — |
| T12 | Tambahkan M ×1 dan L ×2 setelah T11 | 2 baris, 5 unit, Rp750.000 | NOT RUN | — |
| T13 | Tambah 6 setelah T12 | Tolak stok gabungan >10, cart tidak berubah | NOT RUN | — |
| T14 | Ubah qty item di drawer | Count dan total sinkron; tidak melebihi stok | NOT RUN | — |
| T15 | Hapus semua item | Empty state, Rp0, checkout disabled | NOT RUN | — |
| T16 | Klik thumbnail dan next/prev | Gambar, alt, indikator, active state sinkron | NOT RUN | — |
| T17 | Foto terakhir + next; pertama + prev | Wrap ke awal/akhir | NOT RUN | — |
| T18 | Zoom, prev/next, close | Gambar sinkron; dialog bisa ditutup | NOT RUN | — |
| T19 | Checkout dengan cart valid lalu batal | Cart tidak berubah | NOT RUN | — |
| T20 | Checkout skenario gagal | Loading terlihat, error, cart tetap, retry tersedia | NOT RUN | — |
| T21 | Retry skenario sukses setelah T20 | Sukses, cart kosong, loading berhenti | NOT RUN | — |
| T22 | Klik konfirmasi ganda saat pending | Hanya satu proses; kontrol terkunci | NOT RUN | — |
| T23 | Tekan Escape saat pending | Modal tidak ditutup hingga proses selesai | NOT RUN | — |
| T24 | Trigger toast berulang, close manual | Timer lama tidak menutup toast baru; bisa ditutup | NOT RUN | — |
| T25 | Desktop / mobile 390 px | Layout tidak overflow, dialog dapat digunakan | NOT RUN | — |
| T26 | DevTools Console dan Network | Tidak ada error JS; tidak ada fetch API/credential | NOT RUN | — |

## Informasi pengujian

- Browser / versi:
- Tanggal:
- Commit yang diuji:
- Catatan bug / perbaikan:
- Bukti (tambahkan file screenshot sendiri):
