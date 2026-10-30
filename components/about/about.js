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
  const title = document.querySelector(".story-main-title");
  const subTitle = document.querySelector(".story-sub-title");
  const text = document.querySelector(".story-text");
  const image = document.querySelector(".story-main-image");
  title.textContent = fetchStory[0].mainTitle;
  subTitle.textContent = fetchStory[0].subTitle;
  text.textContent = fetchStory[0].text;
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
        <span>${item.valueTitle}</span>
        <p>${item.valueText}</p>
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
  const title = document.querySelector(".journey-main-title");
  const subTitle = document.querySelector(".journey-sub-title");
  const text = document.querySelector(".journey-text");
  if (journey[0].No === 1) {
    title.textContent = journey[0].mainTitle;
    subTitle.textContent = journey[0].subTitle;
    text.textContent = journey[0].text;
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
