const LOGGER = require("../lib/logger");
const WalmartBase = require("../lib/walmart");
const API = require("../lib/api");
const api = new API();
const { WALMART } = require("../constants/urls");

class WalmartBuy extends WalmartBase {
  constructor(orderInfo, orderItemId) {
    super();
    this.orderInfo = orderInfo;
    this.password = "Forte1long!";
    this.orderItemId = orderItemId;
  }

  async openRigistryPage(link) {
    await this.openNewPage();
    await this.openLink(link);
    await this.sleep(3000);
  }

  async addItemsToCart() {
    if (this.orderInfo.extraItem) {
      const isFirstPrimary = await this.page.evaluate(
        (primaryItemNumber) => {
          const firstItemHref = document
            .querySelectorAll("[data-item-id]")[0]
            .querySelector("a").href;
          if (firstItemHref.indexOf(primaryItemNumber) > -1) {
            return true;
          }
          return false;
        },
        [this.orderInfo.primaryItem]
      );
      if (isFirstPrimary) {
        await this.clickButton('[aria-label*="Add to cart"]');
        await this.sleep(2000);
        if (this.orderInfo.primaryItemQty > 1) {
          for (let i = 1; i < this.orderInfo.primaryItemQty; i++) {
            await this.clickButton('[aria-label*="Increase quantity]');
            await this.sleep(100);
          }
        }
      } else {
        const addToCartBtns = await this.page.$$('[aria-label*="Add to cart"]');
        const primaryBtn = addToCartBtns[1];
        await primaryBtn.click();
        await this.sleep(1000);
        if (this.orderInfo.primaryItemQty > 1) {
          for (let i = 1; i < this.orderInfo.primaryItemQty; i++) {
            await this.clickButton('[aria-label*="Increase quantity]');
            await this.sleep(100);
          }
        }
      }
      // Add extra item
      await this.clickButton('[aria-label*="Add to cart"]');
      await this.sleep(2000);
    } else {
      await this.clickButton('[aria-label*="Add to cart"]');
      await this.sleep(2000);
      if (this.orderInfo.primaryItemQty > 1) {
        for (let i = 1; i < this.orderInfo.primaryItemQty; i++) {
          await this.clickButton('[aria-label*="Increase quantity]');
          await this.sleep(100);
        }
      }
    }
    LOGGER.info("Add an item to cart.");
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
    await this.sleep(1000);
    await frame.type('[id="email"]', this.orderInfo.email, { delay: 100 });

    try {
      await frame.click('[data-automation-id="signin-continue-submit-btn"]');
      await this.sleep(2000);
      await frame.type('[id="sign-in-password-no-otp"]', this.password, {
        delay: 300,
      });
      await this.pressEnter();
    } catch (error) {
      await frame.type("#password", this.password, { delay: 100 });
      await this.sleep(1000);
      await frame.click('[type="submit"]');
    }
    await this.sleep(5000);
    LOGGER.info("Sign In Success");
  }

  async payOrder() {
    // click add payment method button
    await this.loadJqueryIntoPage();
    await this.page.evaluate(() => {
      $("button:contains(Add a payment method)").click();
    });
    await this.sleep(1000);
    await this.page.waitForXPath('//*[contains(text(), "Estimated total")]', {
      timeout: 20000,
    });
    await this.loadJqueryIntoPage();

    const total = await this.page.evaluate(() => {
      const value = document.querySelector('[for="grandTotal-label"]')
        .nextElementSibling.innerText;
      return Number(value.replace("$", ""));
    });
    LOGGER.info("Total Order Price is " + total);
    await api.sendTotal(total, this.orderInfo.id);
    let index = 0;
    let remnants = total;
    while (true) {
      const appliedAmount = await this.addGiftCard(index);
      LOGGER.info("Applied value: " + appliedAmount);
      remnants = remnants - appliedAmount;

      if (remnants > 0.01) {
        index = index + 1;
      } else {
        break;
      }
    }
    LOGGER.info("The total price is covered. Placing order...");
    await this.sleep(1000);
    const url = await this.page.url();
    let cartId = "";
    // https://www.walmart.com/checkout/review-order?cartId=cae7b036-8834-45eb-a115-050cbc208d47&wv=add_gift_card
    if (url.indexOf("&wv=") > -1) {
      const pattern = /cartId=(.*)&/;
      cartId = url.match(pattern)[1];
    } else {
      const pattern = /cartId=(.*)/;
      cartId = url.match(pattern)[1];
    }
    LOGGER.info("Cart id: " + cartId);
    const placeOrderLink = `https://www.walmart.com/checkout/review-order?cartId=${cartId}`;
    await this.openLink(placeOrderLink);
    await this.sleep(5000);
  }

