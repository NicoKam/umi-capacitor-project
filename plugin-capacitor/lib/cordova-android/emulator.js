"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitForBoot = exports.waitForEmulator = exports.bestImage = exports.getAvailablePort = exports.listStarted = exports.listImages = exports.listImagesUsingAndroid = exports.listImagesUsingAvdmanager = void 0;

var _utils = require("../utils");

var _Adb = _interopRequireDefault(require("./Adb"));

var _logger = _interopRequireDefault(require("../logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

var shelljs = require('shelljs');

var _require = require('fs'),
    realpathSync = _require.realpathSync;

var androidVersions = require('android-versions');

var delay = function delay(interval) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, interval);
  });
};

var versionToApiLevel = {
  '4.0': 14,
  '4.0.3': 15,
  4.1: 16,
  4.2: 17,
  4.3: 18,
  4.4: 19,
  '4.4W': 20,
  '5.0': 21,
  5.1: 22,
  '6.0': 23,
  '7.0': 24,
  '7.1.1': 25,
  '8.0': 26
};

function forgivingWhichSync(cmd) {
  try {
    return realpathSync(shelljs.which(cmd));
  } catch (e) {
    return '';
  }
}

var listImagesUsingAvdmanager = function listImagesUsingAvdmanager() {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var output, response, emulatorList, i, imgObj, _response$split, _response$split2, versionString, apiLevel;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _utils.spawn)('avdmanager', ['list', 'avd'], {
              stdio: 'pipe'
            });

          case 2:
            output = _context.sent;
            response = output.split('\n');
            emulatorList = [];

            for (i = 1; i < response.length; i += 1) {
              // To return more detailed information use img_obj
              imgObj = {};

              if (response[i].match(/Name:\s/)) {
                imgObj.name = response[i].split('Name: ')[1].replace('\r', '');

                if (response[i + 1].match(/Device:\s/)) {
                  i += 1;
                  imgObj.device = response[i].split('Device: ')[1].replace('\r', '');
                }

                if (response[i + 1].match(/Path:\s/)) {
                  i += 1;
                  imgObj.path = response[i].split('Path: ')[1].replace('\r', '');
                }

                if (response[i + 1].match(/Target:\s/)) {
                  i += 1;

                  if (response[i + 1].match(/ABI:\s/)) {
                    imgObj.abi = response[i + 1].split('ABI: ')[1].replace('\r', '');
                  } // This next conditional just aims to match the old output of `android list avd`
                  // We do so so that we don't have to change the logic when parsing for the
                  // best emulator target to spawn (see below in `best_image`)
                  // This allows us to transitionally support both `android` and `avdmanager` binaries,
                  // depending on what SDK version the user has


                  if (response[i + 1].match(/Based\son:\s/)) {
                    _response$split = response[i + 1].split('Based on:');
                    _response$split2 = _slicedToArray(_response$split, 2);
                    imgObj.target = _response$split2[1];

                    if (imgObj.target.match(/Tag\/ABI:\s/)) {
                      imgObj.target = imgObj.target.split('Tag/ABI:')[0].replace('\r', '').trim();

                      if (imgObj.target.indexOf('(') > -1) {
                        imgObj.target = imgObj.target.substr(0, imgObj.target.indexOf('(') - 1).trim();
                      }
                    }

                    versionString = imgObj.target.replace(/Android\s+/, '');
                    apiLevel = versionToApiLevel[versionString];

                    if (apiLevel) {
                      imgObj.target += " (API level ".concat(apiLevel, ")");
                    }
                  }
                }

                if (response[i + 1].match(/Skin:\s/)) {
                  i += 1;
                  imgObj.skin = response[i].split('Skin: ')[1].replace('\r', '');
                }

                emulatorList.push(imgObj);
              }
              /* To just return a list of names use this
                      if (response[i].match(/Name:\s/)) {
                          emulator_list.push(response[i].split('Name: ')[1].replace('\r', '');
                      } */

            }

            return _context.abrupt("return", emulatorList);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
};

exports.listImagesUsingAvdmanager = listImagesUsingAvdmanager;

