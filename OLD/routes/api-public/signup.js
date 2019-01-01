const config = require('../../config/appconfig').default;
const express = require('express');
const signup = express.Router();
const mailer = require('../../misc/mailer/index');
const randomstring = require('randomstring');
const wallet = require('../../utils/nem/wallet').default;
const UserUtils = require('../../utils/models/userutils').default;
const User = require('../../utils/models/user').default;
const log = require('../../utils/logger/logger').default;
const recaptchaResultMiddleware = require('../../middleware/recaptchaResultMiddleware');
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const isBadWord = require('../../utils/badWordsChecker');

signup.post('/',
  (req, res, next) => {
    /* check username by bad words*/
    if (isBadWord(req.body.username) ) {
      return apiCodes.DATA_NOT_VALID(res);
    };

    if (req.cookies.ref) {
      req.body.ref = req.cookies.ref;
    }
    next();
  },
  recaptchaResultMiddleware,
  JoiMiddleware('public_signup', 'body'),
  async (req, res, next) => {

  try {

    const resultOfUnique = await isUniqueParamsForUser(req.resultOfJoiValidate.value.username, req.resultOfJoiValidate.value.email);

    if (!resultOfUnique.unique) {
      return apiCodes[resultOfUnique.apiCode](res, resultOfUnique.text);
    }


    let referalOfNewUser = await User.findOne({
      'wallet.address': req.resultOfJoiValidate.value.ref
    });

    if (referalOfNewUser) {
      referalOfNewUser = referalOfNewUser.toObject();
      req.resultOfJoiValidate.value.ref1 = referalOfNewUser.wallet.address;

      if (referalOfNewUser.ref1) {

        const referalOfRerefal = await User.findOne({
          'wallet.address': referalOfNewUser._doc.ref1,
          roles: {
            $in: ['admin', 'moderator', 'partner']
          }
        });

        if (referalOfRerefal) {
          req.resultOfJoiValidate.value.ref2 = referalOfNewUser.ref1;
        }
      }
    }

    delete req.resultOfJoiValidate.value.ref;
    delete req.resultOfJoiValidate.value.recaptcha;

    const hash = await UserUtils.hashPassword(req.resultOfJoiValidate.value.password);
    const verificationToken = randomstring.generate(64);

    req.resultOfJoiValidate.value.password = hash;
    req.resultOfJoiValidate.value.verificationToken = verificationToken;
    req.resultOfJoiValidate.value.active = false;
    req.resultOfJoiValidate.value.expireAt = new Date();
    req.resultOfJoiValidate.value.roles = ['unverified'];

    delete req.resultOfJoiValidate.value.confirmationPassword;
    const user = await new User(req.resultOfJoiValidate.value);

    await sendConfirmLinkToUserEmail(verificationToken, req.resultOfJoiValidate.value.email, req.cookies.locale);

    await user.save();

    apiCodes[0](res, 'user created, email verification is being awaited');
  } catch (err) {
    next(err);
  }
});

async function isUniqueParamsForUser(username, email) {

  const userWithSameParams = await User.findOne({
    $or: [
      { email },
      { username }
    ]
  });

  const returnObject = {
    apiCode: 0,
    text: '',
    unique: true
  }

  if(!userWithSameParams) {
    return returnObject;
  }


  if (userWithSameParams.email === email) {
    returnObject.apiCode = 3;
    returnObject.text = 'email must be unique';
    returnObject.unique = false;
  };

  if (userWithSameParams.username === username) {
    returnObject.apiCode = 4;
    returnObject.text = 'username must be unique';
    returnObject.unique = false;
  }

  return returnObject;
}


signup.get('/verify',
 JoiMiddleware('public_signup_verify', 'query'),
 async (req, res, next) => {
  try {

    const user = await User.findOne({
      verificationToken: req.resultOfJoiValidate.value.token
    }).exec();

    if (user === null) {      // some client messages could be added here
      res.redirect('/signup');
      return;
    }

    await User.findOneAndUpdate({
      email: user.email
    }, {
      roles: ['user'],
      $set: {
        wallet: wallet(config.nem.privateSalt),
        active: true
      },
      $unset: {
        expireAt: '',
        verificationToken: ''
      }
    }).exec();

    res.redirect('/login');   // and here
  } catch (err) {
    next(err);
  }
});

signup.post(
'/resend',
JoiMiddleware('public_signup_resend', 'body'),
async(req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.resultOfJoiValidate.value.email,
      active: false
    });

    if (!user) {
      return apiCodes[7](res);
    }

    await sendConfirmLinkToUserEmail(user.verificationToken, user.email, req.cookies.locale);

    apiCodes[0](res, 'confirm link sended to email');
  } catch(e) {
    next(e)
  }
});

async function sendConfirmLinkToUserEmail(verificationToken, userEmail, locale) {
  const confirmLink = `${config.appProtocol}://${config.appAdress}/api/public/signup/verify?token=${verificationToken}`;
  const ejsData = { confirmLink };
  await mailer(locale, 'registration', ejsData, userEmail);
}

module.exports = signup;
