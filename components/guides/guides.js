import { fetchProductData } from "../../script/fetchProducts.js";

export async function fetchGuidesHeroCont() {
  const container = document.querySelector(".guides-first-sec");
  const fetchDataArr = await fetchProductData({
    sheetName: "guidesHero",
    dataKey: "guideHero",
    container: container,
  });
  if (fetchDataArr.length === 0) return;
  renderGuidesHero(fetchDataArr);
}

function renderGuidesHero(guidesHero) {
  const mainTitle = document.querySelector(".guides-main-title");
  const subTitle = document.querySelector(".guides-sub-title");
  const text = document.querySelector(".guides-hero-text");
  const hero = document.querySelector(".guides-hero-background");
  mainTitle.textContent = guidesHero[0].mainTitle;
  subTitle.textContent = guidesHero[0].subTitle;
  text.textContent = guidesHero[0].text;
  hero.src = `./images/guides/firstSection/${guidesHero[0].heroImg}.webp`;
}

export async function fetchGuidesCont() {
  const container = document.querySelector(".guides-first-sec");
  const fetchCategory = await fetchProductData({
    sheetName: "guidesCategory",
    dataKey: "guideCategory",
    container: container,
  });
  const fetchContents = await fetchProductData({
    sheetName: "guidesContents",
    dataKey: "guideContents",
    container: "",
  });
  //if (fetchDataArr.length === 0) return;
  fixDataArray({ fetchCategory, fetchContents });
}
function fixDataArray({ fetchCategory, fetchContents }) {
  /*  const guides = new Map();
  fetchData.forEach((item) => {
    if (!guides.has(item.contentNum)) {
      guides.set(item.contentNum, {
        contentNum: item.contentNum,
        title: "",
        outline: "",
        subTitle: [],
        sections: [],
        tips: [],
      });
    }

    const guide = guides.get(item.contentNum);

    // Main guide information
    if (item.contentID === 1) {
      guide.title = item.title;
      guide.outline = item.outline;
      guide.subTitle.push([
        item.guideOne,
        item.guideTwo,
        item.guideThree,
        item.guideFour,
      ]);
    }
    if (item.tips?.trim()) {
      guide.tips.push(item.tips.trim());
    }
    // Individual guide sections
    if (item.contentID === 2 && item.guideOne) {
      guide.sections.push({
        title: [item.guideOne, item.guideTwo, item.guideThree, item.guideFour],
        outline: [
          item.guideOneOutline,
          item.guideTwoOutline,
          item.guideThreeOutline,
          item.guideFourOutline,
        ],
      });
    }
  }); */
  renderGuidesCont({ fetchCategory, fetchContents });
  //return [...guides.values()];
}
function renderGuidesCont({ fetchCategory, fetchContents }) {
  console.log("category", fetchCategory);
  console.log("content", fetchContents);
  const guideList = document.querySelector(".guide-lists");
  guideList.innerHTML = "";

  fetchCategory.forEach((item) => {
    //match all data where they belong to
    const matchedContents = fetchContents.filter(
      (content) => String(content.contentID) === String(item.contentID),
    );
    //skip empty entries
    if (!item.introduction) return;
    const li = document.createElement("li");
    //list all images folders per type
    const imageFolders = {
      elegance: "elegance",
      wardrobe: "wardrobe",
      business: "business",
      evening: "evening",
      season: "season",
    };
    //filter images
    const imageContents = matchedContents.filter(
      (content) => imageFolders[content.contentType],
    );
    //Render all images inside one container
    const imagesHTML = imageContents
      .map(
        (content) => `
        <img
          src="./images/guides/secondSection/${imageFolders[content.contentType]}/${content.sectionTitle}.webp"
          alt="${content.sectionTitle}"
          loading="lazy"
        />
      `,
      )
      .join("");

    //render sections, tips, and other guide content
    const guideContentHTML = matchedContents
      .filter((content) => !imageFolders[content.contentType])
      .map(
        (content) => `
        <div class="guides">
          ${
            content.sectionTitle &&
            (content.contentType === "section" || content.contentType === "tip")
              ? `
                <h4 class="${
                  content.contentType === "section"
                    ? "section-title"
                    : "section-title-tips"
                }">
                  ${
                    content.contentType === "tip"
                      ? `<strong>${content.sectionTitle}</strong>`
                      : content.sectionTitle
                  }
                </h4>
                <span class="section-title-text">
                  ${content.sectionText || ""}
                </span>
              `
              : ""
          }
          <div class="guides-text">
            ${
              content.contentTitle
                ? `<strong>${content.contentTitle}</strong>`
                : ""
            }
            ${content.contentText ? `<span>${content.contentText}</span>` : ""}
          </div>
        </div>
      `,
      )
      .join("");

    //Combine the image and content containers here
    //This will be the html
    li.innerHTML = `
    <div class="guides-images-con">
      ${imagesHTML}
    </div>

    <div class="guides-content-con">
      <h3>${item.title || ""}</h3>
      <p>${item.introduction || ""}</p>

      ${guideContentHTML}
    </div>
  `;
    guideList.append(li);
  });
}
