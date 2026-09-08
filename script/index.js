import { burgerMenuhandler, displayLikedCount } from "./navigation.js";
import {
  fetchHeroContent,
  fetchIndexFilterContent,
  fetchIndexNewArrivals,
  fetchIndexPromo,
} from "../components/index/indexData.js";
import { validateEmail } from "./emailValidator.js";
import { avatarUpload } from "../components/login-create-form/uploadAvatar.js";
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
  restoreLoggedUser();
}

document.addEventListener("DOMContentLoaded", fetchHTML);

export const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyR0TSCt5abJCp6d8Um68TTGcip-FcLc-K3Xp_9flhfyfUHPoZkD88QuyR9YQOA1kUj/exec";
//50th ver

//display/hide authCon on click of user icon
function showAuthCon() {
  const authCon = document.querySelector(".auth-overlay");
  authCon.classList.add("authOpen");
  document.body.classList.add("no-scroll");
}
function hideAuthCon() {
  const authCon = document.querySelector(".auth-overlay");
  authCon.classList.remove("authOpen");
  document.body.classList.remove("no-scroll");
}

//show/hide login form
function showLoginForm() {
  const loginForm = document.querySelector(".login-overlay");
  loginForm.classList.add("loginForm");
}
function hideLoginForm() {
  const loginForm = document.querySelector(".login-overlay");
  loginForm.classList.remove("loginForm");
}
//login form
function displayLoginForm() {
  const userBtn = document.querySelectorAll(".user-icon-btn");
  userBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
      if (!loggedIn || !loggedIn.loggedIn) {
        showLoginForm();
        showAuthCon();
      } else {
        showAuthCon();
        displayUserWindow(loggedIn);
        restoreLoggedUser();
      }
    });
  });

  const closeLoginForm = document.querySelector(".close-login");
  closeLoginForm.addEventListener("click", () => {
    hideLoginForm();
    hideAuthCon();
  });
  openCreateAccountModal();
  loginHandler();
}

function loginHandler() {
  const form = document.querySelector(".login-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userInput = document.getElementById("email-input");
    const passInput = document.getElementById("password-input");
    if (userInput.value === "" || passInput.value === "") {
      alert("Please fill in both email and password fields.");
      return;
    }
    const isValidEmail = validateEmail(userInput.value);
    if (!isValidEmail) {
      userInput.classList.add("error");
      return;
    }
    const trap = document.querySelector(".login_honeypot");
    if (trap.value !== "") {
      return;
    }
    const params = {
      formType: "login",
      email: userInput.value,
      password: passInput.value,
    };
    showSpinner();
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(params),
      });
      const result = await response.json();
      if (!result.success) {
        alert(result.message);
        hideSpinner();
        return;
      }
      const paramReturn = {
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        avatar: result.user.avatar,
        loggedIn: true,
      };
      const savedUser = JSON.parse(localStorage.getItem("savedUser")) || [];
      const loggedUserIcon = "./images/nav/user-logged-in.svg";
      const userIcon = document.querySelectorAll(".nav-user-icon");
      if (result.success) {
        const rememberMeCheckbox = document.getElementById("rememberMe");
        if (rememberMeCheckbox.checked) {
          localStorage.setItem(
            "rememberUserName",
            JSON.stringify(result.user.email),
          );
        }
        localStorage.setItem("savedUser", JSON.stringify(loggedUserIcon));
        localStorage.setItem("loggedIn", JSON.stringify(paramReturn));
        if (savedUser) {
          userIcon.forEach((icon) => {
            icon.src = loggedUserIcon;
          });
        }
        const userAvatar = document.getElementById("user-avatar");
        if (user.avatarFileId) {
          userAvatar.src = `https://drive.google.com/thumbnail?id=${userData.avatar}&sz=w200`;
        } else {
          userAvatar.src = "./images/index/secondSection/mens.webp";
        }
      }

      alert(result.message);
      hideSpinner();
      hideLoginForm();
      hideAuthCon();
      form.reset();
    } catch (error) {
      console.log(error);
      alert("An error occurred while logging in. Please try again.");
      hideSpinner();
    } finally {
      hideSpinner();
    }
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

