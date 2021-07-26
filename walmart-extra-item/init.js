const colors = require("colors");
/////////////
// WELCOME //
/////////////
console.log(" Walmart Extra Item Cancellation Bot           ".inverse.bold);
console.log(
  " Version ".inverse.underline +
    require("../package").version.inverse.underline +
    "                                 ".inverse.underline
);
console.log(" Property of STL Pro, Inc.                     ".inverse);
console.log(
  " Developed by Xiaoping Jin                     ".inverse.underline
);
console.log(" For tips, please run the bot by executing:    ".inverse);
console.log(" node wmCancelExtraItem.js                     ".inverse);
console.log("");

const ExtraItemCancelManager = require("./walmart_extra_item");

async function main() {
  const manager = new ExtraItemCancelManager();
  await manager.processAllOrders();
}

async function run() {
  await main();
  console.log("Automatically restarts".inverse.bold);
  setTimeout(function () {
    run();
  }, 300000);
}
run();
