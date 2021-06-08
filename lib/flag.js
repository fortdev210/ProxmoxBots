var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require("btoa");

class Flag_Order {
  constructor(currentOrder) {
    this.username = "buybot";
    this.password = "forte1long";
    this.req = null;
    this.currentOrder = currentOrder;
  }

  async setRequestInstance() {
    var url =
      "http://admin.stlpro.com/v1/order_item/" + this.currentOrder + "/";
    var req = new XMLHttpRequest();
    req.open("PUT", url, true);
    req.setRequestHeader(
      "Authorization",
      "Basic " +
        btoa(unescape(encodeURIComponent(this.username + ":" + this.password)))
    );
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.withCredentials = true;
    this.req = req;
  }

  async putEmailInPrep(customerEmail) {
    console.log(`Moving order to Walmart Processing Flag`);
    await this.setRequestInstance();
    this.req.send(
      JSON.stringify({
        flag: "Walmart Processing",
        note: "",
        buyer_email_prep: customerEmail,
      })
    );
  }

  async putInProcessingFlag() {
    await this.setRequestInstance();
    this.req.send(JSON.stringify({ note: "", flag: "Walmart Processing" }));
  }

  async putInOOS() {
    console.log("Moving order to OOS");
    await this.setRequestInstance();
    this.req.send(
      JSON.stringify({
        note: "Preprocessed by Walmart Registry Bot",
        flag: "Out Of Stock",
      })
    );
  }

  async removeEmailFromPrep() {
    console.log("Removing buyer_email_prep...");
    await this.setRequestInstance();
    this.req.send(
      JSON.stringify({
        flag: "Walmart Processing",
        note: "",
        buyer_email_prep: null,
      })
    );
  }

  async putInRebuyProcessingFlag() {
    await this.setRequestInstance();
    console.log("Moving order to Walmart Processing Rebuy Flag");
    this.req.send(
      JSON.stringify({ note: "", flag: "Walmart Processing Rebuy" })
    );
  }

  async putInBuyer1Flag() {
    await this.setRequestInstance();
    if (require("os").hostname().indexOf("PRIO") > -1) {
      this.req.send(
        JSON.stringify({
          note: "Preprocessed by Walmart Registry Bot",
          flag: "Walmart PP1 Priority",
        })
      );
    } else if (require("os").hostname().indexOf("REBUY01") > -1) {
      this.req.send(
        JSON.stringify({
          note: "Preprocessed by Walmart Registry Bot",
          flag: "Rebuy PP1",
        })
      );
    } else if (require("os").hostname().indexOf("REBUY02") > -1) {
      this.req.send(
        JSON.stringify({
          note: "Preprocessed by Walmart Registry Bot",
          flag: "Rebuy PP2",
        })
      );
    } else {
      this.req.send(
        JSON.stringify({
          note: "Preprocessed by Walmart Registry Bot",
          flag: "Walmart Preprocessed",
        })
      );
    }
  }

  async init() {
    await this.setRequestInstance();
  }
}

module.exports = Flag_Order;
