const colors = require("colors");
const STLPRO_MANAGER = require("../lib/stlpro");
const ExtraItemHandler = require("../walmart-registry/extra_item");
const Flag_Order = require("../lib/flag");

async function main() {
  const dbInstance = new STLPRO_MANAGER();
  const dsOrders = await dbInstance.getOrders();
  await dbInstance.closeBrowser();
  if (dsOrders.length) {
    console.log(`Get ${dsOrders.length} ds orders in total.`.bgGreen);
    console.log(dsOrders);
    for (let i = 0; i < dsOrders.length; i++) {
      const dbInstance = new STLPRO_MANAGER(dsOrders[i]);
      const currentOrderInfo = await dbInstance.getOrderDetails();
      const flagInstance = new Flag_Order(dsOrders[i]);
      await flagInstance.setRequestInstance();
      console.log(currentOrderInfo);
      if (currentOrderInfo.extraItem !== 'N/A') {
        await flagInstance.putInProcessingFlag();
        console.log("Order moved to Walmart Processing")
        const extraItemHandler = new ExtraItemHandler(currentOrderInfo)
        extraItemHandler.browser = dbInstance.browser;
        await extraItemHandler.process();
        await flagInstance.putInBuyer1Flag();
        console.log("Order moved to Walmart Preprocessed")
      } else {

      }
    }
  } else {
    console.log(`No orders at the moment. Restarting in 10 minutes...`.bgGreen);
  }
}

main();
