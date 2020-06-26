"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readFileJson = readFileJson;
exports.writeFileJson = writeFileJson;
exports.spawn = void 0;

var _crossSpawn = _interopRequireDefault(require("cross-spawn"));

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

var _logger = _interopRequireDefault(require("./logger"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var cwd = process.cwd();

var spawn = function spawn(command, args, options) {
  return new Promise(function (r, reject) {
    var _a, _b;

    _logger["default"].debug("Running cmd: ".concat([command].concat(_toConsumableArray(args || [])).join(' ')));

    var ps = (0, _crossSpawn["default"])(command, args, Object.assign({
      cwd: cwd,
      stdio: 'inherit'
    }, options));
    var stdout = ''; // eslint-disable-next-line no-unused-expressions

    (_a = ps.stdout) === null || _a === void 0 ? void 0 : _a.on('data', function (chunk) {
      stdout += chunk;
    });
    var stderr = ''; // eslint-disable-next-line no-unused-expressions

    (_b = ps.stderr) === null || _b === void 0 ? void 0 : _b.on('data', function (chunk) {
      stderr += chunk;
    });
    ps.on('close', function (code) {
      if (code !== 0) {
        var errMsg = "Execute error(".concat(code, "): [").concat([command].concat(_toConsumableArray(args || [])).join(' '), "]");

        _logger["default"].debug("".concat(errMsg, " ").concat(stderr));

        reject(new Error(stderr));
        return;
      }

      r(stdout);
    });
  });
};

exports.spawn = spawn;
var readFile = (0, _util.promisify)(_fs["default"].readFile);
var writeFile = (0, _util.promisify)(_fs["default"].writeFile); // const exists = promisify(fs.exists);

function readFileJson(path) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var buffer, json;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return readFile(path);

          case 3:
            buffer = _context.sent;
            json = JSON.parse(buffer.toString());
            return _context.abrupt("return", json);

          case 8:
            _context.prev = 8;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", undefined);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 8]]);
  }));
}

function writeFileJson(path, json, options) {
  return __awaiter(this, void 0, void 0, /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return writeFile(path, JSON.stringify(json, null, '  '), options);

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
}