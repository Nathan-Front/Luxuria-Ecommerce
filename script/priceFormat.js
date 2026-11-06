export function formatPrice(price, showDecimals = true) {
  const [whole, decimal] = price.toFixed(2).split(".");
  return showDecimals ? `$${whole}<small>.${decimal}</small>` : `$${whole}`;
}
