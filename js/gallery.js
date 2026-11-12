// Galeri utama dan zoom berbagi index agar selalu sinkron.
let activeImageIndex = 0;

function renderGallery() {
  const image = product.images[activeImageIndex];
  const currentPosition = String(activeImageIndex + 1).padStart(2, "0");
  const totalImages = String(product.images.length).padStart(2, "0");
  const position = `${currentPosition} / ${totalImages}`;
  get("hero-image").src = image.src;
  get("hero-image").alt = image.alt;
  get("zoom-image").src = image.src;
  get("zoom-image").alt = image.alt;
  get("gallery-position").textContent = position;
  get("zoom-position").textContent = position;
  document.querySelector(".image-badge span").textContent = currentPosition;
  document
    .querySelectorAll("#gallery-thumbnails button[data-index]")
    .forEach((button) => {
      const active = Number(button.dataset.index) === activeImageIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
}

function changeImage(delta) {
  const length = product.images.length;
  // Modulo membuat navigasi berputar dari akhir ke awal dan sebaliknya.
  activeImageIndex = (activeImageIndex + delta + length) % length;
  renderGallery();
}

function initGallery() {
  get("gallery-prev").addEventListener("click", () => changeImage(-1));
  get("gallery-next").addEventListener("click", () => changeImage(1));
  get("zoom-prev").addEventListener("click", () => changeImage(-1));
  get("zoom-next").addEventListener("click", () => changeImage(1));
  document
    .querySelectorAll("#gallery-thumbnails button[data-index]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        activeImageIndex = Number(button.dataset.index);
        renderGallery();
      });
    });
  get("gallery-zoom").addEventListener("click", () =>
    get("zoom-dialog").showModal()
  );
  get("zoom-close").addEventListener("click", () => get("zoom-dialog").close());
  get("zoom-dialog").addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      changeImage(event.key === "ArrowLeft" ? -1 : 1);
    }
  });
  renderGallery();
}
