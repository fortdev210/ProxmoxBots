const WalmartBase = require("../walmart-buy/walmart_buy");
const colors = require("colors");
const API_MANAGER = require("../lib/api");
const apiInstance = new API_MANAGER();

class WalmartOrderStatusScraper extends WalmartBase {
  constructor(startIndex, endIndex, useLuminati) {
    super();
    this.startIndex = startIndex;
    this.endIndex = endIndex;
    this.apiInstance = apiInstance;
    this.supplier = "W";
    this.dsOrders = [];
    this.proxyList = [];
    this.dsOrder = null;
    this.proxy = null;
    this.signInLink = 'https://www.walmart.com/account/login';
    this.useLuminati = useLuminati
  }

  async shuffleDSOrders() {
    let dsOrders = await this.apiInstance.getDsOrders(this.supplier);
    console.log(`Get ${dsOrders.length} orders. Getting the status...`)
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

  async clearSiteSettings() {
    const client = await this.page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    console.log('Clear cookies and caches.'.green)
  }

  async goSignInPage() {
    await this.init(this.proxy);
    if (this.useLuminati) await this.luminatiProxyManager("ON");
    await this.sleep(3000);
    await this.openLink(this.signInLink);
    try {
      await this.waitForLoadingElement("#email");
    } catch (error) {
      console.log("Error while loading the page, reloading...");
      await this.page.reload();
      await this.sleep(10000);
    }
  }

  async getPurchaseHistory() {
    const link = "https://www.walmart.com/account/wmpurchasehistory";
    await this.openLink(link);
    await this.sleep(3000);
    try {
      let bodyHTML = await this.page.evaluate(() => document.body.innerHTML);
      var pattern = /window.__WML_REDUX_INITIAL_STATE__ = (.*?);<\/script>/i;
      let ordersJson = bodyHTML.match(pattern)[1];
      return ordersJson
    } catch (error) {
      console.log('Getting order data error.');
      return "Captcha"
    }
    
  }

  async processDSOrder() {
    await this.goSignInPage();
    await this.signInWalmart(this.email); 
    const captchaDetected = await this.checkCaptcha(5000);
    if (captchaDetected) {
      // await this.closeBrowser();
      return "Captcha";
    }
    if(this.useLuminati) await this.luminatiProxyManager('OFF')
    const orderData = await this.getPurchaseHistory();
    if (orderData === 'Captcha') {
      return orderData
    } else {
      await apiInstance.updateDsOrder(this.dsOrder, orderData, this.supplier);
    }
  }

  async getAllOrderStatus() {
    await this.shuffleDSOrders();
    await this.getProxies();
    let numOfProcessed = 0;
    
    while (true) {
      console.log(`Starting ${numOfProcessed+1}th order...`)
      this.dsOrder = this.dsOrders[numOfProcessed];
      if (!this.useLuminati) {
        console.log('Using buyproxies now.'.green)
        await this.getRandProxy()
      } else {
        console.log('Using Luminati Proxies Now.'.green)
      }
      console.log('Current Order: ', this.dsOrder)
      this.email =  this.dsOrder.username ? this.dsOrder.username : this.dsOrder.email
      await this.processDSOrder();
      await this.closeBrowser();
      console.log('')
      numOfProcessed ++;
      await this.sleep(3000);
      if (numOfProcessed === this.dsOrders.length) break;
    }
  }
}

module.exports = WalmartOrderStatusScraper
