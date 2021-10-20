const LOGGER = require("../lib/logger");
const WalmartBase = require("../lib/walmart");

class WalmartRegistry extends WalmartBase {
  constructor(orderInfo) {
    super();
    this.orderInfo = orderInfo;
  }
}

module.exports = WalmartRegistry;
