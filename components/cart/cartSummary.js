import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { formatPrice } from "../../script/priceFormat.js";
import { displayCartCount } from "../../script/navigation.js";
import {
  formatCurrency,
  getExchangeRates,
  convertCurrency,
} from "../shop/filters.js";
import { languages, translateColors } from "../../script/translation.js";

let fetchDataArr = [];
export async function fetchSummaryData() {
  const cartSecond = document.querySelector(".summary-left-container");
  setSectionLoading(cartSecond, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shop-articles", "products");
    renderTemporaryCart([...fetchDataArr]);
  } catch (error) {
    console.log(error);
    showSectionError(cartSecond);
  } finally {
    setSectionLoading(cartSecond, false);
  }
}

export function renderTemporaryCart(products) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  const summaryList = document.querySelector(".cart-summary-list");
  const toCheckoutBtn = document.querySelector(".to-checkout");
  if (!summaryList) return;
  if (storage.length === 0) {
    const p = document.createElement("p");
    p.classList.add("storage-zero");
    p.textContent = "You don't have item in your cart.";
    summaryList.appendChild(p);
    toCheckoutBtn.classList.remove("enableCheckout");
    return;
  }

  summaryList.innerHTML = "";
  storage.forEach((storageItem) => {
    const product = products.find(
      (item) => String(item.No) === String(storageItem.No),
    );
    if (!product) {
      console.log(`No product found for ID: ${storageItem.No}`);
      return;
    }
    const rates = getExchangeRates();
    const currency = changeLanguage === "ja" ? "JPY" : "USD";
    const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
    const itemTotal = Number(product.price) * Number(storageItem.quantity);
    const displayItemTotal = rates
      ? convertCurrency(Number(itemTotal), currency, rates)
      : Number(itemTotal);
    const displayCurrency = rates ? currency : "USD";
    const displayLocale = rates ? locale : "en-US";

    const li = document.createElement("li");
    li.dataset.productNo = storageItem.No;
    li.dataset.color = storageItem.color;
    li.dataset.size = storageItem.size;
    li.innerHTML = `
        <img src="${storageItem.imageName !== "none" ? `./images/shop/secondSection/articleOptions/${storageItem.articleImg}` : `./images/shop/secondSection/${product.articleImg}.webp`}" alt="${storageItem.imageName}" class="summary-cart-article-image" />
        <div class="summary-article-details">
          <p class="summary-title">${changeLanguage == "en" ? product.article : product.articleJA}</p>
          <p class="summary-color"><span >${languages[changeLanguage].summaryColor}</span> <span>${translateColors(storageItem.color, changeLanguage)}</span></p>
          <p class="summary-size"><span >${languages[changeLanguage].summarySize}</span> <span>${storageItem.size}</span></p>
          <p class="summary-condition"><span >${languages[changeLanguage].summaryCondition}</span> <span>${changeLanguage === "en" ? product.condition : product.conditionJA}</span></p>
        </div>
        <div class="summary-article-opt">
          <p class="summary-price"><span>${changeLanguage === "en" ? formatPrice(itemTotal) : formatCurrency(displayItemTotal, displayCurrency, displayLocale)}</span></p>
          <div>
            <button type="button" class="summary-decrease-count">-</button>
            <span class="summary-cart-count">${storageItem.quantity}</span>
            <button type="button" class="summary-increase-count">+</button>
          </div>
          <button type="button" class="delete-item">
            <img
              src="./images/cart/secondSection/delete.svg"
              alt="delete-button"
            />
          </button>
        </div>
    `;
    summaryList.appendChild(li);
    //enable checkout button
    toCheckoutBtn.classList.add("enableCheckout");
  });
  increaseDecreaseQuantity(products);
  renderTotalCosts(products);
  deleteItemHandler(products);
}

