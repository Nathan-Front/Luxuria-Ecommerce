import { fetchProductData } from "../../script/fetchProducts.js";
import { openGlobalAuth, hideGlobalAuth } from "../../script/globalAuth.js";
import { formatPrice } from "../../script/priceFormat.js";

//get product data from reusable fetch function
export async function likedItemsModal() {
  const container = document.querySelector(".liked-modal");
  const fetchDataArr = await fetchProductData({
    sheetName: "shop-articles",
    dataKey: "products",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  console.log("reusable fetch", fetchDataArr);
  showLikedItemModal(fetchDataArr);
}

function showLikedItemModal(products) {
  console.log("products", products);
  const container = document.querySelector(".liked-modal");
  const listContainer = document.querySelector(".list-liked-items");

  const likedBtn = document.querySelector(".show-liked-items");
  likedBtn.addEventListener("click", () => {
    const likedArr = JSON.parse(localStorage.getItem("likedProducts")) || [];
    const likedItems = products.filter((product) =>
      likedArr.includes(String(product.No)),
    );
    listContainer.innerHTML = "";
    openGlobalAuth();
    likedItems.forEach((product) => {
      container.classList.add("openLikedModal");
      const li = document.createElement("li");
      li.classList.add("like-item-details");
      likedArr.map((item) => {
        item;
      });
      li.innerHTML = `
      <img
        src="./images/shop/secondSection/${product.articleImg}.webp"
        alt=${product.articleAlt}
        loading="lazy"
      />
      <span class="liked-product-title">${product.article}</span>
      <p class="liked-product-price">${formatPrice(product.price)}</p>
      <button class="liked-remove-button">Remove from list</button>
  `;
      listContainer.appendChild(li);
    });
  });
  closeLikedModal();
}

function closeLikedModal() {
  const closeBtn = document.querySelector(".close-liked-modal-btn");
  closeBtn.addEventListener("click", () => {
    hideGlobalAuth();
  });
}
