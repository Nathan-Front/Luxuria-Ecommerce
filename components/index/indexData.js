import { GOOGLE_APPS_SCRIPT_URL } from "../../script/index.js";
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
    setSectionLoading(firstSection);
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

function setSectionLoading(section, isLoading) {
  if (!section) return;
  const loading = section.querySelector(".product-loading");
  if (loading) {
    loading.hidden = !isLoading;
  }
}
