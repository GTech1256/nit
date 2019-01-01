"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _public = _interopRequireDefault(require("./public"));

var _private = _interopRequireDefault(require("./private"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _koaRouter.default({
  prefix: '/api'
});
router.use('/public', _public.default.routes());
router.use('/private', _private.default.routes());

var _default = router.routes();

exports.default = _default;