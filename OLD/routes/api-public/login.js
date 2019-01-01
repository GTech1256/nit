"use strict";

const config = require('../../config/appconfig').default;
const express = require('express');
const login = express.Router();
const jwt = require('jsonwebtoken');
const UserUtils = require('../../utils/models/userutils').default;
const User = require('../../utils/models/user').default;
const log = require('../../utils/logger/logger').default;
const axios = require('axios');
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const recaptchaResultMiddleware = require('../../middleware/recaptchaResultMiddleware');
const { getPayloadForAuth, getRefreshToken } = require('../../misc/authLogic');

login.post('/',
recaptchaResultMiddleware,
JoiMiddleware('public_login', 'body'),
async (req, res, next) => {

  try {
    const { email } = req.resultOfJoiValidate.value;
    const user = await User.findOne({
      email
    });

    if (user === null) {
      return apiCodes[2](res); // apiCode must be same as invalid comoare
    }

    const pwdIsValid = await UserUtils.comparePasswords(req.resultOfJoiValidate.value.password, user.password);

    if (!pwdIsValid) {
      return apiCodes[2](res);
    }

    if (!user.active) {
      return apiCodes[10](res, undefined, email);
    }

    const payload = getPayloadForAuth(user);

    const opts = { expiresIn: config.authentication.exp };

    const refreshToken = getRefreshToken(user);

    await user.update({ $push: { refreshToken } });

    jwt.sign(payload, config.secretOrKey, opts, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        apiCode: 0,
        token,
        refreshToken
      });
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

module.exports = login;
