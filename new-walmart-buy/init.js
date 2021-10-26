const WalmartBuy = require("./walmart_buy");
require("dotenv").config();
const prefix = "Walmart+Pp";
const botNumber =
  process.env.TEST_MODE === "true"
    ? 3
    : require("os").hostname().replace(/\D/g, "").replace("0", "");
const flag = prefix + botNumber;
const API = require("../lib/api");
const LOGGER = require("../lib/logger");
const { parseDSOrderInfo } = require("../lib/utils");
const { WAREHOUSE_BUY_BOTS_NUMBERS } = require("../constants/warehouse");

async function main() {
  const buyer = new WalmartBuy();
  await buyer.buy();
}

main();
