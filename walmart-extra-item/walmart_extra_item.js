const WalmartBase = require("../walmart-order-status/wm_order_status");
const colors = require("colors");
const API_MANAGER = require("../lib/api");
const apiInstance = new API_MANAGER();

class WalmartExtraItemCancel extends WalmartBase {
  constructor(useLuminati) {
    super();
    this.username = "buybot";
    this.password = "forte1long";
    this.signInLink = "https://www.walmart.com/account/login?ref=domain";
  }

  async getDsOrdersToCancel() {
    let orders = await this.apiInstance.getDsOrdersExtraItemToCancel();
    console.log(`Get ${orders.length} orders. Getting the status...`);
    this.dsOrders = orders;
  }

  async openHistoryPage() {
    const link = "https://www.walmart.com/account/wmpurchasehistory";
    await this.openLink(link);
  }

  async processOneOrder() {
    await this.goSignInPage();
    await this.signInWalmart(this.email);
    const captchaDetected = await this.checkCaptcha(5000);
    if (captchaDetected) {
      // await this.closeBrowser();
      await this.clearSiteSettings();
      return "Captcha";
    }
    await this.openHistoryPage();
    const extraItemNumber = this.dsOrder.extra_items[0].item_number;
    const extraItemStatus = await this.cancelExtraItemOnBadOrder(
      extraItemNumber
    );
    if (extraItemStatus.toLowerCase() === "canceled") {
      await this.changeDsStatus(this.dsOrder);
    }
  }

  async changeDsStatus(orderId, allCanceled) {
    const dsChangeLink = `http://admin.stlpro.com/admin/products/dropshippingorder/${orderId}/change/`;
    let date = new Date();
    date = date.toISOString();
    const scrappedDate = date.split("T")[0];
    const scrappedTime = date.split("T")[1].split(".")[0];
    await this.openNewPage();
    await this.openLink(dsChangeLink);
    await this.waitForLoadingElement('[value="Log in"]');
    await this.insertValue('[name="username"]', this.username);
    await this.insertValue('[name="password"]', this.password);
    await this.clickButton('[value="Log in"]');

    await this.waitForLoadingElement('[id="id_extra_items_canceled_at_0"]', 30000);
    ///---- Input the canceled date YYYY-MM-DD ----///
    let isEmpty = await this.page.evaluate(() => {
      const orgDate = document.querySelector(
        '[id="id_extra_items_canceled_at_0"]'
      ).value;
      if (orgDate === "") return true;
      return false;
    });
    if (isEmpty) {
      await this.insertValue(
        '[id="id_extra_items_canceled_at_0"]',
        scrappedDate
      );
      await this.sleep(300);
      await this.insertValue(
        '[id="id_extra_items_canceled_at_1"]',
        scrappedTime
      );
    }
    console.log("Successfully updated db.");
    await this.sleep(1000);

    ///----If all the items are canceled, set ds order as Cancellation review -----///
    if (allCanceled) {
      await this.waitForLoadingElement('[id="id_ds_status"]');
      await this.page.evaluate(() => {
        return (document.querySelector(
          '[id="id_ds_status"]'
        ).selectedIndex = 13);
      });
    }
    await this.sleep(700);
    await this.clickButton('[value="Save"]');
    await this.closeBrowser();
  }

  async processAllOrders() {
    await this.getDsOrdersToCancel();
    await this.getProxies();

    for (let i = 0; i < this.dsOrders.length; i ++) {
        this.dsOrder = this.dsOrders[i];
        console.log(`Starting ${i+1}th order...`);
        if (!this.useLuminati) {
            console.log('Using buyproxies now.'.green)
            await this.getRandProxy()
        } else {
            console.log('Using Luminati Proxies Now.'.green)
        }
        try {
            this.email = this.dsOrder.account_supplier.username;
        } catch (error) {
            this.email = this.dsOrder.email;
        }
        await this.processOneOrder();
    }  
  }
}

module.exports = WalmartExtraItemCancel;