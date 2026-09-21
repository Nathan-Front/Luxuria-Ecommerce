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
    document.querySelector("#black").checked = true;
    document.querySelector('input[name="size"][value="m"]').checked = true;
    document.getElementById("cart-count").textContent = 1;
  });
}

export function renderCartModalHandler(selectedItem) {
  const article = document.querySelector(".cart-article-image");
  const product = document.querySelector(".product-title");
  const color = document.querySelector(".product-color");
  const size = document.querySelector(".product-size");
  const price = document.querySelector(".product-price");
  const condition = document.querySelector(".product-condition");

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
  condition.textContent = selectedItem.condition
    ? selectedItem.condition
    : "In Stock";

  const articleSelected = {
    article: selectedItem.article,
    articleImg: selectedItem.articleImg,
    color: colorSelected,
    size: sizeSelected,
    price: selectedItem.price,
    quantity: 1,
  };

  colorSelectHandler(articleSelected);
  sizeSelectHandler(articleSelected);
  productCountHandler(articleSelected);
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

export function productCountHandler(articleSelected) {
  const add = document.getElementById("increase-count");
  const minus = document.getElementById("decrease-count");
  const counter = document.getElementById("cart-count");
  let cnt = 1;

  add.addEventListener("click", () => {
    cnt++;
    counter.textContent = cnt !== 1 ? cnt : 1;
    articleSelected.quantity = cnt;
    saveToCartHandler(articleSelected);
  });
  minus.addEventListener("click", () => {
    cnt = Math.max(1, cnt - 1);
    counter.textContent = cnt !== 1 ? cnt : 1;
    articleSelected.quantity = cnt;
    saveToCartHandler(articleSelected);
  });
}

function saveToCartHandler(articleSelected) {
  console.log(articleSelected);
}
