import { fetchProductData } from "../../script/fetchProducts.js";

export async function fetchStylesHeroCont() {
  const container = document.querySelector(".styles-first-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "stylesHero",
    dataKey: "styleHero",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderStyleHero(fetchDataArr);
}

function renderStyleHero(styleHero) {
  const mainTitle = document.querySelector(".main-title");
  const subTitle = document.querySelector(".sub-title");
  const textUpper = document.querySelector(".text-upper");
  const textBottom = document.querySelector(".text-bottom");
  const hero = document.querySelector(".styles-hero-background");
  mainTitle.textContent = styleHero[0].mainTitle;
  subTitle.textContent = styleHero[0].subTitle;
  textUpper.textContent = styleHero[0].textUpper;
  textBottom.textContent = styleHero[0].textBottom;
  hero.src = `./images/styles/firstSection/${styleHero[0].heroImg}.webp`;
}

export async function fetchStylesOccasionCont() {
  const container = document.querySelector(".styles-second-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "stylesOccasion",
    dataKey: "styleOccasion",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderStyleOccasion(fetchDataArr);
}

function renderStyleOccasion(styleOccasion) {
  const mainTitle = document.querySelector(".occasion-main-title");
  const subTitle = document.querySelector(".occasion-sub-title");
  const text = document.querySelector(".occasion-text");
  styleOccasion.map((item) => {
    if (item.No === 1) {
      mainTitle.textContent = styleOccasion[0].mainTitle;
      subTitle.textContent = styleOccasion[0].subTitle;
      text.textContent = styleOccasion[0].text;
    }
    if (item.No === 2) {
      const imageCon = document.querySelector(".occasion-lists");
      const li = document.createElement("li");
      li.innerHTML = `
            <img src="./images/styles/secondSection/${item.styleImg}.webp" alt=${item.styleImgAlt} />
            <span>${item.styleImg}</span>
        `;
      imageCon.append(li);
    }
  });
}

export async function fetchStylesGuidesCont() {
  const container = document.querySelector(".styles-third-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "stylesGuides",
    dataKey: "styleGuides",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderStyleGuides(fetchDataArr);
}

function renderStyleGuides(styleOccasion) {
  const mainTitle = document.querySelector(".guides-main-title");
  const subTitle = document.querySelector(".guides-sub-title");
  const text = document.querySelector(".guides-text");
  styleOccasion.map((item) => {
    if (item.No === 1) {
      mainTitle.textContent = styleOccasion[0].mainTitle;
      subTitle.textContent = styleOccasion[0].subTitle;
      text.textContent = styleOccasion[0].text;
    }
    if (item.No === 2) {
      const imageCon = document.querySelector(".guides-lists");
      const li = document.createElement("li");
      li.innerHTML = `
            <img src="./images/styles/thirdSection/${item.occasionImg}.webp" alt=${item.occasionImgAlt} />
            <span>${item.imageTexts}</span>
        `;
      imageCon.append(li);
    }
  });
}

export async function fetchStylesShopNowCont() {
  const container = document.querySelector(".styles-fourth-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "stylesShopNow",
    dataKey: "styleShopNow",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderStyleShopNow(fetchDataArr);
}

function renderStyleShopNow(styleShopNow) {
  const mainTitle = document.querySelector(".shop-now-main-title");
  const subTitle = document.querySelector(".shop-now-sub-title");
  const text = document.querySelector(".shop-now-text");
  const image = document.querySelector(".shop-now-image");
  mainTitle.textContent = styleShopNow[0].mainTitle;
  subTitle.textContent = styleShopNow[0].subTitle;
  text.textContent = styleShopNow[0].text;
  image.src = `./images/styles/fourthSection/${styleShopNow[0].shopNowImg}.webp`;
  image.alt = styleShopNow[0].shopNowImgAlt;
}
