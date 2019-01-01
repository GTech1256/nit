"use strict";

const config = require('../../config/appconfig').default;
const express = require('express');
const rating = express.Router();
const User = require('../../utils/models/user').default;
const Planet = require('../../utils/models/planet').default;
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const fs = require('fs');
const path = require('path');

rating.get('/', async(req, res, next) => {
  try {
    fs.readFile(path.join(__dirname, '../../temporaryFiles/ratingOfUsersByPlanetPopulation.json'), 'utf-8', (err, rating) => {
      if (err) return next(err);
      res.send(rating);
    })
  } catch (e) {
    next(e);
  }
});

module.exports = rating;
