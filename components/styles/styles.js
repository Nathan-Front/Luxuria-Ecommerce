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
  const changeLanguage = localStorage.getItem("language") || "en";
  const mainTitle = document.querySelector(".main-title");
  const subTitle = document.querySelector(".sub-title");
  const textUpper = document.querySelector(".text-upper");
  const textBottom = document.querySelector(".text-bottom");
  const hero = document.querySelector(".styles-hero-background");

  mainTitle.textContent =
    changeLanguage == "en" ? styleHero[0].mainTitle : styleHero[0].mainTitleJA;
  subTitle.textContent =
    changeLanguage == "en" ? styleHero[0].subTitle : styleHero[0].subTitleJA;
  textUpper.textContent =
    changeLanguage == "en" ? styleHero[0].textUpper : styleHero[0].textUpperJA;
  textBottom.textContent =
    changeLanguage == "en"
      ? styleHero[0].textBottom
      : styleHero[0].textBottomJA;

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
  const changeLanguage = localStorage.getItem("language") || "en";
  const mainTitle = document.querySelector(".occasion-main-title");
  const subTitle = document.querySelector(".occasion-sub-title");
  const text = document.querySelector(".occasion-text");
  const link = document.querySelector(".viewAllOccasions");

  styleOccasion.map((item) => {
    if (item.No === 1) {
      mainTitle.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].mainTitle
          : styleOccasion[0].mainTitleJA;
      subTitle.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].subTitle
          : styleOccasion[0].subTitleJA;
      text.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].text
          : styleOccasion[0].textJA;
      link.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].linkText
          : styleOccasion[0].linkTextJA;
    }
    if (item.No === 2) {
      const imageCon = document.querySelector(".occasion-lists");
      const li = document.createElement("li");
      li.innerHTML = `
            <img src="./images/styles/secondSection/${item.styleImg}.webp" alt=${item.styleImgAlt} />
            <span>${changeLanguage === "en" ? item.styleImg : item.styleImgJA}</span>
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
  const changeLanguage = localStorage.getItem("language") || "en";
  const mainTitle = document.querySelector(".guides-main-title");
  const subTitle = document.querySelector(".guides-sub-title");
  const text = document.querySelector(".guides-text");
  const link = document.querySelector(".viewAllGuides");
  styleOccasion.map((item) => {
    if (item.No === 1) {
      mainTitle.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].mainTitle
          : styleOccasion[0].mainTitleJA;
      subTitle.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].subTitle
          : styleOccasion[0].mainTitleJA;
      text.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].text
          : styleOccasion[0].textJA;
      link.textContent =
        changeLanguage === "en"
          ? styleOccasion[0].linkText
          : styleOccasion[0].linkTextJA;
    }
    if (item.No === 2) {
      const imageCon = document.querySelector(".guides-lists");
      const li = document.createElement("li");
      li.innerHTML = `
            <img src="./images/styles/thirdSection/${item.occasionImg}.webp" alt=${item.occasionImgAlt} />
            <span>${changeLanguage === "en" ? item.imageTexts : item.imageTextsJA}</span>
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
  const changeLanguage = localStorage.getItem("language") || "en";
  const mainTitle = document.querySelector(".shop-now-main-title");
  const subTitle = document.querySelector(".shop-now-sub-title");
  const text = document.querySelector(".shop-now-text");
  const image = document.querySelector(".shop-now-image");
  mainTitle.textContent =
    changeLanguage === "en"
      ? styleShopNow[0].mainTitle
      : styleShopNow[0].mainTitleJA;
  subTitle.textContent =
    changeLanguage === "en"
      ? styleShopNow[0].subTitle
      : styleShopNow[0].subTitleJA;
  text.textContent =
    changeLanguage === "en" ? styleShopNow[0].text : styleShopNow[0].textJA;
  image.src = `./images/styles/fourthSection/${styleShopNow[0].shopNowImg}.webp`;
  image.alt = styleShopNow[0].shopNowImgAlt;
}
