
// TODO: USE randomUtils
function randomInRange(seed, rangeA, rangeB) {
    return rangeA + Math.round(random(seed, 1000) * (rangeB - rangeA));
}

function random(seed, multiplier) {
    if (typeof multiplier === 'undefined')
        multiplier = 1;
    var x = Math.sin(seed) * multiplier;
    return x - Math.floor(x);
}

const PlanetName = {

    digrams: "ABOUSEITILETSTONLONUTHNO" +
        "LEXEGEZACEBISO" +
        "USESARMAINDIREA" +
        //"RAMZEIONIEQULANAREQ" +
        "ERATENBERALAVETI" +
        "EDORQUANTEISRION",

    seed0: 0x5a4a,
    seed1: 0x0248,
    seed2: 0xb753,

    rotatel(x) {
        var tmp = (x & 255) * 2;

        if (tmp > 255) tmp -= 255;

        return tmp;
    },

    twist(x) {
        return (256 * rotatel(x / 256)) + rotatel(x & 255);
    },

    next() {
        this.seed0 = this.twist(this.seed0);
        this.seed1 = this.twist(this.seed1);
        this.seed2 = this.twist(this.seed2);
    },

    tweakseed() {
        var tmp;

        tmp = this.seed0 + this.seed1 + this.seed2;
        tmp &= 65535;

        this.seed0 = this.seed1;
        this.seed1 = this.seed2;
        this.seed2 = tmp;
    },

    setseed(seed) {

        this.seed0 = randomInRange(seed, 1, 1000000);

        this.seed1 = randomInRange(seed, 1000000, 100000000);

        this.seed2 = randomInRange(seed, 100000000, 100000000000);

        //tweakseed();
    },

    getpair(pairs, index) {
        //console.log(pairs[index])
        return pairs[index] ? (pairs[index]) : ""; //pairs[randomInRange(index + 1, 0, pairs.length)];
    },

    makename() {
        // original LPT-code was: pairs = digrams[24..<1];
        var pairs = this.digrams; // digrams.substring(24)
        //console.log(pairs)
        var name = "";
        var pair1, pair2, pair3, pair4;
        var longname, verylongname, mediumname, shortname, veryshortname;

        veryshortname = this.seed0 & 5;
        shortname = this.seed0 & 9;

        pair1 = randomInRange(this.seed0, 0, pairs.length); //2 * ((seed2 / 256) & 31); tweakseed();
        pair2 = randomInRange(this.seed1, 0, pairs.length); //2 * ((seed2 / 256) & 31); tweakseed();
        pair3 = randomInRange(this.seed2, 0, pairs.length); //2 * ((seed2 / 256) & 31); tweakseed();
        pair4 = randomInRange(this.seed0 + this.seed2, 0, pairs.length); //2 * ((seed2 / 256) & 31); tweakseed();
        pair5 = randomInRange(this.seed0 + this.seed1, 0, pairs.length); //2 * ((seed2 / 256) & 31); tweakseed();

        name += this.getpair(pairs, pair1); // += ( pairs[pair1]);
        name += this.getpair(pairs, pair1 + 1); // ( pairs[pair1 + 1]);
        name += this.getpair(pairs, pair2); // ( pairs[pair2]);
        name += this.getpair(pairs, pair2 + 1); // ( pairs[pair2 + 1]);
        name += this.getpair(pairs, pair3); // ( pairs[pair3]);
        if (shortname) name += this.getpair(pairs, pair3 + 1); // ( pairs[pair3 + 1]);
        if (mediumname) name += this.getpair(pairs, pair2 + pair3 + 1); // ( pairs[pair3 + 1]);

        if (longname || verylongname) {
            name += this.getpair(pairs, pair4); //( pairs[pair4]);
            name += this.getpair(pairs, pair4 + 1); //( pairs[pair4 + 1]);
        }
        if (verylongname) {
            name += this.getpair(pairs, pair5); //( pairs[pair5]);
            name += this.getpair(pairs, pair5 + 1); //( pairs[pair5 + 1]);
        }
        return name.replace(".", "");
    },

    toUpperCamelCase(string) {
        return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
    },

    makePlanetName(i) {
        this.setseed(i)
        return this.toUpperCamelCase(this.makename())
    },
};

function getPlanetNameBySeed(seed) {
    return PlanetName.makePlanetName(seed);
}

module.exports = getPlanetNameBySeed;
