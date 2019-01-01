const fs = require('fs');
const fetch = require('node-fetch');
// const Planets = require('../utils/models/planet').default;
const planetGenerator = require('./planet/planetGenerator');

let config = {}
const timeCheck = 60 * 60 // one hour

async function startSchedudleLoadPlanets() {

  try {
    config = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));

    const countMissedRealises = await getCountMissedRealises();

    if (countMissedRealises === 0) {
      console.log('countMissedRealises equal 0 scheduleJob for insert. New planets cancel');
      return
    };

    const genetatedPlanets = await planetGenerator(config.generator, countMissedRealises);
    insertPlanetsToDB(genetatedPlanets);
  } catch(e) {
    console.log(e);
  }
}

function insertPlanetsToDB(planetsForLoad) {
  if (!planetsForLoad || planetsForLoad.length < 1) throw new Error('bad parametrs')

  const testPlanets = JSON.stringify(planetsForLoad, null, '\t')

  fs.writeFile(`${__dirname}/testPlanets.json`, testPlanets, (err) => {
    console.error(err)
  })




  /*
  const configJSON = JSON.stringify(config, null, '\t')

  Planets.insertMany(planetsForLoad, (err) => {
    if (err) throw new Error(err);

    console.log('new planets Inserted to DB');
    fs.writeFile(`${__dirname}/config.json`, configJSON, (err) => {
      console.error(err)
    })

  });
  */
}


/*
* Get Count Missed Realises of planets by timestamp from config and other service
*
* @{return} Number
*/
async function getCountMissedRealises() {
  const lastRealisedPlanet = config.generator.last_update;
  const timestampNow = await getTimestampFromServices();

  config.generator.last_update = timestampNow;

  const differenceTime = lastRealisedPlanet ? timestampNow - lastRealisedPlanet : timeCheck;

  const countMissed = Math.floor(differenceTime / timeCheck );

  if(countMissed < 0) throw new Error('countMissed can\' be less than 0')

  return countMissed;
}

function getTimestampFromServices() {

  return new Promise((resolve) => {

    getTimestampIpgeolocation().then(resolve)
      .catch((firstError) => {

        console.log('getTimestampIpgeolocation reject', firstError);
        getTimestampTimezonedb().then(resolve)
          .catch((secondError) => {
            console.log('getTimestampIpgeolocation reject', secondError);
          throw new Error('services timestamp error')
        });

    });

  })
}

function getTimestampIpgeolocation() {
  return new Promise(async (resolve, reject) => {
    const { ipgeolocation_config } = config;
    const response = await fetch(`https://api.ipgeolocation.io/timezone?apiKey=${ipgeolocation_config.key}&tz=${ipgeolocation_config.tz}`)
    const DataFromGoogleapis = JSON.parse(await response.text());
    resolve(new Date(DataFromGoogleapis.date_time).getTime() / 1000);
  });
}

function getTimestampTimezonedb() {
  return new Promise(async (resolve, reject) => {
    const { timezonedb_config } = config;
    const response = await fetch(`http://api.timezonedb.com/v2/get-time-zone?key=${timezonedb_config.key}&format=json&by=zone&zone=${timezonedb_config.zone}`)
    const DateFromTimezonedb = JSON.parse(await response.text());
    resolve(DateFromTimezonedb.timestamp);
  });
}

module.exports = startSchedudleLoadPlanets;
