"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _logger = _interopRequireDefault(require("../logger"));

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* copy from cordova-android */

/**
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/
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

var os = require('os');

function isDevice(line) {
  return line.match(/\w+\tdevice/) && !line.match(/emulator/);
}

function isEmulator(line) {
  return line.match(/device/) && line.match(/emulator/);
}

var Adb = {
  /**
   * Lists available/connected devices and emulators
   *
   * @param   {Object}   opts            Various options
   * @param   {Boolean}  opts.emulators  Specifies whether this method returns
   *   emulators only
   *
   * @return  {Promise<String[]>}        list of available/connected
   *   devices/emulators
   */
  devices: function devices() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var output;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _utils.spawn)('adb', ['devices'], {
                cwd: os.tmpdir(),
                stdio: 'pipe'
              });

            case 2:
              output = _context.sent;
              return _context.abrupt("return", output.split('\n').filter(function (line) {
                // Filter out either real devices or emulators, depending on options
                return line && opts && opts.emulators ? isEmulator(line) : isDevice(line);
              }).map(function (line) {
                return line.replace(/\tdevice/, '').replace('\r', '');
              }));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
  },
  install: function install(target, packagePath) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var args, output, errMsg;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _logger["default"].debug("Installing apk ".concat(packagePath, " on target ").concat(target, "..."));

              args = ['-s', target, 'install'];
              if (opts && opts.replace) args.push('-r');
              _context2.next = 5;
              return (0, _utils.spawn)('adb', args.concat(packagePath), {
                cwd: os.tmpdir(),
                stdio: 'pipe'
              });

            case 5:
              output = _context2.sent;

              if (!output.match(/Failure/)) {
                _context2.next = 10;
                break;
              }

              if (output.match(/INSTALL_PARSE_FAILED_NO_CERTIFICATES/)) {
                output += '\n\n' + "Sign the build using '-- --keystore' or '--buildConfig'" + ' or sign and deploy the unsigned apk manually using Android tools.';
              } else if (output.match(/INSTALL_FAILED_VERSION_DOWNGRADE/)) {
                output += '\n\n' + "You're trying to install apk with a lower versionCode that is already installed." + '\nEither uninstall an app or increment the versionCode.';
              }

              errMsg = "Failed to install apk to device: ".concat(output);
              throw new Error(errMsg);

            case 10:
              return _context2.abrupt("return", output);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
  },
  uninstall: function uninstall(target, packageId) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _logger["default"].debug("Uninstalling package ".concat(packageId, " from target:string ").concat(target, "..."));

              return _context3.abrupt("return", (0, _utils.spawn)('adb', ['-s', target, 'uninstall', packageId], {
                cwd: os.tmpdir(),
                stdio: 'pipe'
              }));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
  },
  shell: function shell(target, shellCommand) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var args, cmd;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _logger["default"].debug("Running adb shell command \"".concat(shellCommand, "\" on target ").concat(target, "..."));

              args = ['-s', target, 'shell'];
              cmd = shellCommand.split(/\s+/);
              return _context4.abrupt("return", (0, _utils.spawn)('adb', args.concat(cmd), {
                cwd: os.tmpdir(),
                stdio: 'pipe'
              })["catch"](function (error) {
                var errMsg = "Failed to execute shell command \"".concat(shellCommand, "\"\" on device: ").concat(error);

                _logger["default"].debug(errMsg);

                return error.message;
              }));

            case 4:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
  },
  start: function start(target, activityName) {
    return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _logger["default"].debug("Starting application \"".concat(activityName, "\" on target ").concat(target, "..."));

              return _context5.abrupt("return", Adb.shell(target, "am start -W -a android.intent.action.MAIN -n".concat(activityName))["catch"](function (output) {
                var errMsg = "Failed to start application \"".concat(activityName, "\"\" on device: ").concat(output);
                throw new Error(errMsg);
              }));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
  }
};
var _default = Adb;
exports["default"] = _default;