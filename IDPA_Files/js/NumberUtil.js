function round(number, decimals) {
  let res = Math.pow(10, decimals);
  return Math.round(number * res) / res;
}
