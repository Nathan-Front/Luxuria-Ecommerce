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
  fetchCategory.map((item) => {
    const li = document.createElement("li");
    //skip empty entries
    if (!item.introduction) return "";
    li.innerHTML = `
        <div class="guides-images-con">
          <img src="" alt="image 1" />
          <img src="" alt="image 2" />
          <img src="" alt="image 3" />
          <img src="" alt="image 4" />
        </div>
        <div class="guides-content-con">
          ${
            item.contentID
              ? `
                <h3>${item.title ? item.title : ""}</h3>
                <p>${item.introduction ? item.introduction : ""}</p>
              `
              : ""
          }
           <div class="guides">
            ${fetchContents
              .filter(
                (content) =>
                  String(content.contentID) === String(item.contentID),
              )
              .map(
                (content) => `
                ${
                  (content.sectionTitle && content.contentType === "section") ||
                  (content.sectionTitle && content.contentType === "tip")
                    ? `
                      
                      ${
                        content.contentType === "section"
                          ? `
                          <h4>${content.sectionTitle}</h4>
                        `
                          : `
                          <h4><strong>${content.sectionTitle}</strong></h4>
                        `
                      }
                      <span>${content.sectionText}</span>
                    `
                    : ""
                }
                <div class=guides-text>
                    ${content.contentTitle ? `<strong>${content.contentTitle}</strong>` : ""}
                    ${content.contentText ? `<span>${content.contentText}</span>` : ""}
                </div>
               `,
              )
              .join("")}
           </div>
        </div>
      `;
    guideList.append(li);
  });
  /* const guideList = document.querySelector(".guide-lists");
  guideList.innerHTML = "";
  guides.map((item) => {
    const li = document.createElement("li");

    li.innerHTML = `
          <li>
      <div class="guides-images-con">
        <img src="" alt="image 1" />
        <img src="" alt="image 2" />
        <img src="" alt="image 3" />
        <img src="" alt="image 4" />
      </div>
      <div class="guides-content-con">
      ${
        item.contentNum
          ? `
        <h3>${item.title}</h3>
        <p>${item.outline}</p>
        `
          : ""
      }
        <div class="guides">
        ${item.subTitle.map(
          (sub) =>
            `
              <h4>${sub}</h4>
              ${item.sections
                .map((section) =>
                  section.title
                    .map((title, index) => {
                      const outline = section.outline[index];

                      //skip empty entries
                      if (!title && !outline) return "";

                      return `
                    <p>
                      ${title ? `<strong>${title}</strong>` : ""}
                      ${outline ? `<span>${outline}</span>` : ""}
                    </p>
                  `;
                    })
                    .join(""),
                )
                .join("")}
            `,
        )}
          
          
        </div>

        ${item.tips
          .map(
            (tip) =>
              `
            <p>
              <strong>${tip}</strong>
            </p>
            `,
          )
          .join("")}
        
      </div>
    </li>
      `;
    guideList.append(li);
  }); */
}
