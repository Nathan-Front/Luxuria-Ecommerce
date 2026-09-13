export function filterContents() {
  const aside = document.querySelector(".aside");
  if (!aside) return;
  aside.addEventListener("click", (e) => {
    const optBtn = e.target.closest(".filter-titles");
    if (!optBtn) return;
    const filterDisplay = optBtn.nextElementSibling;
    const filterOpt = aside.querySelectorAll(".hide-select-cont");
    const arrow = optBtn.querySelector(".filters-arrow");
    filterOpt.forEach((showOpt) => {
      if (showOpt === filterDisplay) {
        if (showOpt.style.maxHeight) {
          showOpt.style.maxHeight = null;
          arrow.classList.remove("rotate-arrow");
        } else {
          showOpt.style.maxHeight = showOpt.scrollHeight + "px";
          arrow.classList.add("rotate-arrow");
        }
      } else {
        showOpt.style.maxHeight = null;
        const otherArrow =
          showOpt.previousElementSibling?.querySelector(".filters-arrow");

        otherArrow?.classList.remove("rotate-arrow");
      }
    });
  });
}
window.addEventListener("resize", () => {
  document.querySelectorAll(".hide-select-cont").forEach((container) => {
    if (container.style.maxHeight) {
      container.style.maxHeight = container.scrollHeight + "px";
    }
  });
});

export function displayFiltersTablet() {
  const display = document.querySelector(".display-filter-tablet");
  display.addEventListener("click", () => {
    const filterOpt = document.querySelectorAll(".filter-tablet");
    filterOpt.forEach((item) => {
      if (item.classList.contains("displayFilter")) {
        item.classList.remove("displayFilter");
      } else {
        item.classList.add("displayFilter");
      }
    });
  });
}