//hide/show create account form
function showCreateAccountForm() {
  const createAccountForm = document.querySelector(".create-account-con");
  createAccountForm.classList.add("createAccntForm");
}
function hideCreateAccountForm() {
  const createAccountForm = document.querySelector(".create-account-con");
  createAccountForm.classList.remove("createAccntForm");
}
//Create account modal
function openCreateAccountModal() {
  const createAccountBtn = document.querySelector(".create-account-btn");
  createAccountBtn.addEventListener("click", () => {
    showCreateAccountForm();
    showAuthCon();
  });

  const closeCreateAccount = document.querySelector(".close-create-account");
  closeCreateAccount.addEventListener("click", () => {
    hideAuthCon();
    hideCreateAccountForm();
  });

  const returnToSignIn = document.querySelector(".return-to-sign-in");
  returnToSignIn.addEventListener("click", () => {
    showAuthCon();
    hideCreateAccountForm();
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
      alert("Please wait 30 seconds before sending again!");
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
    showSpinner();
    try {
      /* const formData = new FormData(form); */
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(param),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const result = await response.json(); //parse the JSON response
      if (!result.success) {
        alert(result.message);
        hideSpinner();
        return;
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("An error occurred while creating the account. Please try again.");
    } finally {
      hideSpinner();
    }
  });
}

//show/hide user window
function showUserWindow() {
  const userWindow = document.querySelector(".user-window");
  userWindow.classList.add("userWindow");
}
function hideUserWindow() {
  const userWindow = document.querySelector(".user-window");
  userWindow.classList.remove("userWindow");
}
//user window
function displayUserWindow(loggedInUser) {
  showUserWindow();
  const userNameElement = document.querySelector(".user-name");
  const userEmailElement = document.querySelector(".user-email");
  userNameElement.textContent =
    loggedInUser.firstName + " " + loggedInUser.lastName;
  userEmailElement.textContent = loggedInUser.email;

  const closeUserWindow = document.querySelector(".close-userWindow");
  closeUserWindow.addEventListener("click", () => {
    hideUserWindow();
    hideAuthCon();
  });
  displayLogoutModal();
  avatarUpload();
}

//logout modal
function displayLogoutModal() {
  const logoutBtn = document.querySelector(".logout");
  const logoutModal = document.querySelector(".logout-modal");
  logoutBtn.addEventListener("click", () => {
    hideUserWindow();
    logoutModal.classList.add("logoutModal");
  });

  const confirmLogout = document.querySelector(".confirm-logout");
  const cancel = document.querySelector(".cancel-logout");
  const avatar = document.getElementById("user-avatar");
  if (confirmLogout) {
    confirmLogout.addEventListener("click", () => {
      logoutModal.classList.remove("logoutModal");
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("savedUser");
      hideAuthCon();
      restoreLoggedUser(); //update icon
      avatar.src = "./images/index/secondSection/mens.webp";
    });
  }
  if (cancel) {
    cancel.addEventListener("click", () => {
      logoutModal.classList.remove("logoutModal");
      hideAuthCon();
    });
  }
}

//spinner
export function showSpinner() {
  const autthContainer = document.querySelector("#auth-modals");
  const spinner = document.createElement("div");
  spinner.className = "spinner-overlay";
  spinner.innerHTML = `
        <div class="loader-box">
          <div class="waiting-spinner"></div>
          <h3>Processing...</h3>
          <p>Please wait a moment.</p>
        </div>
  `;
  autthContainer.append(spinner);
}
export function hideSpinner() {
  const spinner = document.querySelector(".spinner-overlay");
  if (!spinner) return;
  spinner.remove();
}

//on relaod, restore rememberme, user icon and user avatar
function restoreLoggedUser() {
  const savedUser = JSON.parse(localStorage.getItem("rememberUserName"));
  const savedUserIcon = JSON.parse(localStorage.getItem("savedUser"));
  const userIcon = document.querySelectorAll(".nav-user-icon");
  if (savedUser) {
    const userEmailInput = document.getElementById("email-input");
    userEmailInput.value = savedUser;
  }
  if (userIcon) {
    userIcon.forEach((icon) => {
      icon.src = savedUserIcon || "./images/nav/user-svgrepo-com.svg";
    });
  }
  const userData = JSON.parse(localStorage.getItem("loggedIn"));
  const userAvatar = document.getElementById("user-avatar");
  if (userData?.loggedIn && userData.avatar) {
    userAvatar.src = `https://drive.google.com/thumbnail?id=${userData.avatar}&sz=w200`;
  }
}
