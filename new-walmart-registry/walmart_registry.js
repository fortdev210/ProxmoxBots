const LOGGER = require("../lib/logger");
const WalmartBase = require("../lib/walmart");
const { scheduleDate } = require("../lib/utils");

class WalmartRegistry extends WalmartBase {
  constructor(orderInfo) {
    super();
    this.orderInfo = orderInfo;
  }

  async navigateToAddress() {
    await this.openLink("https://www.walmart.com/account/delivery-addresses");
  }

  async addAddress() {
    await this.page.evaluate(() => {
      $("button:contains(+ Add address)").click();
    });
    await this.sleep(1000);
    // Input address details
    await this.insertValue("#ld_select_7", this.orderInfo.firstName);
    await this.insertValue("#ld_select_8", this.orderInfo.lastName);
    await this.insertValue("#ld_select_6", this.orderInfo.phoneNumber);
    await this.insertValue("#ld_select_5", this.orderInfo.zipCode);
    await this.insertValue("#addressLineOne", this.orderInfo.addressOne);
    await this.insertValue("#ld_select_2", this.orderInfo.addressTwo);
    await this.insertValue("#ld_select_3", this.orderInfo.city);
    await this.insertValue("#ld_select_4", this.orderInfo.state);
    await this.clickButton('[id="isDefault"]');
    await this.clickButton('[type="submit"]');
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
  }
}

module.exports = WalmartRegistry;
