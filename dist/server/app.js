"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koa2SwaggerUi = _interopRequireDefault(require("koa2-swagger-ui"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _koaCookie = _interopRequireDefault(require("koa-cookie"));

var _koaHelmet = _interopRequireDefault(require("koa-helmet"));

var _cors = _interopRequireDefault(require("@koa/cors"));

var _koaJson = _interopRequireDefault(require("koa-json"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

var _path = _interopRequireDefault(require("path"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _koa2HistoryApiFallback = _interopRequireDefault(require("koa2-history-api-fallback"));

var _koa = _interopRequireDefault(require("koa"));

require("./db/index");

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var whitelistOfOriginsCors = ['http://nit.ru', 'https://nit.ru', 'http://localhost:3030', 'http://localhost:3031'];

if (process.env.WEBLINK_FOR_CORS) {
  whitelistOfOriginsCors.push(process.env.WEBLINK_FOR_CORS);
}

function checkOriginAgainstWhitelist(ctx) {
  var requestOrigin = ctx.accept.headers.origin;

  if (!whitelistOfOriginsCors.includes(requestOrigin)) {
    return ctx.throw(403, "\uD83D\uDE48 ".concat(requestOrigin, " is not a valid origin"));
  }

  return requestOrigin;
}

var corsOptions = {
  origin: checkOriginAgainstWhitelist,
  credentials: true
};
var app = new _koa.default();
app.use(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(ctx, next) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return next();

          case 3:
            _context.next = 8;
            break;

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);

            if (_context.t0.status === 401) {
              ctx.status = 401;
              ctx.body = {
                success: false,
                token: null,
                info: 'Protected resource, use Authorization header to get access'
              };
            } else {
              ctx.status = _context.t0.status || 500;
              ctx.body = _context.t0.message;
              ctx.app.emit('error', _context.t0, ctx);
            }

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());
app.use((0, _koaLogger.default)());
app.use((0, _koaBodyparser.default)()); // ctx.request.body;

app.use((0, _koaCookie.default)()); // ctx.cookie

app.use((0, _koaHelmet.default)());
app.use((0, _cors.default)(corsOptions));
app.use((0, _koaJson.default)());
app.on('error', function (err) {
  console.log('server error', err);
}); // SWAGGER

if (process.env.NODE_ENV === 'development') {
  (0, _koa2SwaggerUi.default)({
    routePrefix: '/swagger' // host at /swagger instead of default /docs

    /*
    swaggerOptions: {
      url: 'http://petstore.swagger.io/v2/swagger.json', // example path to json
    },
    */

  });
}

app.use(_routes.default);
app.use((0, _koa2HistoryApiFallback.default)());
app.use((0, _koaStatic.default)(_path.default.resolve('dist/front')));
console.log('end');
var _default = app;
exports.default = _default;