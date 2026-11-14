import { languages } from "../../script/translation.js";
import {
  formatCurrency,
  getExchangeRates,
  convertCurrency,
  updatePriceDisplay,
} from "../../components/shop/filters.js";
import { displayLikedCount } from "../../script/navigation.js";
import { fetchProductData } from "../../script/fetchProducts.js";
import { GOOGLE_APPS_SCRIPT_URL } from "../../script/index.js";

let fetchDataArr = [];
export async function fetchHeroContent() {
  const container = document.querySelector(".index-first-sect");
  const fetchDataArr = await fetchProductData({
    sheetName: "hero",
    dataKey: "heroContent",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderHero(fetchDataArr);
}

function renderHero(heroContent) {
  const changeLanguage = localStorage.getItem("language") || "en";

  const heroSection = document.querySelector(".index-first-sect");
  const mainTitle = heroSection.querySelector("h2");
  const subTitle = heroSection.querySelector("span");
  const heroText = heroSection.querySelector(".hero-text");
  const heroImg = heroSection.querySelector("img");
  if (changeLanguage === "en") {
    mainTitle.textContent = heroContent[0].mainTitle;
    subTitle.textContent = heroContent[0].subTitle;
    heroText.textContent = heroContent[0].text;
    heroImg.src = `./images/index/firstSection/${heroContent[0].heroImg}.webp`;
    heroImg.alt = heroContent[0].heroImgAlt;
  } else {
    mainTitle.textContent = heroContent[1].mainTitle;
    subTitle.textContent = heroContent[1].subTitle;
    heroText.textContent = heroContent[1].text;
    heroImg.src = `./images/index/firstSection/${heroContent[1].heroImg}.webp`;
    heroImg.alt = heroContent[1].heroImgAlt;
  }
}

export async function fetchIndexFilterContent() {
  const container = document.querySelector(".index-second-sect");
  const fetchDataArr = await fetchProductData({
    sheetName: "indexFilter",
    dataKey: "indexFilters",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderIndexFilter(fetchDataArr);
}
//get settings for reference, like currency and language
export function renderSecondUpperContent(settingFees) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const freeShippingPrice = document.querySelector(".shipping-free-text");
  if (!freeShippingPrice) return;
  if (changeLanguage === "en") {
    freeShippingPrice.innerHTML = languages.en.shippingText;
  } else {
    freeShippingPrice.innerHTML = `
    <small data-original-price="${settingFees[0].difference}">${formatCurrency(Number(settingFees[0].difference), changeLanguage === "ja" ? "JPY" : "USD", changeLanguage === "ja" ? "ja-JP" : "en-US")}</small>
      <small>${languages.ja.shippingText}</small>
    
    `;
  }
  updatePriceDisplay();
}
function renderIndexFilter(filterContent) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const filterContainer = document.querySelector(".second-sect-lower");
  filterContent.map((item) => {
    const li = document.createElement("li");
    li.classList.add("index-filters");
    li.innerHTML = `
      <a href="./shop.html?category=${item.category}" data-category=${item.category}
        ><img src="./images/index/secondSection/${item.filterImg}.webp" alt="${item.filterImgAlt}" loading="lazy"
      /></a>
      <span>${changeLanguage === "en" ? item.filterTitle : item.filterTitleJA}</span>
    `;
    filterContainer.append(li);
  });
}

export async function fetchIndexNewArrivals() {
  const container = document.querySelector(".index-third-sect");
  const fetchDataArr = await fetchProductData({
    sheetName: "shop-articles",
    dataKey: "products",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderNewArrivals(fetchDataArr);
}

export function renderNewArrivals(newArrivals) {
  const changeLanguage = localStorage.getItem("language") || "en";

  const newArrivalContainer = document.querySelector(".new-product-list");
  //used reverse since in db new item are at the bottom of the list
  const newProducts = newArrivals
    .filter((item) => item.condition === "new")
    .reverse();
  //newProducts.map((item) => { //use this if next line is confusing
  newArrivalContainer.innerHTML = "";
  for (const item of newProducts) {
    const rates = getExchangeRates();
    const currency = changeLanguage === "ja" ? "JPY" : "USD";
    const locale = changeLanguage === "ja" ? "ja-JP" : "en-US";
    const displayPrice = rates
      ? convertCurrency(Number(item.price), currency, rates)
      : Number(item.price);
    const displayCurrency = rates ? currency : "USD";
    const displayLocale = rates ? locale : "en-US";
    const li = document.createElement("li");
    li.dataset.productId = item.No;
    li.innerHTML = `
      <div class="heart-cont">
        <img
          src="./images/nav/heart-svgrepo-com.svg"
          alt="heart-icon"
          class="liked-product"
        />
      </div>
      <img
        src="./images/shop/secondSection/${item.articleImg}.webp"
        alt="${item.articleAlt}"
        loading="lazy"
      />
      <span class="${changeLanguage === "en" ? "product-title" : "product-title-jp"}">${changeLanguage === "en" ? item.article : item.articleJA}</span>
      <p class="product-price" data-original-price="${item.price}">
        ${formatCurrency(displayPrice, displayCurrency, displayLocale)}
      </p>
    `;
    newArrivalContainer.append(li);
  }
  restoreLikedProducts();
  productLikeToggle();
  //updatePriceDisplay();
}

function productLikeToggle() {
  const heartBtn = document.querySelectorAll(".liked-product");
  heartBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const loggedUser = localStorage.getItem("loggedIn") || "";
      if (!loggedUser) {
        alert("Must be logged in to save liked items.");
        return;
      }
      const clickedProduct = btn.closest("li");
      const productId = clickedProduct.dataset.productId;
      let likedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];
      if (likedProducts.includes(productId)) {
        likedProducts = likedProducts.filter((id) => id !== productId); //remove the clicked product from array
        btn.src = "./images/nav/heart-svgrepo-com.svg";
        btn.classList.remove("liked");
      } else {
        likedProducts.push(productId);
        btn.src = "./images/index/thirdSection/heart-alt-svgrepo-com.svg";
        btn.classList.add("liked");
      }
      localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
      displayLikedCount();
      // Show loading state
      clickedProduct.classList.add("loading");
      clickedProduct.disabled = true;
      try {
        await updateWishlist(likedProducts);
      } finally {
        clickedProduct.classList.remove("loading");
        clickedProduct.disabled = false;
      }
    });
  });
}
//Update the wishlist in the sheet
export async function updateWishlist(likedProducts) {
  const loggedUser = JSON.parse(localStorage.getItem("loggedIn") || "null");
  if (!loggedUser?.userID) return;
  try {
    const params = {
      formType: "liked-items",
      userID: loggedUser.userID,
      email: loggedUser.email,
      likedProducts,
    };
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(params),
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Failed to update wishlist");
    }
    if (result.success) {
      alert(result.message);
    }
    return result;
  } catch (error) {
    console.error("Error saving wishlist:", error);
    return null;
  }
}

