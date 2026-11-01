import { formatPrice } from "../../script/priceFormat.js";
import { displayLikedCount } from "../../script/navigation.js";
import { fetchProductData } from "../../script/fetchProducts.js";
import { languages } from "../../script/translation.js";

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

export function changeLanguage() {
  const language = localStorage.getItem("language") || "en";
  const selectedLanguage = languages[language];
  if (!selectedLanguage) return;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (selectedLanguage[key]) {
      element.textContent = selectedLanguage[key];
    }
  });
  document.documentElement.lang = language;
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

function renderIndexFilter(filterContent) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const shopByCategoryTitle = document.querySelector(
    "h3[data-i18n='shopByCategory']",
  );
  if (changeLanguage === "en") {
    shopByCategoryTitle.textContent = languages.en.shopByCategory;
  } else {
    shopByCategoryTitle.textContent = languages.ja.shopByCategory;
  }
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
  const shopByCategoryTitle = document.querySelector(
    "h3[data-i18n='newArrivals']",
  );
  if (changeLanguage === "en") {
    shopByCategoryTitle.textContent = languages.en.newArrivals;
  } else {
    shopByCategoryTitle.textContent = languages.ja.newArrivals;
  }
  const newArrivalContainer = document.querySelector(".new-product-list");
  //used reverse since in db new item are at the bottom of the list
  const newProducts = newArrivals
    .filter((item) => item.condition === "new")
    .reverse();
  //newProducts.map((item) => { //use this if next line is confusing
  newArrivalContainer.innerHTML = "";
  for (const item of newProducts) {
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
      <span class="product-title">${item.article}</span>
      <p class="product-price">${formatPrice(item.price)}</p> 
    `;
    newArrivalContainer.append(li);
  }
  restoreLikedProducts();
  productLikeToggle();
}

function productLikeToggle() {
  const heartBtn = document.querySelectorAll(".liked-product");
  heartBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
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
    });
  });
}

function restoreLikedProducts() {
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
  const changeLanguage = localStorage.getItem("language") || "en";
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
