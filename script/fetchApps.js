import { GOOGLE_APPS_SCRIPT_URL } from "./index.js";

export async function fetchSpecificSheet(
  sheetType,
  key,
  dataFormatter,
  params = {},
) {
  try {
    const queryParams = new URLSearchParams({
      type: sheetType,
      ...params,
    });
    //const url = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?${queryParams}`);
    const url = `${GOOGLE_APPS_SCRIPT_URL}?${queryParams}`;

    const response = await fetch(url);
    const data = await response.json();

    //const response = await fetch(`${GOOGLE_APPS_SCRIPT_URL}?type=${sheetType}`);
    if (!response.ok) {
      throw new Error("Failed to fetch sheet");
    }
    //const data = await response.json();
    return dataFormatter ? dataFormatter(data[key]) : data[key];
  } catch (error) {
    console.log(error);
    throw error; //Re-throw so the caller knows it failed
  }
}
