const path = require('path');

const isProd = process.env.NODE_ENV === 'production';
const pathToEnv = path.join(__dirname, isProd ? '../' : '', '../.env');
console.log(pathToEnv);
require('dotenv').config({
  silent: isProd,
  path: pathToEnv,
});
