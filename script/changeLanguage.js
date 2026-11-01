import { languages } from "./translation.js";
export function changeLanguage() {
  const language = localStorage.getItem("language") || "en";
  const selectedLanguage = languages[language];
  if (!selectedLanguage) return;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (selectedLanguage[key]) {
      element.textContent = selectedLanguage[key];
    }
  });
  document.documentElement.lang = language;
}
