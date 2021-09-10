var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require("btoa");
const PuppeteerBase = require("./puppeeteer");
const constants = require("../constants/warehouse");
require("dotenv").config();
const hostName =
  process.env.TEST_MODE === "true" ? "WM-PREP03" : require("os").hostname();

class STLPRO_MANAGER extends PuppeteerBase {
  constructor(currentOrder) {
    super();
    this.adminLink = "https://admin.stlpro.com/";
    this.paymentLink =
      "http://admin.stlpro.com/admin/products/supplier/W/change/";
    this.username = "buybot";
    this.password = "forte1long";
    this.ordersLink = null;
    this.botNumber =
      process.env.TEST_MODE === "true"
        ? 3
        : parseInt(hostName.replace(/[^0-9]+/g, ""));
    this.currentOrder = currentOrder;
  }

  getWalmartOrdersLink() {
    if (hostName.indexOf("PRIO") > -1) {
      this.ordersLink =
        "http://admin.stlpro.com/products/order_items/new/?supplier=-1&box_size=-1&dummy=None&flag=Walmart+Priority&quantity_ordered=-1&ship_service_level=All&az_account=";
    } else if (hostName.indexOf("REBUY") > -1) {
      this.ordersLink =
        "http://admin.stlpro.com/products/order_items/new/?supplier=W&box_size=-1&dummy=None&flag=Walmart+Rebuy" +
        this.botNumber +
        "&quantity_ordered=-1&ship_service_level=All&free_delivery=-1&az_account=";
      if (this.botNumber === 1) {
        this.username = "buybot-rebuy";
      } else {
        this.username = "buybot-rebuy2";
      }
    } else {
      if (hostName.indexOf("PREP") > -1) {
        if (constants.WAREHOUSE_PREP_BOTS_NUMBERS.includes(this.botNumber)) {
          this.ordersLink =
            "http://admin.stlpro.com/products/warehouse_order_items/new/?supplier=-1&box_size=-1&dummy=None&flag=Walmart+Prep" +
            this.botNumber +
            "&quantity_ordered=-1&ship_service_level=All&free_delivery=-1&az_account=";
        } else {
          this.ordersLink =
            "http://admin.stlpro.com/products/order_items/new/?supplier=-1&box_size=-1&dummy=None&flag=Walmart+Prep" +
            this.botNumber +
            "&quantity_ordered=-1&ship_service_level=All&free_delivery=-1&az_account=";
        }
      } else if (hostName.indexOf("BUY") > -1) {
        this.username = "buybot" + this.botNumber;
        if (constants.WAREHOUSE_BUY_BOTS_NUMBERS.includes(this.botNumber)) {
          this.ordersLink =
            "http://admin.stlpro.com/products/warehouse_order_items/new/?supplier=-1&box_size=-1&dummy=None&flag=Walmart+PP" +
            this.botNumber +
            "&quantity_ordered=-1&ship_service_level=All&free_delivery=-1&az_account=";
        } else {
          this.ordersLink =
            "http://admin.stlpro.com/products/order_items/new/?supplier=-1&box_size=-1&dummy=None&flag=Walmart+PP" +
            this.botNumber +
            "&quantity_ordered=-1&ship_service_level=All&free_delivery=-1&az_account=";
        }
      }
    }
  }

  async signIn() {
    await this.init();
    await this.openLink(this.adminLink);
    await this.insertValue('[name="username"]', this.username);
    await this.insertValue('[name="password"]', this.password);
    await this.clickButton('[value="Log in"]');
  }

