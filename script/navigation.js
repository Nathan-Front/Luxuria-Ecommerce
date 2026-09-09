export function burgerMenuhandler() {
  const burgerBtn = document.querySelector(".burger-menu-btn");
  const filterOpt = document.querySelector(".nav-links");
  burgerBtn.addEventListener("click", () => {
    if (!filterOpt.classList.contains("showNav")) {
      showBurgerOpt();
    } else {
      hideBurgerOpt();
    }
  });
}
function showBurgerOpt() {
  const filterOpt = document.querySelector(".nav-links");
  filterOpt.classList.add("showNav");
  document.body.classList.add("no-scroll");
  const burgerBtn = document.getElementById("burger-btn");
  burgerBtn.classList.add("activeBurger");
}
function hideBurgerOpt() {
  const filterOpt = document.querySelector(".nav-links");
  filterOpt.classList.remove("showNav");
  document.body.classList.remove("no-scroll");
  const burgerBtn = document.getElementById("burger-btn");
  burgerBtn.classList.remove("activeBurger");
}
export async function displayLikedCount() {
  const likes = document.querySelector(".likes-cnt");
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts")) || [];
  likes.textContent = likedProducts.length > 0 ? likedProducts.length : "";
}
