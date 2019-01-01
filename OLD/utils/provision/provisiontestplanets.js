// USAGE
// mongo 127.0.0.1/nemapp /vagrant/frontend-server-nemapp/utils/provision/provisiontestplanets.js

// clear contracts db
db.contracts.deleteMany({});

// clear planets db
db.planets.deleteMany({});

// TODO: use loop over documents array

var document = {
    "_id" : "5b53a91c71af100834c31dfd",
    "description" : {
        "coords" : {
            "x" : 2200,
            "y" : 1,
            "z" : -42400
        },
        "name" : "Tidot",
        "galaxy" : 0,
        "system" : "Ndebst",
        "celestialType" : 4,
        "radius" : 12,
        "seed" : 6,
        "specialSeed" : 6
    },
    "status" : {
        "sale" : {
            "cost" : 0.1,
            "desc" : ""
        },
        "forSale" : true,
        "lockGUID" : "none",
        "lastOwnerUpdate" : 0
    },
    "txHistory" : [],
    "id" : "0000c_0001p4_000001-000wps",
    "owner" : "none",
    "timestamp" : null,
    "__v" : 0
};

db.planets.insert(document);

var document1 = {
    "_id" : "5b53a91c71af100834c31dff",
    "description" : {
        "coords" : {
            "x" : 1200,
            "y" : 2,
            "z" : -12400
        },
        "name" : "Ddot",
        "galaxy" : 0,
        "system" : "Gebst",
        "celestialType" : 3,
        "radius" : 12,
        "seed" : 5,
        "specialSeed" : 5
    },
    "status" : {
        "sale" : {
            "cost" : 0.3,
            "desc" : ""
        },
        "forSale" : true,
        "lockGUID" : "none",
        "lastOwnerUpdate" : 0
    },
    "txHistory" : [],
    "id" : "0000c_0000xc_000002-0009kg",
    "owner" : "none",
    "timestamp" : null,
    "__v" : 0
};

db.planets.insert(document1);