  async getOrders() {
    this.getWalmartOrdersLink();
    await this.signIn();
    await this.openLink(this.ordersLink);

    try {
      await this.page.waitForXPath(
        '//*[contains(text(), "There is no matched Item")]',
        { timeout: 1000 }
      );
      console.log("There are no matched items at the moment.");
      await this.closeBrowser();
      return [];
    } catch (error) {}

    let scrapedOrderItemIDs = await this.page.evaluate(() => {
      // Change table header name for Item to something unique
      document.querySelector('th[class="sorting"]').innerText = "ItemScrapeMe";
      // Grab all table headers and table rows
      var ths = document
        .querySelector('[id="itemsSearch"]')
        .getElementsByTagName("th");
      var trs = document
        .querySelector('[id="itemsSearch"]')
        .getElementsByTagName("tr");
      // Blank array
      orderItemColumn = [];
      // Loop through each table row under the unique header to find the right info
      for (var i = 0; i < ths.length; i++) {
        if (ths[i].innerHTML.indexOf("ItemScrapeMe") !== -1) {
          if (ths[i].innerHTML == "i am gay") {
            // do nothing
          } else {
            var oicId = i;
            break;
          }
        }
      }
      // Push right info to blank array
      for (var i = 0; i < trs.length; i++) {
        orderItemColumn.push(trs[i].children[oicId]);
      }
      scrapedOrderItemIDs = [];
      for (var i = 0; i < orderItemColumn.length; i++) {
        if (i < 2) {
          // fuck off
        } else {
          scrapedOrderItemIDs.push(orderItemColumn[i].innerText);
        }
      }
      return scrapedOrderItemIDs;
    });
    return scrapedOrderItemIDs;
  }

