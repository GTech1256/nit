const config = require('../../config/appconfig').default;
const express = require('express');
const account = express.Router();
const { Base64  } = require('js-base64');
const UserUtils = require('../../utils/models/userutils').default;
const User = require('../../utils/models/user').default;
const rndString = require("randomstring");
const mailer = require('../../misc/mailer/index');
const i18n = require('../../utils/i18n/index');
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const recaptchaResultMiddleware = require('../../middleware/recaptchaResultMiddleware');
const uuid = require('uuid/v4');

account.post('/restore',
recaptchaResultMiddleware,
JoiMiddleware('public_account_restore', 'body'),
async (req, res, next) => {
  try {
    const { email } = req.resultOfJoiValidate.value;

    const newPass = rndString.generate(25);

    const payload = {
      type:'restore',
      key: 'password',
      value: newPass
    }

    const encoded = Base64.encode(JSON.stringify(payload));

    const user = await User
      .findOneAndUpdate({
      email
    }, {
      verificationToken: encoded
    })
      .exec();

    if (!user) {
      return  apiCodes[7](res);
    }


    const { locale = 'en' } = req.cookies;

    const ejsData = {
      confirmLink: `${config.appProtocol}://${config.appAdress}/info?token=${encoded}`,
      username: user.username,
      type: i18n(locale, payload.type),
      propertie: i18n(locale, payload.key),
     };

    await mailer(locale, 'restore', ejsData, email, payload);

    apiCodes[0](res, 'confirm link sended to email');
  } catch(e) {
    next(e);
  }
});

account.post('/change/confirm',
(req, res, next) => {
  // get encodedToken
  try {
    const encodedToken = unescape(req.body.token);

    if (!encodedToken) {
      return apiCodes[6](res);
    };

    const decoded = Base64.decode(encodedToken);

    const parsedJson = JSON.parse(decoded);

    req.objectForValidate = {
      encodedToken,
      ...parsedJson
    };
    next();
  } catch(e) {
    return next(e)
  }
},
JoiMiddleware('public_account_change_confirm', 'objectForValidate'),
async (req, res, next) => {
  try {
    const { type, key } = req.resultOfJoiValidate.value;
    let { value } = req.resultOfJoiValidate.value;
    const user = await User.findOneAndUpdate({
      verificationToken: req.resultOfJoiValidate.value.encodedToken
    }, {
      $unset: {
        verificationToken: ''
      }
    });


    if (!user) {
      return apiCodes[8](res, `not valid token for ${key}`);
    };


    if (key === 'password') {
      await User.findOneAndUpdate({
        email: user.email
      }, {
        password: await UserUtils.hashPassword(value)
      }).exec();
    } else {
       await User.findOneAndUpdate({
         email: user.email
       }, {
         [key]: value
       }).exec();
     }


    const { locale } = req.cookies;

    const ejsData = {
      username: user.username,
      type: i18n(locale, type),
      propertie: i18n(locale, key),
      value
    }

    await mailer(locale, `restore-successful`, ejsData, user.email);

    apiCodes[0](res, `${type} applied`);
  } catch (err) {
    next(err);
  }
});

module.exports = account;
