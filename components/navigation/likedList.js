import { fetchProductData } from "../../script/fetchProducts.js";
import { openGlobalAuth, hideGlobalAuth } from "../../script/globalAuth.js";
import { formatPrice } from "../../script/priceFormat.js";
import { displayLikedCount } from "../../script/navigation.js";
import { renderProducts } from "../shop/shopData.js";
import { renderNewArrivals, updateWishlist } from "../index/indexData.js";
import {
  formatCurrency,
  getExchangeRates,
  convertCurrency,
} from "../shop/filters.js";
import { hideUserWindow } from "../../script/index.js";

//get product data from reusable fetch function
export async function likedItemsModal() {
  const container = document.querySelector(".liked-modal");
  const fetchDataArr = await fetchProductData({
    sheetName: "shop-articles",
    dataKey: "products",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  showLikedItemModal(fetchDataArr);
}

export function showLikedItemModal(products) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const container = document.querySelector(".liked-modal");
  const listContainer = document.querySelector(".list-liked-items");

  const likedBtn = document.querySelector(".show-liked-items");
  const wishlistBtn = document.querySelector(".wish-list-button");
  [likedBtn, wishlistBtn].forEach((btn) => {
    btn.addEventListener("click", () => {
      //close the user window
      hideUserWindow();
      const likedArr = JSON.parse(localStorage.getItem("likedProducts")) || [];
      if (likedArr.length === 0) {
        alert("No liked item in the list");
        return;
      }
      //search up the liked product ID from fetched list of products
      const likedItems = products.filter((product) =>
        likedArr.includes(String(product.No)),
      );
      //this remove duplication when modal is open again
      listContainer.innerHTML = "";
      openGlobalAuth();

      //render the searched up products from latest liked to oldest
      likedItems.reverse().forEach((product) => {
        //Select currency
        const rates = getExchangeRates();
        const currency = changeLanguage === "ja" ? "JPY" : "USD";
        const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
        const displayPrice = rates
          ? convertCurrency(Number(product.price), currency, rates)
          : Number(product.price);
        const displayCurrency = rates ? currency : "USD";
        const displayLocale = rates ? locale : "en-US";
        container.classList.add("openLikedModal");
        const li = document.createElement("li");
        li.dataset.productId = product.No;
        li.classList.add("like-item-details");
        li.innerHTML = `
      <img
        src="./images/shop/secondSection/${product.articleImg}.webp"
        alt=${product.articleAlt}
        loading="lazy"
      />
      <span class="liked-product-title">${changeLanguage === "en" ? product.article : product.articleJA}</span>
      <p class="liked-product-price">${changeLanguage === "en" ? formatPrice(product.price) : formatCurrency(displayPrice, displayCurrency, displayLocale)}</p>
      <div>
        <button class="liked-add-button">
          <img src="./images/shop/secondSection/cart-bag.svg" alt="cart" />
          <span class="tooltip">Add to cart</span>
        </button>
        <button class="liked-remove-button">
          <img src="./images/cart/secondSection/delete.svg" alt="delete-button"/>
          <span class="tooltip">Remove item</span>
        </button>
      </div>
    `;
        listContainer.appendChild(li);
      });
      //attach after rendering
      addToCarLikedItem();
      removeLikedItem(products);
    });
  });

  closeLikedModal();
}

function addToCarLikedItem() {
  const addToCartBtn = document.querySelectorAll(".liked-add-button");
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = e.currentTarget.closest("li");
      const productId = item.dataset.productId;
      window.location.href = `./shop.html?addProduct=${productId}`;
      sharedDeleteLikedItem(productId);
      //remove its container
      item.remove();
    });
  });
}

function removeLikedItem(products) {
  const removeBtn = document.querySelectorAll(".liked-remove-button");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      //get the dataset of its container
      const item = e.currentTarget.closest("li");
      const productId = item.dataset.productId;

      // Remove from localStorage and Google Sheets
      item.classList.add("loading");
      item.disabled = true;
      try {
        await sharedDeleteLikedItem(productId);
      } finally {
        item.classList.remove("loading");
        item.disabled = false;
      }
      //remove its container
      item.remove();
      renderProducts([...products]);
      renderNewArrivals(products);
    });
  });
}
//reusable delete liked items from storage
async function sharedDeleteLikedItem(productId) {
  let likedArr = JSON.parse(localStorage.getItem("likedProducts")) || [];
  //filter it out from the storage list
  likedArr = likedArr.filter((id) => String(id) !== String(productId));
  //update storage
  localStorage.setItem("likedProducts", JSON.stringify(likedArr));
  await updateWishlist(likedArr);
  displayLikedCount();
  if (likedArr.length === 0) {
    hideGlobalAuth();
  }
}

function closeLikedModal() {
  const closeBtn = document.querySelector(".close-liked-modal-btn");
  closeBtn.addEventListener("click", () => {
    hideGlobalAuth();
    const container = document.querySelector(".liked-modal");
    container.classList.remove("openLikedModal");
  });
}
