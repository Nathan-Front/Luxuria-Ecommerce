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
  const text = document.querySelector(".text");
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
            <img src="./images/styles/secondSection/${item.heroImg}.webp" alt=${item.heroImgAlt} />
            <span>${item.heroImg}</span>
        `;
      imageCon.append(li);
    }
  });
}
