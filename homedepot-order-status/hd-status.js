const colors = require("colors");
const PuppeteerBase = require("../lib/puppeeteer");
const API_MANAGER = require("../lib/api");
const apiInstance = new API_MANAGER();

class HDOrderStatusManager extends PuppeteerBase {
  constructor() {
    super();
    this.dsOrder = null;
    this.dsOrders = null;
    this.proxy = null;
    this.supplier = "P";
    this.responseURL =
      "https://www.homedepot.com/customer/order/v1/guest/orderdetailsgroup";
    this.trackLink = `https://www.homedepot.com/order/view/tracking`;
    this.apiInstance = apiInstance;
  }

  async shuffleDSOrders() {
    let dsOrders = await this.apiInstance.getDsOrders(this.supplier);
    console.log(`Get ${dsOrders.length} orders. Getting the status...`);
    dsOrders = dsOrders.slice(this.startIndex, this.endIndex);
    this.dsOrders = dsOrders;
  }

  async getProxies() {
    let proxies = await this.apiInstance.getProxyInfo();
    const filteredProxies = proxies.filter(
      (proxy) => proxy.batch_id === "8889"
    );
    this.proxyList = filteredProxies;
  }

  async getRandProxy() {
    const proxy =
      this.proxyList[Math.floor(Math.random() * this.proxyList.length)];
    this.proxy = proxy;
  }

  async getHDStatus() {
    const email = this.dsOrder.username || this.dsOrder.user_email;
    const orderNumber = this.dsOrder.supplier_order_numbers_str;
    await this.init(this.proxy);
    try {
      await this.openLink(this.trackLink);
    } catch (error) {
      console.log(
        "Proxy authentication error or connection error. Retrying ..."
      );
      await this.sleep(3000);
      await this.closeBrowser();
      return "Captcha Detected";
    }

    //------ Insert order number and email ------///
    try {
      await this.waitForLoadingElement("#order");
      await this.insertValue("#order", orderNumber);
      await this.waitForLoadingElement("#email");
      await this.insertValue("#email", email);
      await this.waitForLoadingElement(
        '[data-automation-id="orderTrackingButton"]'
      );
      await this.clickButton('[data-automation-id="orderTrackingButton"]');
    } catch (error) {
      await this.closeBrowser();
      return "Captcha Detected";
    }

    //------ Get detailed info from the api ------//
    let orderData = null;
    const getResponsePromise = (page) => {
      return new Promise((resolve, reject) => {
        page.on("response", async (response) => {
          if (response.url() === responseURL) {
            try {
              const orderData = await response.json();
              resolve(orderData);
            } catch (error) {
              resolve("Captcha Detected");
            }
          }
        });
      });
    };

    orderData = await getResponsePromise(this.page);

    try {
      if (typeof orderData !== "string") {
        const data = JSON.stringify(orderData);
        await this.closeBrowser();
        return data;
      }
      await this.closeBrowser();
      return orderData;
    } catch (error) {
      console.log("Access Denied, trying another proxy...");
      await this.closeBrowser();
    }
  }

  async scrapeTotalHDState() {
    await this.shuffleDSOrders();
    await this.getProxies();
    let numOfProcessed = 0;
    while (true) {
      console.log(`Starting ${numOfProcessed + 1}th order...`);
      this.dsOrder = this.dsOrders[numOfProcessed];
      console.log("Current Order: ", this.dsOrder);
      this.getRandProxy();
      let orderData = await this.getHDStatus();
      if (orderData !== "Captcha Detected") {
        await this.apiInstance.updateDsOrder(
          this.dsOrder,
          orderData,
          this.supplier
        );
      }
      await this.sleep(1000);
      if (numOfProcessed === this.dsOrders.length) break;
    }
  }
}

module.exports = HDOrderStatusManager;
