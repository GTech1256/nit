import Router from 'koa-router';
import User from '../../db/models/User';

const router = new Router();

export default router.get('/', async (ctx, next) => {
  const user = (await User.findOne({ email: ctx.state.user.email })).toObject();

  delete user.password;
  delete user.refreshToken;
  // eslint-disable-next-line no-underscore-dangle
  delete user._id;

  ctx.body = user;
  return next();
});
