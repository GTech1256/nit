"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _auth = _interopRequireDefault(require("./auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var privateAPI = new _koaRouter.default();
privateAPI.use('/auth', _auth.default.routes());
var _default = privateAPI;
exports.default = _default;