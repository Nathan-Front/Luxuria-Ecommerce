export function formatPrice(price) {
  const [whole, decimal] = price.toFixed(2).split(".");
  return `
        $${whole}<small>.${decimal}</small>
    `;
}
