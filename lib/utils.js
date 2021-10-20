import moment from "moment";

const parseDSOrderInfo = (data) => {
  const id = data.id;
  const zipCode = data.zip_code;
  const proxyIp = data.ip_supplier.ip;
  const proxyPort = data.ip_supplier.port;
  const email = data.email || data.account_supplier.username;
  const primaryItem = data.items[0].supplier_item_id;
  const primaryItemQty = data.items[0].quantity_ordered;
  const extraItem = data.extra_items[0].item_number;
};

const scheduleDate = () => {
  const now = new Date();
  now.setDate(now.getDate() + 14);
  return moment(new Date(now)).format("MM/DD/YYYY");
};

module.exports = {
  scheduleDate,
  parseDSOrderInfo,
};
