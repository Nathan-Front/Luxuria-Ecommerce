import { displayCartCount } from "../../script/navigation.js";
import { colorOptions } from "../../script/colors.js";
import { hideGlobalAuth, openGlobalAuth } from "../../script/globalAuth.js";
import { formatPrice } from "../../script/priceFormat.js";
import {
  formatCurrency,
  getExchangeRates,
  convertCurrency,
} from "../shop/filters.js";
import { languages, translateColors } from "../../script/translation.js";
import { GOOGLE_APPS_SCRIPT_URL } from "../../script/index.js";
import { showSpinner, hideSpinner } from "../../script/index.js";

function hideCartModal() {
  const cartModal = document.querySelector(".cart-modal");
  cartModal.classList.remove("cartModal");
}

export function hideModalCartHandler() {
  const close = document.querySelector(".close-cart-modal");
  close.addEventListener("click", () => {
    document.querySelector(".product-color").textContent = "";
    hideCartModal();
    hideGlobalAuth();
    //document.querySelector("#black").checked = true;
    document.querySelector('input[name="size"][value="m"]').checked = true;
    document.getElementById("cart-count").textContent = 1;
  });
}
export function viewProductDetails() {
  const changeLanguage = localStorage.getItem("language") || "en";
  const viewBtn = document.querySelector(".view-product-details");
  viewBtn.onclick = () => {
    alert(
      `${changeLanguage === "en" ? "view details not yet available at the moment!" : "ただいま詳細準備中です！"}`,
    );
  };
}

export function renderColors(colorArr) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const colorCont = document.querySelector(".color-select");
  colorCont.innerHTML = "";
  if (colorArr.includes("none")) {
    const span = document.createElement("span");
    span.classList.add("no-color-opt");
    span.innerHTML = `
      ${changeLanguage === "en" ? languages.en.onlyOneColorText : languages.ja.onlyOneColorText}
    `;
    colorCont.appendChild(span);
    return;
  }
  Object.entries(colorOptions)
    .filter(([color]) => colorArr.includes(color))
    .forEach(([color, value], index) => {
      const label = document.createElement("label");
      label.classList.add("color-label");
      label.innerHTML = `
      <input
      type="radio"
      name="color"
      value="${color}"
      aria-label="${color}"
      ${index === 0 ? "checked" : ""}
      />
      <span class="checkmark" style="background-color: ${value};"> </span>
    `;
      colorCont.appendChild(label);
    });
}
export function colorInit() {
  const changeLanguage = localStorage.getItem("language") || "en";
  const colorCont = document.querySelector(".color-select");
  const colorDisplay = document.querySelector(".product-color");
  // Initial selected color after render
  const selectedRadio = colorCont.querySelector('input[name="color"]:checked');
  let selectedColor = selectedRadio?.value;
  if (selectedColor) {
    colorDisplay.textContent = translateColors(selectedColor, changeLanguage);
  } else {
    selectedColor = "none";
  }
  return selectedColor;
}

