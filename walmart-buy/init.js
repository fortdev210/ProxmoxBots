const colors = require("colors");
const STLPRO_MANAGER = require("../lib/stlpro");
const Flag_Order = require("../lib/flag");
const WalmartBuyHandler = require("./walmart_buy")
/////////////
// WELCOME //
/////////////
console.log(" Walmart Buybot                                ".inverse.bold);
console.log(" Property of STL Pro, Inc.                     ".inverse);
console.log(" Developed by Xiaoping Jin                     ".inverse);
console.log(" For tips, please run the bot by executing:    ".inverse);
console.log(" node init.js                                  ".inverse);
console.log("");

async function main() {
  const dbInstance = new STLPRO_MANAGER();
  await dbInstance.clearSiteSettings();
  const dsOrders = await dbInstance.getOrders();
  if (dsOrders.length) {
    const paymentMethod = await dbInstance.getPaymentMethods();
    console.log('Current payment option is ' +`${paymentMethod}`.green);
    await dbInstance.closeBrowser();
    console.log(`Get ${dsOrders.length} ds orders in total.`.green);
    console.log(dsOrders);
    for (let i = 0; i < dsOrders.length; i++) {
        console.log(`STARTING: Order ${i + 1}: ${dsOrders[i]}`.green.bold);
        const dbInstance = new STLPRO_MANAGER(dsOrders[i]);
        const currentOrderInfo = await dbInstance.getOrderDetails();
        console.log(currentOrderInfo);
        const flagInstance = new Flag_Order(dsOrders[i]);
        const wmBuyHandler = new WalmartBuyHandler(currentOrderInfo, flagInstance, paymentMethod);
        wmBuyHandler.browser = dbInstance.browser;
        await wmBuyHandler.processBuyOrder();
    }
  } else {
    console.log(
      `No orders at the moment. Restart the bot after put some orders in this folder...`
        .inverse
    );
  }
}

main();
