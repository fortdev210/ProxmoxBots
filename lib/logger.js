const SimpleNodeLogger = require("simple-node-logger");
const parentDir = require("path").resolve(__dirname, "..");

opts = {
  logFilePath: `${parentDir}/logs/walmart.log`,
  timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
};
log = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = log;
