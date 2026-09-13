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
  [...products].reverse().map((item) => {
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
  });
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
}

function activePageButton() {
  const pageButtons = document.querySelectorAll(".page-btn");
  if (!pageButtons) return;
  pageButtons.forEach((btn, index) => {
    btn.classList.toggle("activePageBtn", index + 1 === currentPage);
  });
}
