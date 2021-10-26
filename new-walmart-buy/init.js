const WalmartBuy = require("./walmart_buy");

async function main() {
  const buyer = new WalmartBuy();
  await buyer.buy();
}

main();
