const PuppeteerBase = require("../lib/puppeeteer");
const colors = require("colors");
const API_MANAGER = require("../lib/api");
const apiInstance = new API_MANAGER();

class CarrierScraper extends PuppeteerBase {
  constructor() {
    super();
    this.codeList = [];
    this.carrier = "";
    this.CURRENT_STATUS = {
      PENDING: 4,
      SHIPPED: 1,
      EXCEPTION: 5,
      DELIVERED: 2,
    };
  }

  async fedExScraper() {
    this.carrier = "FedEx";
    const codeList = await apiInstance.getTrackingCodeList(this.carrier);
    //--- FedEx constants for marking orders ---//
    const FEDEX_DELIVERY_STATUS = {
      PENDING: "LABEL CREATED",
      SHIPPED: "IN TRANSIT",
      EXCEPTION: ["DELIVERY EXCEPTION", "SHIPMENT EXCEPTION", "CANCELLED"],
      DELIVERED: "DELIVERED",
    };

    const convertDate = (deliveryDateLabel) => {
      try {
        let dates = deliveryDateLabel.split(",");
        if (dates[2].includes("by end of day")) {
          dates[2] = dates[2].match(/[0-9]{4}/g)[0] + " " + "23:59:00";
        }
        let convertedDate = new Date(
          new Date(dates[1] + " " + dates[2].replace("at", ""))
        );
        convertedDate =
          convertedDate.getFullYear() +
          "-" +
          (convertedDate.getMonth() < 9
            ? "0" + (convertedDate.getMonth() + 1)
            : convertedDate.getMonth() + 1) +
          "-" +
          convertedDate.getDate() +
          " " +
          (convertedDate.getHours() < 10
            ? "0" + convertedDate.getHours()
            : convertedDate.getHours()) +
          ":" +
          (convertedDate.getMinutes() < 10
            ? "0" + convertedDate.getMinutes()
            : convertedDate.getMinutes()) +
          ":" +
          "00";
        return convertedDate;
      } catch (error) {
        console.log("Not a date type");
        return null;
      }
    };

    let index = 0;
    for (let code of codeList) {
      index++;
      console.log(
        "Starting ",
        index,
        "th code, tracking code ",
        code.tracking_code
      );
      await this.init();
      try {
        await this.openLink(
          `https://www.fedex.com/fedextrack/?trknbr=${code.tracking_code}`
        );
        await this.waitForLoadingElement(
          "trk-shared-shipment-status-delivery-date"
        );

        ///------ Get the current status and date ------///
        const statusText = await this.page.evaluate(() => {
          return document.querySelector("trk-shared-shipment-status-text")
            .innerText;
        });

        let currentStatus = "";
        if (statusText.includes(FEDEX_DELIVERY_STATUS.PENDING)) {
          currentStatus = this.CURRENT_STATUS.PENDING;
        } else if (statusText.includes(FEDEX_DELIVERY_STATUS.SHIPPED)) {
          currentStatus = this.CURRENT_STATUS.SHIPPED;
        } else if (statusText.includes(FEDEX_DELIVERY_STATUS.DELIVERED)) {
          currentStatus = this.CURRENT_STATUS.DELIVERED;
        } else if (
          statusText.includes(FEDEX_DELIVERY_STATUS.EXCEPTION[0]) ||
          statusText.includes(FEDEX_DELIVERY_STATUS.EXCEPTION[1]) ||
          statusText.includes(FEDEX_DELIVERY_STATUS.EXCEPTION[2])
        ) {
          currentStatus = this.CURRENT_STATUS.EXCEPTION;
        }

        let postData = [
          {
            tracking_code: code.tracking_code,
            current_status: currentStatus,
            confirmed_by: 4,
          },
        ];
        Object.entries(this.CURRENT_STATUS).map((value) => {
          if (value[1] === currentStatus) {
            return console.log("Current status: " + value[0]);
          }
        });
        if (
          currentStatus === this.CURRENT_STATUS.DELIVERED ||
          currentStatus === this.CURRENT_STATUS.SHIPPED
        ) {
          let deliveryDateLabel = await this.page.evaluate(() => {
            return document.querySelector('[data-test-id="delivery-date-text"]')
              .innerText;
          });
          const deliveryDate = convertDate(deliveryDateLabel);
          if (deliveryDate && currentStatus === this.CURRENT_STATUS.DELIVERED) {
            postData[0].delivered_at = deliveryDate;
          }
          if (deliveryDate && currentStatus === this.CURRENT_STATUS.SHIPPED) {
            postData[0].estimate_delivery_date = deliveryDate;
          }
        }
        if (currentStatus) {
          await apiInstance.updateDeliveryState(postData);
        } else {
          console.log("Another exceptional case: " + statusText);
        }
      } catch (error) {
        console.log(
          `Error while scraping and updating the ${code.tracking_code}`
        );
      }
      await this.closeBrowser();
    }
  }

