import { languages } from "./translation.js";
//error message
export function showSectionError(section) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("section-error");
  errorMessage.innerHTML = `
    <p>${changeLanguage === "en" ? languages.en.fetchErrorText1 : languages.ja.fetchErrorText1}</p>
    <span>${changeLanguage === "en" ? languages.en.fetchErrorText2 : languages.ja.fetchErrorText2}</span>
  `;
  section.appendChild(errorMessage);
}
