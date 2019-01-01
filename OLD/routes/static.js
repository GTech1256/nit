// This file supposed to comprise only non-api routes

const config = require('../config/appconfig').default;
const express = require('express');
const index = express.Router();
const staticData = [
  //'signup',
  //'login',
  //'account',
  //'store',
  //'info',
  //'restore',
  // 'sale',
  'product',
  'game',
];

index.get('/', (req, res) => {
  if (!req.user && req.query.ref) {
    res.cookie('ref', req.query.ref, {
      maxAge: config.refCookie.exp
    });
  }

  res.render('index');
});

index.get('/:staticRequest', (req, res, next) => {
  if (staticData.includes(req.params.staticRequest)) {
    res.render(req.params.staticRequest);
  } else {
    return next();
  }
});

module.exports = index;
