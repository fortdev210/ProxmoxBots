const LOGGER = require("../lib/logger");
const WalmartBase = require("../lib/walmart");
const API = require("../lib/api");
const api = new API();

class WalmartBuy extends WalmartBase {
  constructor(orderInfo) {
    super();
    this.orderInfo = orderInfo;
  }

  async openRigistryPage(link) {
    await this.openNewPage();
    await this.openLink(link);
    await this.sleep(3000);
  }

  async addItemsToCart() {
    await this.clickButton('[aria-label*="Add to cart"]');
    await this.sleep(2000);
    LOGGER.info("Add an item to cart.");
    try {
      await this.clickButton('[aria-label*="Add to cart"]');
      await this.sleep(2000);
      LOGGER.info("Add an item to cart.");
    } catch (error) {}
  }

  async continuetoCheckout() {
    await this.clickButton('[aria-label*="Cart contains"]');
    await this.sleep(2000);
    await this.clickButton('[id="Continue to checkout button"]');
  }

  async fillSignInCart() {
    await this.waitForLoadingElement("iframe");
    const formHanlde = await this.page.$('[id="auth-frame"]');
    const frame = await formHanlde.contentFrame();
    await frame.type('[id="email"]', this.orderInfo.email, { delay: 300 });
    await frame.click('[data-automation-id="signin-continue-submit-btn"]');
    await this.sleep(2000);
    await frame.type('[id="sign-in-password-no-otp"]', "Forte1long!", {
      delay: 300,
    });
    await frame.click('[data-automation-id="signin-continue-submit-btn"]');
    await this.sleep(2000);
    await this.loadJqueryIntoPage();
    await this.page.waitForXPath('//*[contains(text(), "Continue Checkout")]', {
      timeout: 10000,
    });
    await this.page.evaluate(() => {
      $("button:contains(Continue Checkout)").click();
    });
    await this.sleep(5000);
  }

  async payOrder() {
    // click add payment method button
    await this.clickButton('[aria-label="add a payment method"]');
    await this.sleep(1000);
    await this.waitForLoadingElement(
      '[data-testid="wallet-add-payment-card-tiles-container"]'
    );
    await this.loadJqueryIntoPage();
  }

  async addGiftCard(index) {
    await this.page.evaluate(() => {
      $("span:contains(Gift card)").click();
    });
    await this.sleep(1000);
    const giftCardInfo = await api.getGiftCardByAPI(this.orderInfo.id);
    await this.waitForLoadingElement('[id="gc-number"]');
    await this.insertValue('[id="gc-number"]', giftCardInfo.cardNumber);
    await this.sleep(1000);
    await this.waitForLoadingElement('[id="ld_select_2"]');
    await this.insertValue('[id="ld_select_2"]', giftCardInfo.pinCode);
    await this.sleep(1000);
    await this.clickButton('[type="submit"]');
    await this.sleep(2000);
    await this.waitForLoadingElement(`[data-slide="${index}"]`);
    const gcAmount = await this.page.evaluate(
      (i) => {
        const cardContent = document.querySelector(
          `[data-slide="${index}"]`
        ).innerText;
      },
      [index]
    );
    await this.waitForLoadingElement('[aria-label="Add a new payment method"]');
    await this.clickButton('[aria-label="Add a new payment method"]');
  }

  async buy() {
    await this.initPuppeteer();
    await this.sleep(3000);
    // await this.luminatiProxyManager("ON", [
    //   this.orderInfo.proxyIp,
    //   this.orderInfo.proxyPort,
    // ]);
    try {
      await this.openRigistryPage(
        "https://www.walmart.com/registry/ER/5c8487ba-e280-458b-b965-716f8330e0c7"
      );
      await this.addItemsToCart();
      await this.continuetoCheckout();
      await this.fillSignInCart();
    } catch (error) {
      console.error(error);
      await this.sleep(100000);
    }
  }
}

module.exports = WalmartBuy;
