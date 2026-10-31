import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { formatPrice } from "../../script/priceFormat.js";
import { displayCartCount } from "../../script/navigation.js";

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

    const li = document.createElement("li");
    li.dataset.productNo = storageItem.No;
    li.dataset.color = storageItem.color;
    li.dataset.size = storageItem.size;
    li.innerHTML = `
        <img src="${storageItem.imageName !== "none" ? `./images/shop/secondSection/articleOptions/${storageItem.articleImg}` : `./images/shop/secondSection/${product.articleImg}.webp`}" alt="${storageItem.imageName}" class="summary-cart-article-image" />
        <div class="summary-article-details">
          <p class="summary-title">${product.article}</p>
          <p class="summary-color">Color: <span>${storageItem.color}</span></p>
          <p class="summary-size">Size: <span>${storageItem.size}</span></p>
          <p class="summary-condition">Condition: <span>${product.condition}</span></p>
        </div>
        <div class="summary-article-opt">
          <p class="summary-price"><span>${formatPrice(product.price * storageItem.quantity)}</span></p>
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
      renderTotalCosts(products);
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
      renderTotalCosts(products);
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
  const setting = await fetchSettings();
  const subTotal = document.querySelector(".summary-subtotal");
  const delFee = document.querySelector(".summary-del-fee");
  const tax = document.querySelector(".summary-tax");
  const grandTotal = document.querySelector(".summary-total");
  const storage = JSON.parse(localStorage.getItem("luxuriaTemp")) || [];
  const subtotal = storage.reduce((total, storeItem) => {
    const foundItem = products.find(
      (item) => String(item.No) === String(storeItem.No),
    );
    if (!foundItem) return total;
    return total + Number(foundItem.price) * Number(storeItem.quantity);
  }, 0);

  subTotal.innerHTML = formatPrice(subtotal);
  delFee.innerHTML =
    Number(subtotal) > Number(setting[0].difference)
      ? formatPrice(0)
      : formatPrice(setting[0].shippingFee);
  tax.innerHTML = formatPrice(Number(setting[0].taxFee) * subtotal);
  grandTotal.innerHTML = formatPrice(
    Number(subtotal) +
      Number(setting[0].taxFee * subtotal) +
      Number(
        subtotal > Number(setting[0].difference)
          ? 0
          : Number(setting[0].shippingFee),
      ),
  );
}
