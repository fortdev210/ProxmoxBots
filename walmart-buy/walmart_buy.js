const PuppeteerBase = require("../lib/puppeeteer");
const colors = require("colors");

class WalmartBuy extends PuppeteerBase {
  constructor(customerInfo, flagInstance, payMethod) {
    super();
    this.customerInfo = customerInfo;
    this.flagInstance = flagInstance;
    this.passwords = ["Forte1long!", "forte1long", "forte1"];
    this.signInLink = "https://www.walmart.com/account/login?returnUrl=%2Fcart";
    this.payMethod = payMethod;
  }

  async goSignInPage() {
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

  async fillOldSignInForm() {
    await this.insertValue('[id="email"]', this.customerInfo.email);
    await this.insertValue('[id="password"]', this.passwords[0]);
    await this.clickButton('[data-automation-id="signin-submit-btn"]');
    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "Your password and email do not match. Please try again")]',
        { timeout: 1000 }
      );
      await this.reInsertValue('[id="password"]', this.passwords[1]);
      await this.clickButton('[data-automation-id="signin-submit-btn"]');
    } catch (error) {}
    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "Your password and email do not match. Please try again")]',
        { timeout: 1000 }
      );
      await this.reInsertValue('[id="password"]', this.passwords[2]);
      await this.clickButton('[data-automation-id="signin-submit-btn"]');
    } catch (error) {}
  }

  async fillNewSignInForm() {
    await this.insertValue('[id="email"]', this.customerInfo.email);
    await this.waitForLoadingElement(
      '[data-automation-id="signin-continue-submit-btn"]'
    );
    console.log("New Signin Page...");
    await this.pressEnter();
    await this.insertValue('[id="sign-in-password-no-otp"]', this.passwords[0]);
    await this.pressEnter();
    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "Your password and email do not match. Please try again")]',
        { timeout: 1000 }
      );
      console.log(
        "Error happened in new signin page. The password is not working..."
      );
    } catch (error) {}
  }

  async signInWalmart() {
    try {
      await this.waitForLoadingElement("#password");
      console.log("Old Signin Page...");
      await this.fillOldSignInForm();
    } catch (error) {
      await this.fillNewSignInForm();
    }
  }

  async checkProcessed() {
    await this.waitForLoadingElement('[id="cart-active-cart-heading"]', 20000);
    const isCorrectProcessed = await this.page.evaluate(() => {
      heading = document.querySelector(
        '[id="cart-active-cart-heading"]'
      ).innerText;
      num = parseInt(heading.replace(/[^0-9]/g, ""));
      if (num < 1) return false;
      return true;
    });
    return isCorrectProcessed;
  }

  async clickGiftCheck() {
    try {
      await this.waitForLoadingElement('[data-tl-id="CartGiftChk"]');
      await this.sleep(3000);
      await this.page.evaluate(() => {
        if (
          !document.querySelector('[data-automation-id="gift-order-checkbox"]')
            .checked
        ) {
          document
            .querySelector('[data-automation-id="gift-order-checkbox"]')
            .click();
        }
      });
      console.log("Click my order is gift check");
    } catch (error) {
      console.log("No gift check");
    }
  }

  async goCheckout() {
    await this.waitForLoadingElement('[data-tl-id="CartCheckOutBtnBottom"]');
    await this.sleep(3000);
    await this.clickButton('[data-tl-id="CartCheckOutBtnBottom"]');
    console.log("Click checkout");
  }

  async continue() {
    await this.sleep(3000);
    await this.waitForLoadingElement(
      '[data-automation-id="fulfillment-continue"]',
      20000
    );
    await this.clickButton('[data-automation-id="fulfillment-continue"]');
  }

  async confirmAddress() {
    console.log("Confirm recipient’s address");
    try {
        await this.waitForLoadingElement('[class="address-tile-clickable"]', 20000);
    } catch (error) {
        await this.page.reload();
        await this.continue();
        await this.waitForLoadingElement('[class="address-tile-clickable"]', 20000);
    }
    let isAddressSelected = await this.page.evaluate(() => {
      return document
        .querySelector('[class="address-tile-clickable"]')
        .querySelector("input").checked;
    });
    if (!isAddressSelected) {
      console.log("Should select address");
      await this.page.evaluate(() => {
        document
          .querySelector('[class="address-tile-clickable"]')
          .querySelector("input")
          .click();
      });
    }
    await this.waitForLoadingElement(
      '[data-automation-id="address-book-action-buttons-on-continue"]'
    );
    await this.sleep(1500);
    await this.clickButton(
      '[data-automation-id="address-book-action-buttons-on-continue"]'
    );
  }

  async checkAddressConfirmed() {
    await this.sleep(3000);
    let currentURL = await this.page.evaluate(() => {
      return window.location.href;
    });
    if (currentURL === "https://www.walmart.com/checkout/#/fulfillment") {
      console.log("Should repeat the process again.");
      await this.continue();
      console.log("Confirm recipient’s address");
      await this.confirmAddress();
    }
  }

  async checkShipToAddress() {
    try {
      await this.waitForLoadingElement(
        '[id="CXO-modal-unfulfillable-dialog"]',
        20000
      );
      console.log("Sorry, cant ship to this address, flagging it...");
      await this.flagInstance.setCantShipAddress();
      return true;
    } catch (error) {
      console.log("Can ship to this address...");
      return false;
    }
  }

  async handleGiftOption() {
    try {
      await this.waitForLoadingElement('[class*="gifting-module-body"]', 15000);
      await this.waitForLoadingElement('[name="recipientEmail"]');
      await this.insertValue(
        '[name="recipientEmail"]',
        this.customerInfo.email
      );
      await this.waitForLoadingElement('[name="senderName"]');
      await this.reInsertValue(
        '[name="senderName"]',
        this.customerInfo.lastName
      );
      await this.waitForLoadingElement('[data-automation-id="gift-message"]');
      await this.reInsertValue('[data-automation-id="gift-message"]', "...");
      await this.waitForLoadingElement('[data-automation-id="gifting-submit"]');
      await this.clickButton('[data-automation-id="gifting-submit"]');
      console.log("Successfully input gift message.");
    } catch (error) {
      console.log("No gift message. ");
    }
  }

  async prepareForCheckout() {
    await this.continue();
    await this.confirmAddress();
    await this.checkAddressConfirmed();
    await this.checkShipToAddress();
    await this.handleGiftOption();
  }

  async selectPaymentMethod() {
    console.log("Selecting the payment method...");
    if (this.payMethod === "GiftCard") {
      this.clickButton('[id="payment-option-radio-1"]');
    } else {
      this.clickButton('[id="payment-option-radio-2"]');
      await this.waitForLoadingElement('[class*="cash-payment-option"]');
      await this.page.evaluate(() => {
        document
          .querySelector('[class*="cash-payment-option"]')
          .querySelector("button")
          .click();
      });
      console.log("Select pay with cash button");
      await this.sleep(3000);
    }
  }

  async fillInCashModalForm() {
    await this.waitForLoadingElement('[id="cash-modal-form"]');
    //---- Check modal empty ---//
    const isEmpty = await this.page.evaluate(() => {
      inputValue = document.querySelector('[id="firstName"]').value;
      if (inputValue.length) {
        return false;
      }
      return true;
    });

    if (isEmpty) {
      await this.insertValue('[id="firstName"]', this.customerInfo.firstName);
      await this.insertValue('[id="lastName"]', this.customerInfo.lastName);
      await this.insertValue(
        '[id="addressLineOne"]',
        this.customerInfo.addressOne
      );
      await this.insertValue(
        '[id="addressLineTwo"]',
        this.customerInfo.addressTwo
      );
      await this.insertValue('[id="city"]', this.customerInfo.city);
      await this.insertValue('[id="postalCode"]', this.customerInfo.zipCode);
      await this.insertValue('[id="state"]', this.customerInfo.state);
      await this.insertValue('[id="phone"]', this.customerInfo.phoneNum);
      await this.insertValue('[id="email"]', this.customerInfo.email);
    }
  }

  async payWithGiftCard() {}

  async payWithCash() {
    try {
      await this.waitForLoadingElement('[id="payment-option-radio-1"]', 20000);
      await this.selectPaymentMethod();
    } catch (error) {
      await this.prepareForCheckout();
      await this.selectPaymentMethod();
    }
    await this.fillInCashModalForm();
    await this.sleep(2000);
    try {
      await this.waitForLoadingElement(
        '[data-automation-id="review-your-order-cash"]'
      );
      await this.clickButton('[data-automation-id="review-your-order-cash"]');
      console.log("Checkout successfully.");
    } catch (error) {
      console.log('Error while attempting the "Pay with cash button"');
    }
  }

  async checkout() {
    if (this.payMethod === "GiftCard") {
      console.log("Paying with giftcard...");
      await this.payWithGiftCard();
    } else {
      console.log("Paying with cash...");
      await this.payWithCash();
    }
  }

  async placeOrder() {
    await this.sleep(3000);
    await this.waitForLoadingElement(
      '[data-automation-id="summary-place-holder"]'
    );
    await this.clickButton('button[class*="auto-submit-place-order"]');
  }

  async getOrderNumber() {
    await this.sleep(3000);
    await this.waitForLoadingElement('[class="thankyou-main-heading"]');
    const orderNumber = await this.page.evaluate(() => {
      return document
        .querySelector('[class="thankyou-main-heading"]')
        .innerText.split("#")[1];
    });
    console.log(`Order number is ${orderNumber}`.green);
    return orderNumber;
  }

  async cancelExtraItem(orderNumber) {
    if (this.customerInfo.extraItem === 'N/A') return;
    const cancelLink = `https://www.walmart.com/account/order/${orderNumber}/cancel`;
    await this.openNewPage();
    await this.openLink(cancelLink);
    try {
      await this.waitForLoadingElement('[class="product-image"]');
    } catch (error) {
      console.log("Error while opening page. Reloading...");
      await this.page.reload();
      await this.waitForLoadingElement('[class="product-image"]');
    }
    console.log("Selecting checkbox for extra item...".green.bold);
    await this.page.evaluate((customerInfo) => {
      if (
        document.querySelector(
          '[href="/ip/' + customerInfo.primaryItem + '"]'
        ) !== null
      ) {
        if (
          document
            .querySelector(
              '[href*="/ip/"]:not([href*="' + customerInfo.primaryItem + '"])'
            )
            .parentElement.parentElement.querySelector(
              'input[type="checkbox"]'
            ) !== null
        ) {
          document
            .querySelector(
              '[href*="/ip/"]:not([href*="' + customerInfo.primaryItem + '"])'
            )
            .parentElement.parentElement.querySelector('input[type="checkbox"]')
            .click();
        } else {
          document
            .querySelector('[class="js-content"]')
            .querySelector(
              '[href*="/ip/"]:not([href*="' + customerInfo.primaryItem + '"])'
            )
            .parentElement.parentElement.querySelector('input[type="checkbox"]')
            .click();
        }
      } else {
        // Create contains function
        function contains(selector, text) {
          var elements = document.querySelectorAll(selector);
          return Array.prototype.filter.call(elements, function (element) {
            return RegExp(text).test(element.textContent);
          });
        }

        // Find script on page containing item numbers
        scriptData = JSON.parse(
          contains("script", customerInfo.primaryItem)[0]
            .innerHTML.replace("window.__WML_REDUX_INITIAL_STATE__ = {", "{")
            .replace("};", "}")
        );

        // Create arrays for the different item IDs
        goodIDs = [];
        badIDs = [];

        // Push ID types to respective Arrays
        for (
          var i = 0;
          i < scriptData.requestCancel.cancellableGroup.length;
          i++
        ) {
          badIDs.push(
            scriptData.requestCancel.cancellableGroup[i].cancelLinesList[0]
              .orderProduct.productId
          );
          goodIDs.push(
            scriptData.requestCancel.cancellableGroup[i].cancelLinesList[0]
              .orderProduct.usItemId
          );
        }

        // Get which number in Array is the primary item
        actualPrimary = goodIDs.indexOf(customerInfo.primaryItem);

        // Use the bad primary ID to determine which checkbox to NOT click.
        if (
          document
            .querySelector(
              '[href*="/ip/"]:not([href*="' + badIDs[actualPrimary] + '"])'
            )
            .parentElement.parentElement.querySelector(
              'input[type="checkbox"]'
            ) !== null
        ) {
          document
            .querySelector(
              '[href*="/ip/"]:not([href*="' + badIDs[actualPrimary] + '"])'
            )
            .parentElement.parentElement.querySelector('input[type="checkbox"]')
            .click();
        } else {
          document
            .querySelector('[class="js-content"]')
            .querySelector(
              '[href*="/ip/"]:not([href*="' + badIDs[actualPrimary] + '"])'
            )
            .parentElement.parentElement.querySelector('input[type="checkbox"]')
            .click();
        }
      }
      setTimeout(function () {
        document
          .querySelector('[data-automation-id="request-cancel-form-submit"]')
          .click();
      }, 666);
    }, this.customerInfo);

    try {
        await this.waitForLoadingElement('[id="sign-in-widget"]');
        await this.insertValue('#password', this.passwords[0]);
        await this.clickButton('[type="submit"]')
    } catch (error) {
        console.log("No sign in widget.")
    }
  }

  async applyDB() {
      const pages = await this.browser.pages();
      
  }

  async processBuyOrder() {
    // await this.luminatiProxyManager("ON", [
    //     this.customerInfo.ip,
    //     this.customerInfo.port,
    // ]);
    await this.sleep(3000);
    await this.goSignInPage();
    await this.signInWalmart();
    const captchaDetected = await this.checkCaptcha(5000);
    if (captchaDetected) {
      console.log("Use another proxy to bypass captcha...");
      // await this.luminatiProxyManager("OFF");
      await this.sleep(3000);
      // await this.luminatiProxyManager("ON");
      await this.page.reload();
      await this.signInWalmart();
      const captchaDetected = await this.checkCaptcha(5000);
      if (captchaDetected) {
        console.log("Use another proxy to bypass captcha...");
        //   await this.luminatiProxyManager("OFF");
        await this.sleep(3000);
        //   await this.luminatiProxyManager("ON");
        await this.page.reload();
        await this.signInWalmart();
        const captchaDetected = await this.checkCaptcha(5000);
        if (captchaDetected) {
          console.log("Captcha detected.");
          await this.closeBrowser();
          return "Captcha";
        }
      }
    }
    console.log("Successfully signed in, processing now...");
    const isWellProcessed = await this.checkProcessed();
    if (isWellProcessed) {
      console.log("This order was well preprocessed, doing next...");
    } else {
      console.log("This order was ill preprocessed. Needs manual checking...");
      await this.flagInstance.putInKelly();
      await this.closeBrowser();
      return;
    }
    await this.clickGiftCheck();
    await this.goCheckout();
    await this.prepareForCheckout();
    await this.checkout();
    await this.placeOrder();
    await this.cancelExtraItem();
  }
}

module.exports = WalmartBuy;
