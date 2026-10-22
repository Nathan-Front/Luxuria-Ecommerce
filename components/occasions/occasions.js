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

export async function fetchOccasionssCasualCont() {
  const container = document.querySelector(".occasions-second-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "occasionsCasual",
    dataKey: "occasionCasual",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderOccasionsCasual(fetchDataArr);
}
function renderOccasionsCasual(casual) {
  const listCont = document.querySelector(".occasions-casual-list");
  const title = document.querySelector(".section-casual-title");
  casual.map((item) => {
    if (item.No === 1) {
      title.textContent = item.category;
    }
    if (item.No === 2) {
      const li = document.createElement("li");
      li.innerHTML = `
    <img src ="./images/occasions/secondSection/${item.casualImg}.webp" alt="" />
    `;
      listCont.append(li);
    }
  });
}

export async function fetchOccasionssBusinessCont() {
  const container = document.querySelector(".occasions-second-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "occasionsBusiness",
    dataKey: "occasionBusiness",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderOccasionsBusiness(fetchDataArr);
}
function renderOccasionsBusiness(business) {
  const listCont = document.querySelector(".occasions-business-list");
  const title = document.querySelector(".section-business-title");
  business.map((item) => {
    if (item.No === 1) {
      title.textContent = item.category;
    }
    if (item.No === 2) {
      const li = document.createElement("li");
      li.innerHTML = `
    <img src ="./images/occasions/thirdSection/${item.businessImg}.webp" alt="" />
    `;
      listCont.append(li);
    }
  });
}

export async function fetchOccasionssEveningCont() {
  const container = document.querySelector(".occasions-fourth-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "occasionsEvening",
    dataKey: "occasionEvening",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderOccasionsEvening(fetchDataArr);
}
function renderOccasionsEvening(evening) {
  const listCont = document.querySelector(".occasions-evening-list");
  const title = document.querySelector(".section-evening-title");
  evening.map((item) => {
    if (item.No === 1) {
      title.textContent = item.category;
    }
    if (item.No === 2) {
      const li = document.createElement("li");
      li.innerHTML = `
    <img src ="./images/occasions/fourthSection/${item.eveningImg}.webp" alt="" />
    `;
      listCont.append(li);
    }
  });
}

export async function fetchOccasionsTravelCont() {
  const container = document.querySelector(".occasions-fifth-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "occasionsTravel",
    dataKey: "occasionTravel",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderOccasionsTravel(fetchDataArr);
}
function renderOccasionsTravel(travel) {
  const listCont = document.querySelector(".occasions-travel-list");
  const title = document.querySelector(".section-travel-title");
  travel.map((item) => {
    if (item.No === 1) {
      title.textContent = item.category;
    }
    if (item.No === 2) {
      const li = document.createElement("li");
      li.innerHTML = `
    <img src ="./images/occasions/fifthSection/${item.travelImg}.webp" alt="" />
    `;
      listCont.append(li);
    }
  });
}