  async lasershipScraper() {
    this.carrier = "Lasership";
    let codeList = await apiInstance.getTrackingCodeList(this.carrier);

    const LASERSHIP_DELIVERY_STATUS = {
      PENDING: "LABEL CREATED",
      SHIPPED: ["IN TRANSIT", "OUT FOR DELIVERY"],
      EXCEPTION: "EXCEPTION",
      DELIVERED: "DELIVERED",
    };

    let index = 0;

    for (let code of codeList) {
      index++;
      console.log(
        "Starting ",
        index,
        "th code, tracking code ",
        code.tracking_code
      );
      try {
        await this.init();
        await this.openLink(
          `https://t.lasership.com/Track/${code.tracking_code}/json`
        );
        let statusData = await this.page.evaluate(() => {
          return document.body.innerText;
        });
        statusData = JSON.parse(statusData);
        let currentStatus = "";
        let deliverDate = "";
        if (statusData["ReceivedOn"] !== "") {
          currentStatus = this.CURRENT_STATUS.DELIVERED;
          deliverDate = statusData["ReceivedOn"].replace("T", " ");
        }
        let postData = [
          {
            tracking_code: code.tracking_code,
            current_status: currentStatus,
            confirmed_by: 4,
            delivered_at: deliverDate,
          },
        ];

        if (currentStatus) {
          console.log("Status: Delivered");
          await apiInstance.updateDeliveryState(postData);
        } else {
          console.log("Another exceptional case, unknown status.");
        }
      } catch (error) {
        console.log(
          `Error while scraping and updating the ${code.tracking_code}`,
          error
        );
      }

      await this.closeBrowser();
    }
  }

