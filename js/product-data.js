// DATA HARDCODED — bukan API. Harga dan ukuran meneruskan Product 1.
// Stok 10 adalah asumsi demo baru: total seluruh ukuran, BUKAN 10 per ukuran.
const product = {
  id: 1,
  name: "Kemeja Linen Biru",
  price: 150000,
  stock: 10,
  sizes: ["S", "M", "L"],
  color: "Dusty Blue",
  images: [
    {
      src: "assets/linen-blue-front.svg",
      alt: "Ilustrasi Kemeja Linen Biru tampak depan",
    },
    {
      src: "assets/linen-blue-back.svg",
      alt: "Ilustrasi Kemeja Linen Biru tampak belakang",
    },
    {
      src: "assets/linen-blue-detail.svg",
      alt: "Ilustrasi detail kain dan kancing",
    },
  ],
};
