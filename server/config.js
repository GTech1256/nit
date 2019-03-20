const path = require('path');

require('dotenv').config({
  silent: process.env.NODE_ENV === 'production',
  path: path.join(__dirname, '../.env'),
});
