import { setSectionLoading } from "../../script/loadingSpinner.js";
import { showSectionError } from "../../script/fetchDataError.js";
import { fetchSpecificSheet } from "./fetchApps.js";
export async function fetchProductData({ sheetName, dataKey, container }) {
  setSectionLoading(container, true);
  try {
    const data = await fetchSpecificSheet(sheetName, dataKey);
    return data;
  } catch (error) {
    console.log(error);
    showSectionError(container);
  } finally {
    setSectionLoading(container, false);
  }
}
