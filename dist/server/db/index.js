"use strict";

require("./event");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose.default.set('debug', process.env.DEBUG);

_mongoose.default.set('useCreateIndex', true);

_mongoose.default.Promise = Promise;

function getUrlForMongooseConnection() {
  var prefixOfENV = process.env.NODE_ENV.toUpperCase();
  var _process = process,
      env = _process.env;
  var authString = process.env.NODE_ENV === 'production' ? "".concat(env["".concat(prefixOfENV, "_DB_USERNAME")], ":").concat(env["".concat(prefixOfENV, "_DB_PASSWORD")], "@") : '';
  return "mongodb://".concat(authString).concat(env["".concat(prefixOfENV, "_DB_HOSTNAME")], ":").concat(env["".concat(prefixOfENV, "_DB_PORT")], "/").concat(env["".concat(prefixOfENV, "_DB_NAME")]);
}

setTimeout(function () {
  _mongoose.default.connect(getUrlForMongooseConnection(), {
    useNewUrlParser: true
  }).then(function () {
    console.log('Database connected');
  }, function () {
    console.error('Connect to database broken');
  });
}, 1000);