//error message
export function showSectionError(section) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("section-error");
  errorMessage.innerHTML = `
    <p>We couldn't load this section."</p>
    <span>Please reload the page and try again.</span>
  `;
  section.appendChild(errorMessage);
}
