const fs = require('fs');


function getStarInfo() {
  try {

    let stars = JSON.parse(fs.readFileSync(`${__dirname}/config.json`, 'utf8'));
    let firstStar = stars[0];

    if(stars.length === 0) {
      throw new Error('stars empty');
    }

    const { coords } = firstStar;
    coords.r = getRandomOrbit(firstStar);

    const system = firstStar.name;

    firstStar.realPlanets = 1 + firstStar.realPlanets;

    if (firstStar.realPlanets === firstStar.desiredPlanets) {
      stars = stars.slice(1, stars.length);
    }

    stars = JSON.stringify(stars, null, '\t')
    fs.writeFileSync(`${__dirname}/config.json`, stars, (err) => {
      throw new Error(err);
    })

    return {
      coords,
      system
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * set param isEmpty in star [true,false,true,...desiredPlanets]
 *
 * @param {star} firstStar
 * @returns {emptyOrbitPositions} array of empty orbits
 */
function getEmptyOrbitPositions(star) {
  const emptyOrbitPositions = [];

  if (!star.isEmpty) {
    star.isEmpty = [];

    for (let i = 1; i <= star.desiredPlanets; i++) {
      star.isEmpty[i] = true;
      emptyOrbitPositions.push(i);
    }

  } else {
    for (let i = 1; i <= star.desiredPlanets; i++) {
      if (star.isEmpty[i])
        emptyOrbitPositions.push(i);
    }
  }

  return emptyOrbitPositions;
}

/**
 * return random orbit number by EmptyOrbitPositions
 *
 * @param {star} firstStar
 * @returns {orbitNumber} random orbit number by EmptyOrbitPositions
 */
function getRandomOrbit(star) {
  const emptyOrbitPositions = getEmptyOrbitPositions(star);

  const i = Math.floor(Math.random() * emptyOrbitPositions.length);
  const orbitPosition = emptyOrbitPositions[i];

  star.isEmpty[orbitPosition] = false;

  return orbitPosition;
}

module.exports = getStarInfo;
