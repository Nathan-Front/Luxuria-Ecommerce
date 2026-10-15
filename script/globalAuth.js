export function openGlobalAuth() {
  const authCon = document.querySelector(".auth-overlay");
  if (!authCon) return;
  authCon.classList.add("authOpen");
  document.body.classList.add("no-scroll");
}
export function hideGlobalAuth() {
  const authCon = document.querySelector(".auth-overlay");
  if (!authCon) return;
  authCon.classList.remove("authOpen");
  document.body.classList.remove("no-scroll");
}