  async addGiftCard(index) {
    await this.page.evaluate(() => {
      $("button:contains(Gift card)").click();
    });
    await this.sleep(1000);
    const giftCardInfo = await api.getGiftCardByAPI(this.orderInfo.id);
    try {
      await this.waitForLoadingElement('[id="gc-number"]');
    } catch (error) {
      await this.page.evaluate(() => {
        $("button:contains(Add a payment method)").click();
      });
      await this.page.evaluate(() => {
        $("button:contains(Gift card)").click();
      });
      try {
        await this.waitForLoadingElement('[id="gc-number"]');
      } catch (error) {
        await this.page.evaluate(() => {
          $("button:contains(Change payments)").click();
        });
        await this.sleep(2000);
        await this.page.evaluate(() => {
          $("button:contains(Gift card)").click();
        });
        await this.waitForLoadingElement('[id="gc-number"]');
      }
    }
    await this.insertValue('[id="gc-number"]', giftCardInfo.cardNumber);
    await this.sleep(1000);
    await this.waitForLoadingElement('[type="password"]');
    await this.insertValue('[type="password"]', giftCardInfo.pinCode);
    await this.sleep(1000);
    await this.clickButton('[type="submit"]');
    await this.waitForLoadingElement(`[data-slide="${index}"]`);
    await this.sleep(1000);
    const usedCardInfo = await this.page.evaluate(() => {
      const cards = document.querySelectorAll("[data-slide]");
      let cardNumList = [];
      let amountList = [];
      const numpatt = /\d{4}/g;
      const amountPatt = /Amount applied(.*)/g;

      for (let i = 0; i < cards.length; i++) {
        const content = cards[i].innerText;
        cardNumList.push(content.match(numpatt)[0]);
        const amount = content
          .match(amountPatt)[0]
          .replace("Amount applied:", "")
          .trim()
          .replace("$", "");
        amountList.push(Number(amount));
      }
      return [cardNumList, amountList];
    });

    const gcAmount =
      usedCardInfo[1][
        usedCardInfo[0].indexOf(giftCardInfo.cardNumber.slice(-4))
      ];

    LOGGER.info(
      "Applied gift card info: ",
      giftCardInfo.cardNumber,
      ", ",
      gcAmount
    );
    await api.sendCurrentGiftCard(
      giftCardInfo.cardNumber,
      gcAmount,
      this.orderInfo.id
    );
    await this.waitForLoadingElement('[aria-label="Add a new payment method"]');
    await this.page.evaluate(() => {
      $("button:contains(Add a new payment method)").click();
    });
    await this.sleep(3000);
    return gcAmount;
  }

  async placeOrder() {
    console.log("Placing order....");
    await this.loadJqueryIntoPage();
    await this.page.evaluate(() => {
      $("button:contains(Place order)").click();
    });
    await this.sleep(1000);
    try {
      await this.resolveCaptcha();
    } catch (error) {}
    await this.loadJqueryIntoPage();
    const orderNumber = await this.page.evaluate(() => {
      const orderNumber = $("span:contains(Order#)").text();
      return orderNumber.replace(/\D/g, "");
    });
    return orderNumber;
  }

  async openOrderHistoryPage() {
    await this.openLink("https://www.walmart.com/orders"); //5712108308439
    await this.sleep(3000);
    await this.loadJqueryIntoPage();
    await this.page.evaluate(() => {
      $("span:contains(View details)").click();
    });
    await this.sleep(3000);
    await this.loadJqueryIntoPage();
    await this.sleep(1000);
    const orderNumber = await this.page.evaluate(() => {
      const orderNumber = $("span:contains(Order#)").text();
      return orderNumber.replace(/\D/g, "");
    });
    return orderNumber;
  }

