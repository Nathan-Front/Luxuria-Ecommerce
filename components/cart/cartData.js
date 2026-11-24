import { fetchProductData } from "../../script/fetchProducts.js";

export async function fetchCartHeroCont() {
  const container = document.querySelector(".cart-first-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "cartHero",
    dataKey: "cartHero",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderCartCont(fetchDataArr);
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
