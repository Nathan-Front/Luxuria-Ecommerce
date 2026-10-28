import { fetchProductData } from "../../script/fetchProducts.js";

export async function fetchAboutHeroCont() {
  const container = document.querySelector(".about-first-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "aboutContents",
    dataKey: "aboutContent",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderAboutHero(fetchDataArr);
}

function renderAboutHero(aboutUs) {
  const title = document.querySelector(".about-main-title");
  const subTitle = document.querySelector(".about-sub-title");
  const text = document.querySelector(".about-hero-text");
  const image = document.querySelector(".about-hero-background");
  image.src = `./images/about/firstSection/${aboutUs[0].heroImg}.webp`;
  image.alt = aboutUs[0].heroImgAlt;
  title.textContent = aboutUs[0].mainTitle;
  subTitle.textContent = aboutUs[0].subTitle;
  text.textContent = aboutUs[0].text;
}
