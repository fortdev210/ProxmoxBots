const axios = require("axios");
var btoa = require("btoa");

const LOGGER = require("./logger");
class API_MANAGER {
  constructor() {
    this.username = "buybot";
    this.password = "forte1long";
    this.req = null;

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
      }
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

  async fetchWarehouseItems(flag) {
    const link = `http://admin.stlpro.com/v2/order_item/?supplier=W&flag=${flag}&quantity_ordered=&order_status=New+Order&pii_data=&ship_service_level=&free_delivery=&box_size=&item_variety=warehouse`;
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
      return response.data;
    } catch (error) {
      LOGGER.error("Error while creating ds order");
    }
  }

  async putEmailInPrep(orderItemId, customerEmail) {
    var url = "http://admin.stlpro.com/v1/order_item/" + orderItemId + "/";
    LOGGER.info(`Moving order to Walmart Processing Flag`);
    const data = {
      flag: "Walmart Processing",
      note: "",
      buyer_email_prep: customerEmail,
    };
    try {
      const response = await axios.put(url, data, { headers: this.headers });
      LOGGER.info("Updated order item with buyer email: " + customerEmail);
    } catch (error) {
      LOGGER.error("Error while moving order.");
    }
  }

  async putInProcessingFlag(orderItemId) {
    var url = "http://admin.stlpro.com/v1/order_item/" + orderItemId;
    LOGGER.info(`Moving order to Walmart Processing Flag`);
    const data = { note: "", flag: "Walmart Processing" };
    try {
      const response = await axios.put(url, data, { headers: this.headers });
    } catch (error) {
      LOGGER.error("Error while moving order in processing flag.");
    }
  }

  async putInOOS(orderId) {
    LOGGER.info("Moving order to OOS");
    var url = "http://admin.stlpro.com/v1/ds_order/" + orderId;
    const data = {
      note: "Preprocessed by Walmart Registry Bot",
      flag: "Out Of Stock",
    };
    try {
      const response = await axios.put(url, data, { headers: this.headers });
    } catch (error) {
      LOGGER.error("Error while moving order in putting OOS flag.");
    }
  }

  async removeEmailFromPrep(orderItemId) {
    LOGGER.info("Removing buyer_email_prep...");
    var url = "http://admin.stlpro.com/v1/order_item/" + orderItemId;
    const data = {
      flag: "Walmart Processing",
      note: "",
      buyer_email_prep: null,
    };
    try {
      const response = await axios.put(url, data, { headers: this.headers });
    } catch (error) {
      LOGGER.error("Error while moving order in putting OOS flag.");
    }
  }

  async addRegistryLink(orderItemId, registryLink) {
    LOGGER.info("Adding registry link...");
    var url = "https://admin.stlpro.com/v1/order_item/" + orderItemId + "/";
    const data = {
      note: "Preprocessed by Walmart Registry Bot",
      flag: "Walmart Preprocessed",
      shared_registry_link: registryLink,
    };
    try {
      const response = await axios.put(url, data, { headers: this.headers });
      LOGGER.info(
        "Updated the order item with shared registry link." + registryLink
      );
    } catch (error) {
      LOGGER.error("Error while adding registry link to order.", error);
    }
  }
}

module.exports = API_MANAGER;
