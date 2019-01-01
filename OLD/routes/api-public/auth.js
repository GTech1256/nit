const config = require('../../config/appconfig').default;
const auth = require('express').Router();
const { getPayloadForAuth, getRefreshToken } = require('../../misc/authLogic');
const jwt = require('jsonwebtoken');
const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const User = require('../../utils/models/user').default;

auth.post('/refresh',
JoiMiddleware('public_auth_refresh', 'body'),
async (req, res, next) => {
  try {
    const tokenForRefresh = req.resultOfJoiValidate.value.refreshToken;

    const user = await User.findOne({
      refreshToken: tokenForRefresh
    })

    if (!user) {
      return res.sendStatus(404);
    }

    const newRefreshToken = getRefreshToken(user);

    const userTokens = user.refreshToken.filter(token => token !== tokenForRefresh);
    userTokens.push(newRefreshToken);

    await user.update({
      $set: {
        refreshToken: userTokens
      }
    });

    const payload = getPayloadForAuth(user);

    const opts = { expiresIn: config.authentication.exp };

    res.status(200).json({
      apiCode: 0,
      token: jwt.sign(payload, config.secretOrKey, opts),
      refreshToken: newRefreshToken,
    });

  } catch(err) {
    console.log(err);
    next(err);
  }
});

module.exports = auth;
