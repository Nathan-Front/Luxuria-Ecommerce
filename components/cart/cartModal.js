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
    No: selectedItem.No,
    color: colorSelected,
    size: sizeSelected,
    quantity: 1,
  };

  colorSelectHandler(articleSelected);
  sizeSelectHandler(articleSelected);
  productCountHandler(articleSelected);
  saveToCartHandler(articleSelected);
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
  if (!add || !minus) return;
  const counter = document.getElementById("cart-count");
  let cnt = 1;

  add.addEventListener("click", () => {
    cnt++;
    counter.textContent = cnt;
    articleSelected.quantity = cnt;
    saveToCartHandler(articleSelected);
  });
  minus.addEventListener("click", () => {
    cnt = Math.max(1, cnt - 1);
    counter.textContent = cnt;
    articleSelected.quantity = cnt;
    saveToCartHandler(articleSelected);
  });
}

function saveToCartHandler(articleSelected) {
  const addTocartBtn = document.querySelector(".add-item");
  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  addTocartBtn.addEventListener("click", () => {
    let itemExist = storage.find(
      (item) =>
        item.No === articleSelected.No &&
        item.color === articleSelected.color &&
        item.size === articleSelected.size,
    );
    if (itemExist) {
      itemExist.quantity += articleSelected.quantity;
    } else {
      storage.push(articleSelected);
    }
    localStorage.setItem("luxuriaTemp", JSON.stringify(storage));
  });
}
