const config = require('../../config/appconfig').default;
const express = require('express');
const galaxy = express.Router();
const Planet = require('../../utils/models/planet').default;
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
/**
 * get planets by galaxyID in params
 * @return {[planet]}
 */
galaxy.get('/star/:galaxyId',
JoiMiddleware('public_galaxy_star', 'params'),
async (req, res, next) => {
  try {
   const planetsByGalaxy = await Planet.find({
     'description.galaxy': req.resultOfJoiValidate.value.galaxyId
   });

   res.json(planetsByGalaxy);

  } catch(e) {
   next(e);
  }
});
/**
 * Get planets by give query coords of galaxy (x, y, z)
 * @return {[planet]}
 */
galaxy.get('/planets/',
JoiMiddleware('public_galaxy_planets', 'query'),
async (req, res, next) => {
 try {

   const planetsByCoords = await Planet.find({
     'description.coords.x': req.resultOfJoiValidate.value.x,
     'description.coords.y': req.resultOfJoiValidate.value.y,
     'description.coords.z': req.resultOfJoiValidate.value.z,
     // 'description.coords.r': req.resultOfJoiValidate.value.r,
   })

   res.json(planetsByCoords)

 } catch(e) {
   next(e);
 }
});


module.exports = galaxy;