function increaseDecreaseQuantity(products) {
  const summaryList = document.querySelector(".cart-summary-list");
  const summaryAdd = summaryList.querySelectorAll(".summary-increase-count");
  const summaryMinus = summaryList.querySelectorAll(".summary-decrease-count");

  summaryAdd.forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li");
      const productNo = String(li.dataset.productNo);
      const color = String(li.dataset.color);
      const size = String(li.dataset.size);
      const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
      const itemExist = storage.find(
        (item) =>
          String(item.No) === productNo &&
          String(item.color) === color &&
          String(item.size) === size,
      );
      if (itemExist) {
        let span = btn.parentElement.querySelector(".summary-cart-count");
        itemExist.quantity += 1;
        span.textContent = itemExist.quantity;
        localStorage.setItem("luxuriaTemp", JSON.stringify(storage));
      }
      renderTemporaryCart(products);
      displayCartCount();
    });
  });
  summaryMinus.forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li");
      const productNo = String(li.dataset.productNo);
      const color = String(li.dataset.color);
      const size = String(li.dataset.size);
      const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
      const itemExist = storage.find(
        (item) =>
          String(item.No) === productNo &&
          String(item.color) === color &&
          String(item.size) === size,
      );
      console.log(itemExist);
      if (itemExist) {
        let span = btn.parentElement.querySelector(".summary-cart-count");
        itemExist.quantity = Math.max(1, itemExist.quantity - 1);
        span.textContent = itemExist.quantity;
        localStorage.setItem("luxuriaTemp", JSON.stringify(storage));
      }
      renderTemporaryCart(products);
      displayCartCount();
    });
  });
}

function deleteItemHandler(products) {
  const delBtn = document.querySelectorAll(".delete-item");
  delBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const li = btn.closest("li");
      const productNo = String(li.dataset.productNo);
      const color = String(li.dataset.color);
      const size = String(li.dataset.size);
      let storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
      storage = storage.filter(
        (item) =>
          !(
            String(item.No) === productNo &&
            String(item.color) === color &&
            String(item.size) === size
          ),
      );
      localStorage.setItem("luxuriaTemp", JSON.stringify(storage));
      li.remove();
      displayCartCount();
      renderTotalCosts(products);
      renderTemporaryCart(products);
    });
  });
}

export async function fetchSettings() {
  try {
    const fetchDataArr = await fetchSpecificSheet(
      "paymentSettings",
      "settingFees",
    );
    return fetchDataArr;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function renderTotalCosts(products) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const setting = await fetchSettings();

  const summary = document.querySelector(".summary-totals");
  const subTotal = summary.querySelector(".summary-subtotal");
  const delFee = summary.querySelector(".summary-del-fee");
  const tax = summary.querySelector(".summary-tax");
  const grandTotal = summary.querySelector(".summary-total");

  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  const subtotal = storage.reduce((total, storeItem) => {
    const foundItem = products.find(
      (item) => String(item.No) === String(storeItem.No),
    );
    if (!foundItem) return total;
    return total + Number(foundItem.price) * Number(storeItem.quantity);
  }, 0);

  //display selected currency
  const rates = getExchangeRates();
  const currency = changeLanguage === "ja" ? "JPY" : "USD";
  const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
  const displayCurrency = rates ? currency : "USD";
  const displayLocale = rates ? locale : "en-US";

  const displaySubTotal = rates
    ? convertCurrency(Number(subtotal), currency, rates)
    : Number(subtotal);
  subTotal.innerHTML =
    changeLanguage === "en"
      ? formatPrice(subtotal)
      : formatCurrency(displaySubTotal, displayCurrency, displayLocale);

  const displayDelFee = rates
    ? convertCurrency(Number(setting[0].shippingFee), currency, rates)
    : Number(setting[0].shippingFee);
  delFee.innerHTML =
    Number(subtotal) > Number(setting[0].difference)
      ? changeLanguage === "en"
        ? formatPrice(0)
        : formatCurrency(0, displayCurrency, displayLocale)
      : changeLanguage === "en"
        ? formatPrice(setting[0].shippingFee)
        : formatCurrency(Number(displayDelFee), displayCurrency, displayLocale);

  const displayTax = rates
    ? convertCurrency(Number(setting[0].taxFee * subtotal), currency, rates)
    : Number(setting[0].taxFee * subtotal);
  tax.innerHTML =
    changeLanguage === "en"
      ? formatPrice(Number(setting[0].taxFee) * subtotal)
      : formatCurrency(Number(displayTax), displayCurrency, displayLocale);

  const displayTotal =
    Number(subtotal) +
    Number(setting[0].taxFee * subtotal) +
    Number(
      subtotal > Number(setting[0].difference)
        ? 0
        : Number(setting[0].shippingFee),
    );
  const convertedTotal = rates
    ? convertCurrency(displayTotal, currency, rates)
    : displayTotal;
  grandTotal.innerHTML =
    changeLanguage === "en"
      ? formatPrice(displayTotal)
      : formatCurrency(Number(convertedTotal), displayCurrency, displayLocale);
}
