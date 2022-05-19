import moment from "moment";
import winston from "winston";

// import config from '../config/config.json';
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("../config/config.json");

const cusLevels = {
  levels: {
    none: 0,
    info: 10,
    warn: 20,
    error: 30,
    debug: 40,
    verb: 50
  },
  colors: {
    info: "black",
    warn: "yellow",
    error: "red"
  }
};

winston.addColors(cusLevels.colors);

/**
 * Set Logging Formatter
 *
 * @param args
 * @returns {string}
 */
function formatter(args) {
  const datetime = moment().format("YYYY-MM-DD HH:mm:ss.SSSZ");
  const level = `${args.level} `;
  const logLevel = level.slice(0, 4).toLocaleUpperCase();
  return `[${datetime}]|[${logLevel}]|${args.message}`;
}

// Create winston.logger instance for wholesale reconfigure
const logger = winston.createLogger({
  // levels 는 config 파일 선택
  levels: cusLevels.levels,
  // Transports Log
  transports: [
    // # Setting Format Console Log
    new winston.transports.Console({
      name: "console",
      level: config.LOG_MODE,
      colorize: true,
      showLevel: true,
      json: false,
      timestamp: true,
      format: winston.format.printf(info => formatter(info))
    })
  ]
});

// Constructor Function
function Hooks(args) {
  if (!(this instanceof Hooks)) {
    return new Hooks(args);
  }

  this.clazz = args;
  return this;
}

Hooks.prototype.log = function log(level, msg, callback) {
  logger.log(level, `[${this.clazz}]${msg}`, callback);
};

Hooks.prototype.info = function info(msg, callback) {
  logger.info(`[${this.clazz}]${msg}`, callback);
};

Hooks.prototype.error = function error(msg, callback) {
  logger.error(`[${this.clazz}]${msg}`, callback);
};

export default Hooks;