  async uspsScraper() {
    this.carrier = "USPS";
    const codeList = await apiInstance.getTrackingCodeList(this.carrier);
    const USPS_DELIVERY_STATUS = {
      PENDING: "Pending",
      SHIPPED: "In-Transit",
      EXCEPTION: "Exception",
      DELIVERED: "Delivered",
    };

    const convertDate = (deliveryDateLabel) => {
      try {
        deliveryDateLabel = deliveryDateLabel.replace("at", " ");
        let convertedDate = new Date(deliveryDateLabel);
        convertedDate =
          convertedDate.getFullYear() +
          "-" +
          (convertedDate.getMonth() < 9
            ? "0" + (convertedDate.getMonth() + 1)
            : convertedDate.getMonth() + 1) +
          "-" +
          (convertedDate.getDate() < 10
            ? "0" + convertedDate.getDate()
            : convertedDate.getDate()) +
          " " +
          (convertedDate.getHours() < 10
            ? "0" + convertedDate.getHours()
            : convertedDate.getHours()) +
          ":" +
          (convertedDate.getMinutes() < 10
            ? "0" + convertedDate.getMinutes()
            : convertedDate.getMinutes()) +
          ":" +
          "00";
        return convertedDate;
      } catch (error) {
        console.log("Not a date type");
        return null;
      }
    };

    let index = 0;

    for (let code of codeList) {
      await this.init();

      index++;
      console.log(
        "Starting ",
        index,
        "th code, tracking code ",
        code.tracking_code
      );

      try {
        await this.openLink(
          `https://tools.usps.com/go/TrackConfirmAction?tLabels=${code.tracking_code}`
        );
        await this.waitForLoadingElement('[class="delivery_status"]', 30000);

        const status = await this.page.evaluate(() => {
          return document.querySelector('[class="text_explanation"]').innerText;
        });

        console.log(status);
        let currentStatus = "";
        if (status === USPS_DELIVERY_STATUS.PENDING) {
          currentStatus = this.CURRENT_STATUS.PENDING;
        } else if (status === USPS_DELIVERY_STATUS.SHIPPED) {
          currentStatus = this.CURRENT_STATUS.SHIPPED;
        } else if (status === USPS_DELIVERY_STATUS.EXCEPTION) {
          currentStatus = this.CURRENT_STATUS.EXCEPTION;
        } else if (status === USPS_DELIVERY_STATUS.DELIVERED) {
          currentStatus = this.CURRENT_STATUS.DELIVERED;
        }

        let postData = [
          {
            tracking_code: code.tracking_code,
            current_status: currentStatus,
            confirmed_by: 4,
          },
        ];

        if (currentStatus === this.CURRENT_STATUS.DELIVERED) {
          const scrapedDate = await this.page.evaluate(() => {
            return document.querySelector(".status_feed").children[0].innerText;
          });
          console.log("scrape date: ", scrapedDate);
          const deliveryDate = convertDate(scrapedDate);
          if (deliveryDate) {
            postData[0].delivered_at = deliveryDate;
          }
        }
        if (currentStatus === this.CURRENT_STATUS.SHIPPED) {
          try {
            const scrapedDate = await this.page.evaluate(() => {
              return (
                document.querySelector(".month_year").innerText.split("\n")[0] +
                " " +
                document.querySelector(".date").innerText +
                " " +
                document.querySelector(".month_year").innerText.split("\n")[1] +
                " " +
                document
                  .querySelector(".time")
                  .innerText.replace("am", " am")
                  .replace("pm", " pm")
              );
            });
            const deliveryDate = convertDate(scrapedDate);
            if (deliveryDate) {
              postData[0].estimate_delivery_date = deliveryDate;
            }
          } catch (error) {
            console.log("Estimate delivery date not exists.");
          }
        }

        Object.entries(this.CURRENT_STATUS).map((value) => {
          if (value[1] === currentStatus) {
            return console.log("Current status: " + status + ": " + value[0]);
          }
        });

        if (currentStatus) {
          await apiInstance.updateDeliveryState(postData);
        } else {
          console.log("Another exceptional case: ");
        }
      } catch (error) {
        console.log(
          `Error while scraping and updating the ${code.tracking_code}`,
          error
        );
      }

      await this.closeBrowser();
    }
  }

