"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPayloadForAuth = getPayloadForAuth;
exports.getRefreshToken = getRefreshToken;
exports.jwtSign = jwtSign;

var _v = _interopRequireDefault(require("uuid/v4"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPayloadForAuth(user) {
  if (!user) {
    throw new Error('parameters not setted');
  }

  return {
    email: user.email // username: user.username, // fisrt, last, sur
    // roles: user.roles,

  };
}

function getRefreshToken(user) {
  if (!user) {
    throw new Error('parameters not setted');
  }

  return "".concat((0, _v.default)(), "_").concat(user.email);
}

function jwtSign(user) {
  var payload = getPayloadForAuth(user);
  var opts = {
    expiresIn: '10m'
  };
  return _jsonwebtoken.default.sign(payload, process.env.SECRET_OR_KEY, opts);
}