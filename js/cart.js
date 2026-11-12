// Keranjang berada di memori browser; ukuran yang sama digabung.
let cart = [];

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Stok berlaku untuk seluruh ukuran, bukan per ukuran.
function getRemainingStock() {
  return product.stock - getCartCount();
}

function getCartSnapshot() {
  return cart.map((item) => ({ ...item }));
}

function clearCart() {
  cart = [];
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function addCartItem(size, quantity) {
  if (
    checkoutProcessing ||
    !product.sizes.includes(size) ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > getRemainingStock()
  ) {
    return false;
  }

  const existing = cart.find(
    (item) => item.id === product.id && item.size === size
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: product.id, size, quantity, price: product.price });
  }
  return true;
}

function renderCart() {
  const count = getCartCount();
  const cartBadge = get("cart-count");
  if (cartBadge.textContent !== String(count)) {
    cartBadge.textContent = count;
    cartBadge.classList.remove("is-bumping");
    // Paksa reflow agar animasi cart count dimulai ulang.
    void cartBadge.offsetWidth;
    cartBadge.classList.add("is-bumping");
  }
  get("cart-dialog-count").textContent = `(${count})`;
  get("cart-total").textContent = formatRupiah(getCartTotal());
  get("cart-empty").hidden = cart.length !== 0;
  get("checkout-open").disabled = cart.length === 0 || checkoutProcessing;
  const cartItemsContainer = get("cart-items");
  cartItemsContainer.replaceChildren();

  cart.forEach((item) => {
    const fragment = get("cart-item-template").content.cloneNode(true);
    const row = fragment.querySelector(".cart-item");
    row.dataset.size = item.size;
    row.querySelector(".item-name").textContent = product.name;
    row.querySelector(".item-size").textContent = `Ukuran ${item.size}`;
    row.querySelector(".item-quantity").textContent = item.quantity;
    row.querySelector(".item-total").textContent = formatRupiah(
      item.price * item.quantity
    );
    row.querySelector('[data-action="decrease"]').disabled =
      item.quantity <= 1 || checkoutProcessing;
    row.querySelector('[data-action="increase"]').disabled =
      getRemainingStock() <= 0 || checkoutProcessing;
    row.querySelector('[data-action="remove"]').disabled = checkoutProcessing;
    cartItemsContainer.append(fragment);
  });
}

function handleCartAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled || checkoutProcessing) {
    return;
  }
  const size = button.closest(".cart-item").dataset.size;
  const item = cart.find((entry) => entry.size === size);
  if (!item) {
    return;
  }
  const action = button.dataset.action;
  if (action === "increase" && getRemainingStock() > 0) {
    item.quantity++;
  } else if (action === "decrease" && item.quantity > 1) {
    item.quantity--;
  } else if (action === "remove") {
    cart = cart.filter((entry) => entry.size !== size);
  }
  renderCart();
  updateSelection();
  // Setelah render, tombol lama sudah diganti. Pulihkan fokus bila memungkinkan.
  const row = Array.from(get("cart-items").children).find(
    (element) => element.dataset.size === size
  );
  const replacement = row?.querySelector(`button[data-action="${action}"]`);
  if (replacement && !replacement.disabled) {
    replacement.focus();
  } else {
    get("cart-close").focus();
  }
}

function initCart() {
  get("cart-open").addEventListener("click", () => {
    if (checkoutProcessing) {
      return;
    }
    renderCart();
    get("cart-dialog").showModal();
  });
  get("cart-close").addEventListener("click", () => get("cart-dialog").close());
  get("cart-items").addEventListener("click", handleCartAction);
  get("cart-count").addEventListener("animationend", () =>
    get("cart-count").classList.remove("is-bumping")
  );
}
