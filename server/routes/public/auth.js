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
  .post('/register', (ctx) => {
    ctx.body = JSON.stringify(ctx.request.body);
    ctx.status = 200;
  })
  .post('/login', async (ctx, next) => {
    // login logic
  })
  .post(
    '/refresh',
    /* JoiMiddleware('public_auth_refresh', 'body'), */ async (ctx, next) => {
      const { refreshToken } = ctx.request.body;

      const user = await User.findOne({
        refreshToken,
      });

      if (!user) {
        return ctx.status(403);
      }

      const newRefreshToken = getRefreshToken(user);

      const userTokens = user.refreshToken.filter(token => token !== refreshToken);
      userTokens.push(newRefreshToken);

      await user.update({
        $set: {
          refreshToken: userTokens,
        },
      });

      jwtSign(user, (err, token) => {
        if (err) throw err;
        ctx.body = {
          apiCode: 0,
          token,
          refreshToken: newRefreshToken,
        };
      });
    },
  )
  .post('/signin', async (ctx, next) => {
    const { email, password } = ctx.request.body;

    const user = await User.findOne({
      email,
    });

    if (user === null) {
      return ctx.throw(400);
    }

    const pwdIsValid = await User.checkPassword(password, user.password);

    if (!pwdIsValid) {
      return ctx.throw(400);
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
  .post('/signup', async (ctx) => {
    console.log(1);
    const resultOfUnique = await isUniqueParamsForUser(ctx.request.body.email);
    console.log(2);

    if (!resultOfUnique.unique) {
      return ctx.throw(418, {
        message: 'User with this email already exist',
      });
    }

    ctx.request.body.password = await User.hashPassword(ctx.request.body.password);

    const user = await new User(ctx.request.body);

    await user.save();

    ctx.body = {
      success: true,
    };
    console.log('out');
    return ctx.throw(200);
  });
