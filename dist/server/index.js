"use strict";

require("@babel/polyfill");

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

var PORT = process.env.PORT;

_app.default.listen(PORT, function () {
  console.log("Koa is listening in ".concat(PORT));
});