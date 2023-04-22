export function valueWithDiscount(value: number, percentage = 0) {
  const discount = 1 - percentage
  return value * discount
}
