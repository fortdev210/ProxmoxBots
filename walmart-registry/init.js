const colors = require("colors");
const STLPRO_MANAGER = require("../lib/stlpro");
const WalmartRegistryHandler = require("./walmart_registry");
const Flag_Order = require("../lib/flag");
const { is } = require("useragent");

async function main() {
  const dbInstance = new STLPRO_MANAGER();
  const dsOrders = await dbInstance.getOrders();
  await dbInstance.closeBrowser();
  if (dsOrders.length) {
    console.log(`Get ${dsOrders.length} ds orders in total.`.green);
    console.log(dsOrders);
    for (let i = 0; i < dsOrders.length; i++) {
      console.log(`STARTING: Order ${i + 1}: ${dsOrders[i]}`.green.bold);
      const dbInstance = new STLPRO_MANAGER(dsOrders[i]);
      const currentOrderInfo = await dbInstance.getOrderDetails();
      const flagInstance = new Flag_Order(dsOrders[i]);
      console.log(currentOrderInfo);
      const registryHandler = new WalmartRegistryHandler(
        currentOrderInfo,
        flagInstance
      );
      registryHandler.browser = dbInstance.browser;
      let isProcessed = false;
      if (currentOrderInfo.extraItem !== "N/A") {
        console.log("Extra item found...");
        isProcessed = await registryHandler.extraItemProcess();
      } else {
        console.log("No extra item found, registering...");
        isProcessed = await registryHandler.noExtraItemProcess();
      }
      if (isProcessed === "Captcha" || !isProcessed) {
        console.log("Captcha detected. Try later...".red);
        break;
      }
    }
    console.log("Set up completed".inverse);
  } else {
    console.log(
      `No orders at the moment. Restart the bot after put some orders in this folder...`
        .inverse
    );
  }
}

main();
