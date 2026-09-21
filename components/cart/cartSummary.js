import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";

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
  if (storage.length === 0) {
    const p = document.createElement("p");
    p.classList.add("storage-zero");
    p.textContent = "You don't have item in your cart.";
    summaryList.appendChild(p);
    return;
  }

  summaryList.innerHTML = "";
  storage.forEach((storageItem) => {
    const product = products.find(
      (item) => String(item.No) === String(storageItem.Id),
    );
    console.log("Matched product:", product);
    if (!product) {
      console.log(`No product found for ID: ${storageItem.Id}`);
      return;
    }

    const li = document.createElement("li");
    li.innerHTML = `
        <img src="./images/shop/secondSection/${product.articleImg}.webp" alt="${product.articleImgAlt}" class="summary-cart-article-image" />
        <div class="summary-article-details">
          <p class="summary-title">${product.article}</p>
          <p class="summary-color">Color: <span>${storageItem.color}</span></p>
          <p class="summary-size">Size: <span>${storageItem.size}</span></p>
          <p class="summary-condition">Condition: <span>${product.condition}</span></p>
        </div>
        <div class="summary-article-opt">
          <p class="summary-price">$<span>${Number(product.price * storageItem.quantity)}</span></p>
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
  });
}
