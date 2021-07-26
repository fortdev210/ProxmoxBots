const colors = require("colors");
/////////////
// WELCOME //
/////////////
console.log(" Homedepot Order Status Scraper                ".inverse.bold);
console.log(" Property of STL Pro, Inc.                     ".inverse);
console.log(" Developed by Xiaoping Jin                     ".inverse);
console.log(" For tips, please run the bot by executing:    ".inverse);
console.log(" node init.js                                  ".inverse);
console.log("");

const HDOrderStatusManager = require("./hd-status");

async function main() {
  const hdInstance = new HDOrderStatusManager();
  await hdInstance.scrapeTotalHDState();
}

main();
