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
  const changeLanguage = localStorage.getItem("language") || "en";
  const title = document.querySelector(".about-main-title");
  const subTitle = document.querySelector(".about-sub-title");
  const text = document.querySelector(".about-hero-text");
  const image = document.querySelector(".about-hero-background");
  image.src = `./images/about/firstSection/${aboutUs[0].heroImg}.webp`;
  image.alt = aboutUs[0].heroImgAlt;
  title.textContent =
    changeLanguage === "en" ? aboutUs[0].mainTitle : aboutUs[0].mainTitleJA;
  subTitle.textContent = aboutUs[0].subTitle;
  text.textContent =
    changeLanguage === "en" ? aboutUs[0].text : aboutUs[0].textJA;
}

export async function fetchAboutStoryCont() {
  const container = document.querySelector(".about-second-sec");
  const fetchStory = await fetchProductData({
    sheetName: "aboutStories",
    dataKey: "aboutStory",
    container: container,
  });
  const fetchValue = await fetchProductData({
    sheetName: "aboutValues",
    dataKey: "aboutValue",
    container: container,
  });
  renderAboutStory({ fetchStory, fetchValue });
}

function renderAboutStory({ fetchStory, fetchValue }) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const title = document.querySelector(".story-main-title");
  const subTitle = document.querySelector(".story-sub-title");
  const text = document.querySelector(".story-text");
  const image = document.querySelector(".story-main-image");
  title.textContent =
    changeLanguage === "en"
      ? fetchStory[0].mainTitle
      : fetchStory[0].mainTitleJA;
  subTitle.textContent =
    changeLanguage === "en" ? fetchStory[0].subTitle : fetchStory[0].subTitleJA;
  text.textContent =
    changeLanguage === "en" ? fetchStory[0].text : fetchStory[0].textJA;
  image.src = `./images/about/secondSection/${fetchStory[0].mainImg}.webp`;
  image.alt = `${fetchStory[0].mainImg}-image`;

  const storyList = document.querySelector(".story-icons");
  storyList.innerHTML = "";

  fetchValue.map((item) => {
    if (item.No === 1) {
      const value = document.querySelector(".story-value");
      value.textContent = item.valueTitle;
    }
    if (item.No === 1 && item.valueImg === "") return;
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <img src="./images/about/secondSection/${item.valueImg}.webp" alt="${item.valueTitle}" />
        <span>${changeLanguage === "en" ? item.valueTitle : item.valueTitleJA}</span>
        <p>${changeLanguage === "en" ? item.valueText : item.valueTextJA}</p>
      </div>
    `;
    storyList.append(li);
  });
}

export async function fetchAboutJourneyCont() {
  const container = document.querySelector(".about-third-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "aboutJourneys",
    dataKey: "aboutJourney",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderAboutJourney(fetchDataArr);
}

function renderAboutJourney(journey) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const title = document.querySelector(".journey-main-title");
  const subTitle = document.querySelector(".journey-sub-title");
  const text = document.querySelector(".journey-text");
  if (journey[0].No === 1) {
    title.textContent =
      changeLanguage === "en" ? journey[0].mainTitle : journey[0].mainTitleJA;
    subTitle.textContent =
      changeLanguage === "en" ? journey[0].subTitle : journey[0].subTitleJA;
    text.textContent =
      changeLanguage === "en" ? journey[0].text : journey[0].textJA;
  }
  if (journey.mainImg !== "") {
    const imagesList = document.querySelector(".journey-images-list");
    journey.map((img) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="./images/about/thirdSection/${img.mainImg}.webp" alt="${img.mainImg}-image" />
      `;
      imagesList.append(li);
    });
  }
}