  async cancelExtraItem() {
    await this.loadJqueryIntoPage();
    const itemNumbersOnOrder = await this.page.evaluate(() => {
      const items = document.querySelectorAll('[link-identifier="itemClick"]');
      let numbers = [];
      for (let item of items) {
        numbers.push(item.href.split("/").slice(-1)[0]);
      }
      return numbers;
    });
    const indexOfExtraItem = itemNumbersOnOrder.indexOf(
      this.orderInfo.extraItem
    );
    console.log("itemNumbers", itemNumbersOnOrder, "id", indexOfExtraItem);
    // Click extra item remove btn.
    try {
      await this.page.evaluate(
        (ind) => {
          $("button:contains(Remove item)")[ind].click();
        },
        [indexOfExtraItem]
      );
    } catch (error) {
      await this.page.evaluate(() => {
        $("button:contains(Cancel items)").click();
      });
    }

    await this.sleep(2000);
    await this.page.evaluate(() => {
      $("button:contains(Remove)").click();
    });
    await this.page.waitForXPath(
      '//*[contains(text(), "Ordered wrong item or amount.")]',
      {
        timeout: 5000,
      }
    );

    // const [button] = await this.page.$x(
    //   "//label[contains(text(), 'Ordered wrong item or amount.')]"
    // );
    // if (button) {
    //   await button.click();
    //   console.log("Select reason");
    // }
    const reasonOptions = await this.page.$$('[id*="radio-"]');
    const properOptions = await reasonOptions[2];
    await properOptions.focus();
    await properOptions.click();

    await this.sleep(1000);
    await this.page.click('[data-testid="cancel-cta"]');
    // await this.page.evaluate(() => {
    //   // $("button:contains(Remove)").click();
    //   document.querySelectorAll('[data-testid="cancel-cta"]')[0].click();
    // });

    await this.sleep(3000000);
    LOGGER.info("Extra item successfully removed.");
  }

  async checkAlreadyPurchased() {
    const purchased = await this.page.evaluate(() => {
      if ($("h2:contains(Purchased)").length) return true;
      return false;
    });
    if (purchased) {
      LOGGER.info("Items are already purchased.");
      await this.openLink(WALMART.AUTH_LINK);
      await this.signInWalmart(this.orderInfo.email);
      await this.resolveCaptcha();
      try {
        await this.openLink(WALMART.ORDER_LINK);
        await this.sleep(1000);
        await this.loadJqueryIntoPage();
        await this.sleep(1000);
        await this.page.evaluate(() => {
          $("span:contains(View details)").click();
        });
        await this.loadJqueryIntoPage();
        console.log("Details pages");
        await this.sleep(1000);
        const orderNumber = await this.page.evaluate(() => {
          const orderNumber = $("span:contains(Order#)").text();
          return orderNumber.replace(/\D/g, "");
        });
        LOGGER.info("Order number", orderNumber);
      } catch (error) {
        console.log(error);
      }
    }
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
      try {
        await this.addItemsToCart();
      } catch (error) {
        await this.checkAlreadyPurchased();
      }
      await this.resolveCaptcha();
      await this.continuetoCheckout();
      await this.fillSignInCart();
      await this.payOrder();
      const items = [
        {
          id: this.orderItemId,
          quantity_bought: this.orderInfo.primaryItemQty,
        },
      ];
      await this.placeOrder();
      await this.sleep(3000);
      const orderNumber = await this.openOrderHistoryPage();
      LOGGER.info("Order Number: " + orderNumber);
      await api.updatePurchasedOrderNumber(
        this.orderInfo.id,
        orderNumber,
        items
      );
      if (this.orderInfo.extraItem) {
        await this.cancelExtraItem();
      }
      await this.closeBrowser();
    } catch (error) {
      console.error(error);
      await this.sleep(100000);
    }
  }
}

module.exports = WalmartBuy;
