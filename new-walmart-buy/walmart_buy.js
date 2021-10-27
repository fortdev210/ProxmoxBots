const LOGGER = require("../lib/logger");
const WalmartBase = require("../lib/walmart");
const API = require("../lib/api");
const api = new API();

class WalmartBuy extends WalmartBase {
  constructor(orderInfo) {
    super();
    this.orderInfo = orderInfo;
    this.password = "Forte1long!";
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
    await frame.type('[id="email"]', this.orderInfo.email, { delay: 100 });
    try {
      await frame.click('[data-automation-id="signin-continue-submit-btn"]');
      await this.sleep(2000);
      await frame.type('[id="sign-in-password-no-otp"]', this.password, {
        delay: 300,
      });
      await frame.click('[data-automation-id="signin-continue-submit-btn"]');
      await this.sleep(2000);
      await this.loadJqueryIntoPage();
      await this.page.waitForXPath(
        '//*[contains(text(), "Continue Checkout")]',
        {
          timeout: 10000,
        }
      );
      await this.page.evaluate(() => {
        $("button:contains(Continue Checkout)").click();
      });
    } catch (error) {
      LOGGER.info("Old signin page.");
      await frame.type("#password", this.password, { delay: 100 });
      await this.sleep(1000);
      await frame.click('[type="submit"]');
    }
    await this.sleep(5000);
  }

  async payOrder() {
    // click add payment method button
    await this.clickButton('[aria-label="add a payment method"]');
    await this.sleep(1000);
    await this.page.waitForXPath('//*[contains(text(), "Estimated total")]', {
      timeout: 20000,
    });
    await this.loadJqueryIntoPage();
    const total = await this.page.evaluate(() => {
      const content = $("span:contains(Estimated total)").text();
      const pattern = /\d+(\.\d+)?$/;
      return Number(content.match(pattern)[0]);
    });
    LOGGER.info("Total Order Price is " + total);
    await api.sendTotal(total, this.orderInfo.id);
    let index = 0;
    let remnants = total;
    while (true) {
      const appliedAmount = await this.addGiftCard(index);
      remnants = remnants - appliedAmount;
      if (remnants > 0) {
        index = index + 1;
      } else {
        break;
      }
    }
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
        const pattern = /Amount applied(.*)/g;
        const amount = cardContent
          .match(pattern)[0]
          .replace("Amount applied:", "")
          .trim()
          .replace("$", "");
        return Number(amount);
      },
      [index]
    );
    LOGGER.info("Applied gift card info: ", giftCardInfo.cardNumber, gcAmount);
    await api.sendCurrentGiftCard(
      giftCardInfo.cardNumber,
      gcAmount,
      this.orderInfo.id
    );
    await this.waitForLoadingElement('[aria-label="Add a new payment method"]');
    await this.clickButton('[aria-label="Add a new payment method"]');
    return gcAmount;
  }

  async buy() {
    await this.initPuppeteer();
    await this.sleep(3000);
    await this.luminatiProxyManager("ON", [
      this.orderInfo.proxyIp,
      this.orderInfo.proxyPort,
    ]);
    try {
      await this.openRigistryPage(this.orderInfo.sharedRegistryLink);
      await this.addItemsToCart();
      await this.continuetoCheckout();
      await this.fillSignInCart();
      await this.payOrder();
    } catch (error) {
      console.error(error);
      await this.sleep(100000);
    }
  }
}

module.exports = WalmartBuy;
