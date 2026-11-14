import { formatPrice } from "../../script/priceFormat.js";
import {
  formatCurrency,
  getExchangeRates,
  convertCurrency,
} from "./filters.js";
import { displayLikedCount } from "../../script/navigation.js";
import { openGlobalAuth } from "../../script/globalAuth.js";
import {
  hideModalCartHandler,
  renderCartModalHandler,
  colorInit,
  disableSizeHandler,
  renderColors,
  viewProductDetails,
} from "../cart/cartModal.js";
import { fetchProductData } from "../../script/fetchProducts.js";
import { updatePriceDisplay } from "../../components/shop/filters.js";
import { updateWishlist } from "../index/indexData.js";

export async function fetchShopHeroCont() {
  const container = document.querySelector(".shop-first-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "shopHero",
    dataKey: "shopHero",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderShopCont(fetchDataArr);
}
function renderShopCont(shopHeroCon) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const shopHeroSection = document.querySelector(".shop-first-sec");
  const shopMainTitle = shopHeroSection.querySelector("h2");
  const shopSubTitle = shopHeroSection.querySelector("span");
  const shopHeroText = shopHeroSection.querySelector(".shop-hero-text");
  const shopHeroImg = shopHeroSection.querySelector("img");

  shopMainTitle.textContent =
    changeLanguage === "en"
      ? shopHeroCon[0].mainTitle
      : shopHeroCon[0].mainTitleJA;
  shopSubTitle.textContent =
    changeLanguage === "en"
      ? shopHeroCon[0].subTitle
      : shopHeroCon[0].subTitleJA;
  shopHeroText.textContent =
    changeLanguage === "en" ? shopHeroCon[0].text : shopHeroCon[0].textJA;
  shopHeroImg.alt =
    changeLanguage === "en"
      ? shopHeroCon[0].heroImgAlt
      : shopHeroCon[0].heroImgAltJA;
  shopHeroImg.src = `./images/shop/firstSection/${shopHeroCon[0].heroImg}.webp`;
}

