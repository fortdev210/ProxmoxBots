const PuppeteerBase = require("./puppeeteer");
require("dotenv").config();

class WalmartBase extends PuppeteerBase {
  constructor(page) {
    super();
    this.page = page;
    this.passwords = ["Forte1long!", "forte1long", "forte1"];
  }

  async checkCaptcha(waitTime) {
    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "Help us keep your account safe by clicking on the checkbox below.")]',
        { timeout: waitTime }
      );
      console.log("Captcha detected.");
      return true;
    } catch (error) {
      try {
        await this.page.waitForSelector('[id="px-captcha"]');
        console.log("Captcha detected.");
        return true;
      } catch (error) {
        console.log("No captcha detected.");
        return false;
      }
    }
  }

  async resolveCaptcha() {
    let i = 0;
    let captchaDetected = await this.checkCaptcha(20000);
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
        await this.page.waitForTimeout(Math.random() * 15000 + 5000);
        await this.page.mouse.up();
      } catch (error) {
        console.error(error);
      }
      await this.sleep(Math.random() * 2000 + 5000);
      console.log(`Tried to solve captcha ${i} times`);
      captchaDetected = await this.checkCaptcha(10000);
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
}

module.exports = WalmartBase;
