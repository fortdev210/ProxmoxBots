const axios = require("axios");
var btoa = require("btoa");
const cliProgress = require("cli-progress");
const LOGGER = require("./logger");

// create new progress bar
const b1 = new cliProgress.SingleBar({
  format:
    "Fetching the tracking list |" +
    "{bar}" +
    "| {percentage}% || {value}/{total} orders || Speed: {speed}",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

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
      LOGGER.info("Successfully updated the total price in db");
    } catch (error) {
      LOGGER.error(error);
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
      LOGGER.info(data);
    } catch (error) {
      LOGGER.error(error);
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
      LOGGER.error("Error while fetching ", error);
    }
  }

  async getProxyInfo() {
    const proxy_link =
      "http://admin.stlpro.com/v2/ip_supplier/?is_potential_banned=false&is_buyproxies_ip=true&supplier=W&limit=100";
    var response = await axios.get(proxy_link, {
      headers: this.headers,
    });
    return response.data.results;
  }

  async getDsOrders(supplier) {
    const getDsOrdersUrl =
      "http://admin.stlpro.com/v2/ds_order/scrape_order_status/?supplier_id=";
    var response = await axios.get(getDsOrdersUrl + supplier, {
      headers: this.headers,
    });
    return response.data;
  }

  async updateDsOrder(dsOrder, data, supplier) {
    LOGGER.info("Update ds order: " + dsOrder.id);
    const updateDsOrderInfoUrl = "http://admin.stlpro.com/v2/ds_order/";
    const url =
      updateDsOrderInfoUrl +
      dsOrder.id +
      "/update_order_status_scraped_result/";
    try {
      const body = { data: data, confirmed_by: 1, supplier_id: supplier };
      const response = await axios.post(url, body, { headers: this.headers });
      return response.data;
    } catch (error) {
      LOGGER.error("Error while updating the orders in db.", error);
    }
  }

  async getDsOrdersExtraItemToCancel() {
    let api =
      "http://admin.stlpro.com/v2/ds_order/?buyer_name=&ds_status_filter=Purchased+Acknowledged+Confirmed&extra_items=Extra+Item&extra_items_canceled=NOT+canceled&finished=&not_found=&ordering=-ended_at&paid=&started_at_filter=Last+7+days&supplier=W";
    let orders = [];
    try {
      while (api !== null) {
        const response = await axios.get(api, { headers: this.headers });
        orders = [...orders, ...response.data.results];
        api = response.data.next;
      }
      return orders;
    } catch (error) {
      LOGGER.error("Error while fetching the ds_orders", error);
    }
  }

  async getTrackingCodeList(carrier) {
    let api = `http://admin.stlpro.com/v2/shipment/scrape_delivery_status/?shipping_carrier=${carrier}&days=14&limit=25&offset=0`;
    let orders = [];
    try {
      let index = 0;
      while (api !== null) {
        let response = await axios.get(api, { headers: this.headers });
        orders = [...orders, ...response.data.results];
        api = response.data.next;
        index++;
        if (index === 1) {
          b1.start(response.data.count, 0, {
            speed: "N/A",
          });
        }
        if (index > 0) {
          b1.increment();
          b1.update(25 * index);
        }
      }
      b1.stop();
      return orders;
    } catch (error) {
      LOGGER.error("Error while fetching the ds_orders", error);
    }
  }

  async updateDeliveryState(data) {
    const url = `http://admin.stlpro.com/v2/shipment/scrape_delivery_status/`;
    try {
      const response = await axios.post(url, data, { headers: this.headers });
      LOGGER.info(response.data);
    } catch (error) {
      LOGGER.error("Error happened while updating the order status", error);
    }
  }

  async fetchOrderItems(flag) {
    const link = `http://admin.stlpro.com/v2/order_item/?supplier=W&flag=${flag}&quantity_ordered=&order_status=New+Order&pii_data=&ship_service_level=&free_delivery=&az_account=4&box_size=`;
    try {
      const response = await axios.get(link, { headers: this.headers });
      return response.data.results;
    } catch (error) {
      LOGGER.error("Error while fetching order items");
    }
  }

  async createDSOrder(dsOrderItem) {
    const url = "http://admin.stlpro.com/v2/ds_order/";
    const data = {
      order_items: [dsOrderItem],
    };
    try {
      const response = await axios.post(url, data, { headers: this.headers });
      LOGGER.info(response.data);
      return response.data;
    } catch (error) {
      LOGGER.error("Error while creating ds order");
    }
  }
}

module.exports = API_MANAGER;
