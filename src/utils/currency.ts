export function money(cents: number) {
  return `$${(cents / 100).toLocaleString()}`;
}
