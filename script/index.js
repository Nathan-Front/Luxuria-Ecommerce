import { burgerMenuhandler, displayLikedCount } from "./navigation.js";
import {
  fetchHeroContent,
  fetchIndexFilterContent,
  fetchIndexNewArrivals,
  fetchIndexPromo,
} from "../components/index/indexData.js";

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

    const [nav, foot, login, userWindow, logoutModal] = await Promise.all([
      fetch("./components/navigation/nav.html").then((res) => {
        if (!res.ok) throw new Error("Navigation fetch failed");
        return res.text();
      }),
      fetch("./components/footer/footer.html").then((res) => {
        if (!res.ok) throw new Error("Footer fetch failed");
        return res.text();
      }),
      fetch("./components/login-create-form/login.html").then((res) => {
        if (!res.ok) throw new Error("Login form fetch failed");
        return res.text();
      }),
      fetch("./components/login-create-form/userWindow.html").then((res) => {
        if (!res.ok) throw new Error("User window fetch failed");
        return res.text();
      }),
      fetch("./components/login-create-form/logoutModal.html").then((res) => {
        if (!res.ok) throw new Error("User window fetch failed");
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
    body.insertAdjacentHTML("beforeend", login);
    body.insertAdjacentHTML("beforeend", userWindow);
    body.insertAdjacentHTML("beforeend", logoutModal);
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
  displayLikedCount();
  if (page === "home") {
    fetchHeroContent();
    fetchIndexFilterContent();
    fetchIndexNewArrivals();
    fetchIndexPromo();
  }
  displayLoginForm();
  //displayUserWindow();
}

document.addEventListener("DOMContentLoaded", fetchHTML);

export const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxO_49C6uuPlyR6cbHOaN-rfz8za-Ovny-GZ8cMIjp4Qq5Nfnr1NcVaPsdk-1UTiq3T/exec";
//6th ver

//login form
function displayLoginForm() {
  const userBtn = document.querySelectorAll(".user-icon-btn");
  const loginForm = document.querySelector(".login-overlay");
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  userBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (userData) {
        loginForm.classList.add("loginForm");
      } else {
        displayUserWindow();
      }
    });
  });
  const closeLoginForm = document.querySelector(".close-login");
  closeLoginForm.addEventListener("click", () => {
    loginForm.classList.remove("loginForm");
  });
}

//user window
function displayUserWindow() {
  const userBtn = document.querySelectorAll(".user-icon-btn");
  const userWindow = document.querySelector(".user-window");

  userBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      userWindow.classList.add("userWindow");
    });
  });
  displayLogoutModal();
}

//logout modal
function displayLogoutModal() {
  const logoutBtn = document.querySelector(".logout");
  const logoutModal = document.querySelector(".logout-modal");
  logoutBtn.addEventListener("click", () => {
    const userWindow = document.querySelector(".user-window");
    userWindow.classList.remove("userWindow");
    logoutModal.classList.add("logoutModal");
  });

  const cancel = document.querySelector(".cancel-logout");
  cancel.addEventListener("click", () => {
    if (logoutModal) {
      logoutModal.classList.remove("logoutModal");
    }
  });
}
