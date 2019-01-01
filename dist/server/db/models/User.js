"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var userSchema = new _mongoose.default.Schema({
  firstName: String,
  lastName: String,
  subName: String,
  birth_at: Date,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  refreshToken: [String]
}, {
  timestamps: true
});

userSchema.statics.hashPassword =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(inputPassword) {
    var salt;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _bcryptjs.default.genSalt(10);

          case 3:
            salt = _context.sent;
            _context.next = 6;
            return _bcryptjs.default.hash(inputPassword, salt);

          case 6:
            return _context.abrupt("return", _context.sent);

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](0);
            throw new Error("Password hashing failed ".concat(_context.t0));

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

userSchema.statics.checkPassword =
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(inputPassword, hashedPassword) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (inputPassword) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", false);

          case 2:
            _context2.prev = 2;
            _context2.next = 5;
            return _bcryptjs.default.compare(inputPassword, hashedPassword);

          case 5:
            return _context2.abrupt("return", _context2.sent);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](2);
            return _context2.abrupt("return", _context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 8]]);
  }));

  return function (_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

var _default = _mongoose.default.model('User', userSchema);

exports.default = _default;