// Pilihan produk, validasi, feedback, dan inisialisasi halaman.
const get = (id) => document.getElementById(id);
const sizeButtons = document.querySelectorAll("#size-options button");
const quantityInput = get("quantity");
let selectedSize = "M";
const TOAST_DURATION_MS = 3000;
let toastTimer;

function formatRupiah(value) {
  return "Rp" + value.toLocaleString("id-ID");
}

function renderSize() {
  sizeButtons.forEach((button) => {
    const active = button.dataset.size === selectedSize;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  get("selected-size").textContent = selectedSize;
  updateSelection();
}

function validateQuantity(raw) {
  const quantity = Number(raw);
  const remaining = getRemainingStock();
  if (
    String(raw).trim() === "" ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return { valid: false, message: "Jumlah harus bilangan bulat positif." };
  }
  if (quantity > remaining) {
    return {
      valid: false,
      message: `Jumlah melebihi stok tersisa (${remaining} unit).`,
    };
  }
  return { valid: true, quantity };
}

function updateSelection() {
  const remaining = getRemainingStock();
  const validation = validateQuantity(quantityInput.value);
  const quantityErrorElement = get("quantity-error");
  const quantity = Number(quantityInput.value);
  get("stock-label").textContent = `${remaining} tersedia`;
  quantityInput.max = remaining;
  quantityErrorElement.hidden = validation.valid;
  quantityErrorElement.textContent = validation.valid ? "" : validation.message;
  quantityInput.setAttribute("aria-invalid", String(!validation.valid));
  get("subtotal").textContent = validation.valid
    ? formatRupiah(product.price * validation.quantity)
    : "—";
  get("selection-summary").textContent = validation.valid
    ? `Ukuran ${selectedSize} · ${validation.quantity} item`
    : `Ukuran ${selectedSize} · jumlah belum valid`;
  get("add-to-cart").disabled = !validation.valid || checkoutProcessing;
  get("qty-minus").disabled =
    remaining === 0 || (validation.valid && quantity <= 1);
  get("qty-plus").disabled =
    remaining === 0 || (validation.valid && quantity >= remaining);
}

function changeQuantity(delta) {
  const remaining = getRemainingStock();
  if (remaining < 1 || checkoutProcessing) {
    return;
  }
  let current = Number(quantityInput.value);
  if (!Number.isInteger(current) || current < 1) {
    current = 1;
  }
  quantityInput.value = Math.min(remaining, Math.max(1, current + delta));
  clearProductFeedback();
  updateSelection();
}

function handleAddToCart() {
  const validation = validateQuantity(quantityInput.value);
  if (
    !validation.valid ||
    !product.sizes.includes(selectedSize) ||
    checkoutProcessing
  ) {
    updateSelection();
    showProductFeedback(validation.message || "Pilihan tidak valid.", true);
    return;
  }
  if (!addCartItem(selectedSize, validation.quantity)) {
    return;
  }
  renderCart();
  updateSelection();
  showProductFeedback(
    `${validation.quantity} kemeja ukuran ${selectedSize} ditambahkan ke tas.`
  );
}

function clearProductFeedback() {
  const feedback = get("product-feedback");
  feedback.textContent = "";
  feedback.classList.remove("is-error");
}

function showProductFeedback(message, isError = false) {
  const feedback = get("product-feedback");
  feedback.textContent = message;
  feedback.classList.toggle("is-error", isError);
  showToast(message, isError);
}

function hideToast() {
  clearTimeout(toastTimer);
  get("toast").hidden = true;
}

function showToast(message, isError = false) {
  clearTimeout(toastTimer);
  const toast = get("toast");
  get("toast-message").textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.querySelector(".toast-icon").textContent = isError ? "!" : "✓";
  toast.hidden = false;
  toastTimer = setTimeout(hideToast, TOAST_DURATION_MS);
}

// Listener
function init() {
  sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectedSize = button.dataset.size;
      clearProductFeedback();
      renderSize();
    });
  });
  quantityInput.addEventListener("input", () => {
    clearProductFeedback();
    updateSelection();
  });
  get("qty-minus").addEventListener("click", () => changeQuantity(-1));
  get("qty-plus").addEventListener("click", () => changeQuantity(1));
  get("product-form").addEventListener("submit", (event) =>
    event.preventDefault()
  );
  get("add-to-cart").addEventListener("click", handleAddToCart);
  get("toast-close").addEventListener("click", hideToast);
  get("product-price").textContent = formatRupiah(product.price);
  initCart();
  initGallery();
  initCheckout();
  renderSize();
  renderCart();
}

init();
