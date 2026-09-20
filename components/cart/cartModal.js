import { hideAuthCon } from "../../script/index.js";

function hideCartModal() {
  const cartModal = document.querySelector(".cart-modal");
  cartModal.classList.remove("cartModal");
}

export function hideModalCartHandler() {
  const close = document.querySelector(".close-cart-modal");
  close.addEventListener("click", () => {
    hideCartModal();
    hideAuthCon();
  });
}

export function renderCartModalHandler(selectedItem) {
  const article = document.querySelector(".cart-article-image");

  const product = document.querySelector(".product-title");
  const color = document.querySelector(".product-color");
  const price = document.querySelector(".product-price");
  const condition = document.querySelector(".product-condition");
  if (!article || !product || !color || !price || !condition) return;

  article.src = `./images/shop/secondSection/${selectedItem.articleImg}.webp`;
  article.alt = selectedItem.articleAlt;
  product.textContent = selectedItem.article;
  color.textContent = selectedItem.color;
  price.textContent = selectedItem.price;
  condition.textContent = selectedItem.condition;

  console.log("articleImg:", selectedItem.articleImg);
  console.log("src:", article.src);
  productCountHandler();
}

export function colorSelectHandler() {
  const colors = document.querySelectorAll(`input[name="color"]`);
  colors.forEach((color) => {
    color.addEventListener("change", () => {
      console.log(color.value);
    });
  });
}

export function sizeSelectHandler() {
  const sizes = document.querySelectorAll(`input[name="size"]`);
  sizes.forEach((size) => {
    size.addEventListener("change", () => {
      console.log(size.value);
    });
  });
}

export function productCountHandler() {
  const add = document.getElementById("increase-count");
  const minus = document.getElementById("decrease-count");
  const counter = document.getElementById("cart-count");
  let cnt = 0;

  add.addEventListener("click", () => {
    if (add) {
      cnt++;
      counter.textContent = cnt;
    }
  });
  minus.addEventListener("click", () => {
    if (minus) {
      cnt = Math.max(0, cnt - 1);
      counter.textContent = cnt;
    }
  });
}
