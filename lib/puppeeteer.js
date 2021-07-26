const { request } = require("http");
const puppeteer = require("puppeteer");
const randomUseragent = require("random-useragent");
const userAgent = randomUseragent.getRandom();
const parentDir = require('path').resolve(__dirname, '..')

class PuppeteerBase {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extensionName = "STL Pro Dropship Helper";
    this.cookie =
      'vtc=b2l3RKLvN4hwogRPnwcoho; _pxvid=3d55573a-de61-11eb-8336-0242ac120007; tb_sw_supported=true; WMP=4; TS013ed49a=01538efd7c6affd0adfd52cc6622aa51a051f2bfc97a49ccf7055b8ce05c1aef74fb8ea37619a64d0ae7ebf5006be308e68f7936ee; _abck=ix6zyiagv7hfdybh6889_1852; TBV=7; TB_Latency_Tracker_100=1; TB_Navigation_Preload_01=1; TB_SFOU-100=1; TB_DC_Flap_Test=0; bstc=VlY4epED59b8K6vV7W5uJU; mobileweb=0; xpa=; DL=94066%2C%2C%2Cip%2C94066%2C%2C; x-csrf-jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY29va2llIiwidXVpZCI6IjQyMGUxYWQwLWU0YmItMTFlYi1hMDM4LTVkODM2MWMzMzYxYiIsImlhdCI6MTYyNjI3Nzg0OCwiZXhwIjoxNjI4MDc3ODQ4fQ.XsJz_2ouWUjstsYzhATnabLXRgeLvk7yO842iXaLOy8; TS01b0be75=01538efd7c37c65242c1392f85dc7f6f7b4866a35480752f2fec56d449014f82b23ff593a85c01c0bdc3ec8df5a380ab9cb7540791; _pxff_cfp=1; com.wm.reflector="reflectorid:0000000000000000000000@lastupd:1626277890107@firstcreate:1623694887043"; next-day=1626382800|true|false|1626436800|1626277890; location-data=94066%3ASan%20Bruno%3ACA%3A%3A0%3A0|21k%3B%3B15.22%2C46y%3B%3B16.96%2C1kf%3B%3B19.87%2C1rc%3B%3B23.22%2C46q%3B%3B25.3%2C2nz%3B%3B25.4%2C2b1%3B%3B27.7%2C4bu%3B%3B28.38%2C2er%3B%3B29.12%2C1o1%3B%3B30.14|2|7|1|1xun%3B16%3B0%3B2.44%2C1xtf%3B16%3B1%3B4.42%2C1xwj%3B16%3B2%3B7.04%2C1ygu%3B16%3B3%3B8.47%2C1xwq%3B16%3B4%3B9.21; akavpau_p8=1626278490~id=42b4e709df2720862a3f98cb734559fe; xpm=3%2B1626277895%2Bb2l3RKLvN4hwogRPnwcoho~%2B0; _pxff_fp=1; _px3=e07ec3a7f3c8d665f0da21c3260cb44e353259b23d16cbebd1b1f53f63069e51:rjk6VJ6DdYEDTsYw0YYqF28iFOAt5IjAojmw1xMr3KdTwN8FyKdD92p9SKUTEfHhY7M4SB9CIEELI8HSIVP3yA==:1000:U/R645iCL9TtRUmG93mj2wBxCqpMxEfmU1sXC0dJHYreBqLWV6u2cDZRb26APl59BeCDUUAouvaoV7/O6VfLLYzCGo2qGSbuXQbjU5c6aj1JdMOOFmFKfuHBes1mxIjSN8e1kcg8bF5LziQCi4lSzVyxD5zD+EPGxxp7nJzO7qW9MWtuEJ3vJOyZWDWdMdDfkrlsoDszhrou/Ge/wH2JeA==; _pxde=6edab6a17def2c6693793b686435a5ae71f55e76fd48f3ecacd6d9f628be7aca:eyJ0aW1lc3RhbXAiOjE2MjYyNzc4OTkxMDMsImZfa2IiOjAsImlwY19pZCI6W119';
  }

  async initPuppeteer(proxy_info) {
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
          parentDir +
          "/ext/canvas-defend," +
          parentDir +
          "/ext/dsh",
        "--load-extension=" +
          parentDir +
          "/ext/canvas-defend," +
          parentDir +
          "/ext/dsh",
          proxy_info
        ? "--proxy-server=" + proxy_info.ip + ":" + proxy_info.port
        : "",
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
    var urls = []
    page.on("request", (request) => {
      const headers = request.headers();
      headers.Cookie = this.cookie
      request.continue({ headers });
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

  async clearSiteSettings() {
    const client = await this.page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');
    console.log('Clear cookies and caches.'.green)
  }

  async sleep(minSeconds) {
    const time = Math.random() * 1000 + minSeconds;
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
      this.sleep(2000);
    } catch (error) {
      console.log("Error while opening the link");
    }
  }

  async waitForLoadingElement(selector, milliseconds = 10000) {
    await this.page.waitForSelector(selector, { timeout: milliseconds });
    await this.sleep(2000);
  }

  async insertValue(selector, value) {
    await this.page.type(selector, value, { delay: Math.random() * 10 });
    await this.sleep(500);
  }

  async reInsertValue2(selector, value) {
    try {
      const field = await this.page.$(selector);
      await field.focus();
      let originValue = await this.page.evaluate((selector) => {
        return document.querySelector(selector).value;
      }, [selector]);
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
      await this.page.click(selector, {clickCount:3})
      await this.page.keyboard.press("Backspace");
      await this.page.type(selector, value, { delay: Math.random() * 10 });
      await this.page.waitForTimeout(this.randNumber(3000));
    } catch (error) {
      console.log("Error while reinserting value to " + selector);
    }
  }

  async clickButton(selector) {
    await this.page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, [selector])
    await this.sleep(1000)
  }

  async pressEnter() {
    await this.page.keyboard.press("Enter");
  }

  async luminatiProxyManager(flag, proxyInfo=null) {
    const targets = await this.browser.targets();
    const extensionTarget = targets.find(({ _targetInfo }) => {
      return (
        _targetInfo.title === this.extensionName &&
        _targetInfo.type === "background_page"
      );
    });
    const backgroundPage = await extensionTarget.page();
    if (!proxyInfo) {
      proxyInfo = []
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
      console.log('Turn off proxy.')
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
      await this.page.waitForXPath(
        '//*[contains(text(), "Help us keep your account safe by clicking on the checkbox below.")]',
        { timeout: waitTime }
      )
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

  async init(proxy=null) {
    await this.initPuppeteer(proxy);
    await this.openNewPage();
  }

  async closeBrowser() {
    await this.browser.close();
  }

  async closePage() {
    await this.page.close();
  }

  dsUSStates() {
    return [
        { name: 'ALABAMA', abbreviation: 'AL'},
        { name: 'ALASKA', abbreviation: 'AK'},
        { name: 'AMERICAN SAMOA', abbreviation: 'AS'},
        { name: 'ARIZONA', abbreviation: 'AZ'},
        { name: 'ARKANSAS', abbreviation: 'AR'},
        { name: 'CALIFORNIA', abbreviation: 'CA'},
        { name: 'COLORADO', abbreviation: 'CO'},
        { name: 'CONNECTICUT', abbreviation: 'CT'},
        { name: 'DELAWARE', abbreviation: 'DE'},
        { name: 'DISTRICT OF COLUMBIA', abbreviation: 'DC'},
        { name: 'FEDERATED STATES OF MICRONESIA', abbreviation: 'FM'},
        { name: 'FLORIDA', abbreviation: 'FL'},
        { name: 'GEORGIA', abbreviation: 'GA'},
        { name: 'GUAM', abbreviation: 'GU'},
        { name: 'HAWAII', abbreviation: 'HI'},
        { name: 'IDAHO', abbreviation: 'ID'},
        { name: 'ILLINOIS', abbreviation: 'IL'},
        { name: 'INDIANA', abbreviation: 'IN'},
        { name: 'IOWA', abbreviation: 'IA'},
        { name: 'KANSAS', abbreviation: 'KS'},
        { name: 'KENTUCKY', abbreviation: 'KY'},
        { name: 'LOUISIANA', abbreviation: 'LA'},
        { name: 'MAINE', abbreviation: 'ME'},
        { name: 'MARSHALL ISLANDS', abbreviation: 'MH'},
        { name: 'MARYLAND', abbreviation: 'MD'},
        { name: 'MASSACHUSETTS', abbreviation: 'MA'},
        { name: 'MICHIGAN', abbreviation: 'MI'},
        { name: 'MINNESOTA', abbreviation: 'MN'},
        { name: 'MISSISSIPPI', abbreviation: 'MS'},
        { name: 'MISSOURI', abbreviation: 'MO'},
        { name: 'MONTANA', abbreviation: 'MT'},
        { name: 'NEBRASKA', abbreviation: 'NE'},
        { name: 'NEVADA', abbreviation: 'NV'},
        { name: 'NEW HAMPSHIRE', abbreviation: 'NH'},
        { name: 'NEW JERSEY', abbreviation: 'NJ'},
        { name: 'NEW MEXICO', abbreviation: 'NM'},
        { name: 'NEW YORK', abbreviation: 'NY'},
        { name: 'NORTH CAROLINA', abbreviation: 'NC'},
        { name: 'NORTH DAKOTA', abbreviation: 'ND'},
        { name: 'NORTHERN MARIANA ISLANDS', abbreviation: 'MP'},
        { name: 'OHIO', abbreviation: 'OH'},
        { name: 'OKLAHOMA', abbreviation: 'OK'},
        { name: 'OREGON', abbreviation: 'OR'},
        { name: 'PALAU', abbreviation: 'PW'},
        { name: 'PENNSYLVANIA', abbreviation: 'PA'},
        { name: 'PUERTO RICO', abbreviation: 'PR'},
        { name: 'RHODE ISLAND', abbreviation: 'RI'},
        { name: 'SOUTH CAROLINA', abbreviation: 'SC'},
        { name: 'SOUTH DAKOTA', abbreviation: 'SD'},
        { name: 'TENNESSEE', abbreviation: 'TN'},
        { name: 'TEXAS', abbreviation: 'TX'},
        { name: 'UTAH', abbreviation: 'UT'},
        { name: 'VERMONT', abbreviation: 'VT'},
        { name: 'VIRGIN ISLANDS', abbreviation: 'VI'},
        { name: 'VIRGINIA', abbreviation: 'VA'},
        { name: 'WASHINGTON', abbreviation: 'WA'},
        { name: 'WEST VIRGINIA', abbreviation: 'WV'},
        { name: 'WISCONSIN', abbreviation: 'WI'},
        { name: 'WYOMING', abbreviation: 'WY' }
    ];
  }

  getCorrectState(state) {
      var usStates = this.dsUSStates();

      var stateMap = {};
      for(var i = 0; i < usStates.length; i++)
          stateMap[usStates[i].name] = usStates[i].abbreviation;

      state = state.replace('.','').toUpperCase();
      if(state.length > 2)
          state = stateMap[state];
      return state;
  }

  getFullState(abb) {
      var usStates = this.dsUSStates();
      for(var i = 0; i < usStates.length; i++) {
          if (usStates[i].abbreviation === abb) {
              return usStates[i].name
          }
      }
  }
}

module.exports = PuppeteerBase;