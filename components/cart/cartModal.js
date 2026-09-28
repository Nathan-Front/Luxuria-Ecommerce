import { hideAuthCon } from "../../script/index.js";
import { displayCartCount } from "../../script/navigation.js";
import { colorOptions } from "../../script/colors.js";

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
export function renderColors(colorArr) {
  const colorCont = document.querySelector(".color-select");
  colorCont.innerHTML = "";

  Object.entries(colorOptions)
    .filter(([color]) => colorArr.includes(color))
    .forEach(([color, value], index) => {
      const label = document.createElement("label");
      label.classList.add("color-label");
      const colorId = color.replace(/\s+/g, "-");
      label.innerHTML = `
      <input
      type="radio"
      name="color"
      value="${color}"
      id="${colorId}"
      aria-label="${color}"
      ${index === 0 ? "checked" : ""}
      />
      <span class="checkmark" style="background-color: ${value};"></span>
  `;
      colorCont.appendChild(label);
    });
}
export function colorInit() {
  const colorCont = document.querySelector(".color-select");
  const colorDisplay = document.querySelector(".product-color");
  const article = document.querySelector(".cart-article-image");
  // Initial selected color
  const selectedRadio = colorCont.querySelector('input[name="color"]:checked');
  const selectedColor = selectedRadio?.value;
  if (selectedColor) {
    colorDisplay.textContent = selectedColor;
  }

  // when color is changed
  /* colorCont.onchange = (event) => {
    if (event.target.name !== "color") return;
    const newColor = event.target.value;
    colorDisplay.textContent = newColor;

    const colorName = newColor.replace(/\s+/g, "_");
    const imageName = `${selectedItem.articleImg}_${colorName}.webp`;
    article.src = `./images/shop/secondSection/articleOptions/${imageName}`;
  }; */
  return selectedColor;
}

export function renderCartModalHandler(selectedItem) {
  console.log("text", selectedItem);
  const colorCont = document.querySelector(".color-select");
  const article = document.querySelector(".cart-article-image");
  const product = document.querySelector(".product-title");
  //const color = document.querySelector(".product-color");
  const size = document.querySelector(".product-size");
  const price = document.querySelector(".product-price");
  const condition = document.querySelector(".product-condition");

  const colorSelected = colorInit();
  article.src = `./images/shop/secondSection/${selectedItem.articleImg}.webp`;
  article.alt = selectedItem.articleAlt;

  const sizeSelected = document.querySelector(
    'input[name="size"]:checked',
  )?.value;

  product.textContent = selectedItem.article;
  //color.textContent = selectedColor;

  const sizeContainer = document.querySelector(".size-fieldset");
  if (sizeContainer.classList.contains("disabledSize")) {
    size.textContent = "-";
  } else {
    size.textContent = sizeSelected;
  }

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
  const colorName = colorSelected.replace(/\s+/g, "_");
  const imageName = `${selectedItem.articleImg}_${colorName}.webp`;
  article.src = `./images/shop/secondSection/articleOptions/${imageName}`;
  colorCont.onchange = (event) => {
    if (event.target.name !== "color") return;

    const newColor = event.target.value;

    articleSelected.color = newColor;

    const colorName = newColor.replace(/\s+/g, "_");
    const imageName = `${selectedItem.articleImg}_${colorName}.webp`;
    article.src = `./images/shop/secondSection/articleOptions/${imageName}`;

    console.log(articleSelected);
  };
  console.log(articleSelected);
  colorSelectHandler(articleSelected);
  sizeSelectHandler(articleSelected);
  productCountHandler(articleSelected);
  saveToCartHandler(articleSelected);
}
export function disableSizeHandler(noSize) {
  const sizeContainer = document.querySelector(".size-fieldset");
  const sizeText = document.querySelector(".product-size");
  if (noSize) {
    sizeContainer.classList.add("disabledSize");
    sizeText.textContent = "";
  } else {
    sizeContainer.classList.remove("disabledSize");
  }
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
  addTocartBtn.onclick = () => {
    let itemExist = storage.find(
      (item) =>
        item.No === articleSelected.No &&
        item.color === articleSelected.color &&
        item.size === articleSelected.size,
    );
    if (itemExist) {
      itemExist.quantity += articleSelected.quantity;
      alert("Same item is already in the cart. \nQuantity increased");
    } else {
      storage.push(articleSelected);
      alert("Item added to cart.");
    }
    localStorage.setItem("luxuriaTemp", JSON.stringify(storage));
    displayCartCount();
    hideCartModal();
    hideAuthCon();
  };
}
