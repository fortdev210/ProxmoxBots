const WalmartBuy = require("./walmart_buy");
require("dotenv").config();
const prefix = "Walmart+Pp";
const botNumber =
  process.env.TEST_MODE === "true"
    ? 11
    : require("os").hostname().replace(/\D/g, "").replace("0", "");
const flag = prefix + Number(botNumber);
const API = require("../lib/api");
const LOGGER = require("../lib/logger");
const { parseDSOrderInfo } = require("../lib/utils");
const { WAREHOUSE_BUY_BOTS_NUMBERS } = require("../constants/warehouse");

async function main() {
  const api = new API();
  const orderItems = WAREHOUSE_BUY_BOTS_NUMBERS.includes(Number(botNumber))
    ? await api.fetchWarehouseItems(flag)
    : await api.fetchOrderItems(flag);

  if (orderItems.length === 0) {
    LOGGER.info("No order items found. Please put orders in this folder.");
    return;
  }
  const orderItemIds = orderItems.map((order) => order.order_item_id);
  LOGGER.info("Order Item IDs: ", orderItemIds);

  for (const orderItemId of orderItemIds) {
    const orderInfo = await api.createDSOrder(orderItemId);
    const parsedOrder = parseDSOrderInfo(orderInfo);
    LOGGER.info("ORDER: ", parsedOrder);
    const buyer = new WalmartBuy(parsedOrder, orderItemId);
    await buyer.buy();
  }
}

main();
