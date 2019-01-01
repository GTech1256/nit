const config = require('../../config/appconfig').default;
const express = require('express');
const store = express.Router();
const Planet = require('@utils/models/planet').default;
const log = require('../../utils/logger/logger').default;
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');

// query parameters 'query' and 'page' have to be presented

store.get('/planets/search',
(req, res, next) => {
  req.query.page = parseInt(req.query.page);
  next();
},
JoiMiddleware('public_store_planets_search', 'query'),
async (req, res, next) => {
  try {
    const skip = (req.resultOfJoiValidate.value.page - 1) * config.store.pageSize;
    const planets = await Planet.find({
      'description.name': {
        $regex:  new RegExp(req.resultOfJoiValidate.value.query, 'i')
      }
    })
    .skip(skip);

    const totalCount = planets.length;

    planets.length = planets.length > config.store.pageSize ? config.store.pageSize : planets.length;

    return res.status(200).json({
      planets,
      fee: config.nem.fee,
      totalCount,
      pageLimit: config.store.pageSize,
      page: +req.resultOfJoiValidate.value.page
    });
  } catch (err) {
    next(err);
  }
});

// query might have the following params:
//  'price' - a value in form of <from>-<to> where 'from' and 'to' both are integers (eg price=1-90)
//  'population' - a value in form of <from>-<to> where 'from' and 'to' both are integers (eg population=1500-2000)
//  'sort' - a value in form of <key>-<order> where 'key' must have a value of 'price' or 'population' and
//    'order' must have a value of 'u' or 'd' (eg sort=price-i)
//  'type' - a value in form of <type1>-<type2>-...-<typeN> where each 'type' represents integer key of a type

store.get('/planets/:page',
(req, res, next) => {
   const query = { page: req.params.page };

   if (req.query.price) {
     [query.priceFrom, query.priceTo] = req.query.price.split('-').map(Number);
   };

   if (req.query.population) {
     [query.populationFrom, query.populationTo] = req.query.population.split('-').map(Number);
   };

   if (req.query.sort) {
     const sort = req.query.sort.split('-');

     query.sort = sort[0] === 'price' ? 'status.sale.cost' : 'description.seed';
     query.sortOrder = sort[1] === 'u' ? 1 : -1;

     if (query.sort !== 'status.sale.cost' && query.sort !== 'description.seed') {
       query.sort = false;
     }
   };

   if (req.query.type) {
     query.type = req.query.type.split(',').map(Number);
   };

   req.objectForValidate = query;
   next();
 },
 JoiMiddleware('public_store_planets', 'objectForValidate'),
 async (req, res, next) => {
  try {
    let planets;
    const resultOfJoiValidate = req.resultOfJoiValidate.value;
    const skip = (resultOfJoiValidate.page - 1) * config.store.pageSize;
    const $and = [{ 'description.galaxy': 0 }, { 'status.forSale': true }];

    if (resultOfJoiValidate.priceFrom) {
      $and.push({ 'status.sale.cost': { $gte: resultOfJoiValidate.priceFrom }});
    };

    if (resultOfJoiValidate.priceTo) {
      $and.push({ 'status.sale.cost': { $lte: resultOfJoiValidate.priceTo }});
    };

    if (resultOfJoiValidate.populationFrom) {
      $and.push({ 'description.seed': { $gte: resultOfJoiValidate.populationFrom }});
    };

    if (resultOfJoiValidate.populationTo) {
      $and.push({ 'description.seed': { $lte: resultOfJoiValidate.populationTo }});
    };

    if (resultOfJoiValidate.type) {
      $and.push({ 'description.celestialType': { $in: resultOfJoiValidate.type }});
    };

    if (resultOfJoiValidate.sort) {
      planets = await Planet.find({ $and })
        .sort({ [resultOfJoiValidate.sort]: resultOfJoiValidate.sortOrder })
        .skip(skip)
        .limit(config.store.pageSize)
        .exec();
    } else {
      planets = await Planet.find({ $and })
        .skip(skip)
        .limit(config.store.pageSize)
        .exec();
    }

    const totalCount = await Planet.find({ $and })
      .count()
      .exec();

    return res.status(200).json({
      planets,
      fee: config.nem.fee,
      totalCount,
      pageLimit: config.store.pageSize,
      page: +resultOfJoiValidate.page
    });
  } catch (err) {
    next(err);
  }
});

store.get('/planets/id/:id',
 JoiMiddleware('public_store_planets_id', 'params'),
 async (req, res, next) => {
  try {
    const planet = await Planet.findOne({
      'id': req.resultOfJoiValidate.value.id
    }).exec();

    if (!planet) {
      return apiCodes[14](res);
    }

    res.status(200).json({
      apiCodes: 0,
      planet,
      fee: config.nem.fee
    });
  } catch (err) {
    next(err);
  }
});

module.exports = store;
