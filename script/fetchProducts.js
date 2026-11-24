import { setSectionLoading } from "./loadingSpinner.js";
import { showSectionError } from "./fetchDataError.js";
import { fetchSpecificSheet } from "./fetchApps.js";
import { languages } from "./translation.js";
export async function fetchProductData({
  sheetName,
  dataKey,
  container,
  params = {},
}) {
  try {
    setSectionLoading(container, true);
    retrieveDataMessage(container);
    const data = await fetchSpecificSheet(sheetName, dataKey, null, params);
    return data;
  } catch (error) {
    console.log(error);
    showSectionError(container);
  } finally {
    setSectionLoading(container, false);
  }
}

function retrieveDataMessage(container) {
  const changeLanguage = localStorage.getItem("language") || "en";
  const mainDiv = document.createElement("div");
  mainDiv.classList = "product-loading";
  if (!container) return;
  mainDiv.innerHTML = `
    <div class="product-spinner"></div>
    <p>${
      changeLanguage === "en"
        ? languages.en.retrieveDataText
        : languages.ja.retrieveDataText
    }</p>
  `;
  container.prepend(mainDiv);
}
