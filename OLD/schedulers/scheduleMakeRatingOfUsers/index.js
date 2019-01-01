const config = require('../../config/appconfig').default;
const User = require('../../utils/models/user').default;
const Planet = require('../../utils/models/planet').default;
const fs = require('fs');
const path = require('path');

async function makeRatingOfUsers() {
  try {
    const usersWithPlanets = await User.find().populate('planets');

    const sortedUsersWithPlanets = usersWithPlanets.sort(({planets: a}, {planets: b}) => {
      if (!a.length) return -1;
      if (!b.length) return 0;

      return b.description.seed - a.description.seed;
    });


    const MAX_LENGTH_OF_RATING = config.rating.maxLength
    if (sortedUsersWithPlanets.length > MAX_LENGTH_OF_RATING) sortedUsersWithPlanets.length = MAX_LENGTH_OF_RATING;

    const ratingOfUsersByPlanetPopulation = sortedUsersWithPlanets.map(user => {
      const planetsLength = user.planets.length;

      let populationSum = 0;

      if (planetsLength === 1) {
        populationSum = user.planets[0].description.seed;
      }

      if (planetsLength > 1) {
        populationSum = user.planets.reduce((a, b) => a.description + b.description);
      }

      return {
        address: user.wallet.address,
        planetsLength,
        populationSum
      };
    });

    const fileData = {
      data: ratingOfUsersByPlanetPopulation,
      createdAt: new Date().getTime()
    }

    const stringifyData = JSON.stringify(fileData);

    const pathToFile = path.join(__dirname, '../../temporaryFiles/ratingOfUsersByPlanetPopulation.json');
    fs.writeFile(pathToFile, stringifyData, (err) => {
      if (err) throw new Error(err);
    });
  } catch(err) {
    console.error('Ошибка при создании файла с рейтингом пользователей по популяции планет', err);
  }
}

module.exports = makeRatingOfUsers;
