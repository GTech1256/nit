import * as mongoose from 'mongoose';

const planetSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    name: {
      type: String,
      index: true,
      required: true
    },
    celestialType: {
      type: Number,
      required: true
    },
    galaxy: {
      type: Number,
      required: true
    },     // generation seed
    coords: {
      x: {
        type: Number,
        required: true
      },
      y: {
        type: Number,
        required: true
      },
      z: {
        type: Number,
        required: true
      }
      // TODO: orbit
    },
    initPopulation: {
      type: Number,
      required: true
    },
    currentPopulation: {
      type: Number,
      required: true
    },
    seed: {
      type: Number,
      required: true
    }
  },
  owner: {
    type: String
  },        // address or 'none'
  status: {
    forSale: {
      type: Boolean,
      required: true
    },
    lockGUID: {
      type: String,
      required: true
    },  // customer address or 'none'
    sale: {
      cost: {
        type: Number,
        required: true
      },     // XEM and game currency supposed to be 1 : 1
      desc: {
        type: String
      }
    },
    lastOwnerUpdate: {
      type: Number
    }
  },
  txHistory: [{
    from: {
      type: String,
      required: true
    },
    to:{
      type: String,
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Math.round(Date.now() / 1000)
    },
  }],
  timestamp: {
    type: Number
  },     // timeStamp of the last transaction that updated planet document
  realised: {
    type: Number
  }       // timeStamp of the time realise to Shop for buy
// tslint:disable-next-line:align
}, {
  minimize: false,      // allows to keep empty objects as a field values (otherwise the field won't be used)
  strict: false         // allows to store fields that are not described in the schema
});

planetSchema.index({
  'description.name': 'text'
});

const planet = mongoose.model('Planet', planetSchema);

export default planet;
