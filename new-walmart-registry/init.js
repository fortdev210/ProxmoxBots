require("dotenv").config();
const prefix = "Walmart+Prep";
const flag =
  process.env.TEST_MODE === "true"
    ? "Walmart+Prep3"
    : prefix + require("os").hostname().replace(/\D/g, "").replace("0", "");
const API = require("../lib/api");
const LOGGER = require("../lib/logger");
const { parseDSOrderInfo } = require("../lib/utils");
const WalmartRegister = require("./walmart_registry");

async function main() {
  const api = new API();

  const orderItems = await api.fetchOrderItems(flag);
  const orderItemIds = orderItems.map((order) => order.order_item_id);
  LOGGER.info("Order Item IDs: ", orderItemIds);

  for (const orderItemId of orderItemIds) {
    const orderInfo = await api.createDSOrder(orderItemId);
    const parsedOrder = parseDSOrderInfo(orderInfo);
    LOGGER.info("ORDER: ", parsedOrder);
    const register = new WalmartRegister(parsedOrder, orderItemId);
    if (parsedOrder.extraItem) {
      await register.processOrderWithExtraItem();
      console.log("");
    }
  }
}
main();
