const WalmartBase = require("../walmart-buy/walmart_buy");
const colors = require("colors");
const API_MANAGER = require("../lib/api");
const apiInstance = new API_MANAGER();

class WalmartOrderStatusScraper extends WalmartBase {
  constructor(startIndex, endIndex) {
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.apiInstance = apiInstance;
    this.supplier = "W";
    this.dsOrders = [];
    this.proxyList = [];
    this.dsOrder = null;
    this.proxy = null;
    this.signInLink = 'https://www.walmart.com/account/login';
  }

  async shuffleDSOrders() {
    let dsOrders = await this.apiInstance.getDsOrders(this.supplier);
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

  async goSignInPage() {
    await this.init(this.proxy);
    await this.openNewPage();
    await this.openLink(this.signInLink);
    try {
      await this.waitForLoadingElement("#email");
    } catch (error) {
      console.log("Error while loading the page, reloading...");
      await this.page.reload();
      await this.sleep(10000);
    }
  }

  async processDSOrder() {
    await this.goSignInPage();
    await this.signInWalmart(); 
    const captchaDetected = await this.checkCaptcha(5000);
    if (captchaDetected) {
      console.log("Captcha detected.");
      await this.closeBrowser();
      return "Captcha";
    }
  }
  
}
