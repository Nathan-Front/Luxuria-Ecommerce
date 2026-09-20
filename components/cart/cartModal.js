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
  const size = document.querySelector(".product-size");
  const price = document.querySelector(".product-price");
  const condition = document.querySelector(".product-condition");
  if (!article || !product || !color || !price || !condition) return;

  article.src = `./images/shop/secondSection/${selectedItem.articleImg}.webp`;
  article.alt = selectedItem.articleAlt;
  const colorSelected = document.querySelector(
    'input[name="color"]:checked',
  )?.value;
  const sizeSelected = document.querySelector(
    'input[name="size"]:checked',
  )?.value;

  product.textContent = selectedItem.article;
  color.textContent = colorSelected;
  size.textContent = sizeSelected;
  price.textContent = selectedItem.price;
  condition.textContent = selectedItem.condition;

  const articleSelected = {
    article: selectedItem.article,
    color: colorSelected,
    size: sizeSelected,
    price: selectedItem.price,
  };
  saveToCartHandler(articleSelected);
  productCountHandler();
  colorSelectHandler(articleSelected);
  sizeSelectHandler(articleSelected);
}

export function colorSelectHandler(articleSelected) {
  const colors = document.querySelectorAll('input[name="color"]');
  const colorIndicator = document.querySelector(".product-color");

  colors.forEach((input) => {
    input.addEventListener("change", () => {
      articleSelected.color = input.value;
      colorIndicator.textContent = input.value;
      saveToCartHandler(articleSelected);
    });
  });
}

export function sizeSelectHandler(articleSelected) {
  const sizes = document.querySelectorAll(`input[name="size"]`);
  const size = document.querySelector(".product-size");
  sizes.forEach((input) => {
    input.addEventListener("change", () => {
      articleSelected.size = input.value;
      size.textContent = input.value;
      saveToCartHandler(articleSelected);
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

function saveToCartHandler(articleSelected) {
  console.log(articleSelected);
}
