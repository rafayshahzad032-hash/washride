export function formatPKR(amount: number): string {
  const withCommas = String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `Rs. ${withCommas}`;
}