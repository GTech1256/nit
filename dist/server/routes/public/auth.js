"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _User = _interopRequireDefault(require("../../db/models/User"));

var _authLogic = require("../../utils/authLogic");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var router = new _koaRouter.default();

function isUniqueParamsForUser(_x) {
  return _isUniqueParamsForUser.apply(this, arguments);
}

function _isUniqueParamsForUser() {
  _isUniqueParamsForUser = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(email) {
    var userWithSameParams, returnObject;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _User.default.findOne({
              email: email
            });

          case 2:
            userWithSameParams = _context5.sent;
            returnObject = {
              apiCode: 0,
              text: '',
              unique: true
            };

            if (userWithSameParams) {
              _context5.next = 6;
              break;
            }

            return _context5.abrupt("return", returnObject);

          case 6:
            if (userWithSameParams.email === email) {
              returnObject.apiCode = 3;
              returnObject.text = 'email must be unique';
              returnObject.unique = false;
            }

            return _context5.abrupt("return", returnObject);

          case 8:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _isUniqueParamsForUser.apply(this, arguments);
}

var _default = router.post('/register', function (ctx) {
  ctx.body = JSON.stringify(ctx.request.body);
  ctx.status = 200;
}).post('/login',
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function (_x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()).post('/refresh',
/*#__PURE__*/

/* JoiMiddleware('public_auth_refresh', 'body'), */
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(ctx, next) {
    var refreshToken, user, newRefreshToken, userTokens;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            refreshToken = ctx.request.body.refreshToken;
            _context2.next = 3;
            return _User.default.findOne({
              refreshToken: refreshToken
            });

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 6;
              break;
            }

            return _context2.abrupt("return", ctx.status(403));

          case 6:
            newRefreshToken = (0, _authLogic.getRefreshToken)(user);
            userTokens = user.refreshToken.filter(function (token) {
              return token !== refreshToken;
            });
            userTokens.push(newRefreshToken);
            _context2.next = 11;
            return user.update({
              $set: {
                refreshToken: userTokens
              }
            });

          case 11:
            (0, _authLogic.jwtSign)(user, function (err, token) {
              if (err) throw err;
              ctx.body = {
                apiCode: 0,
                token: token,
                refreshToken: newRefreshToken
              };
            });

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()).post('/signin',
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(ctx, next) {
    var _ctx$request$body, email, password, user, pwdIsValid, refreshToken, token;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _ctx$request$body = ctx.request.body, email = _ctx$request$body.email, password = _ctx$request$body.password;
            _context3.next = 3;
            return _User.default.findOne({
              email: email
            });

          case 3:
            user = _context3.sent;

            if (!(user === null)) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", ctx.throw(400));

          case 6:
            _context3.next = 8;
            return _User.default.checkPassword(password, user.password);

          case 8:
            pwdIsValid = _context3.sent;

            if (pwdIsValid) {
              _context3.next = 11;
              break;
            }

            return _context3.abrupt("return", ctx.throw(400));

          case 11:
            refreshToken = (0, _authLogic.getRefreshToken)(user);
            _context3.next = 14;
            return user.updateOne({
              $push: {
                refreshToken: refreshToken
              }
            });

          case 14:
            token = (0, _authLogic.jwtSign)(user);
            ctx.status = 200;
            ctx.body = {
              apiCode: 0,
              token: token,
              refreshToken: refreshToken
            };
            return _context3.abrupt("return", next);

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}()).post('/signup',
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(ctx) {
    var resultOfUnique, user;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            console.log(1);
            _context4.next = 3;
            return isUniqueParamsForUser(ctx.request.body.email);

          case 3:
            resultOfUnique = _context4.sent;
            console.log(2);

            if (resultOfUnique.unique) {
              _context4.next = 7;
              break;
            }

            return _context4.abrupt("return", ctx.throw(418, {
              message: 'User with this email already exist'
            }));

          case 7:
            _context4.next = 9;
            return _User.default.hashPassword(ctx.request.body.password);

          case 9:
            ctx.request.body.password = _context4.sent;
            _context4.next = 12;
            return new _User.default(ctx.request.body);

          case 12:
            user = _context4.sent;
            _context4.next = 15;
            return user.save();

          case 15:
            ctx.body = {
              success: true
            };
            console.log('out');
            return _context4.abrupt("return", ctx.throw(200));

          case 18:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function (_x8) {
    return _ref4.apply(this, arguments);
  };
}());

exports.default = _default;