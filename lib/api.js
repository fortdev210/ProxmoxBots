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
      let cardInfo = {};
      cardInfo.cardNumber = data.gift_card.split(",")[0];
      cardInfo.pinCode = data.gift_card.split(",")[1];
      return cardInfo;
    } catch (error) {
      console.log("Error while fetching ", error);
    }
  }

  async getProxyInfo() {
    const proxy_link = 'http://admin.stlpro.com/v2/ip_supplier/?is_potential_banned=false&is_buyproxies_ip=true&supplier=W&limit=100'
    var response = await axios.get(proxy_link, {
      headers: this.headers,
    });
    return response.data.results;
  };

  async getDsOrders(supplier) {
    const getDsOrdersUrl = 'http://admin.stlpro.com/v2/ds_order/scrape_order_status/?supplier_id='
    var response = await axios.get(getDsOrdersUrl + supplier, {
      headers: this.headers,
    });
    return response.data;
  };

  async updateDsOrder(dsOrder, data, supplier) {
    console.log("Update ds order: " + dsOrder.id);
    const updateDsOrderInfoUrl = 'http://admin.stlpro.com/v2/ds_order/'
    const url =
      updateDsOrderInfoUrl +
      dsOrder.id +
      "/update_order_status_scraped_result/";
    try {
      const body = { data: data, confirmed_by: 1, supplier_id:supplier };
      const response = await axios.post(url, body, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.log("Error while updating the orders in db.", error);
    }
  };

  async getDsOrdersExtraItemToCancel(){ 
    let link = 'http://admin.stlpro.com/v2/ds_order/?buyer_name=&ds_status_filter=Purchased+Acknowledged+Confirmed&extra_items=Extra+Item&extra_items_canceled=NOT+canceled&finished=&not_found=&ordering=-ended_at&paid=&started_at_filter=Last+7+days&supplier=W'    
    let orders = [];
    try {
      while (link !== null) {
        const response = await axios.get(link, { headers: this.headers });
        orders = [...orders, ...response.data.results];
        const api = response.data.next;
      }
      return orders;
    } catch (error) {
      console.log("Error while fetching the ds_orders", error);
    }
  }
}

module.exports = API_MANAGER;
