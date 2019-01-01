const express = require('express');
const publicAPI = express.Router();
const isNotAuthenticated = require('../../middleware/is-not-authenticated');

publicAPI.use('/signup', isNotAuthenticated, require('./signup'));
publicAPI.use('/login', isNotAuthenticated, require('./login'));
publicAPI.use('/store', require('./store'));
publicAPI.use('/account', require('./account'));
publicAPI.use('/galaxy', require('./galaxy'));
publicAPI.use('/rating', require('./rating'));
publicAPI.use('/auth', require('./auth'));

module.exports = publicAPI;
