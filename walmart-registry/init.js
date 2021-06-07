const colors = require("colors");
const STLPRO_MANAGER = require("../lib/stlpro");
const WalmartRegistryHandler = require("./walmart_registry");
const Flag_Order = require("../lib/flag");

async function main() {
  const dbInstance = new STLPRO_MANAGER();
  const dsOrders = await dbInstance.getOrders();
  await dbInstance.closeBrowser();
  if (dsOrders.length) {
    console.log(`Get ${dsOrders.length} ds orders in total.`.green);
    console.log(dsOrders);
    for (let i = 0; i < dsOrders.length; i++) {
      const dbInstance = new STLPRO_MANAGER(dsOrders[i]);
      const currentOrderInfo = await dbInstance.getOrderDetails();
      const flagInstance = new Flag_Order(dsOrders[i]);
      await flagInstance.setRequestInstance();
      console.log(currentOrderInfo);
      const registryHandler = new WalmartRegistryHandler(currentOrderInfo, flagInstance)
      registryHandler.browser = dbInstance.browser;
      if (currentOrderInfo.extraItem !== 'N/A') {
        console.log('Extra item found...')
        await registryHandler.extraItemProcess();
      } else {
        console.log('No extra item found, registering...');
        await registryHandler.noExtraItemProcess();
      }
    }
  } else {
    console.log(`No orders at the moment. Restart the bot after put some orders in this folder...`.inverse);
  }
}

main();
