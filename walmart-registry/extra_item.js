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
    await this.init();
    await this.luminatiProxyManager("ON");
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
      await this.fillNewSignInForm();
    } catch (error) {
      console.log("Old Signin Page...");
      await this.fillOldSignInForm();
    }
  }
}

module.exports = ExtraItemHandler;