export function renderCartModalHandler(selectedItem) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const colorCont = document.querySelector(".color-select");
  const article = document.querySelector(".cart-article-image");
  const product = document.querySelector(".product-title");
  const size = document.querySelector(".product-size");
  const price = document.querySelector(".product-price");
  const condition = document.querySelector(".product-condition");

  const colorSelected = colorInit();

  const sizeSelected = document.querySelector(
    'input[name="size"]:checked',
  )?.value;
  product.textContent =
    changeLanguage === "en" ? selectedItem.article : selectedItem.articleJA;

  const sizeContainer = document.querySelector(".size-fieldset");
  if (sizeContainer.classList.contains("disabledSize")) {
    size.textContent = "-";
  } else {
    size.textContent = sizeSelected;
  }
  //initial display
  const rates = getExchangeRates();
  const currency = changeLanguage === "ja" ? "JPY" : "USD";
  const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
  const displayPrice = rates
    ? convertCurrency(Number(selectedItem.price), currency, rates)
    : Number(selectedItem.price);
  const displayCurrency = rates ? currency : "USD";
  const displayLocale = rates ? locale : "en-US";

  price.innerHTML =
    changeLanguage === "en"
      ? formatPrice(selectedItem.price)
      : formatCurrency(displayPrice, displayCurrency, displayLocale);

  condition.textContent =
    changeLanguage === "en"
      ? selectedItem.condition
      : selectedItem.conditionJA
        ? changeLanguage === "en"
          ? selectedItem.condition
          : selectedItem.conditionJA
        : "In Stock";

  const colorName = colorSelected.replace(/\s+/g, "_");
  const imageName = `${selectedItem.articleImg}_${colorName}.webp`;
  article.src =
    colorSelected !== "none"
      ? `./images/shop/secondSection/articleOptions/${imageName}`
      : `./images/shop/secondSection/${selectedItem.articleImg}.webp`;
  //Array to be rendered in summary
  const articleSelected = {
    No: selectedItem.No,
    color: colorSelected !== "none" ? colorSelected : "-",
    size: sizeContainer.classList.contains("disabledSize") ? "-" : sizeSelected,
    quantity: 1,
    articleImg: colorSelected !== "none" ? imageName : selectedItem.articleImg,
    imageName: colorSelected !== "none" ? imageName : colorSelected,
  };
  //Other color selection
  colorCont.onchange = (event) => {
    if (event.target.name !== "color") return;
    const newColor = event.target.value;
    articleSelected.color = newColor;

    const colorName = newColor.replace(/\s+/g, "_");

    const imageName = `${selectedItem.articleImg}_${colorName}.webp`;
    articleSelected.articleImg = imageName;
    articleSelected.imageName = imageName;
    article.src = `./images/shop/secondSection/articleOptions/${imageName}`;
    colorInit();
  };
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
  const changeLanguage = localStorage.getItem("language") || "en";
  const addTocartBtn = document.querySelector(".add-item");

  addTocartBtn.onclick = async () => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedIn") || "null");
    const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
    try {
      showSpinner();
      openGlobalAuth();
      let itemExist = storage.find(
        (item) =>
          String(item.No) === String(articleSelected.No) &&
          String(item.color || "-") === String(articleSelected.color || "-") &&
          String(item.size || "-") === String(articleSelected.size || "-"),
      );
      let message = "";
      //Save to Google Sheets only for logged-in users
      if (loggedUser?.userID) {
        if (itemExist) {
          itemExist.quantity += articleSelected.quantity;
          message =
            changeLanguage === "en"
              ? `${languages.en.saveToCartText1} \n${languages.en.saveToCartText2}`
              : `${languages.ja.saveToCartText1} \n${languages.ja.saveToCartText2}`;
        } else {
          storage.push(articleSelected);
          //console.log("selected", articleSelected);
          message =
            changeLanguage === "en"
              ? `${languages.en.addedToCartText}`
              : `${languages.ja.addedToCartText}`;
        }
        await syncUserCart(loggedUser.userID, storage);
      }
      //Update local cart
      localStorage.setItem("luxuriaTemp", JSON.stringify(storage));
      displayCartCount();
      hideCartModal();
      hideSpinner();
      hideGlobalAuth();
      alert(message);
    } catch (error) {
      console.log(error);
    } finally {
      hideSpinner();
      hideGlobalAuth();
    }
  };
}

export async function syncUserCart(userID, cart) {
  const cartData = cart.map((item) => ({
    article_ID: item.No,
    article_Color: item.color || "-",
    article_Size: item.size || "-",
    article_Quantity: Number(item.quantity),
    article_Image: item.articleImg || "",
    article_Name: item.imageName || "",
  }));

  const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      formType: "userCartCont",
      userID,
      cart: cartData,
    }),
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Could not save cart.");
  }
  return result;
}

export async function fetchUserCart() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedIn") || "null");
  if (!loggedUser?.userID) return;
  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        formType: "get-cart-content",
        userID: loggedUser.userID,
      }),
    });

    const result = await response.json();
    console.log("result", result);
    if (result.success) {
      localStorage.setItem("luxuriaTemp", JSON.stringify(result.cart));
      displayCartCount();
    }
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
  }
}

function mergeCarts(savedCart, guestCart) {
  //Copies of the items already saved in the user's account
  const mergedCart = savedCart.map((item) => ({ ...item }));

  guestCart.forEach((guestItem) => {
    const existingItem = mergedCart.find(
      (item) =>
        String(item.No) === String(guestItem.No) &&
        (item.color || "-") === (guestItem.color || "-") &&
        (item.size || "-") === (guestItem.size || "-"),
    );

    if (existingItem) {
      //If same item add quantity
      existingItem.quantity =
        Number(existingItem.quantity) + Number(guestItem.quantity);
    } else {
      //Add to merge cart if new item
      mergedCart.push({ ...guestItem });
    }
  });
  return mergedCart;
}

export async function mergeUserCartAfterLogin(userID) {
  try {
    const localCart = JSON.parse(localStorage.getItem("luxuriaTemp") || "[]");
    if (!localCart.length) return;
    const cartOwner = localStorage.getItem("luxuriaCartOwner");

    // Only treat the local cart as a guest cart if it has no owner.
    const guestCart = cartOwner ? [] : localCart;

    // Retrieve the user's saved cart.
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify({
        formType: "get-cart-content",
        userID,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Could not retrieve saved cart.");
    }

    const savedCart = result.cart || [];

    // Merge only genuine guest items with the saved account cart.
    const mergedCart = mergeCarts(savedCart, guestCart);

    // Save the final cart.
    await syncUserCart(userID, mergedCart);

    // Update localStorage and identify its owner.
    localStorage.setItem("luxuriaTemp", JSON.stringify(mergedCart));
    localStorage.setItem("luxuriaCartOwner", userID);

    displayCartCount();

    return mergedCart;
  } catch (error) {
    console.error("Cart merge failed:", error);
    throw error;
  }
}
