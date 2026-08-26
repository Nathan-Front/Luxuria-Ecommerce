import { burgerMenuhandler } from "./navigation.js";
async function fetchHTML() {
  try {
    const page = document.body.dataset.page;
    const app = document.getElementById("app");
    const body = document.body;

    app.innerHTML = `
        <div class="loading">
        <div class="spinner"></div>
        <p>Loading content...</p>
        </div>
    `;

    const [nav] = await Promise.all([
      fetch("./components/navigation/nav.html").then((res) => {
        if (!res.ok) throw new Error("Navigation fetch failed");
        return res.text();
      }),
    ]);

    body.insertAdjacentHTML("beforebegin", nav);

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
}

document.addEventListener("DOMContentLoaded", fetchHTML);
