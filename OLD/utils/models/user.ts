import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verificationToken: {
    type: String
  },
  ref1: {
    type: String
  },
  ref2: {
    type: String
  },
  expireAt: {
    type: Date,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  wallet: {
    privateKey: Buffer,
    iv: { type: String },               // necessary to decode private key with bf algorithm
    address: {
      type: String,
    },
  },
  planets: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Planet',
    // unique: true // mongo and mongoose not support unique variables in Array
  }],
  txHistory: [{
    from: {
      type: String,
      required: true
    },
    to:{
      type: String,
      required: true
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
  experience: {
    type: Number,
    default: 0,
    required: true
  },
  personalInformation: {
    aboutUser: {
      type: String
    },
    website: {
      type: String
    },
    birthday: {
      type: Date
    },
  },
  roles: {
    type: [String],
    required: true
  },
  refreshToken: {
    type: [String]
  }
// tslint:disable-next-line:align
}, {
  minimize: false,
  strict: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

userSchema.index({ expireAt: 1 }, {       // autoIndexes and background are true by default
  name: 'registration_expiration',
  sparse: true,
  expireAfterSeconds: 60 * 60 * 24                 // 24 * 3600
});

const user = mongoose.model('User', userSchema);

export default user;
