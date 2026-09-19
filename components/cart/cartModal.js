import { hideAuthCon } from "../../script/index.js";
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
