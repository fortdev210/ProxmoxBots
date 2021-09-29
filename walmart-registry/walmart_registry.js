const PuppeteerBase = require("../lib/puppeeteer");
require("dotenv").config();

class WalmartRegistry extends PuppeteerBase {
  constructor(customerInfo, flagInstance) {
    super();
    this.customerInfo = customerInfo;
    this.passwords = ["Forte1long!", "forte1long", "forte1"];
    this.regLink =
      "https://www.walmart.com/account/signup?returnUrl=%2Flists%2Fcreate-events-registry%3Fr%3Dyes";
    this.flagInstance = flagInstance;
    this.isNewWalmart = false;
  }

  async clearSiteSettings() {
    const client = await this.page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    console.log("Clear cookies and caches.".green);
  }

  async goSignInPage() {
    await this.openNewPage();
    // await this.luminatiProxyManager("ON");
    await this.openLink(this.regLink);
    await this.waitForLoadingElement(
      '[data-automation-id="signup-sign-in-btn"]'
    );
    await this.clickButton('[data-automation-id="signup-sign-in-btn"]');
  }

  async goSignUpPage() {
    await this.openNewPage();
    // await this.luminatiProxyManager("ON");
    await this.openLink(this.regLink);
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

  async fillSignUpForm() {
    await this.waitForLoadingElement('[id="first-name-su"]');
    await this.insertValue('[id="first-name-su"]', this.customerInfo.firstName);
    await this.insertValue('[id="last-name-su"]', this.customerInfo.lastName);
    await this.insertValue('[id="email-su"]', this.customerInfo.email);
    await this.insertValue('[id="password-su"]', this.passwords[0]);
    await this.clickButton('[id="su-newsletter"]');
    await this.sleep(3000);
    await this.waitForLoadingElement(
      '[data-automation-id="signup-submit-btn"]'
    );
    await this.clickButton('[data-automation-id="signup-submit-btn"]');
  }

  async checkAlreadyExist() {
    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "The email address you entered is associated with another Walmart.com account.")]',
        { timeout: 3000 }
      );
      console.log("Account with this email already exists...");
      await this.flagInstance.removeEmailFromPrep();
    } catch (error) {
      console.log("Account has not been used.");
    }
  }

  async signInWalmart() {
    try {
      await this.waitForLoadingElement('[id="sign-in-with-email-validation"]');
      console.log("New Signin Page.");
      await this.insertValue('[id="email"]', email);
      await this.waitForLoadingElement(
        '[data-automation-id="signin-continue-submit-btn"]'
      );
      await this.pressEnter();
      await this.insertValue("#password", this.passwords[0]);
      await this.pressEnter();
    } catch (error) {
      console.log("Old sign in page.");
      await this.fillOldSignInForm();
    }
  }

  scheduleDate() {
    const now = Date.parse(new Date());
    const schedule = new Date(now + 1000 * 24 * 3600 * 14);
    const scheduleDate =
      schedule.getMonth() +
      1 +
      "/" +
      (schedule.getDate() < 10
        ? "0" + schedule.getDate()
        : schedule.getDate()) +
      "/" +
      schedule.getFullYear();
    return scheduleDate;
  }

  async addEventDate() {
    const eventDate = this.scheduleDate();
    try {
      await this.waitForLoadingElement("#eventDate");
      await this.insertValue("#eventDate", eventDate);
    } catch (error) {
      console.log("Error while loading the page, should reload.");
      await this.page.reload();
      await this.waitForLoadingElement("#eventDate", 20000);
      await this.insertValue("#eventDate", eventDate);
    }
  }

  async addLocation() {
    const state = this.getFullState(this.customerInfo.state);
    await this.waitForLoadingElement("#regstate");
    await this.insertValue("#regstate", state);
  }

  async addOrganization() {
    await this.waitForLoadingElement("#lastname");
    await this.reInsertValue("#lastname", this.customerInfo.lastName);
  }

  async removeOldAddress() {
    try {
      await this.waitForLoadingElement('[class="shipping-address-footer"]');
      await this.clickButton('[class*="delete-button "]');
    } catch (error) {
      console.log("No old address exists!");
    }
  }

  async addPersonalInfo() {
    try {
      await this.waitForLoadingElement("#firstName");
    } catch (error) {
      await this.page.reload();
      await this.addEventDate();
      await this.addLocation();
      await this.addOrganization();
      await this.removeOldAddress();
    }
    await this.insertValue("#firstName", this.customerInfo.firstName);
    await this.insertValue("#lastName", this.customerInfo.lastName);
    await this.insertValue("#phone", this.customerInfo.phoneNum);
    await this.insertValue("#addressLineOne", this.customerInfo.addressOne);
    await this.insertValue("#addressLineTwo", this.customerInfo.addressTwo);
    await this.insertValue("#city", this.customerInfo.city);
    await this.insertValue("#state", this.customerInfo.state);
    await this.insertValue("#postalCode", this.customerInfo.zipCode);
    await this.clickButton('[data-automation-id="address-form-submit"]');
    console.log("All information successfully registered.");
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
      await this.page.waitForXPath(
        '//*[contains(text(), "We can\'t verify this address. Want to save it anyway")]',
        { timeout: 3000 }
      );
      await this.sleep(3000);
      await this.clickButton('[class*="button-save-address"]');
    } catch (error) {
      console.log("No address warning");
    }
    try {
      await this.waitForLoadingElement('[class="validation-wrap"]', 30000);
      console.log("Verify address");
      await this.sleep(1000);
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

  async checkRegisterStatus() {
    await this.sleep(5000);
    await this.sleep(10000);
    const created = await this.page.evaluate(() => {
      const link = window.location.href;
      return link.includes("created") || link.includes("registry/ER");
    });
    return created;
  }

  async checkWalmartNew() {
    const currentLink = await this.page.evaluate(() => {
      return window.location.href;
    });
    if (currentLink.includes("my-registries?created")) {
      this.isNewWalmart = true;
    }
  }

  async addItemToRegistry(itemNumber) {
    const itemLink = `http://www.walmart.com/ip/${itemNumber}?selected=true`;
    await this.openNewPage();
    await this.openLink(itemLink);
    //--- click registry button ---//
    await this.page.waitForXPath('//*[contains(text(), "Add to registry")]');
    await this.sleep(1500);
    await this.page.evaluate(() => {
      $("button:contains(Add to registry)").click();
    });
    await this.page.waitForXPath('//*[contains(text(), "Save")]');
    await this.page.evaluate(() => {
      $("button:contains(Save)").click();
    });
    console.log("Successfully registered");
  }

  async getSharedRegistryLinkInOldWalmart() {
    const link = "https://www.walmart.com/lists/manage-events-registry-items";
    await this.openLink(link);
    await this.waitForLoadingElement('[aria-label="more info"]');
    await this.clickButton('[aria-label="more info"]');
    await this.waitForLoadingElement('[class*="flowtip-flyout-modal"]');
    const registryLink = await this.page.evaluate(() => {
      return document
        .querySelector('[class*="flowtip-flyout-modal"]')
        .querySelector("input").value;
    });
    return registryLink;
  }
  // For new walmart process
  async registryPrimaryItem() {
    const itemLink = `http://www.walmart.com/ip/${this.customerInfo.primaryItem}?selected=true`;
    await this.openNewPage();
    await this.openLink(itemLink);
    await this.page.waitForXPath('//*[contains(text(), "Add to registry")]', {
      timeout: 10000,
    });
    const elements = await this.page.$x(
      '//*[contains(text(), "Add to registry")]'
    );
    await elements[0].click();
    // wait for dialog pop up
    await this.waitForLoadingElement('[role="dialog"]');
    await this.page.evaluate(() => {
      document
        .querySelectorAll('[class="w_Fk"]')[0]
        .querySelector("button")
        .click();
    });
    console.log("Successfully registered primary item");
  }

  async registryExtraItem() {
    const extraItemLink = `http://www.walmart.com/ip/${this.customerInfo.extraItem}?selected=true`;
    await this.openNewPage();
    await this.openLink(extraItemLink);
    await this.page.waitForXPath('//*[contains(text(), "Add to registry")]', {
      timeout: 10000,
    });
    const elements = await this.page.$x(
      '//*[contains(text(), "Add to registry")]'
    );
    await elements[0].click();
    // wait for dialog pop up
    await this.waitForLoadingElement('[role="dialog"]');
    await this.page.evaluate(() => {
      document
        .querySelectorAll('[class="w_Fk"]')[0]
        .querySelector("button")
        .click();
    });
    console.log("Successfully registered extra item");
  }

  async shareRegistry() {
    await this.page.addScriptTag({
      url: "https://code.jquery.com/jquery-3.2.1.min.js",
    });
    this.sleep(2000);
    await this.page.waitForXPath(
      '//*[contains(text(), "Share this registry")]'
    );
    await this.page.evaluate(() => {
      $("button:contains(Share this registry)").click();
    });
    await this.sleep(3000);
    // get the registry link
    await this.waitForLoadingElement('[id="ld_ui_textfield_0"]');
    const registryLink = await this.page.evaluate(() => {
      return document.querySelector('[id="ld_ui_textfield_0"]').value;
    });
    return registryLink;
  }

  async extraItemProcess() {
    await this.luminatiProxyManager("ON", [
      this.customerInfo.ip,
      this.customerInfo.port,
    ]);
    await this.sleep(3000);
    await this.goSignInPage();
    await this.clearSiteSettings();
    await this.signInWalmart();
    const captchaDetected = await this.resolveCaptcha();
    if (captchaDetected) {
      console.log("Captcha detected.");
      await this.clearSiteSettings();
      await this.closeBrowser();
      return "Captcha";
    }
    console.log("Successfully signed in, registering...");
    if (process.env.TEST_MODE !== "true")
      await this.flagInstance.putInProcessingFlag();
    console.log("Order moved to Walmart Processing");
    await this.luminatiProxyManager("OFF");

    const currentURL = await this.getCurrentURL();
    if (currentURL.indexOf("create-events-registry") > -1) {
      await this.registerCustomerInfo();
      await this.verifyAddress();
      await this.flagInstance.putEmailInPrep(this.customerInfo.email);
      await this.makeRegistryPublic();
    }
    const registered = await this.checkRegisterStatus();
    if (registered) {
      console.log("Successfully registered.");
      await this.addItemToRegistry(this.customerInfo.primaryItem);
      await this.addItemToRegistry(this.customerInfo.extraItem);
      const pages = await this.browser.pages();
      const registryPage = pages[pages.length - 3];
      await registryPage.bringToFront();
      this.page = registryPage;
      const regitryLink = await this.shareRegistry();
      console.log(regitryLink);
      await this.flagInstance.putInBuyer1Flag(regitryLink);
      console.log("Order moved to Walmart Preprocessed".bgGreen);
      await this.closeBrowser();
    } else {
      await this.sleep(500000);
      console.error(
        "An error happened while registering. Trying again...".bgRed
      );
      await this.closeBrowser();
      await this.sleep(3000);
      return false;
    }
  }

  async noExtraItemProcess() {
    await this.luminatiProxyManager("ON", [
      this.customerInfo.ip,
      this.customerInfo.port,
    ]);
    await this.sleep(3000);
    await this.goSignUpPage();
    await this.clearSiteSettings();
    await this.fillSignUpForm();
    const captchaDetected = await this.resolveCaptcha();
    if (captchaDetected) {
      console.log("Captcha detected.");
      await this.closeBrowser();
      return "Captcha";
    } else {
      await this.checkAlreadyExist();
    }
    console.log("Successfully signed up, registering...");
    await this.flagInstance.putInProcessingFlag();
    console.log("Order moved to Walmart Processing");
    await this.luminatiProxyManager("OFF");
    await this.registerCustomerInfo();
    await this.verifyAddress();
    await this.flagInstance.putEmailInPrep(this.customerInfo.email);
    await this.makeRegistryPublic();
    const registered = await this.checkRegisterStatus();

    if (registered) {
      console.log("Successfully registered.");
      await this.checkWalmartNew();
      if (this.isNewWalmart) {
        await this.registryPrimaryItem();
        const pages = await this.browser.pages();
        const registryPage = pages[pages.length - 2];
        await registryPage.bringToFront();
        this.page = registryPage;
        const regitryLink = await this.shareRegistry();
        console.log(regitryLink);
        await this.flagInstance.putInBuyer1Flag(regitryLink);
        console.log("Order moved to Walmart Preprocessed".bgGreen);
        await this.closeBrowser();
        return true;
      }
      await this.closePage();
      await this.addItemToRegistry();
      const registryLink = await this.getSharedRegistryLinkInOldWalmart();
      await this.closeBrowser();
      await this.flagInstance.putInBuyer1Flag(registryLink);
      console.log("Order moved to Walmart Preprocessed".bgGreen);
      return true;
    } else {
      console.error("Not registered correctly.".bgRed);
      await this.closeBrowser();
      await this.sleep(3000);
      return false;
    }
  }
}

module.exports = WalmartRegistry;
