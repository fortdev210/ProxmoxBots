const PuppeteerBase = require("../lib/puppeeteer");
const colors = require("colors");
const API_MANAGER = require("../lib/api");
const apiInstance = new API_MANAGER();

class WalmartBuy extends PuppeteerBase {
  constructor(customerInfo, flagInstance, payMethod) {
    super();
    this.customerInfo = customerInfo;
    this.flagInstance = flagInstance;
    this.passwords = ["Forte1long!", "forte1long", "forte1"];
    this.signInLink = "https://www.walmart.com/account/login?returnUrl=%2Fcart";
    this.payMethod = payMethod;
    this.apiInstance = apiInstance;
    this.numOfGCs = 5; // number of giftcards for applying each order
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

  async fillOldSignInForm(email) {
    await this.insertValue('[id="email"]', email);
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

  async fillNewSignInForm(email) {
    await this.insertValue('[id="email"]', email);
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

  async signInWalmart(email) {
    try {
      await this.waitForLoadingElement("#password");
      console.log("Old Signin Page...");
      await this.fillOldSignInForm(email);
    } catch (error) {
      await this.fillNewSignInForm(email);
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

  isWithinDayOrder(lastOrderDate) {
    const orderDate = new Date(lastOrderDate);
    const now = new Date();
    const aDay = 1000*3600*24
    const diff = now - orderDate
    return diff < aDay
  }

  async trackOrders() {
    //--- click account button ---//
    await this.waitForLoadingElement('[aria-label="Your Account"]');
    await this.clickButton('[aria-label="Your Account"]')
    //--- wait for account menu root open ---//
    await this.waitForLoadingElement('[id="vh-account-menu-root"]');
    await this.waitForLoadingElement('[title="Track Orders"]');
    await this.clickButton('[title="Track Orders"]');
    //--- wait for purchase history page open ---//
    try {
      await this.waitForLoadingElement('[data-automation-id="purchase-history"]',30000);
    } catch (error) {
      await this.page.reload()
    }
     
    const lastOrderDate = await this.page.evaluate(()=> {
      return document.querySelector('[data-automation-id="order-date"]').innerText
    })
    console.log("The last order date is ", lastOrderDate);
    return this.isWithinDayOrder(lastOrderDate)
  }

  async cancelExtraItemOnBadOrder(extraItemNumber) {
    const extraItemStatus = await this.page.evaluate((extraItemNumber) => {
      const selector = `[href=\"/ip/${extraItemNumber}\"]`;
      const parent = document.querySelector([selector]).parentElement
        .parentElement.parentElement.parentElement.parentElement;
      return parent.querySelector('[data-automation-id="shipment-status"]')
        .innerText;
    }, extraItemNumber);
    console.log(`Extra Item is in ${extraItemStatus}`.bgGreen);
    if (extraItemStatus.toLowerCase() === "canceled") {
      console.log('Extra item is already cancelled.'.bgGreen)
    } else if (extraItemStatus.toLowerCase().indexOf("arrives by") > -1) {
      ///---- Cancel the extra item ----///
      await this.page.evaluate((extraItemNumber) => {
        const selector = `[href=\"/ip/${extraItemNumber}\"]`;
        const parent = document.querySelector([selector]).parentElement
          .parentElement.parentElement.parentElement.parentElement;
        try {
          parent
          .querySelector('[class="order-details-cancellation"]')
          .querySelector("button")
          .click();
        } catch (error) {
          
        }
      }, extraItemNumber);
      console.log("Clicked cancel button");
      await this.sleep(3000);
      try {
        await this.waitForLoadingElement('form[class="cancellation-form"]');
        console.log("Select the reason");
        await this.page.evaluate(() => {
          document.querySelectorAll('[name="subReasonCode"]')[0].click();
        });
        await this.sleep(2010);
        await this.page.evaluate(() => {
          document
            .querySelector('[class="cancellation-form"]')
            .querySelector('[type="submit"]')
            .click();
        });
        console.log("Successfully canceled extra item".bgGreen);
      } catch (error) {
         console.log('Failed to select the reason'.red)
      }
    }
    return extraItemStatus
  }

  async handleBadOrder() {
    const needCancel =  await this.trackOrders()
    if (needCancel) {
      console.log('There is an order within 24 hours')
      const orderNumber = await this.page.evaluate(()=>{
        let scrapedNum = document.querySelector('[data-automation-id="order-number"]').innerText;
        scrapedNum = scrapedNum.match(/#(.*)/g)[0]
        scrapedNum = scrapedNum.replace('#','').replace('-','')
        return scrapedNum
      })
      console.log('Order number is ', orderNumber);
      try {
        await this.cancelExtraItemOnBadOrder();
      } catch (error) {
        console.log('Failed to cancel the extra item. Extra item doesnt exist or already canceled.'.red)
      }   
      await this.applyDB(orderNumber)
      await this.closeBrowser()
      return
    } else {
      console.log('No need to cancel. Needs manual checking.'.bgRed);
      console.log(stopHERE)
    }
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
    try {
      await this.waitForLoadingElement(
        '[data-automation-id="fulfillment-continue"]',
        20000
      );
    } catch (error) {
      console.log('Unexpected error while loading. Reloading...');
      await this.page.reload();
      try {
        await this.waitForLoadingElement(
          '[data-automation-id="fulfillment-continue"]',
          20000
        );
      } catch (error) {
        console.log("Error while loading page again.");
        await this.closeBrowser();
        return 'Bad Proxy.' 
      }  
    }
    await this.clickButton('[data-automation-id="fulfillment-continue"]');
  }

  async confirmAddress() {
    console.log("Confirm recipient’s address");
    try {
        await this.waitForLoadingElement('[class="address-tile-clickable"]', 20000);
    } catch (error) {
        console.log('Error while waiting for addresss. Reloading...')
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
      await this.reInsertValue2(
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

  async sendTotalPriceToDB() {
    try {
      const totalPrice = await this.page.evaluate(() => {
        value = document.querySelector(
          '[data-automation-id="pos-grand-total-amount"]'
        ).innerText;
        value = value.replace("$", "");
        return parseFloat(value);
      });
      console.log("Total price is ", totalPrice);
      await this.apiInstance.sendTotal(totalPrice, this.customerInfo.orderId);
    } catch (error) {
      console.log('Error while sending the total value to db', error);
    }
  }

  async addNewGiftCard(i) {
    console.log(`Adding ${i+1}th gift card using api...`);
    if (i !== 0) {
      // click `Add new gift card` button.
      await this.waitForLoadingElement(
        '[data-automation-id="payment-add-new-gift-card"]'
      );
      await this.sleep(2000);
      await this.clickButton('[data-automation-id="payment-add-new-gift-card"]');
    }
    const giftCardInfo = await this.apiInstance.getGiftCardByAPI(this.customerInfo.orderId);
    await this.waitForLoadingElement('[data-automation-id="enter-gift-card-number"]');
    await this.insertValue('[data-automation-id="enter-gift-card-number"]', giftCardInfo.cardNumber);
    await this.sleep(1000);
    await this.insertValue('[data-automation-id="enter-gift-card-pin"]',giftCardInfo.pinCode)
    await this.waitForLoadingElement('[data-tl-id="submit"]')
    await this.sleep(1500)
    await this.clickButton('[data-tl-id="submit"]')
    await this.sleep(5000)
    const gcAmount = await this.page.evaluate((i) => {
      value = document
        .querySelectorAll('[class="price gc-amount-paid-price"]')
        [i].querySelector('[class="visuallyhidden"]').innerText;
      value = value.replace("$", "");
      return value;
    }, i);
    console.log(
      `Gift Card Number is ${giftCardInfo.cardNumber} and Amount is ${gcAmount}`
        .green
    );
    try {
      await this.apiInstance.sendCurrentGiftCard(giftCardInfo.cardNumber, gcAmount, this.customerInfo.orderId);
    } catch (error) {
      console.log("Error while sending current gift card info ", error);
    }

    const balanceStatus = await this.page.$('[data-automation-id="pos-balance-due"]');
    if (balanceStatus === null) { 
      return true
    }
    await this.waitForLoadingElement(
      '[data-automation-id="payment-add-new-gift-card"]'
    );
    await this.sleep(2000);
    await this.clickButton('[data-automation-id="payment-add-new-gift-card"]');
    return false
  }

  async getAlreadyAddedGiftcard() {
    try {
      await this.waitForLoadingElement('[class="gift-card-tile"]');
      const number = await this.page.evaluate(() => {
        return document.querySelectorAll('[class="gift-card-tile"]').length
      });
      console.log(`${number} gift cards already added.`.green);
      // Apply each card to order
      for (let i = 0;  i < number; i++) {
        try {
          await this.page.evaluate((i)=> {
            document.querySelectorAll('[class="gift-card-tile"]').querySelector('[type="checkbox"]').click();
          }, [i])
          console.log(`Applied ${i+1}st card again.`)
          await this.sleep(4000)
        } catch (error) {
          console.log('Cant apply the card again.', error)
        }
      }
      return number
    } catch (error) {
      console.log('No giftcard applied. Fetching from the db...');
      return 0;
    }
  }

  async payWithGiftCard() {
    try {
      await this.waitForLoadingElement('[id="payment-option-radio-1"]', 20000);
      await this.selectPaymentMethod();
    } catch (error) {
      await this.prepareForCheckout();
      await this.selectPaymentMethod();
    }
    await this.sleep(3000);
    await this.sendTotalPriceToDB()
    const numOfAlreadyApplied = await this.getAlreadyAddedGiftcard();
    for (let i = numOfAlreadyApplied; i < this.numOfGCs; i++) {
      const payComplete = await this.addNewGiftCard(i)
      if (payComplete) {
        console.log("Good news! Your order total is covered.".green);
        break;
      }
    }
    await this.waitForLoadingElement('[data-automation-id="submit-payment-gc"]');
    await this.sleep(1000);
    await this.clickButton('[data-automation-id="submit-payment-gc"]');
    console.log("Click review order");
  }

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
      await this.sleep(2000)
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
    console.log('Extra item cancelled successfully.');
    await this.closePage();
  }

  async applyDB(orderNumber) {
    const pages = await this.browser.pages();
    const orderPage = pages[pages.length - 2];
    await orderPage.bringToFront();
    this.page = orderPage
    this.page.on("dialog", async (dialog) => {
      console.log("Dialog popup");
      await dialog.accept();
    });
    await this.waitForLoadingElement('[name="supplier_order_number"]');
    await this.sleep(2000);
    await this.page.evaluate((totalCustomInfo) => {
      return (document.querySelector('[name*="quantity_bought_"]').value =
        totalCustomInfo.qty);
    }, this.customerInfo);
    await this.sleep(1500);
    await this.insertValue('[name="supplier_order_number"]', orderNumber)
    await this.sleep(1000);
    await this.clickButton('[value="Submit & Finish Order"]');
    console.log("Click the submit and finish order button");
    await this.waitForLoadingElement('[class="ui-dialog-buttonset"]');
    await this.sleep(1500);
    await this.page.evaluate(() => {
      document
        .querySelectorAll('[class="ui-dialog-buttonset"]')[0]
        .childNodes[0].click();
    });
    await this.sleep(3000);
    await this.waitForLoadingElement('[class="redTd"]');
    console.log("Purchased correctly".green.bold);
  }

  async processBuyOrder() {
    await this.luminatiProxyManager("ON", [
        this.customerInfo.ip,
        this.customerInfo.port,
    ]);
    await this.sleep(3000);
    await this.goSignInPage();
    await this.signInWalmart(this.customerInfo.email);
    const captchaDetected = await this.checkCaptcha(5000);
    if (captchaDetected) {
      console.log("Captcha detected.");
      await this.clearSiteSettings();
      await this.closeBrowser();
      return "Captcha";
    }
    console.log("Successfully signed in, processing now...");
    const isWellProcessed = await this.checkProcessed();
    if (isWellProcessed) {
      console.log("This order was well preprocessed, doing next...");
    } else {
      await this.handleBadOrder();
      return
    }
    try {
      await this.clickGiftCheck();
      await this.goCheckout();
      await this.prepareForCheckout();
      await this.checkout();
      await this.placeOrder();
      const orderNumber = await this.getOrderNumber();
      await this.cancelExtraItem(orderNumber);
      await this.applyDB(orderNumber);
      await this.clearSiteSettings();
      await this.closeBrowser();
    } catch (error) {
      console.log('Error while in processing.'.red);
      await this.closeBrowser();
    }
  }
}

module.exports = WalmartBuy;
