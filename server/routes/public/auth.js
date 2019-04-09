import Router from 'koa-router';

import User from '../../db/models/User';
import { getPayloadForAuth, getRefreshToken, jwtSign } from '../../utils/authLogic';

const router = new Router();

async function isUniqueParamsForUser(email) {
  const userWithSameParams = await User.findOne({ email });

  const returnObject = {
    apiCode: 0,
    text: '',
    unique: true,
  };

  if (!userWithSameParams) {
    return returnObject;
  }

  if (userWithSameParams.email === email) {
    returnObject.apiCode = 3;
    returnObject.text = 'email must be unique';
    returnObject.unique = false;
  }

  return returnObject;
}

export default router
  .post('/refresh', async (ctx, next) => {
    const { refreshToken } = ctx.state.joiValidValues;

    const user = await User.findOne({
      refreshToken,
    });

    if (!user) {
      return ctx.throw(404, { message: 'user not exist' });
    }

    const newRefreshToken = getRefreshToken(user);

    const userTokens = user.refreshToken.filter(token => token !== refreshToken);
    userTokens.push(newRefreshToken);

    await user.update({
      $set: {
        refreshToken: userTokens,
      },
    });

    const token = jwtSign(user);
    ctx.status = 200;

    ctx.body = {
      apiCode: 0,
      token,
      refreshToken: newRefreshToken,
    };
    return next;
  })
  .post('/signin', async (ctx, next) => {
    const { email, password } = ctx.state.joiValidValues;

    const user = await User.findOne({
      email,
    });

    if (user === null) {
      return ctx.throw(400, {
        message: 'user not exist',
      });
    }

    const pwdIsValid = await User.checkPassword(password, user.password);

    if (!pwdIsValid) {
      return ctx.throw(400, 'Password or email not valid');
    }

    const refreshToken = getRefreshToken(user);

    await user.updateOne({ $push: { refreshToken } });

    const token = jwtSign(user);
    ctx.status = 200;

    ctx.body = {
      apiCode: 0,
      token,
      refreshToken,
    };
    return next;
  })
  .post('/signup', async (ctx, next) => {
    const resultOfUnique = await isUniqueParamsForUser(ctx.state.joiValidValues.email);

    if (!resultOfUnique.unique) {
      return ctx.throw(418, {
        message: 'User with this email already exist',
      });
    }

    ctx.state.joiValidValues.password = await User.hashPassword(ctx.state.joiValidValues.password);

    const user = await new User(ctx.state.joiValidValues);

    await user.save();

    ctx.body = {
      success: true,
    };

    return next;
  });
