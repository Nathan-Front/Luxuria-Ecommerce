import { setSectionLoading } from "./loadingSpinner.js";
import { showSectionError } from "./fetchDataError.js";
import { fetchSpecificSheet } from "./fetchApps.js";

export async function fetchProductData({
  sheetName,
  dataKey,
  container,
  params = {},
}) {
  setSectionLoading(container, true);
  try {
    const data = await fetchSpecificSheet(sheetName, dataKey, null, params);
    return data;
  } catch (error) {
    console.log(error);
    showSectionError(container);
  } finally {
    setSectionLoading(container, false);
  }
}
