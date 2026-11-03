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

export async function fetchExchangeRates() {
  try {
    const api = "https://api.frankfurter.dev";

    const res = await fetch(`${api}/v2/rates?base=USD&quotes=EUR,GBP,JPY`);
    if (!res.ok) {
      throw new Error("Failed to fetch exchange rates");
    }
    const data = await res.json();
    const rates = Object.fromEntries(
      data.map((item) => [item.quote, item.rate]),
    );

    const finalRates = {
      USD: 1,
      ...rates,
    };
    return finalRates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    throw error;
  }
}
export function convertCurrency(amount, currency, rates) {
  const rate = rates[currency];

  if (rate === undefined) {
    throw new Error(`Exchange rate for ${currency} not found`);
  }

  return amount * rate;
}
export function formatCurrency(amount, currency, locale) {
  /* return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount); */
  const parts = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).formatToParts(amount);

  return parts
    .map((part) => {
      if (part.type === "fraction" || part.type === "decimal") {
        return `<small>${part.value}</small>`;
      }

      return part.value;
    })
    .join("");
}

export async function updatePriceDisplay() {
  /* const language = localStorage.getItem("language") || "en";
  const rates = await fetchExchangeRates();
  const currency = language === "ja" ? "JPY" : "USD";
  const locale = language === "ja" ? "ja-JP" : "en-US";

  document.querySelectorAll("[data-original-price]").forEach((elem) => {
    const originalPrice = Number(elem.dataset.originalPrice);

    const converted = convertCurrency(originalPrice, currency, rates);

    elem.textContent = formatCurrency(converted, currency, locale);
  }); */
  const language = localStorage.getItem("language") || "en";
  const rates = await fetchExchangeRates();

  const currency = language === "ja" ? "JPY" : "USD";
  const locale = language === "ja" ? "ja-JP" : "en-US";

  document.querySelectorAll("[data-original-price]").forEach((elem) => {
    const originalPrice = Number(elem.dataset.originalPrice);

    const converted = convertCurrency(originalPrice, currency, rates);

    elem.innerHTML = formatCurrency(converted, currency, locale);
  });
}
