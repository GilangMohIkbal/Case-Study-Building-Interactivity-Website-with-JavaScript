// Simulasi checkout frontend; tidak ada request API atau pembayaran.
const CHECKOUT_DELAY_MS = 2000;
let checkoutProcessing = false;
let checkoutCompleted = false;

function simulateOrder(snapshot, shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(
          new Error("Simulasi gagal. Silakan pilih Berhasil lalu coba lagi.")
        );
      } else {
        resolve({ orderId: `SB-${Date.now()}`, total: snapshot.total });
      }
    }, CHECKOUT_DELAY_MS);
  });
}

function setCheckoutControls() {
  get("checkout-loading").hidden = !checkoutProcessing;
  get("checkout-close").disabled = checkoutProcessing;
  get("checkout-cancel").disabled = checkoutProcessing;
  get("checkout-cancel").textContent = checkoutCompleted ? "Tutup" : "Batal";
  const confirmButton = get("checkout-confirm");
  confirmButton.disabled = checkoutProcessing || checkoutCompleted;
  if (checkoutCompleted) {
    confirmButton.textContent = "Terkonfirmasi";
  } else if (checkoutProcessing) {
    confirmButton.textContent = "Memproses…";
  } else {
    confirmButton.textContent = "Konfirmasi demo";
  }
  document
    .querySelectorAll('input[name="checkout-scenario"]')
    .forEach((radio) => {
      radio.disabled = checkoutProcessing || checkoutCompleted;
    });
}

function openCheckout() {
  if (!getCartCount() || checkoutProcessing) {
    return;
  }
  checkoutCompleted = false;
  get("checkout-summary").textContent = getCartSnapshot()
    .map((item) => `Ukuran ${item.size} × ${item.quantity}`)
    .join(" · ");
  get("checkout-total").textContent = formatRupiah(getCartTotal());
  get("checkout-feedback").textContent = "";
  get("checkout-feedback").classList.remove("is-error");
  document.querySelector(
    'input[name="checkout-scenario"][value="success"]'
  ).checked = true;
  setCheckoutControls();
  get("cart-dialog").close();
  get("checkout-dialog").showModal();
}

async function handleCheckout() {
  if (
    checkoutProcessing ||
    checkoutCompleted ||
    !getCartCount() ||
    getRemainingStock() < 0
  ) {
    return;
  }
  // Ambil total saat konfirmasi; proses async memakai nilai yang sudah disalin.
  const snapshot = {
    total: getCartTotal(),
  };
  const shouldFail =
    document.querySelector('input[name="checkout-scenario"]:checked').value ===
    "error";
  const feedback = get("checkout-feedback");
  checkoutProcessing = true;
  feedback.textContent = "";
  feedback.classList.remove("is-error");
  setCheckoutControls();
  renderCart();
  updateSelection();
  try {
    const result = await simulateOrder(snapshot, shouldFail);
    checkoutCompleted = true;
    clearCart();
    feedback.textContent = `Pesanan demo berhasil! ${result.orderId} · ${formatRupiah(result.total)}.`;
  } catch (error) {
    feedback.textContent = error.message;
    feedback.classList.add("is-error");
    // Tidak mengubah cart ketika Promise ditolak.
  } finally {
    checkoutProcessing = false;
    setCheckoutControls();
    renderCart();
    updateSelection();
  }
}

function initCheckout() {
  get("checkout-open").addEventListener("click", openCheckout);
  get("checkout-confirm").addEventListener("click", handleCheckout);
  function closeCheckout() {
    if (!checkoutProcessing) {
      get("checkout-dialog").close();
    }
  }
  get("checkout-close").addEventListener("click", closeCheckout);
  get("checkout-cancel").addEventListener("click", closeCheckout);
  get("checkout-dialog").addEventListener("cancel", (event) => {
    if (checkoutProcessing) {
      event.preventDefault();
    }
  });
  get("checkout-dialog").addEventListener("close", () =>
    get("cart-open").focus()
  );
}
