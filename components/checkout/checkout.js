import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { formatPrice } from "../../script/priceFormat.js";
import {
  formatCurrency,
  formatWholeCurrency,
  getExchangeRates,
  convertCurrency,
} from "../shop/filters.js";
import { translateColors } from "../../script/translation.js";

export async function fetchCheckoutData() {
  let fetchDataArr = [];
  const cartList = document.querySelector(".order-summary");
  const formContainer = document.querySelector(".checkout-right-con");
  const paymentSelections = document.querySelector(".user-payment-con");
  formContainer.classList.add("disableForm");
  paymentSelections.classList.add("disableForm");
  setSectionLoading(cartList, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shop-articles", "products");
    renderCartContent([...fetchDataArr]);
    await fetchSettingFees([...fetchDataArr]);
    formContainer.classList.remove("disableForm");
  } catch (error) {
    console.log(error);
    showSectionError(cartList);
  } finally {
    setSectionLoading(cartList, false);
  }
}
export async function fetchSettingFees(products) {
  let fetchDataArr = [];
  const cartList = document.querySelector(".order-summary");
  const formContainer = document.querySelector(".checkout-right-con");
  const paymentSelections = document.querySelector(".user-payment-con");
  formContainer.classList.add("disableForm");
  paymentSelections.classList.add("disableForm");
  setSectionLoading(cartList, true);
  try {
    fetchDataArr = await fetchSpecificSheet("paymentSettings", "settingFees");
    renderCheckoutTotals(products, fetchDataArr);
    formContainer.classList.remove("disableForm");
  } catch (error) {
    console.log(error);
    showSectionError(cartList);
  } finally {
    setSectionLoading(cartList, false);
  }
}

export function renderCartContent(products) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  const cartCon = document.querySelector(".cart-items");
  cartCon.innerHTML = "";

  storage.forEach((storageItem) => {
    const product = products.find(
      (item) => String(item.No) === String(storageItem.No),
    );

    if (product) {
      const li = document.createElement("li");
      li.innerHTML = `
      <img
        src="./images/shop/secondSection/articleOptions/${storageItem.articleImg.endsWith(".webp") ? storageItem.articleImg : `${storageItem.articleImg}.webp`}"
        alt="${storageItem.articleName}"
        class="checkout-image"
      />
      <div>
        <div class="checkout-product-price">
          <p class="checkout-product">${changeLanguage === "en" ? product.article : product.articleJA}</p>
          <p class="checkout-price">${formatPrice(product.price * storageItem.quantity)}</p>
        </div>
        <p class="checkout-color">${translateColors(storageItem.color, changeLanguage)}</p>
        <div class="checkout-size-count">
          <span class="checkout-size">${storageItem.size}</span> x
          <span class="checkout-count">${storageItem.quantity}</span>
        </div>
      </div>
      `;
      cartCon.appendChild(li);
    }
  });
  const counter = document.querySelector(".checkout-quantity");
  counter.textContent =
    `${storage.length} ${changeLanguage === "en" ? `item${storage.length > 1 ? "s" : ""}` : `商品`}` ||
    `${changeLanguage === "en" ? "0 item" : "0 商品"}`;
}

function renderCheckoutTotals(products, settingFees) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const subtotal = document.querySelector(".checkout-subtotal");
  const shipping = document.querySelector(".checkout-del-fee");
  const tax = document.querySelector(".checkout-tax");
  const grandTotal = document.querySelector(".checkout-total");
  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  const subtotalValue = storage.reduce((total, item) => {
    const product = products.find((p) => String(p.No) === String(item.No));
    if (product) {
      return total + product.price * item.quantity;
    }
  }, 0);
  subtotal.innerHTML = `${formatPrice(subtotalValue)}`;
  if (storage.length !== 0) {
    shipping.innerHTML = `${subtotalValue > Number(settingFees[0].difference) ? formatPrice(0) : formatPrice(settingFees[0].shippingFee)}`;
    tax.innerHTML = `${formatPrice(settingFees[0].taxFee * subtotalValue)}`;
    grandTotal.innerHTML = `${formatPrice(subtotalValue + (subtotalValue > Number(settingFees[0].difference) ? 0 : parseFloat(settingFees[0].shippingFee)) + (settingFees[0].taxFee !== 0 ? parseFloat(settingFees[0].taxFee * subtotalValue) : 0))}`;
  } else {
    shipping.innerHTML = formatPrice(0);
    tax.innerHTML = formatPrice(0);
    grandTotal.innerHTML = formatPrice(0);
  }

  const language = localStorage.getItem("language") || "en";
  const rates = getExchangeRates();
  const currency = language === "ja" ? "JPY" : "USD";
  const locale = language === "ja" ? "ja-JP" : "en-US";
  const displayPrice = rates
    ? convertCurrency(Number(300), currency, rates)
    : Number(300);

  const displayCurrency = rates ? currency : "USD";
  const displayLocale = rates ? locale : "en-US";
  const freeShipping = document.querySelector(".freeShip");
  freeShipping.innerHTML = `
   ${language === "en" ? `Free shipping on orders over ${formatWholeCurrency(displayPrice, displayCurrency, displayLocale)}` : `${formatCurrency(displayPrice, displayCurrency, displayLocale)}以上のお買い上げで送料無料`}
  `;

  const isFreeShipping = document.querySelector(".difference");

  if (Number(subtotalValue) > Number(settingFees[0].difference)) {
    isFreeShipping.textContent =
      changeLanguage === "en"
        ? `You're order is eligible for free shipping`
        : `ご注文は送料無料の対象です`;
  } else {
    const rates = getExchangeRates();
    const displayPrice = rates
      ? convertCurrency(
          Number(settingFees[0].difference - subtotalValue),
          currency,
          rates,
        )
      : Number(settingFees[0].difference - subtotalValue);
    isFreeShipping.textContent = `${
      changeLanguage === "en"
        ? `You're $${Number(settingFees[0].difference - subtotalValue).toFixed(2)} away from free shipping`
        : `後${`${formatCurrency(displayPrice, displayCurrency, displayLocale)}`}で、送料無料となります。`
    }`;
  }
}
