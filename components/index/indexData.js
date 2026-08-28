import { GOOGLE_APPS_SCRIPT_URL } from "../../script/index.js";
import { formatPrice } from "../../script/priceFormat.js";
import { showSectionError } from "../../script/fetchDataError.js";
let fetchDataArr = [];
export async function fetchSpecificSheet(sheetType, key, dataFormatter) {
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?type=${sheetType}`);
    if (!response.ok) {
      throw new Error("Failed to fetch sheet");
    }
    const data = await response.json();
    return dataFormatter ? dataFormatter(data[key]) : data[key];
  } catch (error) {
    console.log(error);
    throw error; //Re-throw so the caller knows it failed
  }
}

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
  heroImg.src = `./images/index/firstSection/${heroContent[0].heroImg}`;
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
    li.innerHTML = `
      <a href="#"
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
    fetchDataArr = await fetchSpecificSheet("indexNewArrive", "newArrivals");
    renderNewArrivals(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(thirdSection);
  } finally {
    setSectionLoading(thirdSection, false);
  }
}

function renderNewArrivals(newArrivals) {
  const newArrivalContainer = document.querySelector(".new-product-list");
  newArrivals.map((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="heart-cont">
        <img src="./images/nav/heart-svgrepo-com.svg" alt="heart-off" />
        <!-- <img src="" alt="heart-on" /> -->
      </div>
      <img
        src="./images/index/thirdSection/${item.productImg}.webp"
        alt="${item.productImgAlt}"
        loading="lazy"
      />
      <span class="product-title">${item.product}</span>
      <p class="product-price">${formatPrice(item.price)}</p>
    `;
    newArrivalContainer.append(li);
  });
}
//For loading and spinner during fetch of data
function setSectionLoading(section, isLoading) {
  if (!section) return;
  const loading = section.querySelector(".product-loading");
  if (loading) {
    loading.hidden = !isLoading;
  }
}
