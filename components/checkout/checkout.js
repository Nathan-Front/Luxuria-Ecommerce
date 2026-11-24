import { formatPrice } from "../../script/priceFormat.js";
import {
  formatCurrency,
  formatWholeCurrency,
  getExchangeRates,
  convertCurrency,
} from "../shop/filters.js";
import { languages, translateColors } from "../../script/translation.js";
import { fetchProductData } from "../../script/fetchProducts.js";

export async function fetchCheckoutData() {
  const container = document.querySelector(".checkout-product-list-loader");
  const paymentSelections = document.querySelector(".user-payment-con");
  const totalsContainer = document.querySelector(".checkout-totals");
  container.classList.add("disableForm");
  try {
    paymentSelections.classList.add("disableForm");
    const fetchDataArr = await fetchProductData({
      sheetName: "shop-articles",
      dataKey: "products",
      container: container,
    });
    const fetchSettings = await fetchProductData({
      sheetName: "paymentSettings",
      dataKey: "settingFees",
      container: totalsContainer,
    });
    if (fetchDataArr.length === 0) return;
    renderCartContent([...fetchDataArr]);
    renderCheckoutTotals([...fetchDataArr], fetchSettings);
    container.classList.remove("disableForm");
  } catch (error) {
    console.log(error);
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
    const rates = getExchangeRates();
    const currency = changeLanguage === "ja" ? "JPY" : "USD";
    const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
    const displayPrice = rates
      ? convertCurrency(
          Number(product.price * storageItem.quantity),
          currency,
          rates,
        )
      : Number(0);

    const displayCurrency = rates ? currency : "USD";
    const displayLocale = rates ? locale : "en-US";
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
          <p class="checkout-price">${formatCurrency(displayPrice, displayCurrency, displayLocale)}</p>
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

  const rates = getExchangeRates();
  const currency = changeLanguage === "ja" ? "JPY" : "USD";
  const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
  const displayCurrency = rates ? currency : "USD";
  const displayLocale = rates ? locale : "en-US";

  const subtotalValue = storage.reduce((total, item) => {
    const product = products.find((p) => String(p.No) === String(item.No));

    if (product) {
      return total + product.price * item.quantity;
    }
  }, 0);
  const displaySubTotal = rates
    ? convertCurrency(Number(subtotalValue), currency, rates)
    : Number(0);
  const displayShipping = rates
    ? convertCurrency(Number(settingFees[0].shippingFee), currency, rates)
    : Number(0);
  const displayTax = rates
    ? convertCurrency(
        Number(settingFees[0].taxFee * subtotalValue),
        currency,
        rates,
      )
    : Number(0);
  const displayGrandTotal = rates
    ? convertCurrency(
        Number(
          subtotalValue +
            (subtotalValue > Number(settingFees[0].difference)
              ? 0
              : parseFloat(settingFees[0].shippingFee)) +
            (settingFees[0].taxFee !== 0
              ? parseFloat(settingFees[0].taxFee * subtotalValue)
              : 0),
        ),
        currency,
        rates,
      )
    : Number(0);
  subtotal.innerHTML = `${formatCurrency(displaySubTotal, displayCurrency, displayLocale)}`;
  if (storage.length !== 0) {
    shipping.innerHTML = `${subtotalValue > Number(settingFees[0].difference) ? formatCurrency(0, displayCurrency, displayLocale) : formatCurrency(displayShipping, displayCurrency, displayLocale)}`;
    tax.innerHTML = `${formatCurrency(displayTax, displayCurrency, displayLocale)}`;
    grandTotal.innerHTML = `${formatCurrency(displayGrandTotal, displayCurrency, displayLocale)}`;
  } else {
    shipping.innerHTML = formatPrice(0);
    tax.innerHTML = formatPrice(0);
    grandTotal.innerHTML = formatPrice(0);
  }

  const displayPrice = rates
    ? convertCurrency(Number(300), currency, rates)
    : Number(300);
  const freeShipping = document.querySelector(".freeShip");
  freeShipping.innerHTML = `
   ${
     changeLanguage === "en"
       ? `${languages.en.checkoutFreeShip1} ${formatWholeCurrency(displayPrice, displayCurrency, displayLocale)}`
       : `${formatCurrency(displayPrice, displayCurrency, displayLocale)}${languages.ja.checkoutFreeShip1}`
   }
  `;

  const isFreeShipping = document.querySelector(".difference");

  if (Number(subtotalValue) > Number(settingFees[0].difference)) {
    isFreeShipping.textContent =
      changeLanguage === "en"
        ? `${languages.en.checkoutFreeShip2}`
        : `${languages.ja.checkoutFreeShip2}`;
  } else {
    const rates = getExchangeRates();
    const displayPrice = rates
      ? convertCurrency(
          Number(settingFees[0].difference - subtotalValue),
          currency,
          rates,
        )
      : Number(settingFees[0].difference - subtotalValue);
    isFreeShipping.innerHTML = `${
      changeLanguage === "en"
        ? `${languages.en.checkoutCheckFree1} ${formatCurrency(Number(settingFees[0].difference - subtotalValue), displayCurrency, displayLocale)} ${languages.en.checkoutCheckFree2}`
        : `${languages.ja.checkoutCheckFree1} ${formatCurrency(displayPrice, displayCurrency, displayLocale)} ${languages.ja.checkoutCheckFree2}`
    }`;
  }
}
