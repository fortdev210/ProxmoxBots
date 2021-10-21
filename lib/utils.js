const moment = require("moment");
const cliProgress = require("cli-progress");

const parseDSOrderInfo = (data) => ({
  id: data.id,
  proxyIp: data.ip_supplier.ip,
  proxyPort: data.ip_supplier.port,
  email: data.email || data.account_supplier.username,
  primaryItem: data.items[0].supplier_item_id,
  primaryItemQty: data.items[0].quantity_ordered,
  extraItem: data.extra_items[0].item_number,
  firstName: data.items[0].buyer_info.first_name,
  lastName: data.items[0].buyer_info.last_name,
  addressOne: data.items[0].buyer_info.address1,
  addressTwo: data.items[0].buyer_info.address2,
  city: data.items[0].buyer_info.city,
  state: data.items[0].buyer_info.state,
  zipCode: data.items[0].buyer_info.zipcode,
  phoneNumber: data.items[0].buyer_info.phone_number,
});

const scheduleDate = () => {
  const now = new Date();
  now.setDate(now.getDate() + 14);
  return moment(new Date(now)).format("MM/DD/YYYY");
};

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

module.exports = {
  scheduleDate,
  parseDSOrderInfo,
};