  async upsScraper() {
    this.carrier = "UPS";
    let codeList = await apiInstance.getTrackingCodeList(this.carrier);
    let index = 0;

    const UPS_DELIVERY_STATUS = {
      PENDING: "Label Created",
      SHIPPED: ["Shipped", "On the Way", "Out for Delivery"],
      EXCEPTION: "Return Delivered",
      DELIVERED: "Delivered",
    };

    const convertDate = (deliveryDateLabel) => {
      try {
        deliveryDateLabel = deliveryDateLabel
          .replace("at", " ")
          .replace("A.M.", "am")
          .replace("P.M.", "pm");
        let convertedDate = new Date(deliveryDateLabel);
        convertedDate =
          convertedDate.getFullYear() +
          "-" +
          (convertedDate.getMonth() < 9
            ? "0" + (convertedDate.getMonth() + 1)
            : convertedDate.getMonth() + 1) +
          "-" +
          (convertedDate.getDate() < 10
            ? "0" + convertedDate.getDate()
            : convertedDate.getDate()) +
          " " +
          (convertedDate.getHours() < 10
            ? "0" + convertedDate.getHours()
            : convertedDate.getHours()) +
          ":" +
          (convertedDate.getMinutes() < 10
            ? "0" + convertedDate.getMinutes()
            : convertedDate.getMinutes()) +
          ":" +
          "00";
        return convertedDate;
      } catch (error) {
        console.log("Not a date type");
        return null;
      }
    };

    for (let code of codeList) {
      await this.init();
      index++;
      console.log(
        "Starting ",
        index,
        "th code, tracking code ",
        code.tracking_code
      );

      try {
        await this.openLink(
          `https://www.ups.com/track?tracknum=${code.tracking_code}`
        );
        await this.waitForLoadingElement("#stApp_txtPackageStatus", 30000);

        const nDeliveryStatus = await this.page.evaluate(() => {
          return document.querySelectorAll(
            '[id*="stApp_ShpmtProg_LVP_milestone_name_"]'
          ).length;
        });
        const possibleStatusValues = await this.page.evaluate(
          (nDeliveryStatus) => {
            let values = [];
            for (let i = 0; i < nDeliveryStatus; i++) {
              values.push(
                document
                  .querySelectorAll(
                    '[id*="stApp_ShpmtProg_LVP_milestone_name_"]'
                  )
                  [i].innerText.trim()
              );
            }
            return values;
          },
          nDeliveryStatus
        );

        const deliveryStatus = await this.page.evaluate(
          (possibleStatusValues) => {
            let value = "";
            for (let i = 0; i < possibleStatusValues.length; i++) {
              if (
                document
                  .querySelectorAll(
                    '[id*="stApp_ShpmtProg_LVP_milestone_name_"]'
                  )
                  [i].parentElement.querySelector('[id*="_date_"]').innerText
              ) {
                value = possibleStatusValues[i];
                break;
              }
            }
            return value.trim();
          },
          possibleStatusValues
        );

        ///-----  Get the current status ------////
        let currentStatus = "";
        if (deliveryStatus === UPS_DELIVERY_STATUS.PENDING) {
          currentStatus = this.CURRENT_STATUS.PENDING;
        } else if (
          deliveryStatus === UPS_DELIVERY_STATUS.SHIPPED[0] ||
          deliveryStatus === UPS_DELIVERY_STATUS.SHIPPED[1] ||
          deliveryStatus === UPS_DELIVERY_STATUS.SHIPPED[2]
        ) {
          currentStatus = this.CURRENT_STATUS.SHIPPED;
        } else if (deliveryStatus === UPS_DELIVERY_STATUS.DELIVERED) {
          currentStatus = this.CURRENT_STATUS.DELIVERED;
        } else if (deliveryStatus === UPS_DELIVERY_STATUS.EXCEPTION) {
          currentStatus = this.CURRENT_STATUS.EXCEPTION;
        }
        let postData = [
          {
            tracking_code: code.tracking_code,
            current_status: currentStatus,
            confirmed_by: 4,
          },
        ];

        ///---- Get the date and time of shipped and delivered status ----///
        const statusOrder = possibleStatusValues.indexOf(deliveryStatus);
        if (
          currentStatus === this.CURRENT_STATUS.DELIVERED ||
          currentStatus === this.CURRENT_STATUS.SHIPPED
        ) {
          let deliveryDateLabel = await this.page.evaluate((statusOrder) => {
            return document.querySelectorAll(
              '[id*="stApp_ShpmtProg_LVP_milestone_name_"]'
            )[statusOrder].parentElement.children[2].innerText;
          }, statusOrder);

          const deliveryDate = convertDate(deliveryDateLabel);
          if (deliveryDate && currentStatus === this.CURRENT_STATUS.DELIVERED) {
            postData[0].delivered_at = deliveryDate;
          }
          if (deliveryDate && currentStatus === this.CURRENT_STATUS.SHIPPED) {
            postData[0].estimate_delivery_date = deliveryDate;
          }
        }
        Object.entries(this.CURRENT_STATUS).map((value) => {
          if (value[1] === currentStatus) {
            return console.log(
              "Current status: " + deliveryStatus + ": " + value[0]
            );
          }
        });
        if (currentStatus) {
          await apiInstance.updateDeliveryState(postData);
        } else {
          console.log("Another exceptional case: " + deliveryStatus);
        }
      } catch (error) {
        console.log(
          `Error while scraping and updating the ${code.tracking_code}`
        );
      }
      await this.closeBrowser();
    }
  }

