export default function howManyItemsInfo() {
  const appProductsAmount = this.$store.getters.appTotalItems;
  const last = appProductsAmount % 10;
  let output;
  // eslint-disable-next-line no-nested-ternary,no-unused-expressions
  (appProductsAmount >= 11 && appProductsAmount <= 20) ? output = 'товаров' : (last === 1) ? output = 'товар' : (last > 1 && last <= 4) ? output = 'товарa' : output = 'товаров';
  return output;
}
