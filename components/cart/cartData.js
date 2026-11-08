import { fetchSpecificSheet } from "../../script/fetchApps.js";
import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";

let fetchDataArr = [];
export async function fetchCartHeroCont() {
  const firstSection = document.querySelector(".cart-first-sec");
  setSectionLoading(firstSection, true);
  try {
    fetchDataArr = await fetchSpecificSheet("cartHero", "cartHero");
    renderCartCont(fetchDataArr);
  } catch (error) {
    console.log(error);
    showSectionError(firstSection);
  } finally {
    setSectionLoading(firstSection, false);
  }
}

export function renderCartCont(cartHero) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const cartHeroSection = document.querySelector(".cart-first-sec");
  const title = cartHeroSection.querySelector("h2");
  const text = cartHeroSection.querySelector(".cart-hero-text");
  const background = cartHeroSection.querySelector(".cart-hero-background");
  title.textContent =
    changeLanguage === "en" ? cartHero[0].mainTitle : cartHero[0].mainTitleJA;
  text.textContent =
    changeLanguage === "en" ? cartHero[0].text : cartHero[0].textJA;
  background.src = `./images/cart/firstSection/${cartHero[0].heroImg}.webp`;
  background.alt = cartHero[0].heroImgAlt;
}
