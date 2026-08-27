import { burgerMenuhandler } from "./navigation.js";
import { fetchHeroContent } from "../components/index/indexData.js";
async function fetchHTML() {
  const page = document.body.dataset.page;
  const app = document.getElementById("app");
  const body = document.body;
  try {
    app.innerHTML = `
        <div class="loading">
        <div class="spinner"></div>
        <p>Loading content...</p>
        </div>
    `;

    const [nav, foot] = await Promise.all([
      fetch("./components/navigation/nav.html").then((res) => {
        if (!res.ok) throw new Error("Navigation fetch failed");
        return res.text();
      }),
      fetch("./components/footer/footer.html").then((res) => {
        if (!res.ok) throw new Error("Footer fetch failed");
        return res.text();
      }),
    ]);
    let sections = [];
    if (page === "home") {
      sections = await Promise.all([
        fetch("./components/index/indexFirstSection.html").then((res) =>
          res.text(),
        ),
        fetch("./components/index/indexSecondSection.html").then((res) =>
          res.text(),
        ),
        fetch("./components/index/indexThirdSection.html").then((res) =>
          res.text(),
        ),
        fetch("./components/index/indexFourthSection.html").then((res) =>
          res.text(),
        ),
      ]);
    }
    body.insertAdjacentHTML("beforebegin", nav);
    sections.forEach((sec) => {
      app.insertAdjacentHTML("beforebegin", sec);
    });
    body.insertAdjacentHTML("beforeend", foot);
    app.innerHTML = "";
  } catch (error) {
    console.log(error);
    app.innerHTML = `
            <div>
             <h2>Sorry for the inconvinience</h2>
                <p>Unable to load content</p>
                <button onclick="location.reload()">
                    Try again
                </button>
            </div>
        `;
  }
  burgerMenuhandler();
  if (page === "home") {
    fetchHeroContent();
  }
}

document.addEventListener("DOMContentLoaded", fetchHTML);

export const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxNmwqUw3PoSWxMm68CLyzJLJ2_NuSuT_tgiQ8R1nDooM1D0r8L1KA-veLU1dp0liOo/exec";
