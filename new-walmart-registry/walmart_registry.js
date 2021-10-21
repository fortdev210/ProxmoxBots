const LOGGER = require("../lib/logger");
const WalmartBase = require("../lib/walmart");
const { scheduleDate } = require("../lib/utils");
const API = require("../lib/api");
const api = new API();

class WalmartRegistry extends WalmartBase {
  constructor(orderInfo) {
    super();
    this.orderInfo = orderInfo;
  }

  async navigateToAddress() {
    await this.openLink("https://www.walmart.com/account/delivery-addresses");
  }

  async addAddress() {
    try {
      await this.page.evaluate(() => {
        $("button:contains(+ Add address)").click();
      });
      await this.sleep(1000);
      // Input address details
      await this.insertValue('[name="firstName"]', this.orderInfo.firstName);
      await this.insertValue('[name="lastName"]', this.orderInfo.lastName);
      await this.insertValue("#ld_select_6", this.orderInfo.phoneNumber);
      await this.insertValue("#ld_select_5", this.orderInfo.zipCode);
      await this.insertValue("#addressLineOne", this.orderInfo.addressOne);
      await this.insertValue("#ld_select_2", this.orderInfo.addressTwo);
      await this.insertValue("#ld_select_3", this.orderInfo.city);
      await this.insertValue("#ld_select_4", this.orderInfo.state);
      await this.clickButton('[id="isDefault"]');
      await this.clickButton('[type="submit"]');
    } catch (error) {
      await this.loadJqueryIntoPage();
      await this.page.evaluate(() => {
        $("button:contains(Add)").click();
      });
      await this.sleep(1000);
      // Input address details
      await this.insertValue('[name="firstName"]', this.orderInfo.firstName);
      await this.insertValue('[name="lastName"]', this.orderInfo.lastName);
      await this.insertValue("#ld_select_6", this.orderInfo.phoneNumber);
      await this.insertValue("#ld_select_5", this.orderInfo.zipCode);
      await this.insertValue("#addressLineOne", this.orderInfo.addressOne);
      await this.insertValue("#ld_select_2", this.orderInfo.addressTwo);
      await this.insertValue("#ld_select_3", this.orderInfo.city);
      await this.insertValue("#ld_select_4", this.orderInfo.state);
      await this.clickButton('[id="isDefault"]');
      await this.clickButton('[type="submit"]');
    }
    LOGGER.info("Address successfully inserted.");
  }

  async manageRegistry() {
    await this.openLink("https://www.walmart.com/my-registries");
    await this.sleep(2000);
    await this.page.evaluate(() => {
      $("button:contains(Create a registry)").click();
    });
    await this.sleep(2000);
    await this.clickButton(
      '[aria-label="Event, Customize a registry for any occasion"]'
    );
    await this.waitForLoadingElement('[name="registryName"]');
    await this.insertValue("#ld_ui_textfield_0", this.orderInfo.lastName);
    await this.clickButton('[form="create-registry-form"]');
    await this.waitForLoadingElement("#ld_ui_textfield_1");
    const scheduleDate = scheduleDate();
    await this.insertValue("#ld_ui_textfield_1", scheduleDate); // Set the schedule date.
    await this.clickButton('[form="create-registry-form"]');
    await this.waitForLoadingElement("#ld_radio_0");
    await this.clickButton("#ld_radio_0"); // Select the 1st radio for address.
    await this.sleep(2000);
    await this.clickButton('[form="create-registry-form"]'); // Click continue button.
    await this.waitForLoadingElement("#ld_radio_2"); // Wait for private mode radio
    await this.clickButton("#ld_radio_2");
    await this.page.evaluate(() => {
      $("button:contains(Create registry)").click(); // Click create registry button.
    });
    LOGGER.info("Successfully Managed.");
  }

  async addItemToRegistry(itemNumber) {
    const itemLink = `http://www.walmart.com/ip/${itemNumber}?selected=true`;
    await this.openNewPage();
    await this.openLink(itemLink);
    await this.page.waitForXPath('//*[contains(text(), "Add to registry")]', {
      timeout: 10000,
    });
    await this.page.evaluate(() => {
      $("button:contains(Add to registry)").click();
    });
    await this.page.waitForXPath('//*[contains(text(), "Save")]');
    await this.page.evaluate(() => {
      $("button:contains(Save)").click();
    });
    LOGGER.info("Successfully Added.");
  }

  async getRegistryLink() {
    await this.loadJqueryIntoPage();
    await this.sleep(2000);
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

  async processOrderWithExtraItem() {
    await this.luminatiProxyManager("ON", [
      this.orderInfo.proxyIp,
      this.orderInfo.proxyPort,
    ]);
    await this.initPuppeteer();
    await this.openSignInPage();

    try {
      await this.signInWalmart(this.orderInfo.email);
      const captchaDetected = await this.resolveCaptcha();
      if (captchaDetected) {
        LOGGER.error("Captcha detected.");
        await this.clearSiteSettings();
        await this.closeBrowser();
        return;
      }
      LOGGER.info("Sign In Success. Registering...");
      if (process.env.TEST_MODE !== "true") {
        await api.putInProcessingFlag(this.orderInfo.id);
      }
      await this.luminatiProxyManager("OFF");
      //////////////////////////////////////////////////////
      await this.navigateToAddress();
      await this.addAddress();
      await this.manageRegistry();
      await this.addItemToRegistry(this.orderInfo.primaryItem);
      await this.addItemToRegistry(this.orderInfo.extraItem);
      const pages = await this.browser.pages();
      const registerPage = pages[pages.length - 3];
      await registerPage.bringToFront();
      this.page = registerPage;
      const registryLink = await this.getRegistryLink();
      LOGGER.info("Registry Link: " + registryLink);
      await api.addRegistryLink(this.orderInfo.id, registryLink);
    } catch (error) {
      LOGGER.error(error);
      await this.sleep(10000000);
    }
  }
}

module.exports = WalmartRegistry;
