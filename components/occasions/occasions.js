import { fetchProductData } from "../../script/fetchProducts.js";

export async function fetchOccasionssHeroCont() {
  const container = document.querySelector(".occasions-first-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "occasionsHero",
    dataKey: "occasionHero",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderOccasionsHero(fetchDataArr);
}

function renderOccasionsHero(occasionsHero) {
  const mainTitle = document.querySelector(".occasions-main-title");
  const subTitle = document.querySelector(".occasions-sub-title");
  const text = document.querySelector(".occasions-hero-text");
  const hero = document.querySelector(".occasions-hero-background");
  mainTitle.textContent = occasionsHero[0].mainTitle;
  subTitle.textContent = occasionsHero[0].subTitle;
  text.textContent = occasionsHero[0].text;
  hero.src = `./images/occasions/firstSection/${occasionsHero[0].heroImg}.webp`;
}
