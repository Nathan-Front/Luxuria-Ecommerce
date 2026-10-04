import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { formatPrice } from "../../script/priceFormat.js";

export async function fetchCheckoutData() {
  let fetchDataArr = [];
  const cartList = document.querySelector(".order-summary");
  const formContainer = document.querySelector(".checkout-right-con");
  formContainer.classList.add("disableForm");

  setSectionLoading(cartList, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shop-articles", "products");
    renderCartContent([...fetchDataArr]);
    await fetchSettingFees([...fetchDataArr]);
  } catch (error) {
    console.log(error);
    showSectionError(cartList);
  } finally {
    setSectionLoading(cartList, false);
    formContainer.classList.remove("disableForm");
  }
}
export async function fetchSettingFees(products) {
  let fetchDataArr = [];
  const cartList = document.querySelector(".order-summary");
  const formContainer = document.querySelector(".checkout-right-con");
  formContainer.classList.add("disableForm");

  setSectionLoading(cartList, true);
  try {
    fetchDataArr = await fetchSpecificSheet("paymentSettings", "settingFees");
    renderCheckoutTotals(products, fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(cartList);
  } finally {
    setSectionLoading(cartList, false);
    formContainer.classList.remove("disableForm");
  }
}

export function renderCartContent(products) {
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
        src="./images/shop/secondSection/articleOptions/${storageItem.articleImg}"
        alt="${storageItem.articleName}"
        class="checkout-image"
      />
      <div>
        <div class="checkout-product-price">
          <p class="checkout-product">${product.article}</p>
          <p class="checkout-price">${formatPrice(product.price * storageItem.quantity)}</p>
        </div>
        <p class="checkout-color">${storageItem.color}</p>
        <div class="checkout-size-count">
          <span class="checkout-size">${storageItem.size}</span> x
          <span class="checkout-count">${storageItem.quantity}</span>
        </div>
      </div>
      `;
      cartCon.appendChild(li);
    }
  });
}

function renderCheckoutTotals(products, settingFees) {
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
  shipping.innerHTML = `${settingFees[0].shippingFee !== "free" ? formatPrice(settingFees[0].shippingFee) : formatPrice(0)}`;
  tax.innerHTML = `${settingFees[0].taxFee !== 0 ? formatPrice(settingFees[0].taxFee) : formatPrice(0)}`;
  grandTotal.innerHTML = `${formatPrice(subtotalValue + (settingFees[0].shippingFee !== "free" ? parseFloat(settingFees[0].shippingFee) : 0) + (settingFees[0].taxFee !== 0 ? parseFloat(settingFees[0].taxFee) : 0))}`;
}
