import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { formatPrice } from "../../script/priceFormat.js";

let fetchDataArr = [];
export async function fetchShopHeroCont() {
  const shopFirstSection = document.querySelector(".shop-first-sec");
  setSectionLoading(shopFirstSection, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shopHero", "shopHero");
    renderShopCont(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(shopFirstSection);
  } finally {
    setSectionLoading(shopFirstSection, false);
  }
}

function renderShopCont(shopHeroCon) {
  const shopHeroSection = document.querySelector(".shop-first-sec");
  const shopMainTitle = shopHeroSection.querySelector("h2");
  const shopSubTitle = shopHeroSection.querySelector("span");
  const shopHeroText = shopHeroSection.querySelector(".shop-hero-text");
  const shopHeroImg = shopHeroSection.querySelector("img");
  shopMainTitle.textContent = shopHeroCon[0].mainTitle;
  shopSubTitle.textContent = shopHeroCon[0].subTitle;
  shopHeroText.textContent = shopHeroCon[0].text;
  shopHeroImg.src = `./images/shop/firstSection/${shopHeroCon[0].heroImg}.webp`;
  shopHeroImg.alt = shopHeroCon[0].heroImgAlt;
}
let productArray = [];
export async function fetchProducts() {
  const shopSecondSection = document.querySelector(".shop-second-sec");
  setSectionLoading(shopSecondSection, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shop-articles", "products");
    productArray = [...fetchDataArr].reverse();

    createPagination(fetchDataArr);
    displayPage(1);
  } catch (error) {
    console.log(error);
    showSectionError(shopSecondSection);
  } finally {
    setSectionLoading(shopSecondSection, false);
  }
}
export function renderProducts(products) {
  const productCon = document.querySelector(".products-lists");
  if (!productCon) return;
  productCon.innerHTML = "";
  //used reverse since in db new item are at the bottom of the list
  [...products].reverse().map((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
    ${
      item.condition
        ? `<span class="condition-tag ${item.condition}">${item.condition}</span>`
        : ""
    }
    <div class="heart-cont">
      <img src="./images/nav/heart-svgrepo-com.svg" alt="heart-icon"class="liked-product" />
    </div>
    <img src="./images/shop/secondSection/${item.articleImg}.webp" alt=${item.articleAlt} class="article-image"/>
    <span class="article-title">${item.article}</span>
    <span class="article-price">${formatPrice(item.price)}</span>
  `;
    productCon.append(li);
    requestAnimationFrame(() => {
      li.style.animationDelay = `${index * 0.05}s`;
    });
  });
  priceSliderHandler();
}

let currentPage = 1;
const cardsPerPage = 12;
function createPagination(productArr) {
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  const totalPage = Math.ceil(productArr.length / cardsPerPage); //compute total page
  currentPage = Math.min(currentPage, totalPage || 1); //always return the smaller number of the two
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPage; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("page-btn");
    button.addEventListener("click", () => {
      currentPage = i;
      displayPage(currentPage);
      document.querySelector(".shop-second-sec").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
    pagination.append(button);
  }
}

function displayPage(page) {
  const start = (page - 1) * cardsPerPage;
  const end = start + cardsPerPage;
  const productPerPage = productArray.slice(start, end).reverse();
  renderProducts(productPerPage);
  activePageButton();
  displayCountPerPage(productArray.length);
}

function activePageButton() {
  const pageButtons = document.querySelectorAll(".page-btn");
  if (!pageButtons) return;
  pageButtons.forEach((btn, index) => {
    btn.classList.toggle("activePageBtn", index + 1 === currentPage);
  });
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

  let filtered = [...fetchDataArr];
  //category filter
  if (checkedCategories.length === 0) {
    filtered = [...fetchDataArr];
  } else {
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
  renderProducts(productArray.reverse());
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
  minValue.textContent = min;
  maxValue.textContent = max;

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
    productArray = [...fetchDataArr];
    currentPage = 1;
    renderProducts(productArray.reverse());
    createPagination(productArray);
    displayPage(currentPage);
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
  priceSliderHandler();
}

export function inputElemInit() {
  const categoryCheckboxes = document.querySelectorAll(
    'input[name="category"]',
  );
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", filtersHandler);
  });
  const minSlider = document.getElementById("min-price");
  const maxSlider = document.getElementById("max-price");
  if (minSlider && maxSlider) {
    minSlider.addEventListener("input", filtersHandler);
    maxSlider.addEventListener("input", filtersHandler);
  }
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
