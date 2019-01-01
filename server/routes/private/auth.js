import Router from 'koa-router';
import uuid from 'uuid/v4';
import jwt from 'jsonwebtoken';
import User from '..';
/*
const config = require('../../config/appconfig').default;

const JoiMiddleware = require('../../dataValidate/joiValidatorMiddleware');
const apiCodes = require('../../misc/apiCodes/index');
const User = require('../../../OLD/utils/models/user').default;
*/

const router = new Router();

export default router.post('/logout', async (ctx, next) => {
  /*
    await User.findOneAndUpdate(
      {
        email: ctx.request.user.email,
      },
      {
        refreshToken: [],
      },
    );
    */
  ctx.status = 200;
});
