"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _address = _interopRequireDefault(require("address"));

var _path = require("path");

var _utils = require("./utils");

var _buildAndroid = require("./build-android");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

function changeCapacitorConfig(configPath, url) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var configContent;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.readFileJson)(configPath);

          case 2:
            configContent = _context.sent;
            _context.next = 5;
            return (0, _utils.writeFileJson)(configPath, Object.assign(Object.assign({}, configContent), {
              server: Object.assign(Object.assign({}, configContent.server), {
                url: url
              })
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
}

var _default = function _default(api) {
  var logger = {
    info: function info() {
      var _api$logger;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_api$logger = api.logger).info.apply(_api$logger, ['[umi-plugin-capacitor]'].concat(args));
    },
    log: function log() {
      var _api$logger2;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      (_api$logger2 = api.logger).log.apply(_api$logger2, ['[umi-plugin-capacitor]'].concat(args));
    },
    error: function error() {
      var _api$logger3;

      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      (_api$logger3 = api.logger).error.apply(_api$logger3, ['[umi-plugin-capacitor]'].concat(args));
    }
  };
  api.describe({
    key: 'capacitor',
    config: {
      schema: function schema(joi) {
        return joi.object({});
      }
    }
  });
  /* change default config */

  api.modifyDefaultConfig(function (config) {
    return Object.assign(Object.assign({}, config), {
      outputPath: 'www',
      history: {
        type: 'hash'
      },
      base: './',
      publicPath: './'
    });
  });
  var first = true;
  api.onDevCompileDone(function () {
    return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var _api$args, android, ios, url, _api$config$capacitor, capacitor;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _api$args = api.args, android = _api$args.android, ios = _api$args.ios;

              if (!(!android && !ios)) {
                _context2.next = 3;
                break;
              }

              return _context2.abrupt("return");

            case 3:
              if (!first) {
                _context2.next = 11;
                break;
              }

              first = false;
              url = "http://".concat(_address["default"].ip(), ":").concat(api.getPort());
              logger.info("Setting url(".concat(url, ") to server.url in capacitor.config.json"));
              _context2.next = 9;
              return changeCapacitorConfig((0, _path.resolve)(api.paths.cwd, 'capacitor.config.json'), url);

            case 9:
              _api$config$capacitor = api.config.capacitor, capacitor = _api$config$capacitor === void 0 ? {} : _api$config$capacitor;
              (0, _buildAndroid.run)();

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
  });
};

exports["default"] = _default;