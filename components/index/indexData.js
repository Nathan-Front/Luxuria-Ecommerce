import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { formatPrice } from "../../script/priceFormat.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { displayLikedCount } from "../../script/navigation.js";

let fetchDataArr = [];
export async function fetchHeroContent() {
  const firstSection = document.querySelector(".index-first-sect");
  setSectionLoading(firstSection, true); //pass true
  try {
    fetchDataArr = await fetchSpecificSheet("hero", "heroContent");
    renderHero(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(firstSection);
  } finally {
    setSectionLoading(firstSection, false);
  }
}

function renderHero(heroContent) {
  const heroSection = document.querySelector(".index-first-sect");
  const mainTitle = heroSection.querySelector("h2");
  const subTitle = heroSection.querySelector("span");
  const heroText = heroSection.querySelector(".hero-text");
  const heroImg = heroSection.querySelector("img");
  mainTitle.textContent = heroContent[0].mainTitle;
  subTitle.textContent = heroContent[0].subTitle;
  heroText.textContent = heroContent[0].text;
  heroImg.src = `./images/index/firstSection/${heroContent[0].heroImg}.webp`;
  heroImg.alt = heroContent[0].heroImgAlt;
}

export async function fetchIndexFilterContent() {
  const secondSection = document.querySelector(".index-second-sect");
  setSectionLoading(secondSection, true);
  try {
    fetchDataArr = await fetchSpecificSheet("indexFilter", "indexFilters");
    renderIndexFilter(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(secondSection);
  } finally {
    setSectionLoading(secondSection, false);
  }
}

function renderIndexFilter(filterContent) {
  const filterContainer = document.querySelector(".second-sect-lower");
  filterContent.map((item) => {
    const li = document.createElement("li");
    li.classList.add("index-filters");
    li.innerHTML = `
      <a href="./shop.html?category=${item.category}" data-category=${item.category}
        ><img src="./images/index/secondSection/${item.filterImg}.webp" alt="${item.filterImgAlt}" loading="lazy"
      /></a>
      <span>${item.filterTitle}</span>
    `;
    filterContainer.append(li);
  });
}

export async function fetchIndexNewArrivals() {
  const thirdSection = document.querySelector(".index-third-sect");
  setSectionLoading(thirdSection, true);
  try {
    fetchDataArr = await fetchSpecificSheet("shop-articles", "products");
    renderNewArrivals(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(thirdSection);
  } finally {
    setSectionLoading(thirdSection, false);
  }
}

export function renderNewArrivals(newArrivals) {
  const newArrivalContainer = document.querySelector(".new-product-list");
  //used reverse since in db new item are at the bottom of the list
  const newProducts = newArrivals
    .filter((item) => item.condition === "new")
    .reverse();
  //newProducts.map((item) => { //use this if next line is confusing
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
  const fourthSection = document.querySelector(".index-fourth-sect");
  setSectionLoading(fourthSection, true);
  try {
    fetchDataArr = await fetchSpecificSheet("indexPromo", "promo");
    renderPromo(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(fourthSection);
  } finally {
    setSectionLoading(fourthSection, false);
  }
}
function renderPromo(promo) {
  const promoContainer = document.querySelector(".fourth-upper-con");
  promo.map((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <span>${item.subTitle}</span>
      <h3>${item.mainTitle}</h3>
      <p>${item.text}</p>
      <a href=${item.link}.html>${item.buttons}</a>
      <img src="./images/index/fourthSection/${item.promoImg}.webp" alt="${item.promoImgAlt}" loading="lazy" />
    `;
    promoContainer.append(div);
  });
}
