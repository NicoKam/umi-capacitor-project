"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.start = exports.getActiveDevice = exports.build = void 0;

var _path = require("path");

var _Adb = _interopRequireDefault(require("./cordova-android/Adb"));

var _emulator = require("./cordova-android/emulator");

var _logger = _interopRequireDefault(require("./logger"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

var build = function build() {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var gradleCmd, args;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            gradleCmd = (0, _path.resolve)(root, './android/gradlew');
            args = ['assembleDebug', '-b', (0, _path.resolve)(root, './android/build.gradle')];
            _context.next = 4;
            return (0, _utils.spawn)(gradleCmd, args);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
};

exports.build = build;

var getActiveDevice = function getActiveDevice() {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var avd, port, emulatorId, success;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _emulator.bestImage)();

          case 2:
            avd = _context2.sent;

            if (avd) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", undefined);

          case 5:
            _context2.next = 7;
            return (0, _emulator.getAvailablePort)();

          case 7:
            port = _context2.sent;
            (0, _utils.spawn)('emulator', ['-avd', avd.name, '-port', port], {
              detached: true
            })["catch"](function () {
              _logger["default"].error('Emulator start failed.');

              process.exit(-2);
            });

            _logger["default"].info('Waiting for emulator...');

            _context2.next = 12;
            return (0, _emulator.waitForEmulator)(port);

          case 12:
            emulatorId = _context2.sent;

            if (emulatorId) {
              _context2.next = 15;
              break;
            }

            throw new Error('Emulator start failed.');

          case 15:
            _logger["default"].info("Emulator".concat(emulatorId, " started"));

            _context2.next = 18;
            return (0, _emulator.waitForBoot)(emulatorId);

          case 18:
            success = _context2.sent;

            if (!success) {
              _context2.next = 24;
              break;
            }

            _logger["default"].info('BOOT COMPLETE'); // unlock screen


            _context2.next = 23;
            return _Adb["default"].shell(emulatorId, 'input keyevent 82');

          case 23:
            return _context2.abrupt("return", emulatorId);

          case 24:
            return _context2.abrupt("return", undefined);

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
};

exports.getActiveDevice = getActiveDevice;

var start = function start() {
  var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd();
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var devices, emulatorId, _devices, config;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.t0 = [];
            _context3.t1 = _toConsumableArray;
            _context3.next = 4;
            return _Adb["default"].devices();

          case 4:
            _context3.t2 = _context3.sent;
            _context3.t3 = (0, _context3.t1)(_context3.t2);
            _context3.t4 = _toConsumableArray;
            _context3.next = 9;
            return _Adb["default"].devices({
              emulators: true
            });

          case 9:
            _context3.t5 = _context3.sent;
            _context3.t6 = (0, _context3.t4)(_context3.t5);
            devices = _context3.t0.concat.call(_context3.t0, _context3.t3, _context3.t6);

            if (!(devices.length === 0)) {
              _context3.next = 18;
              break;
            }

            _context3.next = 15;
            return getActiveDevice();

          case 15:
            emulatorId = _context3.sent;
            _context3.next = 20;
            break;

          case 18:
            _devices = _slicedToArray(devices, 1);
            emulatorId = _devices[0];

          case 20:
            if (!(emulatorId == null)) {
              _context3.next = 23;
              break;
            }

            _logger["default"].error('No avaliable target.');

            throw new Error('No avaliable target.');

          case 23:
            _logger["default"].info('Installing app...');

            _context3.next = 26;
            return _Adb["default"].install(emulatorId, (0, _path.resolve)(root, './android/app/build/outputs/apk/debug/app-debug.apk'));

          case 26:
            _logger["default"].info('Install compoleted. Starting App');

            _context3.next = 29;
            return (0, _utils.readFileJson)((0, _path.resolve)(process.cwd(), 'capacitor.config.json'));

          case 29:
            config = _context3.sent;
            _context3.next = 32;
            return _Adb["default"].start(emulatorId, "".concat(config.appId, "/.MainActivity"));

          case 32:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
};

exports.start = start;

function run() {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _logger["default"].info('build project');

            _context4.next = 3;
            return (0, _utils.spawn)((0, _path.resolve)(process.cwd(), 'node_modules/.bin/cap'), ['copy', 'android']);

          case 3:
            _context4.next = 5;
            return build();

          case 5:
            _context4.next = 7;
            return start();

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
}

run();