//Use during login to get the saved list
export async function FetchWishlists() {
  try {
    const loggedUser = JSON.parse(localStorage.getItem("loggedIn"));
    if (!loggedUser) return [];
    const fetchDataArr = await fetchProductData({
      sheetName: "getLikedItems",
      dataKey: "retrieveWishlist",
      container: "",
      params: {
        userID: loggedUser.userID,
      },
    });
    localStorage.setItem("likedProducts", JSON.stringify(fetchDataArr || []));
    return fetchDataArr || [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
async function restoreLikedProducts() {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
  const heartBtns = document.querySelectorAll(".liked-product");
  heartBtns.forEach((btn) => {
    const productId = btn.closest("li").dataset.productId;
    if (likedProducts.includes(productId)) {
      btn.src = "./images/index/thirdSection/heart-alt-svgrepo-com.svg";
      btn.classList.add("liked");
    }
  });
}

export async function fetchIndexPromo() {
  const container = document.querySelector(".index-fourth-sect");
  const fetchDataArr = await fetchProductData({
    sheetName: "indexPromo",
    dataKey: "promo",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderPromo(fetchDataArr);
}
function renderPromo(promo) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const promoContainer = document.querySelector(".fourth-upper-con");
  promo.map((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${changeLanguage === "en" ? item.subTitle : item.subTitleJA}</span>
      <h3>${changeLanguage === "en" ? item.mainTitle : item.mainTitleJA}</h3>
      <p>${changeLanguage === "en" ? item.text : item.textJA}</p>
      <a href=${item.link}.html>${changeLanguage === "en" ? item.buttons : item.buttonsJA}</a>
      <img src="./images/index/fourthSection/${item.promoImg}.webp" alt="${item.promoImgAlt}" loading="lazy" />
    `;
    promoContainer.append(div);
  });
}
