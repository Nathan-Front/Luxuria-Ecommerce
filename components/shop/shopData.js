import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";

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
