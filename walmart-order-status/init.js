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
    let startIndex, endIndex;
    startIndex = process.argv[process.argv.length-2];
    endIndex = process.argv[process.argv.length-1];
    const scraper = new WalmartOrderStatusScraper(startIndex, endIndex);
    await scraper.getAllOrderStatus();
}

main();