  async ontracScraper() {
    this.carrier = "OnTrac";
    let codeList = await apiInstance.getTrackingCodeList(this.carrier);

    const ONTRAC_STATUS = {
      PENDING: "Pending",
      SHIPPED: ["In Transit", "Out for Delivery"],
      EXCEPTION: ["Contact Sender", "Returned"],
      DELIVERED: "Delivered",
    };

    const convertDate = (deliveryDateLabel) => {
      try {
        if (deliveryDateLabel.indexOf("By End of Day") > -1) {
          deliveryDateLabel = deliveryDateLabel.replace(
            "By End of Day",
            "23:59:00"
          );
        }
        deliveryDateLabel = deliveryDateLabel
          .replace("PM", " PM")
          .replace("AM", " AM")
          .replace("at", " ");
        let convertedDate = new Date(deliveryDateLabel);
        convertedDate =
          convertedDate.getFullYear() +
          "-" +
          (convertedDate.getMonth() < 9
            ? "0" + (convertedDate.getMonth() + 1)
            : convertedDate.getMonth() + 1) +
          "-" +
          convertedDate.getDate() +
          " " +
          (convertedDate.getHours() < 10
            ? "0" + convertedDate.getHours()
            : convertedDate.getHours()) +
          ":" +
          (convertedDate.getMinutes() < 10
            ? "0" + convertedDate.getMinutes()
            : convertedDate.getMinutes()) +
          ":" +
          "00";
        return convertedDate;
      } catch (error) {
        console.log("Not a date type");
        return null;
      }
    };

    let index = 0;
    for (let code of codeList) {
      await this.init();
      index++;
      console.log(
        "Starting ",
        index,
        "th code, tracking code ",
        code.tracking_code
      );
      try {
        await this.openLink(
          `https://www.ontrac.com/trackingresults.asp?tracking_number=${code.tracking_code}`,
          { timeout: 45000 }
        );
        await this.waitForLoadingElement('[class="trackStatus"]', 30000);
        const status = await this.page.evaluate(() => {
          return document.querySelector('[class="trackStatusText"]').innerText;
        });
        console.log("Scraped status: ", status);
        ///---- Get the current status value -----///
        let currentStatus = "";
        if (status === ONTRAC_STATUS.PENDING) {
          currentStatus = this.CURRENT_STATUS.PENDING;
        } else if (ONTRAC_STATUS.SHIPPED.includes(status)) {
          currentStatus = this.CURRENT_STATUS.SHIPPED;
        } else if (ONTRAC_STATUS.EXCEPTION.includes(status)) {
          currentStatus = this.CURRENT_STATUS.EXCEPTION;
        } else if (status === ONTRAC_STATUS.DELIVERED) {
          currentStatus = this.CURRENT_STATUS.DELIVERED;
        }

        let postData = [
          {
            tracking_code: code.tracking_code,
            current_status: currentStatus,
            confirmed_by: 4,
          },
        ];
        ///---- Get the exact delivery date and estimate_delivery_date ----////
        if (currentStatus === this.CURRENT_STATUS.SHIPPED) {
          const scrapedDate = await page.evaluate(() => {
            return document
              .querySelector('[class="trackDestination"]')
              .querySelectorAll("li")[3].innerText;
          });
          const deliveryDate = convertDate(scrapedDate);
          postData[0].estimate_delivery_date = deliveryDate;
        }
        if (currentStatus === this.CURRENT_STATUS.DELIVERED) {
          const scrapedDate = await page.evaluate(() => {
            return document
              .querySelector('[class="trackDestination"]')
              .querySelectorAll("li")[3].innerText;
          });
          const deliveryDate = convertDate(scrapedDate);
          postData[0].delivered_at = deliveryDate;
        }

        if (currentStatus) {
          await apiInstance.updateDeliveryState(postData);
        } else {
          console.log("Another exceptional case: " + statusText);
        }
      } catch (error) {
        console.log(
          `Error while scraping and updating the ${code.tracking_code}`,
          error
        );
      }
      await this.closeBrowser();
    }
  }
}

module.exports = CarrierScraper;
