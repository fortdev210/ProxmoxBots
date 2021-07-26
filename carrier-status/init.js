/////////////
// WELCOME //
/////////////
const colors = require("colors");
console.log(" Carrier bot for shipped orders                ".inverse.bold);
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
console.log(" node scraper.js                               ".inverse);
console.log("");

const CarrierScraper = require("./carriers");

async function main() {
  const scraperInstance = new CarrierScraper();
  const carriers = ["FedEx", "USPS", "UPS", "Lasership", "OnTrac"];
  for (let i = 0; i < 5; i++) {
    const selectedCarrier = carriers[i];
    console.log(selectedCarrier);

    switch (selectedCarrier) {
      case "FedEx":
        await scraperInstance.fedExScraper();
        break;
      case "USPS":
        await scraperInstance.uspsScraper();
        break;
      case "UPS":
        await scraperInstance.upsScraper();
        break;
      case "Lasership":
        await scraperInstance.lasershipScraper();
        break;
      case "OnTrac":
        await scraperInstance.ontracScraper();
        break;
    }
    console.log("Completed".bgGreen, selectedCarrier);
  }
}

main();
