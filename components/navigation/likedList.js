import { fetchProductData } from "../../script/fetchProducts.js";
import { openGlobalAuth, hideGlobalAuth } from "../../script/globalAuth.js";
import { formatPrice } from "../../script/priceFormat.js";
import { displayLikedCount } from "../../script/navigation.js";

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
    //render the searched up products from latest liked to oldest
    likedItems.reverse().forEach((product) => {
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
    removeLikedItem();
  });
  closeLikedModal();
}

function addToCarLikedItem() {
  const addToCartBtn = document.querySelectorAll(".liked-add-button");
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const item = e.currentTarget.closest("li");
      const productId = item.dataset.productId;
      console.log(productId);
    });
  });
}
function removeLikedItem() {
  const removeBtn = document.querySelectorAll(".liked-remove-button");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      //get the dataset of its container
      const item = e.currentTarget.closest("li");
      const productId = item.dataset.productId;
      let likedArr = JSON.parse(localStorage.getItem("likedProducts")) || [];

      //filter it out from the storage list
      likedArr = likedArr.filter((id) => String(id) !== String(productId));
      //update storage
      localStorage.setItem("likedProducts", JSON.stringify(likedArr));
      //remove its container
      item.remove();
      displayLikedCount();
    });
  });
}

function closeLikedModal() {
  const closeBtn = document.querySelector(".close-liked-modal-btn");
  closeBtn.addEventListener("click", () => {
    hideGlobalAuth();
  });
}
