const schedudle = require('node-schedule');
const scheduleLoadPlanets = require('./scheduleLoadPlanets');
const scheduleMakeRatingOfUsers = require('./scheduleMakeRatingOfUsers');
const fs = require('fs');

setInterval(loadSchedudes, 60 * 60 * 1000); // every hour from startStarting all intervals
loadSchedudes()

function loadSchedudes() {
  const config = JSON.parse(fs.readFileSync(`${__dirname}/schedulesConfig.json`, 'utf8'));

  if (config.loadPlanets) {
    scheduleLoadPlanets();
  }

  if (config.makeRatingOfUsers) {
    scheduleMakeRatingOfUsers();
  }

}
