export function burgerMenuhandler() {
  const burgerBtn = document.querySelector(".burger-menu-btn");
  const filterOpt = document.querySelector(".nav-links");
  burgerBtn.addEventListener("click", () => {
    filterOpt.classList.toggle("showNav");
    document.body.classList.toggle("no-scroll");
  });
}
