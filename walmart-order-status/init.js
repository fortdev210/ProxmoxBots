const colors = require('colors')
/////////////
// WELCOME //
/////////////
console.log(" Walmart Order Status Scraper                  ".inverse.bold);
console.log(" Property of STL Pro, Inc.                     ".inverse);
console.log(" Developed by Xiaoping Jin                     ".inverse);
console.log(" For tips, please run the bot by executing:    ".inverse);
console.log(" node init.js                                  ".inverse);
console.log("");

const WalmartOrderStatusScraper = require('./wm_order_status')

async function main() {
    let startIndex = 0, endIndex = 100, useLuminati = 0;
    const args = process.argv.slice(2);
    startIndex = args[0]
    endIndex = args[1];
    try {
        useLuminati = args[2];
    } catch (error) {
        useLuminati = 0;
    }
    const scraper = new WalmartOrderStatusScraper(startIndex, endIndex,useLuminati);
    await scraper.getAllOrderStatus();
}


async function run() {
  await main();
  console.log("Automatically restarts".inverse.bold);
  setTimeout(function () {
    run();
  }, 300000);
}
run();