let productArray = [];
let originalProducts = [];
export async function fetchProducts() {
  const container = document.querySelector(".shop-second-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "shop-articles",
    dataKey: "products",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  productArray = [...fetchDataArr].reverse();
  originalProducts = [...fetchDataArr].reverse();
  createPagination(fetchDataArr);
  displayPage(1);
  priceSliderHandler();
}
export function renderProducts(products) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const productCon = document.querySelector(".products-lists");
  if (!productCon) return;

  productCon.innerHTML = "";
  if (products.length === 0) {
    const noProducts = document.createElement("p");
    noProducts.classList.add("no-products");
    noProducts.textContent = "No products found.";

    productCon.appendChild(noProducts);
    return;
  }
  const likes = likedProduct();
  //used reverse since in db new item are at the bottom of the list
  [...products].reverse().map((item, index) => {
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
    ${
      item.condition
        ? `<span class="condition-tag ${item.condition}">${item.condition}</span>`
        : ""
    }
    <div class="heart-cont">
      <img src=${likes.includes(item.No) ? "./images/nav/heart-alt-svgrepo-com.svg" : "./images/nav/heart-svgrepo-com.svg"} alt="heart-icon" class="shop-liked-product" loading="lazy" />
    </div>
    <img src="./images/shop/secondSection/${item.articleImg}.webp" alt=${item.articleAlt} class="article-image"/>
    <span class="${changeLanguage === "en" ? "article-title" : "article-title-jp"}">${changeLanguage === "en" ? item.article : item.articleJA}</span>
    <span class="${changeLanguage === "en" ? "article-price" : "article-price-jp"}" data-original-price=${item.price}>${formatCurrency(displayPrice, displayCurrency, displayLocale)}</span>
    <button type="button" class="add-to-cart"><img src="./images/shop/secondSection/cart-bag.svg" alt="cart" /></button>
  `;
    productCon.append(li);
    requestAnimationFrame(() => {
      li.style.animationDelay = `${index * 0.05}s`;
    });
  });
  likeProductToggle();
  addToCart(products);
  updatePriceDisplay();
}

let currentPage = 1;
const cardsPerPage = 12;
function createPagination(productArr) {
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  const totalPage = Math.ceil(productArr.length / cardsPerPage); //compute total page
  currentPage = Math.min(currentPage, totalPage || 1); //always return the smaller number of the two
  const pages = getPageNumbers(currentPage, totalPage);
  pagination.innerHTML = "";
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("previous-btn");
  prevBtn.innerHTML = "<";
  pagination.append(prevBtn);
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1 && currentPage <= totalPage) {
      currentPage--;
      displayPage(currentPage);
      createPagination(productArr);
    }
  });
  pages.forEach((page) => {
    if (page === "...") {
      const dots = document.createElement("span");
      dots.classList.add("page-btn-dots");
      dots.textContent = "...";
      pagination.appendChild(dots);
      return;
    }
    const button = document.createElement("button");
    button.classList.add("page-btn");
    button.textContent = page;
    if (page === currentPage) {
      button.classList.add("activePageBtn");
    }
    button.addEventListener("click", () => {
      currentPage = page;
      displayPage(currentPage);
      createPagination(productArr);
      document.querySelector(".shop-second-sec").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    pagination.appendChild(button);
  });
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("next-btn");
  nextBtn.innerHTML = ">";
  pagination.append(nextBtn);
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPage) {
      currentPage++;
      displayPage(currentPage);
      createPagination(productArr);
    }
  });
}

function getPageNumbers(current, total) {
  //If there are only 5 or fewer pages,
  //show everything.
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  //Beginning
  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }
  //End
  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  //Middle
  return [1, "...", current - 1, current, current + 1, "...", total];
}

function displayPage(page) {
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const productPerPage = productArray.slice(start, end).reverse();
  renderProducts(productPerPage);
  //activePageButton();
  displayCountPerPage(productArray.length);
}

function displayCountPerPage(totalProduct) {
  const start = (currentPage - 1) * cardsPerPage + 1;
  const end = Math.min(currentPage * cardsPerPage, totalProduct);
  const startCnt = document.querySelector(".start-count");
  const endCnt = document.querySelector(".end-count");
  const totalCnt = document.querySelector(".total-count");
  if (!startCnt || !endCnt || !totalCnt) return;
  startCnt.textContent = start;
  endCnt.textContent = end;
  totalCnt.textContent = totalProduct;
}

export function filtersHandler() {
  const checkedCategories = [
    ...document.querySelectorAll('input[name="category"]:checked'),
  ].map((input) => input.value);

  let filtered = [...originalProducts];
  //category filter
  if (checkedCategories.length > 0) {
    filtered = filtered.filter((item) =>
      checkedCategories.includes(item.category),
    );
  }
  //price filter
  const min = Number(document.getElementById("min-price").value);
  const max = Number(document.getElementById("max-price").value);
  filtered = filtered.filter((item) => {
    const price = Number(item.price);
    return price >= min && price <= max;
  });
  //features filter
  const features = document.getElementById("features").value;
  if (features !== "") {
    filtered = filtered.filter((item) => item.condition === features);
  }
  productArray = filtered;
  currentPage = 1;
  renderProducts(productArray);
  createPagination(productArray);
  displayPage(currentPage);
}

function priceSliderHandler() {
  const tracker = document.querySelector(".slider-tracker");
  const minSlider = document.getElementById("min-price");
  const maxSlider = document.getElementById("max-price");
  const minValue = document.getElementById("min-value");
  const maxValue = document.getElementById("max-value");
  if (!tracker || !minSlider || !maxSlider) return;
  const min = Number(minSlider.value);
  const max = Number(maxSlider.value);

  if (min > max) {
    minSlider.value = max;
    return priceSliderHandler();
  }

  const language = localStorage.getItem("language") || "en";
  const rates = getExchangeRates();

  const currency = language === "ja" ? "JPY" : "USD";
  const locale = language === "ja" ? "ja-JP" : "en-US";

  const formatValue = (value) => {
    const converted = rates ? convertCurrency(value, currency, rates) : value;

    return formatCurrency(
      converted,
      rates ? currency : "USD",
      rates ? locale : "en-US",
    );
  };
  if (language === "en") {
    minValue.innerHTML = formatPrice(min, false);
    maxValue.innerHTML = formatPrice(max, false);
  } else {
    minValue.textContent = formatValue(min);
    maxValue.textContent = formatValue(max);
  }

  const left = (min / Number(minSlider.max)) * 100;
  const right = (max / Number(maxSlider.max)) * 100;
  tracker.style.background = `
        linear-gradient(
            to right,
            #B8963E ${left}%,
            #657153 ${left}%,
            #657153 ${right}%,
            #B8963E ${right}%
        )
    `;
  filtersHandler();
}

export function resetFiltersHandler() {
  const resetBtn = document.querySelector(".reset-filter");
  if (!resetBtn) return;
  resetBtn.addEventListener("click", () => {
    const checkedCategories = document.querySelectorAll(
      'input[name="category"]',
    );
    const minSlider = document.getElementById("min-price");
    const maxSlider = document.getElementById("max-price");
    const features = document.getElementById("features");
    checkedCategories.forEach((category) => {
      category.checked = false;
    });
    minSlider.value = minSlider.defaultValue;
    maxSlider.value = maxSlider.defaultValue;
    features.value = "";
    priceSliderHandler();
    currentPage = 1;
    renderProducts(productArray);
    createPagination(productArray);
    displayPage(currentPage);
    filtersHandler();
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.history.replaceState({}, "", url);
  });
}

export function initializePriceSlider() {
  const minSlider = document.getElementById("min-price");
  const maxSlider = document.getElementById("max-price");
  if (!minSlider || !maxSlider) return;
  minSlider.addEventListener("input", priceSliderHandler);
  maxSlider.addEventListener("input", priceSliderHandler);
  //priceSliderHandler();
}

export function inputElemInit() {
  const categoryCheckboxes = document.querySelectorAll(
    'input[name="category"]',
  );
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filtersHandler);
  });
  const features = document.getElementById("features");
  if (features) {
    features.addEventListener("change", filtersHandler);
  }
}

export function openShopFromURL() {
  const param = new URLSearchParams(window.location.search);
  const category = param.get("category");
  if (!category) return;
  const categoryFilter = document.querySelector(
    `input[name="category"][value=${category}`,
  );
  if (categoryFilter) {
    categoryFilter.checked = true;
    filtersHandler();
  }
}

function likedProduct() {
  const liked = JSON.parse(localStorage.getItem("likedProducts")) || [];
  return productArray
    .filter((item) => liked.includes(String(item.No)))
    .map((item) => item.No);
}

function likeProductToggle() {
  const heartBtn = document.querySelectorAll(".shop-liked-product");
  heartBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const clickedProduct = btn.closest("li");
      const productId = clickedProduct.dataset.productId;
      let likedProducts =
        JSON.parse(localStorage.getItem("likedProducts")) || [];
      if (likedProducts.includes(productId)) {
        likedProducts = likedProducts.filter((id) => id !== productId);
        btn.src = "./images/nav/heart-svgrepo-com.svg";
        btn.classList.remove("liked");
      } else {
        likedProducts.push(productId);
        btn.src = "./images/nav/heart-alt-svgrepo-com.svg";
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

//reusable existing size/color selection modal
function openCartOptionsModal(addItem, products) {
  if (!addItem) return;
  const noSize = products.find(
    (item) =>
      Number(item.No) === Number(addItem.No) &&
      (String(item.category) === "bags" ||
        String(item.category) === "accessory"),
  );
  disableSizeHandler(noSize);
  openGlobalAuth();
  hideModalCartHandler();
  const colorArr = addItem.color
    .split(",")
    .map((color) => color.trim().replaceAll('"', ""));
  showCartModal(colorArr);
  colorInit();
  renderCartModalHandler(addItem);
}

//Add to cart modal
function addToCart(products) {
  //open cart modal by add to cart button of shop page
  const addToCartBtn = document.querySelectorAll(".add-to-cart");
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.closest("li").dataset.productId;
      const addItem = [...products]
        .reverse()
        .find((item) => Number(item.No) === Number(productId));
      openCartOptionsModal(addItem, products);
    });
  });
  //open cart modal from liked modal's add to cart button
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("addProduct");
  if (productId) {
    const addItem = [...products]
      .reverse()
      .find((item) => Number(item.No) === Number(productId));
    if (addItem) {
      openCartOptionsModal(addItem, products);
    }
    //Remove only addProduct, preserving any other query parameters
    params.delete("addProduct");
    const query = params.toString();
    const newUrl =
      window.location.pathname +
      (query ? `?${query}` : "") +
      window.location.hash;
    window.history.replaceState({}, "", newUrl);
  }
}

function showCartModal(colorArr) {
  const cartModal = document.querySelector(".cart-modal");
  cartModal.classList.add("cartModal");
  renderColors(colorArr);
  viewProductDetails();
}
