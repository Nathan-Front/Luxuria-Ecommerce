import { GOOGLE_APPS_SCRIPT_URL } from "./index.js";

export async function fetchSpecificSheet(sheetType, key, dataFormatter) {
  try {
    const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?type=${sheetType}`);
    if (!response.ok) {
      throw new Error("Failed to fetch sheet");
    }
    const data = await response.json();
    return dataFormatter ? dataFormatter(data[key]) : data[key];
  } catch (error) {
    console.log(error);
    throw error; //Re-throw so the caller knows it failed
  }
}
