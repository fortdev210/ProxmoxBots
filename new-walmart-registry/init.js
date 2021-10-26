require("dotenv").config();
const prefix = "Walmart+Prep";
const botNumber =
  process.env.TEST_MODE === "true"
    ? 7
    : require("os").hostname().replace(/\D/g, "").replace("0", "");
const flag = prefix + botNumber;
const API = require("../lib/api");
const LOGGER = require("../lib/logger");
const { parseDSOrderInfo } = require("../lib/utils");
const WalmartRegister = require("./walmart_registry");
const { WAREHOUSE_PREP_BOTS_NUMBERS } = require("../constants/warehouse");

async function main() {
  const api = new API();

  const orderItems = WAREHOUSE_PREP_BOTS_NUMBERS.includes(Number(botNumber))
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
    const register = new WalmartRegister(parsedOrder, orderItemId);
    await register.processOrderWithExtraItem();
    console.log("");
  }
}
main();
