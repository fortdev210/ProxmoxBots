const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const userAgent = randomUseragent.getRandom();
var UsaStates = require("usa-states").UsaStates;
const parentDir = require("path").resolve(__dirname, "..");
require("dotenv").config();

class PuppeteerBase {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extensionName = "STL Pro Dropship Helper";
    this.default_page_width = 1800;
    this.default_page_height = 1000;
  }

  async initPuppeteer() {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 30 + parseInt(Math.random() * 10),
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
        "--user-agent=" + userAgent + "",
        "--disable-extensions-except=" +
          parentDir +
          "/ext/canvas-defend," +
          parentDir +
          "/ext/dsh",
        "--load-extension=" +
          parentDir +
          "/ext/canvas-defend," +
          parentDir +
          "/ext/dsh",
      ],
    });
    this.browser = browser;
  }

  async openNewPage() {
    const page = await this.browser.newPage();
    await page.setViewport({
      width: this.default_page_width + Math.floor(Math.random() * 300),
      height: this.default_page_height + Math.floor(Math.random() * 100),
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
    const time = Math.random() * 3000 + minSeconds;
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  randNumber(minValue) {
    return Math.random() * 1000 + minValue;
  }

  contains(selector, text) {
    var elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function (element) {
      return RegExp(text).test(element.textContent);
    });
  }

  async openLink(link) {
    try {
      await this.page.goto(link, { waitUntil: "networkidle2" });
      await this.page.addScriptTag({
        url: "https://code.jquery.com/jquery-3.2.1.min.js",
      });
      this.sleep(2000);
    } catch (error) {
      console.log("Error while opening the link");
    }
  }

  async loadJqueryIntoPage() {
    await this.page.addScriptTag({
      url: "https://code.jquery.com/jquery-3.2.1.min.js",
    });
  }

  async waitForLoadingElement(selector, milliseconds = 10000) {
    await this.page.waitForSelector(selector, { timeout: milliseconds });
    await this.sleep(2000);
  }

  async insertValue(selector, value) {
    const field = await this.page.$(selector);
    await field.focus();
    await this.page.type(selector, value, { delay: Math.random() * 10 });
    await this.sleep(500);
  }

  async reInsertValue2(selector, value) {
    try {
      const field = await this.page.$(selector);
      await field.focus();
      let originValue = await this.page.evaluate(
        (selector) => {
          return document.querySelector(selector).value;
        },
        [selector]
      );
      for (let i = 0; i < originValue.length; i++) {
        await this.page.keyboard.press("Backspace");
      }
      await this.page.keyboard.press("Backspace");
      await this.page.type(selector, value, { delay: Math.random() * 10 });
      await this.page.waitForTimeout(this.randNumber(3000));
    } catch (error) {
      console.log("Error while reinserting value to " + selector);
    }
  }

  async reInsertValue(selector, value) {
    try {
      const field = await this.page.$(selector);
      await field.focus();
      await this.page.click(selector, { clickCount: 3 });
      await this.page.keyboard.press("Backspace");
      await this.page.type(selector, value, { delay: Math.random() * 10 });
      await this.page.waitForTimeout(this.randNumber(3000));
    } catch (error) {
      console.log("Error while reinserting value to " + selector);
    }
  }

  async clickButton(selector) {
    await this.page.evaluate(
      (selector) => {
        document.querySelector(selector).click();
      },
      [selector]
    );
    await this.sleep(1000);
  }

  async pressEnter() {
    await this.page.keyboard.press("Enter");
    await this.sleep(1000);
  }

  async luminatiProxyManager(flag, proxyInfo = null) {
    if (process.env.TEST_MODE === "true") return;
    const targets = await this.browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
      return (
        _targetInfo.title === this.extensionName &&
        _targetInfo.type === "background_page"
      );
    });
    const backgroundPage = await extensionTarget.page();
    if (!proxyInfo) {
      proxyInfo = [];
      proxyInfo[0] = "127.0.0.1";
      proxyInfo[1] = 24000 + parseInt(Math.random() * 100);
    }
    if (flag === "ON") {
      await backgroundPage.evaluate((proxyInfo) => {
        var pulledIP_webF = proxyInfo[0];
        var pulledPort_webF = proxyInfo[1];
        setProxyWebF(pulledIP_webF, pulledPort_webF);
      }, proxyInfo);
    } else {
      console.log("Turn off proxy.");
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

  async clearSiteSettings() {
    const client = await this.page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    console.log("Clear cookies and caches.".green);
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
    await this.clearSiteSettings();
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async closePage() {
    await this.page.close();
  }

  async getCurrentURL() {
    const url = await this.page.evaluate(() => {
      return window.location.href;
    });
    return url;
  }

  getCorrectState(state) {
    var usStates = new UsaStates();
    var stateMap = {};
    for (var i = 0; i < usStates.length; i++)
      stateMap[usStates[i].name] = usStates[i].abbreviation;

    state = state.replace(".", "").toUpperCase();
    if (state.length > 2) state = stateMap[state];
    return state;
  }

  getFullState(abb) {
    var usStates = new UsaStates();
    for (var i = 0; i < usStates.length; i++) {
      if (usStates[i].abbreviation === abb) {
        return usStates[i].name;
      }
    }
  }
}

module.exports = PuppeteerBase;
