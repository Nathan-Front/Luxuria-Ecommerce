import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";

export async function fetchCheckoutData() {
  let fetchDataArr = [];
  const cartList = document.querySelector(".order-summary");
  setSectionLoading(cartList, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shop-articles", "products");
    renderCartContent([...fetchDataArr]);
  } catch (error) {
    console.log(error);
    showSectionError(cartList);
  } finally {
    setSectionLoading(cartList, false);
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
          <p class="checkout-price">${(product.price * storageItem.quantity).toFixed(2)}</p>
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
