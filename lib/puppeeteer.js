const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const userAgent = randomUseragent.getRandom();

class PuppeteerBase {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extensionName = "STL Pro Dropship Helper";
  }

  async initPuppeteer() {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 35,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--ignore-certificate-errors",
        "--ignore-certificate-errors-spki-list",
        "--disable-dev-shm-usage",
        "--disable-infobars",
        "--lang=en-US,en",
        "--window-size=1920,1040",
        "--user-agent=" + userAgent + "",
        "--disable-extensions-except=" +
          process.cwd() +
          "/ext/canvas-defend," +
          process.cwd() +
          "/ext/dsh",
        "--load-extension=" +
          process.cwd() +
          "/ext/canvas-defend," +
          process.cwd() +
          "/ext/dsh",
        "--disable-infobars",
      ],
    });
    this.browser = browser;
  }

  async openNewPage() {
    const page = await this.browser.newPage();
    await page.setViewport({
      width: 1920 + Math.floor(Math.random() * 100),
      height: 3000 + Math.floor(Math.random() * 100),
      deviceScaleFactor: 1,
      hasTouch: false,
      isLandscape: false,
      isMobile: false,
    });
    await page.setUserAgent(userAgent.toString());
    await page.setJavaScriptEnabled(true);
    await page.emulateTimezone("America/Toronto");
    //--- Block the trakcing request ---//
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (url.endsWith("init.js")) request.abort();
      else request.continue();
    }); // you should check network in developer mode and check the collector in Network. https://help.apify.com/en/articles/1961361-several-tips-on-how-to-bypass-website-anti-scraping-protections

    await page.evaluateOnNewDocument(() => {
      // Pass webdriver check
      Object.defineProperty(navigator, "webdriver", {
        get: () => false,
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Pass chrome check
      window.chrome = {
        runtime: {},
        // etc.
      };
    });

    await page.evaluateOnNewDocument(() => {
      //Pass notifications check
      const originalQuery = window.navigator.permissions.query;
      return (window.navigator.permissions.query = (parameters) =>
        parameters.name === "notifications"
          ? Promise.resolve({ state: Notification.permission })
          : originalQuery(parameters));
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, "plugins", {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `languages` property to use a custom getter.
      Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
      });
    });

    this.page = page;
  }

  async sleep(minSeconds) {
    const time = Math.random() * 1000 + minSeconds;
    return new Promise((resolve) => setTimeout(resolve, minSeconds));
  }

  randNumber(minValue) {
    return Math.random() * 1000 + minValue;
  }

  async openLink(link) {
    try {
      await this.page.goto(link, { waitUntil: "networkidle2" });
      this.sleep(2000);
    } catch (error) {
      console.log("Error while opening the link", error);
    }
  }

  async waitForLoadingElement(selector, milliseconds = 10000) {
    try {
      await this.page.waitForSelector(selector, { timeout: milliseconds });
      await this.sleep(2000);
    } catch (error) {
      console.log("Error while waiting for loading element " + selector);
    }
  }

  async insertValue(selector, value) {
    try {
      await this.page.waitForSelector(selector, {
        timeout: this.randNumber(3000),
      });
      await this.page.type(selector, value, { delay: Math.random() * 10 });
      await this.sleep(500);
    } catch (error) {
      console.error(`Error while waiting for the ${selector}`, error);
    }
  }

  async reInsertValue(selector, value) {
    try {
      const field = await this.page.$(selector);
      await field.focus();
      await field.click({ clickCount: 3 });
      await this.page.type(selector, value, { delay: Math.random() * 10 });
      await this.page.waitForTimeout(this.randNumber(3000));
    } catch (error) {
      console.log("Error while reinserting value to " + selector);
    }
  }

  async clickButton(selector) {
    await this.page.click(selector);
  }

  async pressEnter() {
    await this.page.keyboard.press("Enter");
  }

  async luminatiProxyManager(flag, proxyInfo) {
    const targets = await this.browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
      return (
        _targetInfo.title === this.extensionName &&
        _targetInfo.type === "background_page"
      );
    });
    const backgroundPage = await extensionTarget.page();
    if (!proxyInfo) {
      proxyInfo[0] = "127.0.0.1";
      proxyInfo[1] = parseInt(Math.random() * 100);
    }
    if (flag === "ON") {
      await backgroundPage.evaluate((proxyInfo) => {
        var pulledIP_webF = proxyInfo[0];
        var pulledPort_webF = proxyInfo[1];
        setProxyWebF(pulledIP_webF, pulledPort_webF);
      }, proxyInfo);
    } else {
      await backgroundPage.evaluate(() => {
        proxyOffWebF();
      });
    }
  }

  async getValueOfField(selector) {
    try {
      await this.page.waitForSelector(selector);
      const value = await this.page.evaluate(() => {
        return document.querySelector(selector).innerText;
      });
      return value;
    } catch (error) {
      console.error("Error while getting values from " + selector);
    }
  }

  async checkCaptcha(waitTime) {
    try {
      await this.page.waitForSelector('[class*="captcha"]', {
        timeout: waitTime,
      });
      console.log("Captcha detected.");
      return true;
    } catch (error) {
      console.log("No captcha detected.");
      return false;
    }
  }

  async deleteFieldValue(selector) {
    try {
      await this.page.waitForSelector(selector);
      const originValue = await this.page.evaluate(() => {
        return document.querySelector(selector).value;
      });
      const agent = await this.page.$(selector);
      await agent.focus();
      for (let i = 0; i < originValue.length; i++) {
        await this.page.keyboard.press("Backspace");
      }
    } catch (error) {
      console.error("Error while deleting value on ", selector);
    }
  }

  async init() {
    await this.initPuppeteer();
    await this.openNewPage();
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async closePage() {
    await this.page.close();
  }
}

module.exports = PuppeteerBase;
