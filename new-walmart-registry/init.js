require("dotenv").config();
const flag =
  process.env.TEST_MODE === "true" ? "Walmart+Prep3" : require("os").hostname();
const API = require("../lib/api");
const LOGGER = require("../lib/logger");

async function main() {
  const api = new API();
  const orderItems = await api.fetchOrderItems(flag);
  const orderItemIds = orderItems.map((order) => order.order_item_id);
  LOGGER.info("Order Item IDs: ", orderItemIds);

  for (const orderItemId of orderItemIds) {
    const orderInfo = await api.createDSOrder(orderItemId);
  }
}
main();
