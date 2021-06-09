const axios = require("axios");
var btoa = require("btoa");

class API_MANAGER {
  constructor() {
    this.username = "buybot";
    this.password = "forte1long";
    this.headers = {
      Authorization:
        "Basic " +
        btoa(unescape(encodeURIComponent(this.username + ":" + this.password))),
    };
  }

  async sendTotal(totalPrice, orderId) {
    const api = `http://admin.stlpro.com/v2/ds_order/${orderId}/`;
    const body = { supplier_site_total: totalPrice };
    try {
      const response = await axios.patch(api, body, { headers: this.headers });
      const data = response.data;
      console.log("Successfully updated the total price in db");
    } catch (error) {
      console.log(error);
    }
  }

  async sendCurrentGiftCard(cardNumber, amount, orderId) {
    const api = `http://admin.stlpro.com/v2/ds_order/${orderId}/update_gift_card_usage/`;
    const body = {
      gift_cards: [
        {
          card_number: cardNumber,
          amount: amount,
        },
      ],
    };
    console.log(body);
    try {
      const response = await axios.patch(api, body, { headers: this.headers });
      const data = response.data;
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  async getGiftCardByAPI(orderId) {
    const api = `http://admin.stlpro.com/v2/ds_order/${orderId}/next_gift_card`;
    const body = {};
    try {
      const response = await axios.patch(api, body, { headers: this.headers });
      const data = response.data;
      cardInfo = {};
      cardInfo.cardNumber = data.gift_card.split(",")[0];
      cardInfo.pinCode = data.gift_card.split(",")[1];
      console.log("Get gift card using api...");
      return cardInfo;
    } catch (error) {
      console.log("Error while fetching ");
    }
  }
}

module.exports = API_MANAGER;
