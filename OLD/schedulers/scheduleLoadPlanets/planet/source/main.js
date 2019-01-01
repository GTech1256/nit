var presets = [{
	hot: true,
	colors: [
		[0.5, 0.0, 0.0],
		[0.0, 0, 0],
		[0.6, 0.3, 0.2],
		[0.8, 0.4, 0.2]
	],
	emissionColors: [
		[1.0, 1.0, 0.0],
		[1.0, 0.5, 0.0],
		[1.0, 0.0, 0.0]
	]
}, {
	cold: true,
	colors: [
		[0.8, 1.0, 1],
		[0.9, 0.9, 0.9],
		[1, 1, 0.9],
		[1, 1, 1]
	],
	emissionColors: [
		[0.3, 0.3, 0.9],
		[0.8, 1.0, 1],
		[0.3, 0.3, 0.9]
	]
}, {
	gaseous: true,
	planetScale: [0.1, 1, 0.1],
	falloff: 4,
	normal: {
		max: 0
	},
	clouds: true,
	colors: [
		[0.74, 0.62, 0.53],
		[0.62, 0.64, 0.66],
		[0.77, 0.75, 0.65],
		[0.71, 0.62, 0.56],
		[0.5, 0, 0.0],
		[0.25, 0.25, 0.25]
	]
}, {
	flora: true,
	clouds: true,
	colors: [
		[0.0, 0, 0.25],
		[0.25, 0.25, 1.0],
		[0.8, 0.5, 0.2],
		[0.6, 0.4, 0.2],
		[0, 0.5, 0],
		[0, 0.25, 0],
		[0.5, 0.25, 0.125],
		[0.25, 0.25, 0.25]
	]
}, {
	toxic: true,
	clouds: true,
	colors: [
		[0.44, 0.79, 0.14],
		[0.74, 0.99, 0.44],
		[0.44, 0.99, 0.44],
		[0.44, 0.69, 0.44],
		[0.14, 0.69, 0.44],
		[0.44, 0.69, 0.14],
		[0.44, 0.79, 0.14],
		[0.14, 0.69, 0.14],
		[0.84, 0.99, 0.14],
		[0.65, 0.47, 0.21]
	],
	emissionColors: [
		[0.44, 0.79, 0.14],
		[0.74, 0.99, 0.44],
		[0.44, 0.99, 0.44],
		[0.44, 0.69, 0.44],
		[0.14, 0.69, 0.44],
		[0.44, 0.69, 0.14],
		[0.44, 0.79, 0.14],
		[0.14, 0.69, 0.14],
		[0.84, 0.99, 0.14],
		[0.65, 0.47, 0.21]
	]
}, {
	dry: true,
	clouds: true,
	falloff: 0.7,
	colors: [
		[0.93, 0.78, 0.48],
		[0.82, 0.65, 0.34],
		[0.93, 0.78, 0.47],
		[0.9, 0.66, 0.44],
		[0.87, 0.56, 0.3],
		[0.76, 0.46, 0.24],
		[0.57, 0.4, 0.29],
		[0.82, 0.58, 0.27],
		[0.82, 0.68, 0.47]
	]
}, {
	dead: true,
	colors: [
		[0.25, 0.25, 0.25],
		[0.35, 0.35, 0.35],
		[0.45, 0.45, 0.45],
		[0.55, 0.55, 0.55],
		[0.65, 0.65, 0.65],
		[1, 1, 1]
	]
}];

// TODO: use randomUtils
// Returns a random integer between min (included) and max (included)
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
global.getRandomInt = getRandomInt;

function randomInRange(seed, rangeA, rangeB) {
	return rangeA + Math.round(random(seed, 1000) * (rangeB - rangeA));
}
global.randomInRange = randomInRange;

function random(seed, multiplier) {
	if (typeof multiplier === 'undefined')
		multiplier = 1;
	var x = Math.sin(seed) * multiplier;
	return x - Math.floor(x);
}
global.random = random;



function generatePlanetType(seed) {
	var presetSeed = seed;
	return randomInRange(presetSeed++, 0, presets.length - 1);
}
global.generatePlanetType = generatePlanetType;

function translatePlanetType(typeNum) {
	///var typesENG = ['hot', 'cold', 'gaseous', 'flora', 'toxic', 'dry', 'dead']
	var typesRUS = ['лавовая', 'арктическая', 'газовая', 'землеподобная', 'токсичная', 'пустынная', 'пепельная']
	return typesRUS[typeNum];

}
global.translatePlanetType = translatePlanetType;

function generateSystemPlanets(systemPos, planetSeed) {
	//var planetSeed = seed;
	var availibleOrbits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
	var planets = [];
	// At least 1 planet
	var planetCount = randomInRange(planetSeed, 6, availibleOrbits.length - 1);
	for (var i = 0; i < planetCount; i++) {
		//planetSeed++;
		var orbitIndex = randomInRange(totalPlanets, 0, availibleOrbits.length - 1);
		var orbit = availibleOrbits[orbitIndex];
		availibleOrbits.splice(orbitIndex, 1); // remove orbit. 1 planet = 1 orbit

		planets.push({
			galaxy: 0,
			name: generatePlanetName(totalPlanets),
			r: orbit, // must be unique for planets in system
			x: systemPos.pX,
			y: systemPos.pY,
			z: systemPos.pZ,
			seed: totalPlanets,
			type: generatePlanetType(totalPlanets),
			specialSeed: totalPlanets
			// created time
			// start population
		});

		//console.log(totalPlanets, generatePlanetName(totalPlanets))

		planetDebugArr.push({
			galaxy: 0,
			name: generatePlanetName(totalPlanets),
			r: orbit, // must be unique
			x: systemPos.pX,
			y: systemPos.pY,
			z: systemPos.pZ,
			seed: totalPlanets,
			type: generatePlanetType(totalPlanets),
			specialSeed: totalPlanets
			// created time
			// start population
		});

		totalPlanets++;
	}
	//console.log(planets)
	return planets;
}