var listImagesUsingAndroid = function listImagesUsingAndroid() {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var output, response, emulatorList, i, imgObj, secondLine;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _utils.spawn)('android', ['list', 'avd'], {
              stdio: 'pipe'
            });

          case 2:
            output = _context2.sent;
            response = output.split('\n');
            emulatorList = [];

            for (i = 1; i < response.length; i += 1) {
              // To return more detailed information use img_obj
              imgObj = {};

              if (response[i].match(/Name:\s/)) {
                imgObj.name = response[i].split('Name: ')[1].replace('\r', '');

                if (response[i + 1].match(/Device:\s/)) {
                  i += 1;
                  imgObj.device = response[i].split('Device: ')[1].replace('\r', '');
                }

                if (response[i + 1].match(/Path:\s/)) {
                  i += 1;
                  imgObj.path = response[i].split('Path: ')[1].replace('\r', '');
                }

                if (response[i + 1].match(/\(API\slevel\s/) || response[i + 2] && response[i + 2].match(/\(API\slevel\s/)) {
                  i += 1;
                  secondLine = response[i + 1].match(/\(API\slevel\s/) ? response[i + 1] : '';
                  imgObj.target = (response[i] + secondLine).split('Target: ')[1].replace('\r', '');
                }

                if (response[i + 1].match(/ABI:\s/)) {
                  i += 1;
                  imgObj.abi = response[i].split('ABI: ')[1].replace('\r', '');
                }

                if (response[i + 1].match(/Skin:\s/)) {
                  i += 1;
                  imgObj.skin = response[i].split('Skin: ')[1].replace('\r', '');
                }

                emulatorList.push(imgObj);
              }
              /* To just return a list of names use this
                    if (response[i].match(/Name:\s/)) {
                        emulator_list.push(response[i].split('Name: ')[1].replace('\r', '');
                    } */

            }

            return _context2.abrupt("return", emulatorList);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
};
/**
 * Returns a Promise for a list of emulator images in the form of objects
 * {
      name   : <emulator_name>,
      device : <device>,
      path   : <path_to_emulator_image>,
      target : <api_target>,
      abi    : <cpu>,
      skin   : <skin>
   }
 */


exports.listImagesUsingAndroid = listImagesUsingAndroid;

var listImages = function listImages() {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var avds;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            avds = [];

            if (!forgivingWhichSync('avdmanager')) {
              _context3.next = 7;
              break;
            }

            _context3.next = 4;
            return listImagesUsingAvdmanager();

          case 4:
            avds = _context3.sent;
            _context3.next = 14;
            break;

          case 7:
            if (!forgivingWhichSync('android')) {
              _context3.next = 13;
              break;
            }

            _context3.next = 10;
            return listImagesUsingAvdmanager();

          case 10:
            avds = _context3.sent;
            _context3.next = 14;
            break;

          case 13:
            return _context3.abrupt("return", Promise.reject(new Error('Could not find either `android` or `avdmanager` on your $PATH! Are you sure the Android SDK is installed and available?')));

          case 14:
            return _context3.abrupt("return", avds.map(function (avd) {
              if (avd.target && avd.target.indexOf('Android API') > -1 && avd.target.indexOf('API level') < 0) {
                var apiLevel = avd.target.match(/\d+/);

                if (apiLevel) {
                  var level = androidVersions.get(apiLevel);

                  if (level) {
                    avd.target = "Android ".concat(level.semver, " (API level ").concat(apiLevel, ")");
                  }
                }
              }

              return avd;
            }));

          case 15:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
};

exports.listImages = listImages;

var listStarted = function listStarted() {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", _Adb["default"].devices({
              emulators: true
            }));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
};

exports.listStarted = listStarted;

var getAvailablePort = function getAvailablePort() {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
    var emulators, p;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return listStarted();

          case 2:
            emulators = _context5.sent;
            p = 5584;

          case 4:
            if (!(p >= 5554)) {
              _context5.next = 11;
              break;
            }

            if (!(emulators.indexOf("emulator-".concat(p)) === -1)) {
              _context5.next = 8;
              break;
            }

            _logger["default"].debug("Found available port: ".concat(p));

            return _context5.abrupt("return", p);

          case 8:
            p -= 2;
            _context5.next = 4;
            break;

          case 11:
            throw new Error('Could not find an available avd port');

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
};

exports.getAvailablePort = getAvailablePort;

var bestImage = function bestImage() {
  return __awaiter(void 0, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
    var images;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return listImages();

          case 2:
            images = _context6.sent;

            if (!(images.length > 0)) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt("return", images[0]);

          case 5:
            return _context6.abrupt("return", undefined);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
};

exports.bestImage = bestImage;

var waitForEmulator = function waitForEmulator(port) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var emulatorId, output;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            emulatorId = "emulator-".concat(port);
            _context7.prev = 1;
            _context7.next = 4;
            return _Adb["default"].shell(emulatorId, 'getprop dev.bootcomplete');

          case 4:
            output = _context7.sent;

            if (!(output.indexOf('1') >= 0)) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt("return", emulatorId);

          case 7:
            _context7.next = 9;
            return delay(1000);

          case 9:
            return _context7.abrupt("return", waitForEmulator(port));

          case 12:
            _context7.prev = 12;
            _context7.t0 = _context7["catch"](1);

            _logger["default"].error(_context7.t0.message);

            if (!(_context7.t0 && _context7.t0.message && _context7.t0.message.indexOf('not found') > -1 || _context7.t0.message.indexOf('device offline') > -1 || _context7.t0.message.indexOf('device still connecting') > -1 || _context7.t0.message.indexOf('device still authorizing') > -1)) {
              _context7.next = 19;
              break;
            }

            _context7.next = 18;
            return delay(1000);

          case 18:
            return _context7.abrupt("return", waitForEmulator(port));

          case 19:
            throw _context7.t0;

          case 20:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 12]]);
  }));
};

exports.waitForEmulator = waitForEmulator;

var waitForBoot = function waitForBoot(emulatorId) {
  var timeRemaining = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
    var output;
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return _Adb["default"].shell(emulatorId, 'ps');

          case 2:
            output = _context8.sent;

            if (!output.match(/android\.process\.acore/)) {
              _context8.next = 5;
              break;
            }

            return _context8.abrupt("return", true);

          case 5:
            if (!(timeRemaining === 0)) {
              _context8.next = 7;
              break;
            }

            return _context8.abrupt("return", false);

          case 7:
            process.stdout.write('.');
            return _context8.abrupt("return", new Promise(function (resolve) {
              var interval = Math.min(timeRemaining, 3000);
              setTimeout(function () {
                var updatedTime = timeRemaining >= 0 ? Math.max(timeRemaining - 3000, 0) : timeRemaining;
                resolve(waitForBoot(emulatorId, updatedTime));
              }, interval);
            }));

          case 9:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8);
  }));
};

exports.waitForBoot = waitForBoot;