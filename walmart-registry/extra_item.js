const PuppeteerBase = require("../lib/puppeeteer");

class ExtraItemHandler extends PuppeteerBase {
  constructor(customerInfo) {
    super();
    this.customerInfo = customerInfo;
    this.passwords = ["Forte1long!", "forte1long", "forte1"];
    this.link =
      "https://www.walmart.com/account/signup?returnUrl=%2Flists%2Fcreate-events-registry%3Fr%3Dyes";
  }

  async goSignInPage() {
    await this.openNewPage();
    // await this.luminatiProxyManager("ON");
    await this.openLink(this.link);
    await this.waitForLoadingElement(
      '[data-automation-id="signup-sign-in-btn"]'
    );
    await this.clickButton('[data-automation-id="signup-sign-in-btn"]');
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
      await this.waitForLoadingElement('#password');
      console.log("Old Signin Page...");
      await this.fillOldSignInForm();
    } catch (error) {
      await this.fillNewSignInForm();
    }
  }

  scheduleDate(){
    const now = Date.parse(new Date());
    const schedule = new Date(now + 1000 * 24 * 3600 * 14);
    const scheduleDate =
      schedule.getMonth() +
      1 +
      "/" +
      (schedule.getDate() < 10 ? "0" + schedule.getDate() : schedule.getDate()) +
      "/" +
      schedule.getFullYear();
    return scheduleDate
  }

  async addEventDate() {
    const eventDate = this.scheduleDate();
    try {
      await this.waitForLoadingElement('#eventDate');
      await this.insertValue('#eventDate', eventDate)
    } catch (error) {
      console.log("Error while loading the page, should reload.");
      await this.page.reload();
      await this.waitForLoadingElement('#eventDate');
      await this.insertValue('#eventDate', eventDate)
    }
  }

  async addLocation() {
    const state = this.getFullState(this.customerInfo.state);
    await this.waitForLoadingElement('#regstate');
    await this.insertValue('#regstate', state);
  }

  async addOrganization() {
    await this.waitForLoadingElement('#lastname');
    await this.reInsertValue('#lastname', this.customerInfo.lastName);
  }

  async removeOldAddress() {
    try {
      await this.waitForLoadingElement('[class="shipping-address-footer"]');
      await this.clickButton('[class*="delete-button "]')
    } catch (error) {
      console.log("No old address exists!");
    }
  }

  async addPersonalInfo() {
    try {
      await this.waitForLoadingElement('#firstName');
    } catch (error) {
      await this.page.reload();
      await this.addEventDate();
      await this.addLocation();
      await this.addOrganization();
      await this.removeOldAddress();
    }
    await this.insertValue('#firstName', this.customerInfo.firstName);
    await this.insertValue('#lastName', this.customerInfo.lastName);
    await this.insertValue('#phone', this.customerInfo.phoneNum);
    await this.insertValue('#addressLineOne', this.customerInfo.addressOne);
    await this.insertValue('#addressLineTwo', this.customerInfo.addressTwo);
    await this.insertValue('#city', this.customerInfo.city);
    await this.insertValue('#state', this.customerInfo.state);
    await this.insertValue('#postalCode', this.customerInfo.zipCode);
    await this.clickButton('[data-automation-id="address-form-submit"]')
    console.log('All information successfully registered.')
  }

  async registerCustomerInfo() {
    await this.addEventDate();
    await this.addLocation();
    await this.addOrganization();
    await this.removeOldAddress();
    await this.addPersonalInfo();
  }

  async verifyAddress() {
    try {
      await this.waitForLoadingElement('[class*="alert-warning"]');
      await this.clickButton('[data-automation-id="address-form-submit"]');
    } catch (error) {
      console.log("No address warning");
    }
    try {
      await this.waitForLoadingElement('[class="validation-wrap"]', 20000);
      console.log("Verify address");
      await this.clickButton('[class*="button-save-address"]');
    } catch (error) {
      console.log("No address error");
    }
  }

  async makeRegistryPublic() {
    console.log("Make my registry public");
    await this.page.evaluate(() => {
      document
        .querySelectorAll(".LNR-PrivacyOptions")[0]
        .childNodes[1].querySelector("input")
        .click();
    });
    await this.sleep(3000);
    ///--- Click looking good button ---///
    console.log("Click looking good button");
    await this.page.evaluate(() => {
      document
        .querySelector('[class="m-padding-ends"]')
        .querySelector("button")
        .click();
    });
  }

  async process() {
    await this.goSignInPage();
    await this.signInWalmart();
    const captchaDetected = await this.checkCaptcha(5000);
    if (captchaDetected) {
      console.log('Use another proxy to bypass captcha...')
      // await this.luminatiProxyManager('OFF');
      // await this.luminatiProxyManager('ON');
      await this.page.reload();
      await this.signInWalmart();
    } 
    console.log('Successfully signed in, registering...');
    await this.registerCustomerInfo();
    await this.verifyAddress();
    await this.makeRegistryPublic();
  }
}

module.exports = ExtraItemHandler;
