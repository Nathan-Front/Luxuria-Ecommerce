import { burgerMenuhandler, displayLikedCount } from "./navigation.js";
import {
  fetchHeroContent,
  fetchIndexFilterContent,
  fetchIndexNewArrivals,
  fetchIndexPromo,
} from "../components/index/indexData.js";
import { validateEmail } from "./emailValidator.js";
async function fetchHTML() {
  const page = document.body.dataset.page;
  const app = document.getElementById("app");
  const body = document.body;
  const authContainer = document.querySelector("#auth-modals");
  try {
    app.innerHTML = `
        <div class="loading">
        <div class="spinner"></div>
        <p>Loading content...</p>
        </div>
    `;

    const [nav, foot, login, userWindow, logoutModal, createAccount] =
      await Promise.all([
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
        fetch("./components/login-create-form/createAccount.html").then(
          (res) => {
            if (!res.ok) throw new Error("User window fetch failed");
            return res.text();
          },
        ),
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

    /* body.insertAdjacentHTML("beforeend", login);
    body.insertAdjacentHTML("beforeend", userWindow);
    body.insertAdjacentHTML("beforeend", logoutModal);
    body.insertAdjacentHTML("beforeend", createAccount); */
    sections.forEach((sec) => {
      app.insertAdjacentHTML("beforebegin", sec);
    });
    body.insertAdjacentHTML("beforeend", foot);
    authContainer.insertAdjacentHTML(
      "beforeend",
      login + userWindow + logoutModal + createAccount,
    );
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
  "https://script.google.com/macros/s/AKfycby9iOopLaCbtyWR-RJEPlJUDrjX_ZvzWpTOZnKVpdWcBWJ1Kpyr0nZMLqQc1gcIYmoD/exec";
//12th ver

//login form
function displayLoginForm() {
  const userBtn = document.querySelectorAll(".user-icon-btn");
  const loginForm = document.querySelector(".login-overlay");
  const authCon = document.querySelector(".auth-overlay");
  const userData = JSON.parse(localStorage.getItem("userData")) || [];
  userBtn.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (userData) {
        loginForm.classList.add("loginForm");
        authCon.classList.add("authOpen");
      } else {
        displayUserWindow();
      }
    });
  });
  const closeLoginForm = document.querySelector(".close-login");

  closeLoginForm.addEventListener("click", () => {
    loginForm.classList.remove("loginForm");
    authCon.classList.remove("authOpen");
  });

  openCreateAccountModal();
}
function loginHandler() {
  const form = document.querySelector(".login-form");
  const userInput = document.getElementById("email-input");
  const passInput = document.getElementById("password-input");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  });
}

//Disable/enable eula checbox and button
function checkInputs() {
  const inputs = document.querySelectorAll(".required-create-inputs");
  const createAccountSubmit = document.querySelector(".create-account-submit");
  const eulaCheckbox = document.getElementById("eula");
  const allFilled = [...inputs].every((input) => input.value.trim() !== "");

  if (allFilled) {
    eulaCheckbox.disabled = false;
  } else {
    eulaCheckbox.disabled = true;
    eulaCheckbox.checked = false;
    createAccountSubmit.disabled = true;
  }

  eulaCheckbox.addEventListener("change", () => {
    createAccountSubmit.disabled = !eulaCheckbox.checked;
  });
}
//Create account modal
function openCreateAccountModal() {
  const createAccountBtn = document.querySelector(".create-account-btn");
  const createAccountForm = document.querySelector(".create-account-con");
  const authCon = document.querySelector(".auth-overlay");

  createAccountBtn.addEventListener("click", () => {
    authCon.classList.add("authOpen");
    createAccountForm.classList.add("createAccntForm");
  });

  const closeCreateAccount = document.querySelector(".close-create-account");
  closeCreateAccount.addEventListener("click", () => {
    authCon.classList.remove("authOpen");
    createAccountForm.classList.remove("createAccntForm");
  });

  const returnToSignIn = document.querySelector(".return-to-sign-in");
  returnToSignIn.addEventListener("click", () => {
    authCon.classList.add("authOpen");
    createAccountForm.classList.remove("createAccntForm");
  });

  const form = document.querySelector(".create-account-form");
  const inputs = form.querySelectorAll(".required-create-inputs");

  inputs.forEach((input) => {
    input.addEventListener("input", checkInputs);
  });
  createAccountHandler();
}
function createAccountHandler() {
  const form = document.querySelector(".create-account-form");
  if (!form) return;
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");
  const emailInput = document.getElementById("userEmail");
  const passwordInput = document.getElementById("password");
  const sendBtn = document.querySelector(".create-account-submit");
  let lastSent = 0;
  emailInput.addEventListener("input", () => {
    if (validateEmail(emailInput.value)) {
      emailInput.classList.remove("error");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isValidEmail = validateEmail(emailInput.value);
    if (!isValidEmail) {
      emailInput.classList.add("error");
      return;
    }
    const trap = document.querySelector(".__honeypot");
    if (trap.value !== "") {
      return;
    }
    //timer for 30s
    const now = Date.now();
    if (now - lastSent < 30000) {
      alert("Please wait before sending again!");
      return;
    }
    lastSent = now;
    sendBtn.disabled = true;
    const param = {
      formType: "create-account",
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    };
    try {
      const formData = new FormData(form);
      /* Object.entries(param).forEach(([key, value]) => {
        formData.append(key, value);
      }); */
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(param),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating the account. Please try again.");
    }
  });
}
//user window
function displayUserWindow() {
  //const userBtn = document.querySelectorAll(".user-icon-btn");
  const userWindow = document.querySelector(".user-window");

  //userBtn.forEach((btn) => {
  // btn.addEventListener("click", () => {
  userWindow.classList.toggle("userWindow");
  //});
  //});
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
