import Router from 'koa-router';
import User from '../../db/models/User';

const router = new Router();

export default router.post('/logout', async (ctx, next) => {
  await User.findOneAndUpdate(
    {
      email: ctx.state.user.email,
    },
    {
      refreshToken: [],
    },
  );

  ctx.status = 200;
  return next();
});
