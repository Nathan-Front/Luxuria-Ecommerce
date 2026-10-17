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
  showLikedItemModal(fetchDataArr);
}

function showLikedItemModal(products) {
  const container = document.querySelector(".liked-modal");
  const listContainer = document.querySelector(".list-liked-items");

  const likedBtn = document.querySelector(".show-liked-items");
  likedBtn.addEventListener("click", () => {
    const likedArr = JSON.parse(localStorage.getItem("likedProducts")) || [];
    //search up the liked product ID from fetched list of products
    const likedItems = products.filter((product) =>
      likedArr.includes(String(product.No)),
    );
    //this remove duplication when modal is open again
    listContainer.innerHTML = "";
    openGlobalAuth();
    //render the searched up products
    likedItems.forEach((product) => {
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
      <span class="liked-product-title">${product.article}</span>
      <p class="liked-product-price">${formatPrice(product.price)}</p>
      <button class="liked-remove-button">Remove from list</button>
    `;
      listContainer.appendChild(li);
    });
  });
  closeLikedModal();
  removeLikedItem();
}

function removeLikedItem() {
  const removeBtn = document.querySelectorAll(".liked-remove-button");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = e.target.closest("li");
      console.log(item.dataset);
    });
  });
}

function closeLikedModal() {
  const closeBtn = document.querySelector(".close-liked-modal-btn");
  closeBtn.addEventListener("click", () => {
    hideGlobalAuth();
  });
}