  async getOrderDetails() {
    this.getWalmartOrdersLink();
    await this.signIn();
    const dsLink = "http://admin.stlpro.com/products/getdsorders/";
    await this.openLink(dsLink);
    await this.waitForLoadingElement('[id="orders"]');
    await this.page.evaluate(() => {
      return (document.querySelector('[name="object_type"]').selectedIndex = 1);
    });
    await this.insertValue('[id="orders"]', this.currentOrder);
    await this.clickButton('[value="Submit"]');
    await this.waitForLoadingElement('[id="updateAllItemsForm"]', 30000);

    await this.openNewPage();
    await this.openLink("http://admin.stlpro.com/products/getdsforchrome/");
    await this.waitForLoadingElement("#picked_ip");

    const proxyInfo = await this.page.evaluate(() => {
      var pulledIP_webF = document.getElementById("picked_ip").innerText;
      var pulledPort_webF = document.getElementById("picked_port").innerText;
      return [pulledIP_webF, pulledPort_webF];
    });
    ///--- Get the order id ----///
    const orderId = await this.page.evaluate(() => {
      return document.querySelector('[id="ds_order_id"]').innerText;
    });
    let dropshipHelper = await this.page.evaluate(() => {
      var customerInfo = document
        .querySelector('[id*="for_button_"]')
        .innerHTML.replace("&amp;", "&");
      try {
        var customerEmail = document.querySelector(
          '[id="picked_username"]'
        ).innerHTML;
      } catch (error) {
        var customerEmail = document.querySelector(
          '[id="picked_email"]'
        ).innerHTML;
      }

      if (
        document
          .querySelectorAll('[class="slimcell"]')[11]
          .querySelector("a") !== null
      ) {
        var freeshipItem = document
          .querySelectorAll('[class="slimcell"]')[11]
          .querySelector("a").innerHTML;
      } else {
        var freeshipItem = "N/A";
      }
      if (
        document.querySelectorAll('[class="slimcell"]')[7].innerHTML.trim() ==
        "1"
      ) {
        var primaryItemQty = "1";
      } else {
        var primaryItemQty = document
          .querySelectorAll('[class="slimcell"]')[7]
          .querySelector("em").innerHTML;
      }
      var price = parseFloat(
        document.querySelectorAll(".slimcell")[8].innerText
      );
      return [customerInfo, customerEmail, freeshipItem, primaryItemQty, price];
    });
    let customerInfo = dropshipHelper[0].split("|");

    if (customerInfo[7].length > 5) {
      customerInfo[7] = customerInfo[7].substring(0, 5);
    }
    customerInfo[8] = customerInfo[8].replace(/\D/g, "");
    if (!customerInfo[8]) {
      customerInfo[8] = "3146981997";
    } else if (customerInfo[8].length < 10) {
      customerInfo[8] = "3146981997";
    } else if (customerInfo[8].match(/(.)\1{2,}/) !== null) {
      customerInfo[8] = "3146981997";
    } else if (customerInfo[8] == "4158519136") {
      customerInfo[8] = "3146981997";
    }
    customerInfo[9] = this.getCorrectState(customerInfo[9]);
    let customerInfoClean = {};
    customerInfoClean.supplier = customerInfo[0];
    customerInfoClean.primaryItem = customerInfo[1];
    customerInfoClean.extraItem = dropshipHelper[2];
    customerInfoClean.orderId = orderId;
    if (hostName.indexOf("REBUY") > -1) {
      customerInfoClean.firstName = customerInfo[3].replace(/[^A-Za-z]+/g, "");
      customerInfoClean.lastName = customerInfo[2].replace(/[^A-Za-z]+/g, "");
    } else {
      customerInfoClean.firstName = customerInfo[2].replace(/[^A-Za-z]+/g, "");
      customerInfoClean.lastName = customerInfo[3].replace(/[^A-Za-z]+/g, "");
    }
    customerInfoClean.addressOne = customerInfo[4].replace(
      /[&\/\\_+():$"~%*?<>®-]/g,
      ""
    );
    customerInfoClean.addressTwo = customerInfo[5].replace(
      /[&\/\\_+():$"~%*?<>®-]/g,
      ""
    );
    customerInfoClean.city = customerInfo[6];
    customerInfoClean.zipCode = customerInfo[7];
    customerInfoClean.phoneNum = customerInfo[8];
    customerInfoClean.state = customerInfo[9];
    customerInfoClean.email = dropshipHelper[1];
    customerInfoClean.qty = dropshipHelper[3];
    customerInfoClean.price = dropshipHelper[4];
    customerInfoClean.ip = proxyInfo[0];
    customerInfoClean.port = proxyInfo[1];
    customerInfo = customerInfoClean;
    customerInfoClean = null;
    if (
      isNaN(customerInfo.firstName) == false &&
      isNaN(customerInfo.lastName) == false
    ) {
      customerInfo.firstName == "Customer";
      customerInfo.lastName == "Customer";
    }

    if (isNaN(customerInfo.firstName) == false) {
      if (isNaN(customerInfo.lastName) == true) {
        customerInfo.firstName == customerInfo.lastName;
      }
    } else if (isNaN(customerInfo.lastName) == false) {
      if (isNaN(customerInfo.firstName) == true) {
        customerInfo.lastName == customerInfo.firstName;
      }
    }

    if (customerInfo.firstName !== "" && customerInfo.lastName == "") {
      customerInfo.lastName = customerInfo.firstName;
    } else if (customerInfo.firstName == "" && customerInfo.lastName !== "") {
      customerInfo.firstName = customerInfo.lastName;
    }

    if (customerInfo.phoneNum.length == 11) {
      customerInfo.phoneNum = customerInfo.phoneNum.substr(1, 10);
    }

    if (customerInfo.phoneNum[0] == "0") {
      customerInfo.phoneNum = "314" + customerInfo.phoneNum.substr(3, 10);
    }

    if (customerInfo.addressOne == "" && customerInfo.addressTwo !== "") {
      customerInfo.addressOne = customerInfo.addressTwo;
      customerInfo.addressTwo = "";
    }
    await this.page.close();
    return customerInfo;
  }

  async getPaymentMethods() {
    const link = "http://admin.stlpro.com/admin/products/supplier/W/change/";
    await this.openLink(link);
    await this.waitForLoadingElement("#id_payment_method");
    const option = await this.page.evaluate(() => {
      value = document.querySelector("#id_payment_method").value;
      return document
        .querySelector("#id_payment_method")
        .querySelector(`[value="${value}"]`).innerText;
    });
    await this.page.close();
    return option;
  }
}

module.exports = STLPRO_MANAGER;
