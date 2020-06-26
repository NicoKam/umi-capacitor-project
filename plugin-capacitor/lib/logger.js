"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Logger = void 0;

var _chalk = _interopRequireDefault(require("chalk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var argv = require('minimist')(process.argv.slice(2));

var LoggerLevel;

(function (LoggerLevel) {
  LoggerLevel[LoggerLevel["VERBOSE"] = 0] = "VERBOSE";
  LoggerLevel[LoggerLevel["INFO"] = 1] = "INFO";
  LoggerLevel[LoggerLevel["ERROR"] = 2] = "ERROR";
})(LoggerLevel || (LoggerLevel = {}));

var Logger = function Logger() {
  var _this = this;

  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Logger);

  this.getPrefix = function () {
    if (_this.prefix) {
      return "[".concat(_this.prefix, "] ");
    }

    return '';
  };

  this.debug = function (msg) {
    if (_this.level <= LoggerLevel.VERBOSE) {
      console.log(_chalk["default"].gray(_this.getPrefix() + msg));
    }
  };

  this.info = function (msg) {
    if (_this.level <= LoggerLevel.INFO) {
      console.log(_this.getPrefix() + msg);
    }
  };

  this.error = function (msg) {
    if (_this.level <= LoggerLevel.ERROR) {
      console.log(_chalk["default"].red(_this.getPrefix() + msg));
    }
  };

  var _props$level = props.level,
      level = _props$level === void 0 ? LoggerLevel.INFO : _props$level,
      _props$prefix = props.prefix,
      prefix = _props$prefix === void 0 ? '' : _props$prefix;
  this.level = level;
  this.prefix = prefix;
};

exports.Logger = Logger;
var level = LoggerLevel.INFO;

if (argv.verbose) {
  level = LoggerLevel.VERBOSE;
}

var _default = new Logger({
  level: level,
  prefix: 'umi-plugin-capacitor'
});

exports["default"] = _default;