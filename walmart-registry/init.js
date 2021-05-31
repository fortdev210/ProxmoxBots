const colors = require("colors");
const STLPRO_MANAGER = require('../lib/stlpro');
const ExtraItemHandler = require('../walmart-registry/extra_item')
const Flag_Order = require('../lib/flag')

async function main() {
    const dbInstance = new STLPRO_MANAGER();
    const flagInstance = new Flag_Order();
    const dsOrders = await dbInstance.getOrders();
    console.log(`Get ${dsOrders.length} ds orders in total.`.bgGreen);
    for (let i =0; i < dsOrders.length; i++) {
        const dbInstance = new STLPRO_MANAGER(dsOrders[i]);
        const currentOrderInfo = await dbInstance.getOrderDetails();
        console.log(currentOrderInfo)
    }
}

main();