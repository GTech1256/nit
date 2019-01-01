const config = require('../../config/appconfig').default;
const express = require('express');
const sale = express.Router();
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const Planet = require('../../utils/models/planet').default;
const apiCodes = require('../../misc/apiCodes/index');

// sale is the place from where user can see all his trading goods, create and modify ads

sale.get('/planets/:page',
(req, res, next) => {
  req.objectForJoiValidate =  {
    address: req.query.address,
    page: req.params.page
  }
  next()
},
JoiMiddleware('private_sale_planets', 'objectForJoiValidate'),
async (req, res, next) => {
  try {

    const skip = (req.params.page - 1) * config.store.pageSize;

    const totalCount = await Planet.find({ owner: req.resultOfJoiValidate.value.address })
      .count()
      .exec();

    const planets = await Planet.find({ owner: req.resultOfJoiValidate.value.address })
      .skip(skip)
      .limit(config.store.pageSize)

    return res.status(200).json({
      planets,
      fee: config.nem.fee,
      totalCount,
      pageLimit: config.store.pageSize,
      page: +req.params.page
    });
  } catch (err) {
    next(err);
  }
});

sale.get('/planets/id/:id',
JoiMiddleware('private_sale_planets_id', 'params'),
async (req, res, next) => {
  try {
    const planet = await Planet.findOne({
      'id': req.resultOfJoiValidate.value.id
    })

    if (!planet) {
      return apiCodes[14](res);
    };
    if (planet.owner !== req.user.wallet.address) {
      return apiCodes[15](res);
    };

    res.status(200).json({
      planet: planet
    });
  } catch (err) {
    next(err);
  }
});

// this route can be used for both modifying existing and creating new ads
// request body should contain 'forsale', 'cost' and 'desc' params

// TODO: cause desc is showed to other users make sure it won't break anything

sale.post('/planets/id/:id',
JoiMiddleware('private_sale_planets_id', 'body'),
async (req, res, next) => {
  try {
    let status = { 'status.lastOwnerUpdate': +new Date() };

    for (let key in result.value) {
      switch (key) {
        case 'cost':
          status['status.sale.cost'] = +result.value.cost;
          break;
        case 'desc':
          status['status.sale.desc'] = result.value.desc;
          break;
        case 'forsale':
          status['status.forSale'] = !!+result.value.forsale;
          break;
      }
    }

    const planet = await Planet.findOne({
      'id': req.params.id
    });

    if (!planet) {
      return apiCodes[14](res);
    };

    if (planet.owner !== req.user.wallet.address) {
      return apiCodes[15](res);
    };

    const canBeModified = await Planet.findOneAndUpdate({
      id: req.params.id,
      owner: req.user.wallet.address,
      'status.lockGUID': 'none'
    }, {
      $set: status
    }, {
      new: true
    }).exec();

    if (!canBeModified) {
      return apiCodes[16](res);
    }

    return apiCodes[0](res, 'ad modified');
  } catch (err) {
    next(err);
  }
});

module.exports = sale;
