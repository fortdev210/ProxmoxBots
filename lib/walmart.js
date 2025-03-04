const PuppeteerBase = require("./puppeeteer");
const LOGGER = require("./logger");
const { WALMART } = require("../constants/urls");
require("dotenv").config();

class WalmartBase extends PuppeteerBase {
  constructor(page) {
    super();
    this.page = page;
    this.passwords = ["Forte1long!", "forte1long", "forte1"];
  }

  async checkCaptcha() {
    const pageUrl = await this.page.url();
    const pageContent = await this.page.content();
    if (pageUrl.includes("https://www.walmart.com/blocked?")) {
      LOGGER.info("https://www.walmart.com/blocked?");
      return true;
    }
    if (
      pageContent.includes("Verify your identity") ||
      pageContent.includes("Account Verification")
    ) {
      LOGGER.info("Account Verification");
      return true;
    }
    try {
      await this.page.waitForSelector('[id="px-captcha"]');
      LOGGER.warn('[id="px-captcha"]');
      return true;
    } catch (e) {
      return false;
    }
  }

  async resolveCaptcha() {
    let i = 0;
    let captchaDetected = await this.checkCaptcha();
    while (captchaDetected && i < 5) {
      i++;
      try {
        await this.waitForLoadingElement('[id="px-captcha"]', 30000);
        const position = await this.page.evaluate(() => {
          const captchaBtn = document.querySelector('[id="px-captcha"]');
          const { top, left, bottom, right } =
            captchaBtn.getBoundingClientRect();
          return { top, left, bottom, right };
        });
        await this.page.mouse.move(
          position.left +
            (Math.random() * (position.right - position.left)) / 3,
          position.top + Math.random() * (position.bottom - position.top)
        );
        await this.page.mouse.down();
        await this.page.waitForTimeout(Math.random() * 30000 + 5000);
        await this.page.mouse.up();
      } catch (error) {
        LOGGER.error(error);
      }
      await this.sleep(Math.random() * 2000 + 5000);
      LOGGER.info(`Tried to solve captcha ${i} times`);
      captchaDetected = await this.checkCaptcha();
    }
    return captchaDetected;
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
    LOGGER.info("New Signin Page...");
    await this.pressEnter();
    await this.insertValue('[id="sign-in-password-no-otp"]', this.passwords[0]);
    await this.pressEnter();
    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "Your password and email do not match. Please try again")]',
        { timeout: 1000 }
      );
      LOGGER.error(
        "Error happened in new signin page. The password is not working..."
      );
    } catch (error) {}
  }

  async signUpWalmart(customerInfo) {
    await this.waitForLoadingElement('[id="first-name-su"]');
    await this.insertValue('[id="first-name-su"]', customerInfo.firstName);
    await this.insertValue('[id="last-name-su"]', customerInfo.lastName);
    await this.insertValue('[id="email-su"]', customerInfo.email);
    await this.insertValue('[id="password-su"]', this.passwords[0]);
    await this.clickButton('[id="su-newsletter"]');
    await this.sleep(1000);
    await this.waitForLoadingElement(
      '[data-automation-id="signup-submit-btn"]'
    );
    await this.clickButton('[data-automation-id="signup-submit-btn"]');
  }

  async signInWalmart(email) {
    try {
      await this.waitForLoadingElement('[id="sign-in-with-email-validation"]');
      LOGGER.info("New Signin Page.");
      await this.insertValue('[id="email"]', email);
      await this.waitForLoadingElement(
        '[data-automation-id="signin-continue-submit-btn"]'
      );
      await this.pressEnter();
      await this.insertValue(
        '[id="sign-in-password-no-otp"]',
        this.passwords[0]
      );
      await this.pressEnter();
    } catch (error) {
      LOGGER.info("Old sign in page.");
      await this.fillOldSignInForm(email);
    }
  }

  async openSignupPage() {
    await this.openNewPage();
    await this.openLink(WALMART.SIGNUP_LINK);
    await this.sleep(2000);
  }

  async openSignInPage() {
    await this.openNewPage();
    await this.openLink(WALMART.REGISTRY_EVENT_LINK);
    await this.sleep(2000);
  }
}

module.exports = WalmartBase;
